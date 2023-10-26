from flask import Flask, request, jsonify
from models import db, connect_db, User, Circle, Kpi, TokenBlocklist, Periodicity, Unit, Kpi_Values
from flask_jwt_extended import JWTManager, create_access_token, get_jwt_identity, jwt_required, get_jwt
from datetime import datetime, timezone, timedelta
from dotenv import load_dotenv
import os
import ast
from datetime import date
from dateutil.relativedelta import relativedelta
from flask_cors import CORS

load_dotenv()

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql:///kpi_db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ECHO'] = False
ACCESS_EXPIRES = timedelta(hours=1)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = ACCESS_EXPIRES
jwt = JWTManager(app)
CORS(app, origins=['http://localhost:3000'])

CURR_USER_KEY = 'user_id'

with app.app_context():
    connect_db(app)
    db.create_all()


##################
# User Endpoints 

# Callback function to check if a JWT exists in the database blocklist
@jwt.token_in_blocklist_loader
def check_if_token_revoked(jwt_header, jwt_payload: dict) -> bool:
    jti = jwt_payload["jti"]
    token = db.session.query(TokenBlocklist.id).filter_by(jti=jti).scalar()

    return token is not None

@app.route('/login', methods=['POST'])
def login_user():
    """Login Users"""

    data = request.get_json()
    email=data["email"]
    try:
        user = User.query.filter_by(email=email).first()
        if user:
            access_token = create_access_token(identity=user.id)
            
            return jsonify(access_token=access_token, user_id=user.id), 200 
        else:
            return jsonify(message='User Not Found'), 404

    except Exception as e:
        return jsonify(error= str(e)), 500
   

@app.route('/users/<int:user_id>', methods=['GET'])
@jwt_required()
def get_user(user_id):
    """Fetches a user's details"""

    current_user = get_jwt_identity()
    try:
        user = User.query.filter_by(id=user_id).first()
        if user.id == current_user:
            user_dict = user.to_dict()
            user_dict['circles'] = [circle.to_dict() for circle in user.circles]
            return jsonify({'user':user_dict}), 200
        else:
            return jsonify(message='User Not Found'), 404

    except Exception as e:
        return jsonify(error=str(e)), 500


@app.route('/users', methods=['GET'])
def get_users():
    """Fetches All Users"""

    users = User.query.all()
    user_list = []
    for user in users:
        user_dict = user.to_dict()  
        user_dict['circles'] = [circle.circle.to_dict() for circle in user.user_circle]  # get user's circles
        user_list.append(user_dict)
    return jsonify(user_list)

# Endpoint for revoking the current users access token. Saved the unique
# identifier (jti) for the JWT into our database.
@app.route("/logout", methods=["DELETE"])
@jwt_required()
def modify_token():
    """Logs User Out"""

    jti = get_jwt()["jti"]
    now = datetime.now(timezone.utc)
    try:
        db.session.add(TokenBlocklist(jti=jti, created_at=now))
        db.session.commit()
        return jsonify(msg="JWT revoked"), 200
    except Exception as e:
        return jsonify(error=str(e)), 500


##################
# Circle Endpoints

@app.route('/circles/<int:circle_id>', methods=['GET'])
@jwt_required()
def get_circle(circle_id):
    """Fetches a Circle by its ID"""

    try:
        circle = Circle.query.filter_by(id=circle_id).first()
        if circle:
            return jsonify({'circle': circle.to_dict()}),200
        else:
            return jsonify(message='Circle Not Found.'), 404

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/circles/add', methods=['POST'])
@jwt_required()
def add_circles():
    data = request.get_json()
    new_circle = Circle(**data)
    db.session.add(new_circle)
    db.session.commit()
    return jsonify(message='Circle added')

@app.route('/circles', methods=['GET'])
@jwt_required()
def fetch_circles():
    """Fetch a list of all circles"""

    try:
        circles = Circle.query.all()
        if circles:
            circles_dict = [circle.to_dict() for circle in circles]
            return jsonify({'circles': circles_dict}), 200
        else:
            return jsonify(message='Circles Not Found.'), 404

    except Exception as e:
        return jsonify({'error': str(e)}), 500
        
    
##################
# kpis Endpoints

@app.route('/kpis/add', methods=['POST'])
@jwt_required()
def add_kpi_value():
    """Add New KPI"""

    json_data = request.get_json()
    kpi_name = json_data.get('name')

    current_user = get_jwt_identity()

    try:
        # check if user is a gatekeeper
        fetched_user = User.query.filter_by(id=current_user).first()
        if not fetched_user.is_gatekeeper:
            return jsonify(message='User is not a gatekeeper. Unauthorized Access'), 403
   
        else:
                kpi = Kpi.query.filter_by(name = kpi_name).first()
                if kpi:
                    return jsonify(message='KPI name already exists. Choose a different name.'), 400
                else:
                    data = request.get_json()
                
                    for key, value in data.items():
                        if key == 'active':
                            data[key] = ast.literal_eval(value)
                        elif key == 'periodicity':
                            data[key] = Periodicity[value.lower()]
                        elif key == 'unit':
                            data[key] = Unit[value.lower()]
                    new_kpi = Kpi(**data)
                    db.session.add(new_kpi)
                    db.session.commit()
                    return jsonify(message='KPI created successfully'), 201
                    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@app.route('/kpis/<int:kpi_id>/edit', methods=['PUT'])
@jwt_required()
def edit_kpis(kpi_id):
    """Update A KPI"""

    current_user = get_jwt_identity()

    try:
        # check if user is a gatekeeper
        fetched_user = User.query.filter_by(id=current_user).first()
        if not fetched_user.is_gatekeeper:
            return jsonify(message='User is not a gatekeeper. Unauthorized Access'), 403
   
        else:
            kpi = Kpi.query.filter_by(id=kpi_id).first()
            if not kpi:
                return jsonify(message='KPI Not Found'), 404

            else:
                data = request.get_json()
                for key, value in data.items():
                    if key == 'active':
                        value = ast.literal_eval(value)
                    elif key == 'periodicity':
                        value = Periodicity[value.lower()]
                    elif key == 'unit':
                        value = Unit[value.lower()]
                    setattr(kpi, key, value)
                db.session.commit()
                return jsonify(message='KPI Updated Successfully'), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@app.route('/kpis/<int:kpi_id>', methods=['GET'])
@jwt_required()
def get_kpi(kpi_id):
    """Get A KPI by ID"""

    try:
        kpi = Kpi.query.filter_by(id=kpi_id).first()
        if kpi:
            return jsonify({'kpi': kpi.to_dict()}), 200
        else:
            return jsonify(message='KPI Not Found.'), 404

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/kpis', methods=['GET'])
@jwt_required()
def kpis_list():
    """Get All KPIs"""
    try:
        kpi_list = Kpi.query.all()
        if kpi_list:
            kpis_dict = [kpi.to_dict() for kpi in kpi_list]
            return jsonify({'kpi_list':kpis_dict}), 200
        else:
            return jsonify(message='KPIs Not Found.'), 404

    except Exception as e:
        return jsonify({'error': str(e)}), 500


##################
# kpi_values Endpoints

@app.route('/kpi_values/add', methods=['POST'])
@jwt_required()
def add_kpi_values():
    """Add New KPI Value"""

    data = request.get_json()
    user_id = get_jwt_identity()
    kpi_id = data.get('kpi_id')
    try:
        # Check if a Kpi record with the given name and circle_id exists
        kpi = Kpi.query.filter_by(id=kpi_id).first()
       
        if not kpi:
            return jsonify(message="KPI doesn't exist")

        else:
            new_value = Kpi_Values(**data, created_by_user_id=user_id, updated_at=None)
            kpi.kpi_values.append(new_value)
            db.session.commit()
            return jsonify(message="KPI Value was added successfully"),201

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# an endpoint to fetch all kpi values and supports filtering
@app.route('/kpi_values', methods=['GET'])
@jwt_required()
def get_all_values():
    """Get KPI Values"""

    data = request.args
    circle_id = data.get('circle_id')
    period = data.get('period')

    quarters = {
    1: [1, 2, 3],
    2: [4, 5, 6],
    3: [7, 8, 9],
    4: [10, 11, 12]
    }

    # Define date ranges based on the selected period
    end_date = date.today()
    start_date = date(end_date.year, 1, 1)
    current_month = end_date.month

    if period == 'this_month':
        start_date = end_date.replace(day=1)
    elif period == 'last_month':
        start_date = (end_date - relativedelta(months=1)).replace(day=1)
        end_date = end_date.replace(day=1) - timedelta(days=1)
    elif period == 'this_quarter':
        for quarter, months in quarters.items():
            if current_month in months:
                quarter_start_date = date(end_date.year, months[0], 1)
                start_date = quarter_start_date
                end_date = quarter_start_date + relativedelta(months=3) - timedelta(days=1)
                break
    elif period == 'last_quarter':
        for quarter, months in quarters.items():
            if current_month in months:
                last_quarter = quarter - 1 if quarter > 1 else 4
                last_quarter_start_date = date(end_date.year, quarters[last_quarter][0], 1)
                last_quarter_end_date = last_quarter_start_date + relativedelta(months=3) - timedelta(days=1)
                start_date = last_quarter_start_date
                end_date = last_quarter_end_date
                break

    elif period == 'this_year':
        start_date = date(end_date.year, 1, 1)
    elif period == 'last_year':
        start_date = date(end_date.year - 1, 1, 1)
        end_date = date(end_date.year - 1, 12, 31)

   
    if not circle_id and not period:
        kpi_values = Kpi_Values.query.all()
        if kpi_values:
            values_dict = [kpi_value.to_dict() for kpi_value in kpi_values]
            return jsonify({'KPI Values': values_dict}), 200
        else:
            return jsonify(message='No Values available')

    if not circle_id:
        # Logic for filtering KPI Values without specifying a circle
        kpi_values = Kpi_Values.query.join(Kpi).filter(
            Kpi_Values.period_year >= start_date.year,
            Kpi_Values.period_year <= end_date.year,
            Kpi_Values.period_month >= start_date.month,
            Kpi_Values.period_month <= end_date.month
        ).all()

        if kpi_values:
            values_dict = [kpi_value.to_dict() for kpi_value in kpi_values]
            return jsonify({'KPI Values': values_dict}), 200
        else:
            return jsonify(message='No Values available')

    
    if circle_id:
        try:
            kpis = Kpi.query.filter_by(circle_id=circle_id).all()
            if not kpis:
                return jsonify(message='No KPIs available for the circle')

            kpi_values_list = []
            for kpi in kpis:
                if period is None:
                    kpi_values = Kpi_Values.query.filter(
                        Kpi_Values.kpi_id == kpi.id
                    ).all()
                else:
                    kpi_values = Kpi_Values.query.filter(
                        Kpi_Values.kpi_id == kpi.id,
                        Kpi_Values.period_year >= start_date.year,
                        Kpi_Values.period_year <= end_date.year,
                        Kpi_Values.period_month >= start_date.month,
                        Kpi_Values.period_month <= end_date.month
                    ).all()
                kpi_values_list.extend(kpi_values)

            if not kpi_values_list:
                return jsonify(message='No Values available')
            if kpi_values_list:
                values_dict = [kpi_value.to_dict() for kpi_value in kpi_values_list]
                return jsonify({'KPI Values': values_dict}), 200

        except Exception as e:
            return jsonify({'error': str(e)}), 500

# --------------------------------------
@app.route('/kpi_values/<int:kpi_value_id>/edit', methods=['PUT'])
@jwt_required()
def edit_kpi_values(kpi_value_id):
    # receive kpi_value_id, value
    data = request.get_json()
    kpi_new_values = data.get('value')
    
    try:
        kpi_value = Kpi_Values.query.filter_by(id=kpi_value_id).first()
        kpi_id = kpi_value.kpi_id
        kpi = Kpi.query.filter_by(id=kpi_id).first()
        if not kpi.active:
            return jsonify(message='Kpi is not active. Cannot be updated'), 403
        else:
            kpi_value.value = kpi_new_values
            db.session.commit()
            return jsonify(message='KPI Values Updated Successfully'), 200
    
    except Exception as e:
            db.session.rollback()
            return jsonify({'error': str(e)}), 500



# --------------------------------------
# /GET param= kpi_values_id
#FOR: mini change log : receive kpi_values_id
    # send recent 3 values
# --------------------------------------


# --------------------------------------

# ENDPOINT
# /GET /kpi values based on PARAM:circle_ID and kpi_ID > SEND: SPECIFIC KPI_VALUES

# ------------------------------------


# ------------------------------------
#change log endpoint: 
    # receive circle_id, 'from' and 'to'
    # send response:
        # kpi name & username > needed
        # value = db.Column(db.Float) > needed
        # activity: created - updated
        # timestamp: when action took place
# -------------------------------------


if __name__ == '__main__':
    app.run()
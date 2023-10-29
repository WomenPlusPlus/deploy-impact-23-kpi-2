from flask import Flask, request, jsonify
from models import db, connect_db, User, Circle, Kpi, TokenBlocklist, Periodicity, Unit, Kpi_Values, Change_Log, User_Circle
from flask_jwt_extended import JWTManager, create_access_token, get_jwt_identity, jwt_required, get_jwt
from datetime import datetime, timezone, timedelta
from dotenv import load_dotenv
import os
import ast
from datetime import date
from dateutil.relativedelta import relativedelta
from flask_cors import CORS
from sqlalchemy import and_
import calendar

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

        if not user:
            return jsonify(message='User Not Found'), 404

        elif not user.active:
            return jsonify(message='User is not active. Unauthorized Access'), 403
            
        else:
            access_token = create_access_token(identity=user.id)
            user_dict = user.to_dict()
            return jsonify(access_token=access_token, user=user_dict), 200 
    
    except Exception as e:
        return jsonify(error= str(e)), 500
   

@app.route('/users/<int:user_id>', methods=['GET'])
@jwt_required()
def get_user(user_id):
    """Fetches a user's details"""

    try:

        user = User.query.filter_by(id=user_id).first()
        if not user:
            return jsonify(message='User Not Found'), 404
        
        elif not user.active:
            return jsonify(message='User is not active. Unauthorized Access'), 403
        
        else:
            user_dict = user.to_dict()
            user_dict['circles'] = [user_circle.circle.to_dict() for user_circle in user.user_circle]
            return jsonify({'user':user_dict}), 200
            
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
    period_year = data.get('period_year')
    period_month = data.get('period_month')

    try:
        # Check if a Kpi record with the given name and circle_id exists
        # check if the kpi_value of the same kpi_id, period_month, period_year exists 
        # in the database, when adding a new kpi_value
        kpi = Kpi.query.filter_by(id=kpi_id).first()
       
        if not kpi:
            return jsonify(message="KPI doesn't exist"), 404

        # Check if a Kpi_Values record with the same kpi_id, period_month, and period_year exists
        existing_kpi_value = Kpi_Values.query.filter_by(
            kpi_id=kpi_id,
            period_year=period_year,
            period_month=period_month
        ).first()

        if existing_kpi_value:
            return jsonify(message="KPI Value already exists for this period"), 400

        new_value = Kpi_Values(**data, created_by_user_id=user_id, updated_at=None)
        kpi.kpi_values.append(new_value)
        db.session.commit()
        new_value_id = new_value.id
    
        log_entry = Change_Log(kpi_value_id=new_value_id, user_id=user_id, activity='Created')
        db.session.add(log_entry)
        db.session.commit()
        return jsonify(message="KPI Value was added successfully"),201

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@app.route('/kpi_values/<int:kpi_value_id>/edit', methods=['PUT'])
@jwt_required()
def edit_kpi_values(kpi_value_id):
    """Edit Kpi Value"""

    data = request.get_json()
    kpi_new_values = data.get('value')
    user_id = get_jwt_identity()
    try:
        kpi_value = Kpi_Values.query.filter_by(id=kpi_value_id).first()
        kpi_id = kpi_value.kpi_id
        kpi = Kpi.query.filter_by(id=kpi_id).first()
        if not kpi.active:
            return jsonify(message='Kpi is not active. Cannot be updated'), 403
        else:
            kpi_value.value = kpi_new_values
           
            log_entry = Change_Log(kpi_value_id=kpi_value_id, user_id=user_id, activity='Updated')
            db.session.add(log_entry)
            db.session.commit()
            return jsonify(message='KPI Values Updated Successfully'), 200
    
    except Exception as e:
            db.session.rollback()
            return jsonify({'error': str(e)}), 500


@app.route('/kpi_values', methods=['GET'])
@jwt_required()
def get_all_values():
    """Get KPI Values - Supports Filtering Period and Circle Id"""

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
            return jsonify({'KPI_Values': values_dict}), 200
        else:
            return jsonify(message='No Values Available'), 204

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
            return jsonify({'KPI_Values': values_dict}), 200
        else:
            return jsonify(message='No Values Available'), 204

    if circle_id:
        try:
            kpis = Kpi.query.filter_by(circle_id=circle_id).all()
            if not kpis:
                return jsonify(message='No KPIs available for the circle'), 204

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
                return jsonify(message='No Values Available'), 204
            if kpi_values_list:
                values_dict = [kpi_value.to_dict() for kpi_value in kpi_values_list]
                return jsonify({'KPI_Values': values_dict}), 200

        except Exception as e:
            return jsonify({'error': str(e)}), 500


@app.route('/kpi_values/change_log', methods=["GET"])
@jwt_required()
def get_change_log():
    """Fetch All Change Logs for Kpi Values"""

    data = request.args
    circle_id = data.get('circle_id')
    from_year = data.get('from_year')
    from_month = data.get('from_month')
    to_month = data.get('to_month')
    to_year = data.get('to_year')
    
    # Parse from_year and from_month into a datetime for the start date
    date_from = datetime(int(from_year), int(from_month), 1)

   # Calculate the last day of the to_month
    _, to_month_last_day = calendar.monthrange(int(to_year), int(to_month))

    date_to = datetime(int(to_year), int(to_month), to_month_last_day)
    
    try:
   
        results = (
        db.session.query(
            Kpi_Values.value,
            Kpi.name.label('kpi_name'),
            User.display_name.label('username'),
            Change_Log.activity,
            Change_Log.registered_at
        )
        .join(Kpi, Kpi_Values.kpi_id == Kpi.id)
        .join(Circle, Kpi.circle_id == Circle.id)
        .join(User, Kpi_Values.created_by_user_id == User.id)
        .join(Change_Log, Kpi_Values.id == Change_Log.kpi_value_id)
        .filter(Circle.id == circle_id)  
        .filter(Change_Log.registered_at >= date_from)  
        .filter(Change_Log.registered_at <= date_to)  
        .all()
    )

        if len(results) == 0:
            return jsonify(message='No Logs Available'), 200

        logs_dict = [
            {
                'value': result[0],
                'kpi_name': result[1],
                'username': result[2],
                'activity': result[3],
                'registered_at': result[4]
            }
            for result in results
        ]
        return jsonify(change_log=logs_dict), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/kpi_values/<int:kpi_values_id>/change_log', methods=['GET'])
@jwt_required()
def get_mini_log(kpi_values_id):
    """Get 3 Most Recent Change Log Entries"""

    try:
        results = Change_Log.query.filter_by(kpi_value_id=kpi_values_id).order_by(Change_Log.registered_at.desc()).limit(3).all()

        if not results:
            return jsonify(message='No Logs Available'), 200

        else:
            dict_results = [result.to_dict() for result in results]
            return jsonify(mini_change_log= dict_results), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run()
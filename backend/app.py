from flask import Flask, request, jsonify
from models import db, connect_db, User, Circle, Kpi, TokenBlocklist, Periodicity, Unit, Kpi_Values
from flask_jwt_extended import JWTManager, create_access_token, get_jwt_identity, jwt_required, get_jwt
from datetime import datetime, timezone, timedelta
from dotenv import load_dotenv
import os
import ast

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
    try:
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

    kpi = Kpi.query.filter_by(id=kpi_id).first()

    if not kpi:
        return jsonify(message='KPI Not Found'), 404

    else:
        try:
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
            new_value = Kpi_Values(**data)
            new_value.created_by_user_id = user_id
            new_value.updated_at = None
            kpi.kpi_values.append(new_value)
            db.session.commit()
            return jsonify(message="KPI Value was added successfully"),201

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# AN ENDPOINT TO SHOW ALL VALUES AND SUPPORT FILTERING
@app.route('/kpi_values', methods=['GET'])
@jwt_required()
def get_all_values():
    """Get All KPI Values"""
# NOT DONE YET
    data = request.args
    
    circle_id = data.get('circle_id')
    circle = Circle.query.filter_by(id=circle_id).first()
    if circle:
        try:
            kpi_values_list = Kpi_Values.query.join(Kpi).filter(Kpi.circle_id == circle_id).all()
            if not kpi_values_list:
                return jsonify(message='No Values available')
            if kpi_values_list:
                values_dict = [kpi_value.to_dict() for kpi_value in kpi_values_list]
                return jsonify({'KPI Values': values_dict}), 200

        except Exception as e:
            return jsonify({'error': str(e)}), 500
    

# receive circle_id, kpi_id, period-month, period-year, value
#     send michael all kpi_values based circle and kpi

# @app.route('/kpis/<int:kpi_value_id>/edit', methods=['PUT'])
# def edit_kpi_values():
# check first: if kpi.active == true 
# the reset button should turn value to null
# receive kpi_value_id, value



# get request for kpi values based on circle and kpi SPECIFIC KPI_VALUES ID

# get request for kpi values based on circle and kpi ALL


# ------------------------------------
# 

#create  /OVERVIEW KPI - search endpoint from to :  FOR EACH CIRCLE, PER PERIOD, FOR ALL KPIs and all kpi_values

#mini change log : receive kpi_values_id
    # send recent 3 values

#change log endpoint: 
    # receive circle_id, 'from' and 'to'
    # send response:
        # kpi name & username
        # value = db.Column(db.Float)
        # created_by_user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
        # created_at = db.Column(db.TIMESTAMP, default=func.now())
        # updated_by_user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
        # updated_at = db.Column(db.TIMESTAMP, default=func.now(), onupdate=func.now())


# ---------------------------------------      
# create a table in models.py for kpi_value use history table
#     KPI HISTORY DB TABLE

        # - id
        # - kpi_value_id
        # - user_id
        # - timestamp
        # - activity (insert/new=0, updated=1)
# ---------------------------------------

if __name__ == '__main__':
    app.run()
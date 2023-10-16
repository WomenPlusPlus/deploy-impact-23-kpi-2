from flask import Flask, request, jsonify
from models import db, connect_db, User, Circle, Kpi, TokenBlocklist
from flask_jwt_extended import JWTManager, create_access_token, get_jwt_identity, jwt_required, get_jwt
from datetime import datetime, timezone, timedelta
from dotenv import load_dotenv
import os

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

    user_email = request.form.get('email')
    try:
        user = User.query.filter_by(email=user_email).first()
        if user:
            access_token = create_access_token(identity=user.id)
            return jsonify(access_token=access_token, message='User Verified'), 200
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
            return jsonify({'user':user.to_dict()}), 200
        else:
            return jsonify(message='User Not Found'), 404

    except Exception as e:
        return jsonify(error=str(e)), 500

# Endpoint for revoking the current users access token. Saved the unique
# identifier (jti) for the JWT into our database.
@app.route("/logout", methods=["DELETE"])
@jwt_required()
def modify_token():
    jti = get_jwt()["jti"]
    now = datetime.now(timezone.utc)
    db.session.add(TokenBlocklist(jti=jti, created_at=now))
    db.session.commit()
    return jsonify(msg="JWT revoked")

## add users route
## include user's circle


# ADD USER LOGOUT ENDPOINT
##################
# Circle Endpoints

@app.route('/circles/<int:circle_id>', methods=['GET'])
@jwt_required()
def get_circle(circle_id):
    """Fetches a Circle by its ID"""

    try:
        circle = Circle.query.get_or_404(circle_id)
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

@app.route('/circles/<int:circle_id>/kpis/add', methods=['POST'])
@jwt_required()
def add_kpi_value(circle_id):

    kpi_name = request.form.get('name')
    try:
        kpi = Kpi.query.filter_by(name = kpi_name).first()

        if kpi:
            return jsonify(message='KPI name already exists. Choose a different name.'), 400
        
        else:
            data = request.form.to_dict()
            data['circle_id'] = circle_id
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
    
    kpi = Kpi.query.filter_by(id=kpi_id).first()

    if not kpi:
        return jsonify(message='KPI Not Found'), 404

    else:
        try:
            data = request.form.to_dict()
            for key, value in data.items():
                setattr(kpi, key, value)
            db.session.commit()
            return jsonify(message='KPI Updated Successfully'), 200
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': str(e)}), 500


@app.route('/kpis/<int:kpi_id>', methods=['GET'])
@jwt_required()
def get_kpi(kpi_id):
     
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

# @app.route('/kpis/<int:kpi_id>/kpi_values/<int:kpi_value_id>/add', methods=['POST'])
# def add_kpi_values(kpi_value_id):
#     # check first: if kpi.active == true 
#     

# @app.route('/kpis/<int:kpi_value_id>/edit', methods=['PUT'])
# def edit_kpi_values():
# the reset button should turn value to null
#SEND DATA ABOUT THE KPI HISTORY

if __name__ == '__main__':
    app.run()
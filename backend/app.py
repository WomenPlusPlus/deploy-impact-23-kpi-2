from flask import Flask, request, jsonify
from models import db, connect_db, User, Circle, Kpi, TokenBlocklist, Periodicity, Unit, Kpi_Values
from flask_jwt_extended import JWTManager, create_access_token, get_jwt_identity, jwt_required, get_jwt
from datetime import datetime, timezone, timedelta
from dotenv import load_dotenv
import os
import ast
from datetime import date
from dateutil.relativedelta import relativedelta

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
            new_value = Kpi_Values(**data, created_by_user_id=user_id, updated_at=None)
            kpi.kpi_values.append(new_value)
            db.session.commit()
            return jsonify(message="KPI Value was added successfully"),201

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# AN ENDPOINT TO SHOW ALL VALUES AND SUPPORT FILTERING
# @app.route('/kpi_values', methods=['GET'])
# @jwt_required()
# def get_all_values():
#     """Get All KPI Values"""
# #create  /OVERVIEW KPI - search endpoint from to :  FOR EACH CIRCLE, PER PERIOD, FOR ALL KPIs and all kpi_values
# # /GET /kpi values based on circle and kpi ALL > #if no circles were specified > return all circles
# # SEND BACK KPI VALUES + KPI COLUMNS
#     data = request.args
#     circle_id = data.get('circle_id')
#     period = data.get('period')
    

#     # Define date ranges based on the selected period
#     end_date = date.today()
#     start_date = date(end_date.year, 1, 1)
#     current_quarter = (end_date.month - 1) // 3 + 1
#     current_year = end_date.year
    
#     if period == 'this_month':
#         start_date = end_date.replace(day=1)
#     elif period == 'last_month':
#         start_date = (end_date - relativedelta(months=1)).replace(day=1)
#         end_date = end_date.replace(day=1) - timedelta(days=1)
#     elif period == 'this_quarter':
#         # Calculate the current quarter and year
#         quarter_start_date = date(current_year, (current_quarter - 1) * 3 + 1, 1)
#         quarter_end_date = (quarter_start_date + relativedelta(months=3)) - relativedelta(days=1)
        
#     elif period == 'last_quarter':
#         # Calculate the current quarter and year
#         current_quarter = (end_date.month - 1) // 3 + 1
#         current_year = end_date.year
        
#         # Calculate the first day of the previous quarter
#         previous_quarter_start = date(current_year, (current_quarter - 2) * 3 + 1, 1)
        
#         # Calculate the last day of the previous quarter
#         previous_quarter_end = (previous_quarter_start + relativedelta(months=3)) - relativedelta(days=1)

#         # Update start_date and end_date to the previous quarter
#         start_date = previous_quarter_start
#         end_date = previous_quarter_end
#         print(f"Start Date: {start_date}")
#         print(f"End Date: {end_date}")
#     # Calculate the end date of the previous quarter
    
#     elif period == 'this_year':
#         start_year = end_date.year
#         end_year = end_date.year

#         if circle_id:
#             kpi_values = Kpi_Values.query.join(Kpi).filter(
#                 Kpi.circle_id == circle_id,
#                 Kpi_Values.period_year >= start_year,
#                 Kpi_Values.period_year <= end_year
#             ).all()
#         else:
#             kpi_values = Kpi_Values.query.join(Kpi).filter(
#                 Kpi_Values.period_year >= start_year,
#                 Kpi_Values.period_year <= end_year
#             ).all()
#     elif period == 'last_year':
#         start_year = end_date.year - 1
#         end_year = end_date.year - 1

#         if circle_id:
#             kpi_values = Kpi_Values.query.join(Kpi).filter(
#                 Kpi.circle_id == circle_id,
#                 Kpi_Values.period_year >= start_year,
#                 Kpi_Values.period_year <= end_year
#             ).all()
#         else:
#             kpi_values = Kpi_Values.query.join(Kpi).filter(
#                 Kpi_Values.period_year >= start_year,
#                 Kpi_Values.period_year <= end_year
#             ).all()
#     if circle_id:
#         try:
#             # Get all Kpi instances associated with the circle_id
#             kpis = Kpi.query.filter_by(circle_id=circle_id).all()
#             if not kpis:
#                 return jsonify(message='No KPIs available for the circle')

#             # Get all Kpi_Values associated with the Kpi instances within the date range
#             kpi_values_list = []
#             for kpi in kpis:
#                 kpi_values = Kpi_Values.query.join(Kpi).filter(
#                     Kpi.circle_id == circle_id,
#                     Kpi_Values.created_at >= start_date,
#                     Kpi_Values.created_at <= end_date
#                 ).all()
#                 kpi_values_list.extend(kpi_values)

#             if not kpi_values_list:
#                 return jsonify(message='No Values available')
#             if kpi_values_list:
#                 values_dict = [kpi_value.to_dict() for kpi_value in kpi_values_list]
#                 return jsonify({'KPI Values': values_dict}), 200

#         except Exception as e:
#             return jsonify({'error': str(e)}), 500
#     else:
#         kpi_values = Kpi_Values.query.join(Kpi).filter(
#                     Kpi_Values.created_at >= start_date,
#                     Kpi_Values.created_at <= end_date
#                 ).all()
#         if kpi_values:
#             values_dict = [kpi_value.to_dict() for kpi_value in kpi_values]
#             return jsonify({'KPI Values': values_dict}), 200
#         else:
#             return jsonify(message='No Values available')
# @app.route('/kpi_values', methods=['GET'])
# @jwt_required()
# def get_all_values():
#     data = request.args
#     circle_id = data.get('circle_id')
#     period = data.get('period')

#     # Define date ranges based on the selected period
#     end_date = date.today()
#     start_date = date(end_date.year, 1, 1)
#     current_quarter = (end_date.month - 1) // 3 + 1
#     current_year = end_date.year

#     if period == 'this_month':
#         start_date = end_date.replace(day=1)
#     elif period == 'last_month':
#         start_date = (end_date - relativedelta(months=1)).replace(day=1)
#         end_date = end_date.replace(day=1) - timedelta(days=1)
#     elif period == 'this_quarter':
#         current_quarter = (end_date.month - 1) // 3 + 1
#         current_year = end_date.year

#         # Calculate the first day of the current quarter
#         quarter_start_date = date(current_year, (current_quarter - 1) * 3 + 1, 1)

#         # Calculate the last day of the current quarter
#         quarter_end_date = (quarter_start_date + relativedelta(months=3)) - timedelta(days=1)

#         # Set start_year and end_year to the current year
#         start_year = current_year
#         end_year = current_year

#         # Update start_date and end_date to the current quarter
#         start_date = quarter_start_date
#         end_date = quarter_end_date
#     elif period == 'last_quarter':
#         current_quarter = (end_date.month - 1) // 3 + 1
#         current_year = end_date.year
#         previous_quarter_start = date(current_year, (current_quarter - 2) * 3 + 1, 1)
#         previous_quarter_end = (previous_quarter_start + relativedelta(months=3)) - relativedelta(days=1)
#         start_date = previous_quarter_start
#         end_date = previous_quarter_end

#     if period == 'this_year':
#         start_year = end_date.year
#         end_year = end_date.year

#     elif period == 'last_year':
#         start_year = end_date.year - 1
#         end_year = end_date.year - 1

#     if circle_id:
#         try:
#             kpis = Kpi.query.filter_by(circle_id=circle_id).all()
#             if not kpis:
#                 return jsonify(message='No KPIs available for the circle')

#             kpi_values_list = []
#             for kpi in kpis:
#                 kpi_values = Kpi_Values.query.join(Kpi).filter(
#                     Kpi.circle_id == circle_id,
#                     Kpi_Values.period_year >= start_year,
#                     Kpi_Values.period_year <= end_year
#                 ).all()
#                 kpi_values_list.extend(kpi_values)

#             if not kpi_values_list:
#                 return jsonify(message='No Values available')
#             if kpi_values_list:
#                 values_dict = [kpi_value.to_dict() for kpi_value in kpi_values_list]
#                 return jsonify({'KPI Values': values_dict}), 200

#         except Exception as e:
#             return jsonify({'error': str(e)}), 500
#     else:
#         kpi_values = Kpi_Values.query.join(Kpi).filter(
#             Kpi_Values.period_year >= start_year,
#             Kpi_Values.period_year <= end_year
#         ).all()
#         if kpi_values:
#             values_dict = [kpi_value.to_dict() for kpi_value in kpi_values]
#             return jsonify({'KPI Values': values_dict}), 200
#         else:
#             return jsonify(message='No Values available')


@app.route('/kpi_values', methods=['GET'])
@jwt_required()
def get_all_values():
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
# @app.route('/kpis/<int:kpi_value_id>/edit', methods=['PUT'])
# def edit_kpi_values():
# check first: if kpi.active == true 
# the reset button should turn value to null
# receive kpi_value_id, value


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
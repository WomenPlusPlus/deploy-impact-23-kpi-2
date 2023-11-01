from flask_sqlalchemy import SQLAlchemy
from enum import Enum, unique
from sqlalchemy import func

db = SQLAlchemy()

@unique
class Periodicity(Enum):
    yearly = "Yearly"
    quarterly = "Quarterly"
    monthly = "Monthly"

@unique
class Unit(Enum):
    chf = "CHF"
    percentage = "%"
    amount = "Amount"
    score = 'Score'

class User(db.Model):
    """Users Table"""

    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    first_name = db.Column(db.String(250), nullable=False)
    last_name = db.Column(db.String(250), nullable=False)
    display_name = db.Column(db.String(250), nullable=False, unique=True)
    email = db.Column(db.String(250), nullable=False, unique=True)
    user_login_name = db.Column(db.String(250), nullable=False, unique=True)
    active = db.Column(db.Boolean, default=True)
    is_gatekeeper = db.Column(db.Boolean, default=False)
    
    created_kpi_values = db.relationship('Kpi_Values', backref='created_by', foreign_keys='Kpi_Values.created_by_user_id')
    updated_kpi_values = db.relationship('Kpi_Values', backref='updated_by', foreign_keys='Kpi_Values.updated_by_user_id')
    user_circle = db.relationship('User_Circle', backref='user')

    def to_dict(self):
        return {
            'id': self.id,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'display_name': self.display_name,
            'email': self.email,
            'user_login_name': self.user_login_name,
            'active': self.active,
            'is_gatekeeper': self.is_gatekeeper
        }

class Circle(db.Model):
    """Circles Table"""

    __tablename__ = 'circles'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(250), unique=True)

 
    circle_user = db.relationship('User_Circle', backref='circle')


    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            }

class Kpi(db.Model):
    """KPI's Table"""

    __tablename__ = 'kpis'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    circle_id = db.Column(db.Integer, db.ForeignKey('circles.id'))
    name = db.Column(db.Text, nullable=False, unique=True)
    periodicity = db.Column(db.Enum(Periodicity), nullable=False)
    unit = db.Column(db.Enum(Unit), nullable=False)
    initial_value = db.Column(db.Float, default=0)
    target_value = db.Column(db.Float, nullable = False)
    active = db.Column(db.Boolean, default=True)

    kpi_values = db.relationship('Kpi_Values', backref='kpi')

    def to_dict(self):
        return {
            'id': self.id,
            'circle_id': self.circle_id,
            'name': self.name,
            'periodicity': self.periodicity.value,
            'unit':self.unit.value,
            'initial_value':self.initial_value,
            'target_value':self.target_value,
            'active': self.active
        }



class Kpi_Values(db.Model):
    """Kpi Values Table"""

    __tablename__ = 'kpi_values'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    kpi_id = db.Column(db.Integer, db.ForeignKey('kpis.id'))
    period_year = db.Column(db.Integer)
    period_month = db.Column(db.Integer)
    value = db.Column(db.Float)
    created_by_user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    created_at = db.Column(db.TIMESTAMP, default=func.now())
    updated_by_user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    updated_at = db.Column(db.TIMESTAMP, default=func.now(), onupdate=func.now())
    
    def to_dict(self):
        return {
            'id': self.id,
            'kpi_id': self.kpi_id,
            'period_year': self.period_year,
            'period_month': self.period_month,
            'value': self.value,
            'created_by_user_id': self.created_by_user_id,
            'created_at':self.created_at,
            'updated_by_user_id':self.updated_by_user_id,
            'updated_at':self.updated_at
        }

class User_Circle(db.Model):
    """Users_Circles Table"""

    __tablename__ = 'user_circle'


    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), primary_key=True)
    circle_id = db.Column(db.Integer, db.ForeignKey('circles.id'), primary_key=True)

    
class TokenBlocklist(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    jti = db.Column(db.String(36), nullable=False, index=True)
    created_at = db.Column(db.DateTime, nullable=False)

class Change_Log(db.Model):
    """Change Log Table"""

    __tablename__ = 'change_logs'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    kpi_value_id = db.Column(db.Integer, db.ForeignKey('kpi_values.id'))
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    registered_at = db.Column(db.TIMESTAMP, default=func.now())
    activity = db.Column(db.Text)

    def to_dict(self):
        return {
            'id': self.id,
            'kpi_value_id': self.kpi_value_id,
            'user_id': self.user_id,
            'registered_at': self.registered_at,
            'activity': self.activity
        }

    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    

def connect_db(app):
    db.app = app
    db.init_app(app)
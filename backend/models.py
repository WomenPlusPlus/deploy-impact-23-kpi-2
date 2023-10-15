from flask_sqlalchemy import SQLAlchemy
from enum import Enum, unique


db = SQLAlchemy()

@unique
class Periodicity(Enum):
    YEARLY = "YEARLY"
    QUARTERLY = "Quarterly"
    MONTHLY = "Monthly"

@unique
class Unit(Enum):
    UNIT1 = "CHF"
    UNIT2 = "%"
    UNIT3 = "Amount" #CHECK WITH ALINA
    UNIT4 = 'Score'

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

    created_kpi_values = db.relationship('kpi_values', foreign_keys='kpi_values.created_by_user_id', backref='created_by', lazy='dynamic')
    updated_kpi_values = db.relationship('kpi_values', foreign_keys='kpi_values.updated_by_user_id', backref='updated_by', lazy='dynamic')
    user_circle = db.relationship('user_circle', foreign_keys = 'user_circle.user_id', backref='user_id')

class Circle(db.Model):
    """Circles Table"""

    __tablename__ = 'circles'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(250), unique=True)

    user_circle = db.relationship('user_circle', foreign_keys='user_circle.circle_id', backref='circle_id')

class Kpi(db.Model):
    """KPI's Table"""

    __tablename__ = 'kpis'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    circle_id = db.Column(db.Integer, db.ForeignKey('circles.id'))
    name = db.Column(db.Text, nullable=False, unique=True)
    description = db.Column(db.Text, nullable=False)
    visibility = db.Column(db.Text, nullable=True)
    periodicity = db.Column(db.Enum(Periodicity), nullable=False)
    unit = db.Column(db.Enum(Unit), nullable=False)
    initial_value = db.Column(db.Float) #any default value?
    target_value = db.Column(db.Float, nullable = False)
    active = db.Column(db.Boolean, default=True)

    kpi_values = db.relationship('kpi_values', foreign_keys='kpi_values.kpi_id', backref='kpi_id')

class Kpi_Values(db.Model):
    """Kpi Values Table"""

    __tablename__ = 'kpi_values'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    kpi_id = db.Column(db.Integer, db.ForeignKey('kpis.id'))
    period_year = db.Column(db.Integer)
    period_month = db.Column(db.Integer)
    value = db.Column(db.Float)
    created_by_user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    created_at = db.Column(db.TIMESTAMP)
    updated_by_user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    updated_at = db.Column(db.TIMESTAMP)
    
class User_Circle(db.Model):
    """Users_Circles Table"""

    __tablename__ = 'user_circle'

    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), primary_key=True)
    circle_id = db.Column(db.Integer, db.ForeignKey('circles.id'), primary_key=True)



def connect_db(app):
    db.app = app
    db.init_app(app)
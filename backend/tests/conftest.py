# import pytest
# from flask import Flask
# from models import db, connect_db

# @pytest.fixture(scope='module')
# def test_app():
#     app = Flask(__name__)
#     app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
#     app.config['TESTING'] = True
#     app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
#     connect_db(app)
#     with app.app_context():
#         db.create_all()
#     return app

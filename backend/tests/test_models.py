import pytest
from flask import Flask
from models import User, db as _db, Circle, Kpi, Kpi_Values, Periodicity
from app import app

@pytest.fixture(scope='module')
def test_app_fixture():
    app = Flask(__name__)
    app.config['TESTING'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    _db.init_app(app)
    with app.app_context():
        yield app

@pytest.fixture(scope='module')
def db(test_app_fixture):
    with test_app_fixture.app_context():
        _db.create_all()
        yield _db
        _db.drop_all()

@pytest.fixture(scope='module')
def setup(db, test_app_fixture):
    with test_app_fixture.app_context():
        user = User(email='test@example.com', user_login_name='testuser', first_name='Test', last_name='User', display_name='Test User')
        db.session.add(user)
        db.session.commit()
        db.session.refresh(user)

        circle = Circle(name='Test circle')
        db.session.add(circle)
        db.session.commit()
        db.session.refresh(circle)

        kpi = Kpi(circle_id=circle.id, name='Employee Turnover', periodicity='yearly', unit='amount', initial_value=10, target_value=3)
        db.session.add(kpi)
        db.session.commit()
        db.session.refresh(kpi)

        return user, circle, kpi


def test_get_user(db, test_app_fixture, setup):
    user, _, _ = setup
    with test_app_fixture.app_context():
        db.session.add(user)
        db.session.commit()
        user_query = db.session.query(User).filter_by(email=user.email).first()
        assert user_query is not None
        assert user_query.id == 1



def test_add_kpi(db, test_app_fixture, setup):
    _, circle, _ = setup
    with test_app_fixture.app_context():
        db.session.add(circle)
        db.session.commit()
        circle_id = circle.id
        n_kpi = Kpi(circle_id=circle_id, name='gross sales', periodicity='monthly', unit='chf', initial_value=0, target_value=1000)
        db.session.add(n_kpi)
        db.session.commit()

        kpi_query = Kpi.query.filter_by(id=n_kpi.id).first()
        assert kpi_query.circle_id == 1
        assert kpi_query.name == 'gross sales'




def test_edit_kpi(db, test_app_fixture, setup):
    _, circle, _ = setup
    with test_app_fixture.app_context():
        db.session.add(circle)
        db.session.commit()
        circle_id = circle.id
        new_kpi = Kpi(circle_id=circle_id, name='Acquisition Cost', periodicity='monthly', unit='chf', initial_value=0, target_value=1000)
        db.session.add(new_kpi)
        db.session.commit()

        kpi_query = Kpi.query.filter_by(id=new_kpi.id).first()
        kpi_query.name = 'Net Profit'
        kpi_query.periodicity = 'quarterly'
        db.session.commit()

        updated_kpi_query = Kpi.query.filter_by(id=new_kpi.id).first()
        assert updated_kpi_query.circle_id == 1
        assert updated_kpi_query.name == 'Net Profit'
        assert updated_kpi_query.periodicity == Periodicity.quarterly

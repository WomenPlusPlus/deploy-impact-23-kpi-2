from unittest import TestCase
from models import db, User, Kpi, Kpi_Values, Circle
from app import app



class UserModelTestCase(TestCase):
    """Test views for user routes."""

    def setUp(self):
    
        self.app = app
        self.app_context = app.app_context()
        self.app_context.push()
        self.app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
        self.db = db
        with self.app_context:
            self.db.create_all()

        economist = User(
            first_name='testq',
            last_name='userq',
            display_name='testing_user_1',
            email='testers@test.com',
            user_login_name='tester1',
            active=True,
            is_gatekeeper=False
        )
        gatekeeper = User(
            first_name='martin1',
            last_name='po1',
            display_name='Martin1',
            email='martinsz@test.com',
            user_login_name='Martin-PO1',
            active=True,
            is_gatekeeper=True
        )
        self.db.session.add_all([economist, gatekeeper])
        self.db.session.commit()

        self.economist=economist
        self.gatekeeper=gatekeeper

        self.client = app.test_client()

    def tearDown(self):
        with self.app.app_context():
            # Rollback any uncommitted transactions
            self.db.session.rollback()
            
            # Remove all data from the database tables
            meta = db.metadata
            for table in reversed(meta.sorted_tables):
                self.db.session.execute(table.delete())
            self.db.session.commit()

    def test_login(self):
        """Tests SSO"""
        response = self.client.post('/login', data={'email': self.economist.email})
        self.assertEqual(response.status_code, 200)
       

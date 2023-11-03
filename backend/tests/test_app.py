import unittest
from models import db, User, Circle, Kpi_Values, Kpi
from app import app


class LoginEndpointTestCase(unittest.TestCase):
    def setUp(self):

        self.app = app.test_client()
        self.db = db
        
        self.app_context = app.app_context()
        self.app_context.push()
        self.db.create_all()

        
        self.user = User(first_name='test', last_name='tester', display_name='test_user', email='test@test.com', user_login_name='test user', active=True, is_gatekeeper=False)
        self.db.session.add(self.user)
        self.db.session.commit()

        self.martin = User(first_name='martin', last_name='po', display_name='martin', email='martin@test.com', user_login_name='martin', active=True, is_gatekeeper=True)
        self.db.session.add(self.martin)
        self.db.session.commit()

        self.inactive_user = User(first_name='inactive', last_name='user', display_name='inactive_user', email='inactive@test.com', user_login_name='inactive user', active=False, is_gatekeeper=False)
        self.db.session.add(self.inactive_user)
        self.db.session.commit()

        self.new_circle = Circle(name='test circle')
        self.db.session.add(self.new_circle)
        self.db.session.commit()

    def tearDown(self):
        self.db.session.remove()
        self.db.drop_all()
        self.app_context.pop()

    def login_and_get_token(self, email):
        response = self.app.post('/login', json={
            'email': email
        })
        self.assertEqual(response.status_code, 200)
        json_data = response.get_json()
        self.token = json_data.get('access_token')
        headers = {'Authorization': f'Bearer {self.token}'}
        return {'json_data': json_data, 'headers':headers}

    def add_kpi(self):
        login_response_data = self.login_and_get_token('martin@test.com')
        response = self.app.post('/kpis/add', headers=login_response_data["headers"], json={"circle_id":1, "name":"new_kpi", "periodicity":"monthly", "unit":"chf", "initial_value": 0, "target_value":10000})
        new_res = self.app.get('/kpis/1', headers=login_response_data["headers"])
        kpi_json = new_res.get_json()
        return kpi_json["kpi"]

    def test_login_with_existing_email(self):
        login_response_data = self.login_and_get_token('test@test.com')
        self.assertIn('access_token', login_response_data['json_data'])
        self.assertIn('user', login_response_data['json_data'])

    def test_login_with_non_existing_email(self):
        response = self.app.post('/login', json={'email': 'nonexisting@example.com'})
        self.assertEqual(response.status_code, 404)
        json_data = response.get_json()
        self.assertEqual(json_data['message'], 'User Not Found')

    def test_get_user(self):
        login_response_data = self.login_and_get_token('test@test.com')
        res = self.app.get(f'/users/{self.user.id}', headers=login_response_data["headers"])
        self.assertEqual(res.status_code, 200)
        self.assertIn('user', res.get_json())

    def test_get_non_existing_user_(self):
        login_response_data = self.login_and_get_token('test@test.com')
        res = self.app.get('/users/4', headers=login_response_data["headers"])
        self.assertEqual(res.status_code, 404)
        self.assertIn('User Not Found', res.get_json()['message'])

    def test_get_non_active_user_(self):
        login_response_data = self.login_and_get_token('test@test.com')
        res = self.app.get(f'/users/{self.inactive_user.id}', headers=login_response_data["headers"])
        self.assertEqual(res.status_code, 403)
        self.assertIn('User is not active. Unauthorized Access', res.get_json()['message'])

    def test_get_users(self):
        login_response_data = self.login_and_get_token('test@test.com')
        res = self.app.get(f'/users', headers=login_response_data["headers"])
        self.assertEqual(res.status_code, 200)
        self.assertEqual(len(res.get_json()), 3)
    
    def test_logout(self):
        response = self.app.post('/login', json={
            'email': 'test@test.com'
        })
        self.assertEqual(response.status_code, 200)
        json_data = response.get_json()
        new_token = json_data.get('access_token')
        headers = {'Authorization': f'Bearer {new_token}'}
        response = self.app.delete(f'/logout', headers=headers)
        self.assertEqual(response.status_code, 200)
        response= self.app.get('/users', headers=headers)
        self.assertEqual(response.status_code, 401)


    def test_get_circles(self):
        login_response_data = self.login_and_get_token('test@test.com')
        response = self.app.get('/circles', headers=login_response_data["headers"])
        self.assertEqual(response.status_code, 200)
        self.assertIn('circles', response.get_json())
    
    def test_get_circle_by_id(self):
        login_response_data = self.login_and_get_token('test@test.com')
        response = self.app.get('/circles/1', headers=login_response_data["headers"])
        self.assertEqual(response.status_code, 200)
        self.assertIn('circle', response.get_json())
        self.assertIn('test circle' ,response.get_json()["circle"]["name"])

    def test_get_non_existing_circle(self):
        login_response_data = self.login_and_get_token('test@test.com')
        response = self.app.get('/circles/11', headers=login_response_data["headers"])
        self.assertEqual(response.status_code, 404)
        self.assertIn('Circle Not Found.', response.get_json()["message"])
      
    def test_add_circle(self):
        login_response_data = self.login_and_get_token('test@test.com')
        response = self.app.post('/circles/add', headers=login_response_data["headers"], json={"name":'new_circle'})
        self.assertEqual(response.status_code, 201)
        self.assertIn('Circle added', response.get_json()["message"]) 

    def test_add_kpi_economist(self):
        login_response_data = self.login_and_get_token('test@test.com')
        response = self.app.post('/kpis/add', headers=login_response_data["headers"], json={"circle_id":1, "name":"new_kpi", "periodicity":"monthly", "unit":"chf", "initial_value": 0, "target_value":10000})
        self.assertEqual(response.status_code, 403)
        self.assertIn('User is not a gatekeeper. Unauthorized Access', response.get_json()["message"])

    def test_add_kpi_gatekeeper(self):
        login_response_data = self.login_and_get_token('martin@test.com')
        response = self.app.post('/kpis/add', headers=login_response_data["headers"], json={"circle_id":1, "name":"new_kpi", "periodicity":"monthly", "unit":"chf", "initial_value": 0, "target_value":10000})
        self.assertEqual(response.status_code, 201)
        self.assertIn('KPI created successfully', response.get_json()["message"])
        new_res = self.app.post('/kpis/add', headers=login_response_data["headers"], json={"circle_id":1, "name":"new_kpi", "periodicity":"monthly", "unit":"chf", "initial_value": 0, "target_value":10000})
        self.assertEqual(new_res.status_code, 400)
        self.assertIn('KPI name already exists. Choose a different name.', new_res.get_json()["message"])

    def test_edit_kpi_gatekeeper(self):
        login_response_data = self.login_and_get_token('martin@test.com')
        response = self.app.post('/kpis/add', headers=login_response_data["headers"], json={"circle_id":1, "name":"new_kpi", "periodicity":"monthly", "unit":"chf", "initial_value": 0, "target_value":10000})
        response = self.app.put('/kpis/1/edit', headers=login_response_data["headers"], json={"circle_id":1, "name":"updated_kpi", "periodicity":"monthly", "unit":"chf", "initial_value": 0, "target_value":10000})
        self.assertEqual(response.status_code, 200)
        self.assertIn('KPI Updated Successfully', response.get_json()["message"])
        new_resp = self.app.get('/kpis/1', headers=login_response_data["headers"])
        self.assertIn('updated_kpi', new_resp.get_json()["kpi"]["name"])
        
    def test_edit_na_kpi_gatekeeper(self):
        login_response_data = self.login_and_get_token('martin@test.com')
        response = self.app.put('/kpis/3/edit', headers=login_response_data["headers"], json={"circle_id":1, "name":"updated_kpi", "periodicity":"monthly", "unit":"chf", "initial_value": 0, "target_value":10000})
        self.assertEqual(response.status_code, 404)
        self.assertIn('KPI Not Found', response.get_json()["message"])

    def test_edit_kpi_gatekeeper(self):
        login_response_data = self.login_and_get_token('martin@test.com')
        response = self.app.post('/kpis/add', headers=login_response_data["headers"], json={"circle_id":1, "name":"new_kpi", "periodicity":"monthly", "unit":"chf", "initial_value": 0, "target_value":10000})
        response = self.app.get('/kpis/1', headers=login_response_data["headers"])
        self.assertEqual(response.status_code, 200)
        self.assertIn('new_kpi', response.get_json()["kpi"]["name"])

    def test_get_kpi_gatekeeper(self):
        login_response_data = self.login_and_get_token('martin@test.com')
        response = self.app.post('/kpis/add', headers=login_response_data["headers"], json={"circle_id":1, "name":"new_kpi", "periodicity":"monthly", "unit":"chf", "initial_value": 0, "target_value":10000})
        response = self.app.get('/kpis', headers=login_response_data["headers"])
        self.assertEqual(response.status_code, 200)
        self.assertIn('new_kpi', response.get_json()["kpi_list"][0]["name"])

    def test_get_kpi_economist(self):
        login_response_data = self.login_and_get_token('martin@test.com')
        response = self.app.post('/kpis/add', headers=login_response_data["headers"], json={"circle_id":1, "name":"new_kpi", "periodicity":"monthly", "unit":"chf", "initial_value": 0, "target_value":10000})
        new_login_response_data = self.login_and_get_token('test@test.com')
        res = self.app.get('/kpis', headers=new_login_response_data["headers"])
        self.assertEqual(res.status_code, 200)
        self.assertIn('new_kpi', res.get_json()["kpi_list"][0]["name"])
    
    def test_add_kpi_values(self):
        new_kpi = self.add_kpi()
        login_response_data = self.login_and_get_token('test@test.com')
        response = self.app.post('/kpi_values/add', headers=login_response_data["headers"], json={"kpi_id":new_kpi["id"], "period_year":2023, "period_month":8, "value":555})
        self.assertEqual(response.status_code, 201)
        self.assertIn('KPI Value was added successfully', response.get_json()["message"])
        
        another_kpi = self.add_kpi()
        res = self.app.post('/kpi_values/add', headers=login_response_data["headers"], json={"kpi_id":another_kpi["id"], "period_year":2023, "period_month":8, "value":555})
        self.assertEqual(res.status_code, 400)
        self.assertIn('KPI Value already exists for this period', res.get_json()["message"])
        
    def test_add_kpi_values_na_kpi(self):
        login_response_data = self.login_and_get_token('test@test.com')
        response = self.app.post('/kpi_values/add', headers=login_response_data["headers"], json={"kpi_id":12, "period_year":2023, "period_month":8, "value":555})
        self.assertEqual(response.status_code, 404)
        self.assertIn("KPI doesn't exist", response.get_json()["message"])
    
    def test_edit_kpi_values(self):
        new_kpi = self.add_kpi()
        login_response_data = self.login_and_get_token('test@test.com')
        response = self.app.post('/kpi_values/add', headers=login_response_data["headers"], json={"kpi_id":new_kpi["id"], "period_year":2023, "period_month":8, "value":555})
        new_res = self.app.put('/kpi_values/1/edit', headers=login_response_data["headers"], json={"value":1000})
        self.assertEqual(new_res.status_code, 200)
        self.assertIn('KPI Values Updated Successfully', new_res.get_json()["message"])

    def test_get_all_values_no_params(self):
        """Test API can get kpi_values without any parameters."""
        new_kpi = self.add_kpi()
        login_response_data = self.login_and_get_token('test@test.com')
        response = self.app.post('/kpi_values/add', headers=login_response_data["headers"], json={"kpi_id":new_kpi["id"], "period_year":2023, "period_month":8, "value":555})
        res = self.app.get('/kpi_values', headers=login_response_data["headers"])
        self.assertEqual(res.status_code, 200)

    def test_get_all_values_this_month(self):
        """Test API can filter by this_month."""
        new_kpi = self.add_kpi()
        login_response_data = self.login_and_get_token('test@test.com')
        response = self.app.post('/kpi_values/add', headers=login_response_data["headers"], json={"kpi_id":new_kpi["id"], "period_year":2023, "period_month":11, "value":555})
        res = self.app.get('/kpi_values?period=this_month', headers=login_response_data["headers"])
        self.assertEqual(res.status_code, 200)

    def test_get_all_values_last_quarter(self):
        """Test API can filter by last_quarter."""
        new_kpi = self.add_kpi()
        login_response_data = self.login_and_get_token('test@test.com')
        response = self.app.post('/kpi_values/add', headers=login_response_data["headers"], json={"kpi_id":new_kpi["id"], "period_year":2023, "period_month":8, "value":555})
        res = self.app.get('/kpi_values?period=last_quarter', headers=login_response_data["headers"])
        self.assertEqual(res.status_code, 200)

    def test_get_all_values_circle_id(self):
        """Test API can filter by circle_id."""
        new_kpi = self.add_kpi()
        login_response_data = self.login_and_get_token('test@test.com')
        response = self.app.post('/kpi_values/add', headers=login_response_data["headers"], json={"kpi_id":new_kpi["id"], "period_year":2023, "period_month":8, "value":555})
        res = self.app.get('/kpi_values?circle_id=1', headers=login_response_data["headers"])
        self.assertEqual(res.status_code, 200)

   

if __name__ == '__main__':
    unittest.main()

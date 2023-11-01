DROP DATABASE IF EXISTS kpi_db;
CREATE DATABASE kpi_db;

\c kpi_db

CREATE TYPE periodicity AS ENUM ('yearly', 'quarterly', 'monthly');
CREATE TYPE unit AS ENUM ('chf', 'percentage', 'amount', 'score');


CREATE TABLE users
(
    
  id SERIAL PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  display_name TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  user_login_name TEXT NOT NULL UNIQUE,
  active BOOLEAN NOT NULL DEFAULT true,
  is_gatekeeper BOOLEAN NOT NULL DEFAULT false
);

INSERT INTO users
    (first_name, last_name, display_name, email, user_login_name, active, is_gatekeeper)
    VALUES 
    ('test', 'user', 'test_user_1', 'test@test.com', 'tester', True, false),
    ('martin', 'po', 'Martin', 'martin@test.com', 'Martin-PO', True, True);
CREATE TABLE circles (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE
);

INSERT INTO circles
    (name)
    VALUES 
    ('test_circle');

CREATE TABLE kpis (
  id SERIAL PRIMARY KEY,
  circle_id INTEGER REFERENCES circles,
  name TEXT NOT NULL UNIQUE,
  periodicity periodicity NOT NULL,
  unit unit NOT NULL,
  initial_value FLOAT NOT NULL,
  target_value FLOAT NOT NULL,
  active BOOLEAN NOT NULL DEFAULT true
);

INSERT INTO kpis
    (circle_id,name, periodicity,unit,initial_value,target_value)
    VALUES 
    (1, 'HR KPI', 'monthly', 'percentage',0,100);


CREATE TABLE kpi_values (
  id SERIAL PRIMARY KEY,
  kpi_id INTEGER REFERENCES kpis,
  period_year INTEGER NOT NULL,
  period_month INTEGER NOT NULL,
  value FLOAT NOT NULL,
  created_by_user_id INTEGER REFERENCES users,
  created_at TIMESTAMP NOT NULL,
  updated_by_user_id INTEGER REFERENCES users,
  updated_at TIMESTAMP NOT NULL
);

CREATE TABLE user_circle (
  user_id INTEGER REFERENCES users,
  circle_id INTEGER REFERENCES circles
);


WITH user_id AS (
  SELECT id FROM users WHERE email = 'test@test.com'
), circle_id AS (
  SELECT id FROM circles WHERE name = 'test_circle'
)
INSERT INTO user_circle (user_id, circle_id)
SELECT (SELECT id FROM user_id), (SELECT id FROM circle_id);


CREATE TABLE change_logs (
    id SERIAL PRIMARY KEY,
    kpi_value_id INTEGER REFERENCES kpi_values,
    user_id INTEGER REFERENCES users,
    registered_at TIMESTAMP NOT NULL,
    activity TEXT NOT NULL
);

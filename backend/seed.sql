DROP DATABASE IF EXISTS kpi_db;
CREATE DATABASE kpi_db;

\c kpi_db

CREATE TYPE periodicity AS ENUM ('YEARLY', 'Quarterly', 'Monthly');
CREATE TYPE unit AS ENUM ('CHF', '%', 'Amount', 'Score');


CREATE TABLE users
(
    
  id SERIAL PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  display_name TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  user_login_name TEXT NOT NULL UNIQUE,
  active BOOLEAN NOT NULL DEFAULT true
);

INSERT INTO users
    (first_name, last_name, display_name, email, user_login_name)
    VALUES 
    (test, user, test_user_1, test@test.com, tester);

CREATE TABLE circles (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE
);

CREATE TABLE kpis (
  id SERIAL PRIMARY KEY,
  circle_id INTEGER REFERENCES circles,
  name TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  visibility TEXT NOT NULL,
  periodicity periodicity NOT NULL,
  unit unit NOT NULL,
  initial_value FLOAT NOT NULL,
  target_value FLOAT NOT NULL,
  active BOOLEAN NOT NULL DEFAULT true
);


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
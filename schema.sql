DROP DATABASE IF EXISTS employees_db;
CREATE DATABASE employees_db;
USE employees_db;

CREATE TABLE department(
  id INTEGER(11) AUTO_INCREMENT NOT NULL,
  name VARCHAR(30) NOT NULL, 
  authorId INTEGER(11),
  title VARCHAR(100),
  PRIMARY KEY (id)
);

CREATE TABLE role(
  id INTEGER(11) AUTO_INCREMENT NOT NULL,
  title VARCHAR(30) NOT NULL,
  salary DECIMAL(8,0) NOT NULL,
  department_id INT NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE employee(
  id INT(11) AUTO_INCREMENT NOT NULL,
  first_Name VARCHAR(30) NOT NULL,
  last_Name VARCHAR(30) NOT NULL,
  salary DECIMAL(8,0),
  role_id INT NOT NULL,
  manager_id INT NULL,
  PRIMARY KEY (id)
);




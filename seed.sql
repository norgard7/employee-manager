USE employees_db;

INSERT INTO department (name)
VALUES ("public safety"), 
("OSD"), 
("Academic Affairs");

INSERT INTO role (title, salary, department_id)
VALUES ("Instructor",80000, 3), 
("Dean", 120000, 3),
("lead Officer", 65000, 1),
("junior Officer", 30000, 1),
("intake specalist", 45000,2),
("ASL Interpreter", 60000, 2),
("Testing Coordinators", 40000, 2),
("Director", 90000, 2);


INSERT INTO employee (first_Name, last_Name, role_id)
VALUES ("Michael", "Kirch",2),("Debbie", "Tillman",8), ("Parker", "John", 3);

INSERT INTO employee (first_Name, last_Name, role_id, manager_id)
VALUES ("Dan", "Norgard", 1, 1),
("Anne-Marie", "Ryan-Guest", 1,1),
("Bill", "Nye", 4,3), 
("Kayla", "Allen", 5,8), 
("Geri", "wilson", 7,8), 
("Shelly", "Oliver", 8,8);

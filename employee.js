const inquirer = require("inquirer");
const mysql = require('mysql');
const cTable = require('console.table');
require('dotenv').config();
const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user:  process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: 'employees_db',
  });

function start() {
    inquirer.prompt([
    {
       name: 'options',
       type: 'list',
       message: 'What would you like to do?',
       choices: [
           'Add a department',
           'Add a role',
           'Add an employee',
           'View departments',
           'View roles',
           'View employees',
           "Update an employee's role",
           'EXIT'
       ] 
    }])
    .then((response) => {
        switch (response.options) {
        case 'Add a department':
            addDepartment();
            break;
        case 'Add a role':
            addRole();
            break;
        case 'Add an employee':
            addEmployee();
            break;
        case 'View departments':
            viewDepartments();
            break;
        case 'View roles':
            viewRoles();
            break;
        case 'View employees':
            viewEmployees();
            break;
        case "Update an employee's role":
            updateEmployee();
            break;
        default:
            console.log(response)
            break;
        case 'EXIT':
            connection.end();
    }})
};

function addDepartment() {
    inquirer.prompt([
        {
            name: "department",
            type: 'input',
            message: 'What is the name of the department you want to add?'
        }
    ])
    .then((response) => {
        connection.query('INSERT INTO department SET ?', {
            name: response.department
        },
        (err, res) => {
            if (err) throw err;
            console.log("A new department was added \n");
            start();
        });
    });
};

function addRole() {
    const departments =[];
    connection.query('SELECT * FROM department', (err, res) => {
        if (err) throw err;
        for(let i=0; i<res.length; i++){
            departments.push(res[i].name);
        }
        inquirer.prompt([
            {
                name: "title",
                type: 'input',
                message: 'What is the title of the role you want to add?'
            },
            {
                name: "salary",
                type: 'input',
                message: 'What is the salary of the role you want to add?'
            },
            {
                name: "departmentId",
                type: 'list',
                message: 'What department is this role in?',
                choices: departments
            }
        ])
    .then((res) => {
            let depId;
            for (let i=0; i<departments.length; i++){
                if(departments[i]===res.departmentId){
                    depId=i+1;
                }
            }
            connection.query('INSERT INTO role SET ?', {
                title: res.title,
                salary: res.salary,
                department_id: depId
            },
            (err, res) => {
                if (err) throw err;
                console.log("A new role was added \n");
                start();
            });
        })
        });
}
    
function addEmployee() {
    let roles=[];
    let managers=["none"];
    connection.query('SELECT * FROM role', (err, res) => {
        if (err) throw err;
        for(let i=0; i<res.length; i++){
            roles.push(res[i].title);
        }
    })
    connection.query('SELECT * FROM employee', (err, res) => {
        if (err) throw err;
        for(let i=0; i<res.length; i++){
            managers.push(res[i].first_name +' '+ res[i].last_name);
        }
    })
    
    inquirer.prompt([
        {
            name: "firstName",
            type: 'input',
            message: 'What is the first name of the new employee?'
        },
        {
            name: "lastName",
            type: 'input',
            message: 'What is the last name of the new employee?'
        },
        {
            name: "roleId",
            type: 'list',
            message: 'What is the role of the new employee?',
            choices: roles
        },
        {
            name: "managerId",
            type: 'list',
            message: 'Who is the manager of the new employee?',
            choices: managers
        },
    ])
    .then((res) => {
        let roleIndex;
        let managerIndex;
        for (let i=0; i<roles.length; i++){
            if(roles[i]===res.roleId){
                roleIndex=i+1;
            }
        }
        for (let i=1; i<managers.length; i++){
            if(managers[i]===res.managerId){
                managerIndex=i;
            }
        }
        connection.query('INSERT INTO employee SET ?', {
            first_name: res.firstName,
            last_name: res.lastName,
            role_id: roleIndex,
            manager_id: managerIndex
        },
        (err, res) => {
            if (err) throw err;
            console.log("A new enployee was added \n");
            start();
        });
    });
}

function viewDepartments(){
    connection.query('SELECT * FROM department', (err, res) =>{
        if (err) throw err;
        console.log('***** departments *****');
        console.table(res);
        start();
    })
}

function viewRoles() {
    const query = 'SELECT title, salary, name FROM role INNER JOIN department ON role.department_id=department.id'; 
    connection.query(query, (err, res) =>{
        if (err) throw err; 
        console.log('***** roles *****');
        console.table(res);
        start();
    })
}

function viewEmployees() {
    const query =
    `SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager
  FROM employee e
  LEFT JOIN role r
    ON e.role_id = r.id
  LEFT JOIN department d
  ON d.id = r.department_id
  LEFT JOIN employee m
    ON m.id = e.manager_id`
    connection.query(query, (err, res) =>{
        if (err) throw err; 
        console.log('***** roles *****');
        console.log(res);
        console.table(res);
        start();
    })
}

function updateEmployee() {
    let employees = [];
    let roles = [];
    connection.query('SELECT * FROM employee', (err, res) => {
        if (err) throw err;
        for(let i=0; i<res.length; i++){
            employees.push(res[i].first_name +' '+ res[i].last_name);
        }
    });
    connection.query('SELECT * FROM role', (err, res) => {
        if (err) throw err;
        for(let i=0; i<res.length; i++){
            roles.push(res[i].title);
        }
    })
    inquirer.prompt([
        {
            name: "confirm",
            type: "list",
            message: "Are you sure you want to update an employee?",
            choices:['yes', 'no']
        },
        {
            name: "updatedEmployee",
            type: 'list',
            message: 'Which employee do you want to update?',
            when: function (answer) {
                return answer.confirm === 'yes'
            },
            choices: employees
        },
        {
            name: "updatedRole",
            type: 'list',
            message: 'What is the new role for the employee?',
            when: function (answer) {
                return answer.confirm === 'yes'
            },
            choices:roles
        }
    ])
        .then((res) => {
            let employeeIndex;
            let roleIndex;
            for (let i=0; i<employees.length; i++){
                if(employees[i]===res.updatedEmployee){
                    employeeIndex=i+1;
                }
            }
            for (let i=0; i<roles.length; i++){
                if(roles[i]===res.updatedRole){
                    roleIndex=i+1;
                }
            }
    const query = connection.query(
        'UPDATE employee SET ? WHERE ?',
        [
          {
            role_id: roleIndex,
          },
          {
            id: employeeIndex,
          },
        ],
        (err, res) => {
          if (err) throw err;
          start();
        }
      );

})
}

start();
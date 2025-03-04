import inquirer from 'inquirer';
// const { prompt } = pkg;
// import logo from "asciiart-logo";
import db from "./db/index.js";

init();

// diplay logo & load main prompts
function init() {
    // const logoText = logo({ name: "Employee Manager" }).render();
    // console.log(logoText)
    loadMainPrompts();
};

function loadMainPrompts() {
    inquirer.prompt([
        {
            type: "list",
            name: "choice",
            message: "What would you like to do?",
            choices: [
                {
                    name: "View All Employees",
                    value: "VIEW_EMPLOYEES"
                },
                {
                    name: "View All Employees By Department",
                    value: "VIEW_EMPLOYEES_BY_DEPARTMENT"
                },
                {
                    name: "View All Employees By Manager",
                    value: "VIEW_EMPLOYEES_BY_MANAGER"
                },
                {
                    name: "Add Employee",
                    value: "ADD_EMPLOYEE"
                },
                {
                    name: "Remove Employee",
                    value: "REMOVE_EMPLOYEE"
                },
                {
                    name: "Update Employee Role",
                    value: "UPDATE_EMPLOYEE_ROLE"
                },
                {
                    name: "Update Employee Manager",
                    value: "UPDATE_EMPLOYEE_MANAGER"
                },
                {
                    name: "View All Roles",
                    value: "VIEW_ROLES"
                },
                {
                    name: "Add Role",
                    value: "ADD_ROLE"
                },
                {
                    name: "Remove Role",
                    value: "REMOVE_ROLE"
                },
                {
                    name: "View All Departments",
                    value: "VIEW_DEPARTMENTS"
                },
                {
                    name: "Add Department",
                    value: "ADD_DEPARTMENT"
                },
                {
                    name: "Remove Department",
                    value: "REMOVE_DEPARTMENT"
                },
                {
                    name: "View Total Utilized Budget by Dept",
                    value: "VIEW_BUDGET_BY_DEPT"
                },
                {
                    name: "Quit",
                    value: "QUIT"
                },
            ]
        }
    ]).then(res => {
        let choice = res.choice;
        // Call the appropriate function depending on what the user chose
        switch (choice) {
            case "VIEW_EMPLOYEES":
                viewEmployees();
                break;
            case "VIEW_EMPLOYEES_BY_DEPARTMENT":
                viewEmployeesByDepartment();
                break;
            case "VIEW_EMPLOYEES_BY_MANAGER":
                viewEmployeesByManager();
                break;
            case "ADD_EMPLOYEE":
                addEmployee();
                break;
            case "REMOVE_EMPLOYEE":
                removeEmployee();
                break;
            case "UPDATE_EMPLOYEE_ROLE":
                updateEmployeeRole();
                break;
            case "UPDATE_EMPLOYEE_MANAGER":
                updateEmployeeManager();
                break;
            case "VIEW_ROLES":
                viewRoles();
                break;
            case "ADD_ROLE":
                addRole();
                break;
            case "REMOVE_ROLE":
                removeRole();
                break;
            case "VIEW_DEPARTMENTS":
                viewDepartments();
                break;
            case "ADD_DEPARTMENT":
                addDepartment();
                break;
            case "REMOVE_DEPARTMENT":
                removeDepartment();
                break;
            case "VIEW_BUDGET_BY_DEPT":
                viewBudgetByDept();
                break;
            case "QUIT":
                quit();
        }
    }
    )
}

async function viewBudgetByDept() {
    const { rows } = await db.viewDepartmentBudgets();
    console.table(rows);
    loadMainPrompts();
}

// View All Employees
async function viewEmployees() {
    const { rows } = await db.findAllEmployees(); // 
    console.table(rows);
    loadMainPrompts();
}

// view all employees by department
function viewEmployeesByDepartment() {
    db.findAllDepartments()
        .then(({ rows }) => {
            let departments = rows;
            const departmentChoices = departments.map(({ id, name }) => ({
                name: name,
                value: id
            }));

            inquirer.prompt([
                {
                    type: "list",
                    name: "departmentId",
                    message: "Which department would you like to see employees for?",
                    choices: departmentChoices
                }
            ])
                .then(res => db.findAllEmployeesByDepartment(res.departmentId))
                .then(({ rows }) => {
                    let employees = rows;
                    console.log("\n");
                    console.table(employees);
                })
                .then(() => loadMainPrompts())
        });
}
function viewEmployeesByManager() {
    db.findAllEmployees()
        .then(({ rows }) => { // async 
            let managers = rows;
            const managerChoices = managers.map(({ id, first_name, last_name }) => ({
                name: `${first_name} ${last_name}`,
                value: id
            }));

            inquirer.prompt([
                {
                    type: "list",
                    name: "managerId",
                    message: "Which employee do you want to see direct reports for?",
                    choices: managerChoices
                }
            ])
                .then(res => db.findAllEmployeesByManager(res.managerId))
                .then(({ rows }) => {
                    let employees = rows;
                    console.log("\n");
                    if (employees.length === 0) {
                        console.log("The selected employee has no direct reports");
                    } else {
                        console.table(employees);
                    }
                })
                .then(() => loadMainPrompts())
        });
}

function removeEmployee() {
    db.findAllEmployees()
        .then(({ rows }) => {
            let employees = rows;
            const employeeChoices = employees.map(({ id, first_name, last_name }) => ({
                name: `${first_name} ${last_name}`,
                value: id
            }));

            inquirer.prompt([
                {
                    type: "list",
                    name: "employeeId",
                    message: "Which employee do you want to remove?",
                    choices: employeeChoices
                }
            ])
                .then(res => db.removeEmployee(res.employeeId))
                .then(() => console.log("Removed employee from the database"))
                .then(() => loadMainPrompts())
        })
}

async function updateEmployeeRole() {
    const { rows } = await db.findAllEmployees();
    const employeeChoices = rows.map(({ id, first_name, last_name }) => ({
        name: `${first_name} ${last_name}`,
        value: id
    }));
    const { rows: roles } = await db.findAllRoles();
    const roleChoices = roles.map(({ id, title }) => ({
        name: title,
        value: id
    }));
    const { employeeId, roleId } = await inquirer.prompt([ // wait for employeeId & roleId input
        {
            type: "list",
            name: "employeeId",
            message: "Which employee's role do you want to update?",
            choices: employeeChoices
        },
        {
            type: "list",
            name: "roleId",
            message: "Which role do you want to assign the selected employee?",
            choices: roleChoices
        }
    ])
    await db.updateEmployeeRole(employeeId, roleId);
    console.log("Updated employee's role");
    loadMainPrompts(); // restart menu
}

// update employee's manager
function updateEmployeeManager() {
    db.findAllEmployees()
        .then(({ rows }) => {
            let employees = rows;
            const employeeChoices = employees.map(({ id, first_name, last_name }) => ({
                name: `${first_name} ${last_name}`,
                value: id
            }));
            inquirer.prompt([
                {
                    type: "list",
                    name: "employeeId",
                    message: "Which employee's manager do you want to update?",
                    choices: employeeChoices
                }
            ])
                .then(res => {
                    let employeeId = res.employeeId
                    db.findAllPossibleManagers(employeeId)
                        .then(({ rows }) => {
                            let managers = rows;
                            const managerChoices = managers.map(({ id, first_name, last_name }) => ({
                                name: `${first_name} ${last_name}`,
                                value: id
                            }));
                            inquirer.prompt([
                                {
                                    type: "list",
                                    name: "managerId",
                                    message: "Which employee do you want to set as manager for the selected employee?",
                                    choices: managerChoices
                                }
                            ])
                                .then(res => db.updateEmployeeManager(employeeId, res.managerId))
                                .then(() => console.log("Updated employee's manager"))
                                .then(() => loadMainPrompts())
                        })
                })
        })
}
// view all roles
async function viewRoles() {
    const { rows } = await db.findAllRoles()
    console.table(rows);
    loadMainPrompts();
}

// add a role
async function addRole() {
    const { rows } = await db.findAllDepartments();
    let departments = rows;
    const departmentChoices = departments.map(({ id, name }) => ({
        name: name,
        value: id
    }));
    const role = await inquirer.prompt([
        {
            name: "title",
            message: "What is the name of the role?"
        },
        {
            name: "salary",
            message: "What is the salary of the role?"
        },
        {
            type: "list",
            name: "department_id",
            message: "Which department does the role belong to?",
            choices: departmentChoices
        }
    ])
    await db.createRole(role);
    console.log(`Added ${role.title} to the database`);
    loadMainPrompts();
}

// delete a role
function removeRole() {
    db.findAllRoles()
        .then(({ rows }) => {
            let roles = rows;
            const roleChoices = roles.map(({ id, title }) => ({
                name: title, // what user sees
                value: id    // role id
            }));
            inquirer.prompt([  // create a menu to select a role
                {
                    type: "list",
                    name: "roleId",
                    message:
                        "Which role do you want to remove? (Warning: This will also remove employees)",
                    choices: roleChoices
                }
            ])
                .then(res => db.removeRole(res.roleId)) // removes selected role
                .then(() => console.log("Removed role from the database"))
                .then(() => loadMainPrompts())
        })
}
// add a department
function addDepartment() {
    inquirer.prompt([
        {
            name: "name",
            message: "What is the name of the department?"
        }
    ])
        .then(res => {
            let name = res;
            db.createDepartment(name)
                .then(() => console.log(`Added ${name.name} to the database`))
                .then(() => loadMainPrompts())
        })
}
// remove a department
function removeDepartment() {
    db.findAllDepartments()
        .then(({ rows }) => {
            let departments = rows;
            const departmentChoices = departments.map(({ id, name }) => ({
                name: name,
                value: id
            }));
            inquirer.prompt({
                type: "list",
                name: "departmentId",
                message: "Which department would you like to remove? (Warning: This will also remove associated roles and employees)",
                choices: departmentChoices
            })
                .then(res => db.removeDepartment(res.departmentId))
                .then(() => console.log("Removed department from the database"))
                .then(() => loadMainPrompts())
        })
}
// view all departments & show total budgets
async function viewDepartments() {
    const { rows } = await db.findAllDepartments();
    console.table(rows);
    loadMainPrompts();
}

// add employee
function addEmployee() {
    inquirer.prompt([
        {
            name: "first_name",
            message: "What is the employee's first name?"
        }, {
            name: "last_name",
            message: "What is the employee's last name?"
        }
    ])
        .then(res => {
            let firstName = res.first_name;
            let lastName = res.last_name;

            db.findAllRoles()
                .then(({ rows }) => {
                    let roles = rows;
                    const roleChoices = roles.map(({ id, title }) => ({
                        name: title,
                        value: id
                    }));

                    inquirer.prompt({
                        type: "list",
                        name: "roleId",
                        message: "What is the employee's role?",
                        choices: roleChoices
                    })
                        .then(res => {
                            let roleId = res.roleId;

                            db.findAllEmployees()
                                .then(({ rows }) => {
                                    let employees = rows;
                                    const managerChoices = employees.map(({ id, first_name, last_name }) => ({
                                        name: `${first_name} ${last_name}`,
                                        value: id
                                    }));
                                    managerChoices.unshift({ name: "None", value: null });

                                    inquirer.prompt({
                                        type: "list",
                                        name: "managerId",
                                        message: "Who is the employee's manager?",
                                        choices: managerChoices
                                    })
                                        .then(res => {
                                            let employee = {
                                                manager_id: res.managerId,
                                                role_id: roleId,
                                                first_name: firstName,
                                                last_name: lastName
                                            }

                                            db.createEmployee(employee);
                                        })
                                        .then(() => console.log(
                                            `Added ${firstName} ${lastName} to the database`
                                        ))
                                        .then(() => loadMainPrompts())
                                })
                        })
                })
        })
}

// quit app
function quit() {
    console.log("See you later!")
    process.exit();
}
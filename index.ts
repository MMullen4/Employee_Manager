import prompt from 'inquirer';
import * as logo from 'asciiart-logo';
import { Database } from './db'; // Assuming the correct path to the 'db' module
import inquirer from 'inquirer';


// Define types
type MenuChoice =
    | 'VIEW_EMPLOYEES'
    | 'VIEW_EMPLOYEES_BY_DEPARTMENT'
    | 'VIEW_EMPLOYEES_BY_MANAGER'
    | 'ADD_EMPLOYEE'
    | 'REMOVE_EMPLOYEE'
    | 'UPDATE_EMPLOYEE_ROLE'
    | 'UPDATE_EMPLOYEE_MANAGER'
    | 'VIEW_ROLES'
    | 'ADD_ROLE'
    | 'REMOVE_ROLE'
    | 'VIEW_DEPARTMENTS'
    | 'ADD_DEPARTMENT'
    | 'REMOVE_DEPARTMENT'
    | 'VIEW_BUDGET_BY_DEPT'
    | 'QUIT';

interface Employee {
    id: number;
    first_name: string;
    last_name: string;
    role_id: number;
    manager_id: number | null;
}

interface Department {
    id: number;
    name: string;
}

interface Role {
    id: number;
    title: string;
    salary: number;
    department_id: number;
}

interface MenuOption {
    name: string;
    value: MenuChoice;
}

// Initialize database connection
const db = new Database();

function init(): void {
    const logoText = logo({ name: "Employee Manager" }).render();
    console.log(logoText);
    loadMainPrompts();
}

async function loadMainPrompts(): Promise<void> {
    const choices: MenuOption[] = [
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
        }
    ];

    const { choice } = await inquirer.prompt([

        {
            type: "list",
            name: "choice",
            message: "What would you like to do?",
            choices
        }
    ]);

    switch (choice as MenuChoice) {
        case "VIEW_EMPLOYEES":
            await viewEmployees();
            break;
        case "VIEW_EMPLOYEES_BY_DEPARTMENT":
            await viewEmployeesByDepartment();
            break;
        case "VIEW_EMPLOYEES_BY_MANAGER":
            await viewEmployeesByManager();
            break;
        case "ADD_EMPLOYEE":
            await addEmployee();
            break;
        case "REMOVE_EMPLOYEE":
            await removeEmployee();
            break;
        case "UPDATE_EMPLOYEE_ROLE":
            await updateEmployeeRole();
            break;
        case "UPDATE_EMPLOYEE_MANAGER":
            await updateEmployeeManager();
            break;
        case "VIEW_ROLES":
            await viewRoles();
            break;
        case "ADD_ROLE":
            await addRole();
            break;
        case "REMOVE_ROLE":
            await removeRole();
            break;
        case "VIEW_DEPARTMENTS":
            await viewDepartments();
            break;
        case "ADD_DEPARTMENT":
            await addDepartment();
            break;
        case "REMOVE_DEPARTMENT":
            await removeDepartment();
            break;
        case "VIEW_BUDGET_BY_DEPT":
            await viewBudgetByDept();
            break;
        case "QUIT":
            quit();
            break;
    }
}

async function viewEmployees(): Promise<void> {
    try {
        const rows = await db.findAllEmployees();
        console.table(rows);
        await loadMainPrompts();
    } catch (error) {
        console.error('Error viewing employees:', error);
        await loadMainPrompts();
    }
}

async function viewEmployeesByDepartment(): Promise<void> {
    try {
        const departments = await db.findAllDepartments();
        const departmentChoices = departments.map(({ id, name }: Department) => ({
            name: name,
            value: id
        }));

        const { departmentId } = await inquirer.prompt([
            {
                type: "list",
                name: "departmentId",
                message: "Which department would you like to see employees for?",
                choices: departmentChoices
            }
        ]);

        const employees = await db.findAllEmployeesByDepartment(departmentId);
        console.table(employees);
        await loadMainPrompts();
    } catch (error) {
        console.error('Error viewing employees by department:', error);
        await loadMainPrompts();
    }
}
async function viewEmployeesByManager(): Promise<void> {
    try {
        const managers = await db.findAllPossibleManagers();
        const managerChoices = managers.map(({ id, first_name, last_name }: Employee) => ({
            name: `${first_name} ${last_name}`,
            value: id
        }));

        const { managerId } = await inquirer.prompt([
            {
                type: "list",
                name: "managerId",
                message: "Which manager would you like to see employees for?",
                choices: managerChoices
            }
        ]);

        const employees = await db.findAllEmployeesByManager(managerId);
        console.table(employees);
        await loadMainPrompts();
    } catch (error) {
        console.error('Error viewing employees by manager:', error);
        await loadMainPrompts();
    }
}

async function addEmployee(): Promise<void> {
    try {
        const { firstName, lastName } = await inquirer.prompt([
            {
                name: "first_name",
                message: "What is the employee's first name?"
            },
            {
                name: "last_name",
                message: "What is the employee's last name?"
            }
        ]);

        const roles = await db.findAllRoles();
        const roleChoices = roles.map(({ id, title }: Role) => ({
            name: title,
            value: id
        }));

        const { roleId } = await inquirer.prompt({
            type: "list",
            name: "roleId",
            message: "What is the employee's role?",
            choices: roleChoices
        });

        const employees = await db.findAllEmployees();
        const managerChoices = employees.map(({ id, first_name, last_name }: Employee) => ({
            name: `${first_name} ${last_name}`,
            value: id
        }));
        managerChoices.unshift({ name: "None", value: null });

        const { managerId } = await inquirer.prompt({
            type: "list",
            name: "managerId",
            message: "Who is the employee's manager?",
            choices: managerChoices
        });

        await db.createEmployee({
            first_name: firstName,
            last_name: lastName,
            role_id: roleId,
            manager_id: managerId
        });

        console.log(`Added ${firstName} ${lastName} to the database`);
        await loadMainPrompts();
    } catch (error) {
        console.error('Error adding employee:', error);
        await loadMainPrompts();
    }
}

async function removeEmployee(): Promise<void> {
    try {
        const employees = await db.findAllEmployees();
        const employeeChoices = employees.map(({ id, first_name, last_name }: Employee) => ({
            name: `${first_name} ${last_name}`,
            value: id
        }));

        const { employeeId } = await inquirer.prompt([
            {
                type: "list",
                name: "employeeId",
                message: "Which employee would you like to remove?",
                choices: employeeChoices
            }
        ]);

        await db.removeEmployee(employeeId);
        console.log("Employee removed from the database");
        await loadMainPrompts();
    } catch (error) {
        console.error('Error removing employee:', error);
        await loadMainPrompts();
    }
}

async function updateEmployeeRole(): Promise<void> {
    try {
        const employees = await db.findAllEmployees();
        const employeeChoices = employees.map(({ id, first_name, last_name }: Employee) => ({
            name: `${first_name} ${last_name}`,
            value: id
        }));

        const { employeeId } = await prompt([
            {
                type: "list",
                name: "employeeId",
                message: "Which employee's role would you like to update?",
                choices: employeeChoices
            }
        ]);

        const roles = await db.findAllRoles();
        const roleChoices = roles.map(({ id, title }: Role) => ({
            name: title,
            value: id
        }));

        const { roleId } = await prompt([
            {
                type: "list",
                name: "roleId",
                message: "Which role would you like to assign to the selected employee?",
                choices: roleChoices
            }
        ]);

        await db.updateEmployeeRole(employeeId, roleId);
        console.log("Updated employee's role");
        await loadMainPrompts();
    } catch (error) {
        console.error('Error updating employee role:', error);
        await loadMainPrompts();
    }
}

// update employee manager
async function updateEmployeeManager(): Promise<void> {
    try {
        const employees = await db.findAllEmployees();
        const employeeChoices = employees.map(({ id, first_name, last_name }: Employee) => ({
            name: `${first_name} ${last_name}`,
            value: id
        }));

        const { employeeId } = await inquirer.prompt([
            {
                type: "list",
                name: "employeeId",
                message: "Which employee's manager would you like to update?",
                choices: employeeChoices
            }
        ]);

        const managers = await db.findAllPossibleManagers(employeeId);
        const managerChoices = managers.map(({ id, first_name, last_name }: Employee) => ({
            name: `${first_name} ${last_name}`,
            value: id
        }));

        const { managerId } = await inquirer.prompt([
            {
                type: "list",
                name: "managerId",
                message: "Which employee do you want to set as manager for the selected employee?",
                choices: managerChoices
            }
        ]);

        await db.updateEmployeeManager(employeeId, managerId);
        console.log("Updated employee's manager");
        await loadMainPrompts();
    } catch (error) {
        console.error('Error updating employee manager:', error);
        await loadMainPrompts();
    }
}

// view roles
async function viewRoles(): Promise<void> {
    try {
        const roles = await db.findAllRoles();
        console.table(roles);
        await loadMainPrompts();
    } catch (error) {
        console.error('Error viewing roles:', error);
        await loadMainPrompts();
    }
}

// add roles
async function addRole(): Promise<void> {
    try {
        // fetch deparments
        const departments = await db.findAllDepartments();

        //format departments
        const departmentChoices: Department[] = departments.map(({ id, name }: Department) => ({
            name: name,
            value: id
        })
        );

        // collect role info
        const roleInput: Role = await inquirer.prompt([
            {
                name: "title",
                message: "What is the name of the role?",
                type: "input",
                validate: (input: string) => {
                    if (!input) {
                        return "Please enter a role name";
                    }
                    return true;
                }
            },
            {
                name: "salary",
                message: "What is the salary of this role?",
                type: "number",
                validate: (input: number) => {
                    if (isNaN(input) || input < 0) {
                        return "Please enter a valid salary";
                    }
                    return true;
                }
            },
            {
                name: "department_id",
                message: "Which department does this role belong to?",
                type: "list",
                choices: departmentChoices
            }
        ]);
        // add role to database
        await db.createRole({
            title: roleInput.title,
            salary: roleInput.salary,
            departmentId: roleInput.department_id
        });
        console.log(`Added ${roleInput.title} to the database`);
        await loadMainPrompts();
    } catch (error) {
        console.error('Error adding role:', error);
        await loadMainPrompts();
    }
}

// remove roll
async function removeRole(): Promise<void> {
    try {
        const roles = await db.findAllRoles();
        const roleChoices = roles.map(({ id, title }: Role) => ({
            name: title,
            value: id
        }));

        const { roleId } = await inquirer.prompt([
            {
                type: "list",
                name: "roleId",
                message: "Which role would you like to remove?",
                choices: roleChoices
            }
        ]);

        await db.removeRole(roleId);
        console.log("Role removed from the database");
        await loadMainPrompts();
    } catch (error) {
        console.error('Error removing role:', error);
        await loadMainPrompts();
    }
}

// add department
async function addDepartment(): Promise<void> {
    try {
        const { name } = await inquirer.prompt([
            {
                name: "name",
                message: "What is the name of the department?",
                type: "input",
                validate: (input: string) => {
                    if (!input) {
                        return "Please enter a department name";
                    }
                    return true;
                }
            }
        ]);

        await db.createDepartment(name);
        console.log(`Added ${name} to the database`);
        await loadMainPrompts();
    } catch (error) {
        console.error('Error adding department:', error);
        await loadMainPrompts();
    }
}

// remove department
async function removeDepartment(): Promise<void> {
    try {
        const departments = await db.findAllDepartments();
        const departmentChoices = departments.map(({ id, name }: Department) => ({
            name: name,
            value: id
        }));

        const { departmentId } = await inquirer.prompt([
            {
                type: "list",
                name: "departmentId",
                message: "Which department would you like to remove?",
                choices: departmentChoices
            }
        ]);

        await db.removeDepartment(departmentId);
        console.log("Department removed from the database");
        await loadMainPrompts();
    } catch (error) {
        console.error('Error removing department:', error);
        await loadMainPrompts();
    }
}

// view deparments
async function viewDepartments(): Promise<void> {
    try {
        const departments = await db.findAllDepartments();
        console.table(departments);
        await loadMainPrompts();
    } catch (error) {
        console.error('Error viewing departments:', error);
        await loadMainPrompts();
    }
}

// view Budget by Department
async function viewBudgetByDepartment(): Promise<void> {
    try {
        const departments = await db.findAllDepartments();
        const departmentChoices = departments.map(({ id, name }: Department) => ({
            name: name,
            value: id
        }));

        const { departmentId } = await inquirer.prompt([
            {
                type: "list",
                name: "departmentId",
                message: "Which department would you like to view the budget for?",
                choices: departmentChoices
            }
        ]);

        const budget = await db.viewBudgetByDepartment(departmentId);
        console.log(`The budget for this department is $${budget}`);
        await loadMainPrompts();
    } catch (error) {
        console.error('Error viewing budget by department:', error);
        await loadMainPrompts();
    }
}


function quit(): void {
    console.log("Goodbye!");
    process.exit();
}

init();

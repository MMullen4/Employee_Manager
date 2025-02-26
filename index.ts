import { prompt } from "inquirer";
import logo from "asciiart-logo";
import db from "./db";

// Define types for our choices
type MenuChoice =
    | "VIEW_EMPLOYEES"
    | "VIEW_EMPLOYEES_BY_DEPARTMENT"
    | "VIEW_EMPLOYEES_BY_MANAGER"
    | "ADD_EMPLOYEE"
    | "REMOVE_EMPLOYEE"
    | "UPDATE_EMPLOYEE_ROLE"
    | "UPDATE_EMPLOYEE_MANAGER"
    | "VIEW_ROLES"
    | "ADD_ROLE"
    | "REMOVE_ROLE"
    | "VIEW_DEPARTMENTS"
    | "ADD_DEPARTMENT"
    | "REMOVE_DEPARTMENT"
    | "VIEW_BUDGET_BY_DEPT"
    | "QUIT";

// Define interface for department choices
interface DepartmentChoice {
    name: string;
    value: number;
}

function init(): void {
    const logoText = logo({ name: "Employee Manager" }).render();
    console.log(logoText);
    loadMainPrompts();
}

function loadMainPrompts(): void {
    prompt([
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
                }
            ]
        }
    ]).then(res => {
        const choice = res.choice as MenuChoice;
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
                break;
        }
    });
}

// View All Employees
async function viewEmployees(): Promise<void> {
    const [rows] = await db.findAllEmployees();
    console.table(rows);
    loadMainPrompts();
}

// View all employees by department
async function viewEmployeesByDepartment(): Promise<void> {
    try {
        const [rows] = await db.findAllDepartments();
        const departments = rows;
        const departmentChoices: DepartmentChoice[] = departments.map(({ id, name }) => ({
            name: name,
            value: id
        }));

        const response = await prompt([
            {
                type: "list",
                name: "departmentId",
                message: "Which department would you like to see employees for?",
                choices: departmentChoices
            }
        ]);

        const [employees] = await db.findAllEmployeesByDepartment(response.departmentId);
        console.log("\n");
        console.table(employees);
        loadMainPrompts();
    } catch (error) {
        console.error("Error:", error);
        loadMainPrompts();
    }
}

// Initialize the application
init();

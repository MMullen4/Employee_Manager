import { Pool } from 'pg';
import connection from '../db/connection';

interface Employee {
  id: number;
  first_name: string;
  last_name: string;
  role_id: number;
  manager_id: number | null;
}

interface Role {
  id: number;
  title: string;
  salary: number;
  department_id: number;
}

interface Department {
  id: number;
  name: string;
}

class DB {
  private connection: Pool;

  constructor(connection: Pool) {
    this.connection = connection;
  }

  async findAllEmployees(): Promise<Employee[]> {
    const query = `
            SELECT 
                employee.id, 
                employee.first_name, 
                employee.last_name, 
                role.title, 
                department.name AS department, 
                role.salary, 
                CONCAT(manager.first_name, ' ', manager.last_name) AS manager 
            FROM employee 
            LEFT JOIN role ON employee.role_id = role.id 
            LEFT JOIN department ON role.department_id = department.id 
            LEFT JOIN employee manager ON manager.id = employee.manager_id
        `;
    const result = await this.connection.query<Employee>(query);
    return result.rows;
  }

  async findAllPossibleManagers(employeeId: number): Promise<Employee[]> {
    const query = `
            SELECT id, first_name, last_name 
            FROM employee 
            WHERE id != $1
        `;
    const result = await this.connection.query<Employee>(query, [employeeId]);
    return result.rows;
  }

  async updateEmployeeManager(employeeId: number, managerId: number): Promise<void> {
    const query = `
            UPDATE employee 
            SET manager_id = $1 
            WHERE id = $2
        `;
    await this.connection.query(query, [managerId, employeeId]);
  }

  async findAllDepartments(): Promise<Department[]> {
    const query = `
            SELECT department.id, department.name 
            FROM department
        `;
    const result = await this.connection.query<Department>(query);
    return result.rows;
  }

  async viewDepartmentBudgets(): Promise<any[]> {
    const query = `
            SELECT 
                department.id, 
                department.name, 
                SUM(salary) AS utilized_budget 
            FROM employee 
            LEFT JOIN role ON employee.role_id = role.id 
            LEFT JOIN department ON role.department_id = department.id 
            GROUP BY department.id
        `;
    const result = await this.connection.query(query);
    return result.rows;
  }

  async findAllEmployeesByDepartment(departmentId: number): Promise<Employee[]> {
    const query = `
            SELECT 
                employee.id, 
                employee.first_name, 
                employee.last_name, 
                role.title 
            FROM employee 
            LEFT JOIN role ON employee.role_id = role.id 
            LEFT JOIN department ON role.department_id = department.id 
            WHERE department.id = $1
        `;
    const result = await this.connection.query<Employee>(query, [departmentId]);
    return result.rows;
  }

  async findAllEmployeesByManager(managerId: number): Promise<Employee[]> {
    const query = `
            SELECT 
                employee.id, 
                employee.first_name, 
                employee.last_name, 
                department.name AS department, 
                role.title 
            FROM employee 
            LEFT JOIN role ON role.id = employee.role_id 
            LEFT JOIN department ON department.id = role.department_id 
            WHERE manager_id = $1
        `;
    const result = await this.connection.query<Employee>(query, [managerId]);
    return result.rows;
  }

  async findAllRoles(): Promise<Role[]> {
    const query = `
            SELECT 
                role.id, 
                role.title, 
                department.name AS department, 
                role.salary 
            FROM role 
            LEFT JOIN department ON role.department_id = department.id
        `;
    const result = await this.connection.query<Role>(query);
    return result.rows;
  }

  async createEmployee(employee: Omit<Employee, 'id'>): Promise<Employee> {
    const query = `
            INSERT INTO employee (first_name, last_name, role_id, manager_id) 
            VALUES ($1, $2, $3, $4) 
            RETURNING *
        `;
    const result = await this.connection.query<Employee>(
      query,
      [employee.first_name, employee.last_name, employee.role_id, employee.manager_id]
    );
    return result.rows[0];
  }

  async removeEmployee(employeeId: number): Promise<void> {
    const query = `DELETE FROM employee WHERE id = $1`;
    await this.connection.query(query, [employeeId]);
  }

  async createRole(role: Omit<Role, 'id'>): Promise<Role> {
    const query = `
            INSERT INTO role (title, salary, department_id) 
            VALUES ($1, $2, $3) 
            RETURNING *
        `;
    const result = await this.connection.query<Role>(
      query,
      [role.title, role.salary, role.department_id]
    );
    return result.rows[0];
  }

  async removeRole(roleId: number): Promise<void> {
    const query = `DELETE FROM role WHERE id = $1`;
    await this.connection.query(query, [roleId]);
  }

  async removeDepartment(departmentId: number): Promise<void> {
    const query = `DELETE FROM department WHERE id = $1`;
    await this.connection.query(query, [departmentId]);
  }

  async createDepartment(department: Omit<Department, 'id'>): Promise<Department> {
    const query = `
            INSERT INTO department (name) 
            VALUES ($1) 
            RETURNING *
        `;
    const result = await this.connection.query<Department>(query, [department.name]);
    return result.rows[0];
  }

  async updateEmployeeRole(employeeId: number, roleId: number): Promise<void> {
    const query = `
            UPDATE employee 
            SET role_id = $1 
            WHERE id = $2
        `;
    await this.connection.query(query, [roleId, employeeId]);
  }
}
const database = new DB(connection);
export default database;

// export default new DB(connection);

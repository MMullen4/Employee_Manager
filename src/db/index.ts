import { pool } from './connection.js'; // import pool class

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

export default {
  // private connection: Pool;
  async query(sequelQuery: string, params?: any[]) {
    const poolConnect = await pool.connect()
    try {
      const result = await poolConnect.query(sequelQuery, params)
      return result
    } catch (error) {
      console.error('Error executing query:', error)
      throw error
    } finally {
      poolConnect.release()
    }
  },

  async findAllEmployees() {
    const querySql = `
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
            LEFT JOIN employee manager on manager.id = employee.manager_id
        `;
    const result = await this.query(querySql);
    return result;
  },

  async findAllPossibleManagers(employeeId: number) {
    const query = `
            SELECT id, first_name, last_name 
            FROM employee 
            WHERE id != $1
        `;
    const result = await this.query(query, [employeeId]);
    return result;
  },

  async updateEmployeeManager(employeeId: number, managerId: number) {
    const query = `
            UPDATE employee 
            SET manager_id = $1 
            WHERE id = $2
        `;
    await this.query(query, [managerId, employeeId]);
  },

  async findAllDepartments() {
    const query = `
            SELECT department.id, department.name 
            FROM department
        `;
    const result = await this.query(query);
    return result;
  },

  async viewDepartmentBudgets() {
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
    const result = await this.query(query);
    return result;
  },

  async findAllEmployeesByDepartment(departmentId: number) {
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
    const result = await this.query(query, [departmentId]);
    return result;
  },

  async findAllEmployeesByManager(managerId: number) {
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
    const result = await this.query(query, [managerId]);
    return result;
  },

  async findAllRoles() {
    const query = `
            SELECT 
                role.id, 
                role.title, 
                department.name AS department, 
                role.salary 
            FROM role 
            LEFT JOIN department ON role.department_id = department.id
        `;
    const result = await this.query(query);
    return result;
  },

  async createEmployee(employee: Omit<Employee, 'id'>) {
    const query = `
            INSERT INTO employee (first_name, last_name, role_id, manager_id) 
            VALUES ($1, $2, $3, $4) 
            RETURNING *
        `;
    const result = await this.query(
      query,
      [employee.first_name, employee.last_name, employee.role_id, employee.manager_id]
    );
    return result.rows[0];
  },

  async removeEmployee(employeeId: number) {
    const query = `DELETE FROM employee WHERE id = $1`;
    await this.query(query, [employeeId]);
  },

  async createRole(role: Omit<Role, 'id'>) {
    const query = `
            INSERT INTO role (title, salary, department_id) 
            VALUES ($1, $2, $3) 
            RETURNING *
        `;
    const result = await this.query(
      query,
      [role.title, role.salary, role.department_id]
    );
    return result.rows[0];
  },

  async removeRole(roleId: number) {
    const query = `DELETE FROM role WHERE id = $1`;
    await this.query(query, [roleId]);
  },

  async removeDepartment(departmentId: number) {
    const query = `DELETE FROM department WHERE id = $1`;
    await this.query(query, [departmentId]);
  },

  async createDepartment(department: Omit<Department, 'id'>) {
    const query = `
            INSERT INTO department (name) 
            VALUES ($1) 
            RETURNING *
        `;
    const result = await this.query(query, [department.name]);
    return result.rows[0];
  },

  async updateEmployeeRole(employeeId: number, roleId: number) {
    const query = `
            UPDATE employee 
            SET role_id = $1 
            WHERE id = $2
        `;
    await this.query(query, [roleId, employeeId]);
  }
// async viewDepartmentBudgets() {
//     db.viewDepartmentBudgets()
//       .then(({ rows }) => {
//         console.table(rows);
//         loadMainPrompts();
//       })

  }

// const database = new DB(connection);
// export default database;

// export default new DB(connection);

# Employee Manager

A command-line application to manage a company's employee database, built with Node.js, Inquirer, and PostgreSQL.

## Description

Employee Manager is a robust Content Management System (CMS) that allows business owners to view and manage their company's departments, roles, and employees. This application simplifies organizational structure management through an intuitive command-line interface.

## Features

- View all departments, roles, and employees
- Add new departments, roles, and employees
- Update employee roles and managers
- View employees by manager or department
- Delete departments, roles, and employees
- View total utilized budget by department

## Database Schema

The application uses three main tables:
- **Department**: Stores department names
- **Role**: Contains job titles, salaries, and department associations
- **Employee**: Manages employee information including roles and managers

## Prerequisites

- Node.js (v14.0 or higher)
- PostgreSQL (v12.0 or higher)
- npm (Node Package Manager)

## Installation

1. Clone the repository:
```bash
git clone [repository-url]
npm install
psql -U postgres
CREATE DATABASE employee_manager;
DB_HOST=localhost
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=employee_manager
npm run db:init
npm start

## Usage
1. Start the application:

2. Use the arrow keys to navigate through the menu options

3.Follow the prompts to manage your employee database

Available Commands
 - View all departments
 - View all roles
 - View all employees
 - Add a department
 - Add a role
 - Add an employee
 - Update an employee role
 - Update employee manager
 - View employees by manager
 - View employees by department
 - Delete department
 - Delete role
 - Delete employee
 - View department budget


## Technologies Used
- Node.js
- PostgreSQL
- Inquirer.js
- dotenv
- console.table

## Contributing


## License
This project is licensed under the MIT License - see the LICENSE file for details.

## Contact
Your Name - mhmullen4@outlook.com

Project Link: 

## Acknowledgments
Node.js documentation

PostgreSQL documentation

Inquirer.js documentation




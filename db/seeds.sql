USE employees;

INSERT INTO department 
(name)
VALUES 
('Sales'),
('Engineering'),
('Finance'),
('Legal'),
('Human Resources'),
('IT'),
('Shipping'),
('Admin');

INSERT INTO role
(title, salary, department_id)
VALUES
('Sales Lead', 100000, 1),
('Salesperson', 80000, 1),
('Lead Engineer', 150000, 2),
('Software Engineer', 120000, 2),
('Accountant', 125000, 3),
('Legal Team Lead', 250000, 4),
('Lawyer', 190000, 4),
('HR Manager', 150000, 5),
('HR Specialist', 80000, 5),
('IT Manager', 150000, 6),
('IT Specialist', 80000, 6),
('Shipping Manager', 150000, 7),
('Shipping Specialist', 80000, 7),
('Admin Manager', 150000, 8),
('Admin Specialist', 80000, 8);

INSERT INTO employee
(first_name, last_name, role_id, manager_id)
VALUES
('John', 'Doe', 1, NULL),
('Jane', 'Dunn', 2, 1),
('Bob', 'Smith', 3, NULL),
('Sally', 'Smith', 4, 3),
('Tom', 'Johnson', 5, NULL),
('Sue', 'Murrey', 6, 5),
('Mary', 'Brown', 7, NULL),
('Joe', 'Berry', 8, 7),
('Sue', 'Jones', 9, NULL),
('Joe', 'Joob', 10, 9),
('Sue', 'Williams', 11, NULL),
('Joe', 'Mullen', 12, 11),
('Sue', 'Miller', 13, NULL),
('Joe', 'Maurer', 14, 13),
('Bette', 'Davis', 15, NULL),
('Joe', 'Blow', 16, 15);
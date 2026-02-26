require('dotenv').config();
const mongoose = require('mongoose');
const Assignment = require('./models/Assignment');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ciphersql';

const assignments = [
    {
        title: 'Find All Employees',
        description: 'Practice basic SELECT queries on an employees table.',
        difficulty: 'Easy',
        question:
            'Write a SQL query to retrieve all columns from the employees table. Sort the results by last_name in ascending order.',
        relevantTables: ['employees'],
        tableSchemas: [
            {
                tableName: 'employees',
                columns: [
                    { name: 'id', type: 'INTEGER' },
                    { name: 'first_name', type: 'VARCHAR' },
                    { name: 'last_name', type: 'VARCHAR' },
                    { name: 'department', type: 'VARCHAR' },
                    { name: 'salary', type: 'NUMERIC' },
                    { name: 'hire_date', type: 'DATE' },
                ],
            },
        ],
        tags: ['SELECT', 'ORDER BY'],
    },
    {
        title: 'High Earners',
        description: 'Filter employees based on salary thresholds.',
        difficulty: 'Easy',
        question:
            'Write a SQL query to find all employees who earn more than 60000. Return their first_name, last_name, and salary. Order by salary descending.',
        relevantTables: ['employees'],
        tableSchemas: [
            {
                tableName: 'employees',
                columns: [
                    { name: 'id', type: 'INTEGER' },
                    { name: 'first_name', type: 'VARCHAR' },
                    { name: 'last_name', type: 'VARCHAR' },
                    { name: 'department', type: 'VARCHAR' },
                    { name: 'salary', type: 'NUMERIC' },
                    { name: 'hire_date', type: 'DATE' },
                ],
            },
        ],
        tags: ['WHERE', 'ORDER BY'],
    },
    {
        title: 'Department Salary Summary',
        description: 'Aggregate salary statistics grouped by department.',
        difficulty: 'Medium',
        question:
            'Write a SQL query to find the total salary budget and average salary for each department. Only include departments with more than 2 employees. Order by total budget descending.',
        relevantTables: ['employees'],
        tableSchemas: [
            {
                tableName: 'employees',
                columns: [
                    { name: 'id', type: 'INTEGER' },
                    { name: 'first_name', type: 'VARCHAR' },
                    { name: 'last_name', type: 'VARCHAR' },
                    { name: 'department', type: 'VARCHAR' },
                    { name: 'salary', type: 'NUMERIC' },
                    { name: 'hire_date', type: 'DATE' },
                ],
            },
        ],
        tags: ['GROUP BY', 'HAVING', 'AGGREGATE'],
    },
    {
        title: 'Orders and Customers Join',
        description: 'Practice INNER JOIN across two related tables.',
        difficulty: 'Medium',
        question:
            'Write a SQL query to list each customer\'s full name along with all their order totals. Only include customers who have placed at least one order. Order by customer last_name.',
        relevantTables: ['customers', 'orders'],
        tableSchemas: [
            {
                tableName: 'customers',
                columns: [
                    { name: 'id', type: 'INTEGER' },
                    { name: 'first_name', type: 'VARCHAR' },
                    { name: 'last_name', type: 'VARCHAR' },
                    { name: 'email', type: 'VARCHAR' },
                ],
            },
            {
                tableName: 'orders',
                columns: [
                    { name: 'id', type: 'INTEGER' },
                    { name: 'customer_id', type: 'INTEGER' },
                    { name: 'order_date', type: 'DATE' },
                    { name: 'total_amount', type: 'NUMERIC' },
                    { name: 'status', type: 'VARCHAR' },
                ],
            },
        ],
        tags: ['JOIN', 'INNER JOIN'],
    },
    {
        title: 'Apply a Raise',
        description: 'Practice UPDATE queries that modify salary data.',
        difficulty: 'Hard',
        question:
            'Write a SQL query to give a 10% raise to all employees in the Engineering department who were hired before 2022. Show the updated salary values.',
        relevantTables: ['employees'],
        tableSchemas: [
            {
                tableName: 'employees',
                columns: [
                    { name: 'id', type: 'INTEGER' },
                    { name: 'first_name', type: 'VARCHAR' },
                    { name: 'last_name', type: 'VARCHAR' },
                    { name: 'department', type: 'VARCHAR' },
                    { name: 'salary', type: 'NUMERIC' },
                    { name: 'hire_date', type: 'DATE' },
                ],
            },
        ],
        tags: ['UPDATE', 'WHERE'],
    },
];

const seed = async () => {
    await mongoose.connect(MONGODB_URI);
    await Assignment.deleteMany({});
    await Assignment.insertMany(assignments);
    console.log(`Seeded ${assignments.length} assignments.`);
    await mongoose.disconnect();
};

seed().catch((err) => {
    console.error('Seed failed:', err.message);
    process.exit(1);
});

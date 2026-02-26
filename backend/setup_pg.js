require('dotenv').config();
const { Client } = require('pg');

const setupDatabase = async () => {
    // Determine connection parameters
    const config = {
        user: process.env.PG_USER,
        host: process.env.PG_HOST,
        database: process.env.PG_DATABASE,
        password: process.env.PG_PASSWORD,
        port: process.env.PG_PORT || 5432,
        ssl: {
            rejectUnauthorized: false
        }
    };

    const client = new Client(config);

    try {
        await client.connect();
        console.log(`Connected to database: ${config.database}`);

        // Clean up existing tables
        console.log('Cleaning up existing tables...');
        await client.query(`
            DROP TABLE IF EXISTS orders CASCADE;
            DROP TABLE IF EXISTS customers CASCADE;
            DROP TABLE IF EXISTS employees CASCADE;
        `);

        // Create tables
        console.log('Creating tables...');
        await client.query(`
            CREATE TABLE employees (
                id SERIAL PRIMARY KEY,
                first_name VARCHAR(50),
                last_name VARCHAR(50),
                department VARCHAR(50),
                salary NUMERIC(10, 2),
                hire_date DATE
            );

            CREATE TABLE customers (
                id SERIAL PRIMARY KEY,
                first_name VARCHAR(50),
                last_name VARCHAR(50),
                email VARCHAR(100)
            );

            CREATE TABLE orders (
                id SERIAL PRIMARY KEY,
                customer_id INTEGER REFERENCES customers(id),
                order_date DATE,
                total_amount NUMERIC(10, 2),
                status VARCHAR(20)
            );
        `);
        console.log('Tables created.');

        // Insert sample data
        console.log('Inserting sample data...');
        await client.query(`
            INSERT INTO employees (id, first_name, last_name, department, salary, hire_date) VALUES
            (1, 'Alice', 'Smith', 'Engineering', 85000, '2020-03-15'),
            (2, 'Bob', 'Jones', 'Marketing', 55000, '2021-07-01'),
            (3, 'Carol', 'Davis', 'Engineering', 92000, '2019-11-30'),
            (4, 'Dan', 'Wilson', 'HR', 48000, '2022-01-10'),
            (5, 'Eve', 'Brown', 'Engineering', 78000, '2021-04-20');

            INSERT INTO customers (id, first_name, last_name, email) VALUES 
            (1, 'John', 'Doe', 'john@example.com'),
            (2, 'Jane', 'Lee', 'jane@example.com');
            
            INSERT INTO orders (id, customer_id, order_date, total_amount, status) VALUES 
            (1, 1, '2024-01-15', 250.00, 'completed'),
            (2, 1, '2024-02-10', 120.50, 'pending'),
            (3, 2, '2024-01-28', 89.99, 'completed');
        `);
        console.log('Sample data inserted successfully.');

    } catch (err) {
        console.error('Error during database setup:', err);
    } finally {
        await client.end();
    }
};

setupDatabase();

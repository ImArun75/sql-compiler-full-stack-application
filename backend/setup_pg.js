require('dotenv').config();
const { Client } = require('pg');

const setupDatabase = async () => {
    // Connect to the default 'postgres' database to create the sandbox database
    const initialClient = new Client({
        user: process.env.PG_USER,
        host: process.env.PG_HOST,
        database: 'postgres',
        password: process.env.PG_PASSWORD,
        port: process.env.PG_PORT || 5432,
    });

    try {
        await initialClient.connect();

        // Check if database exists
        const res = await initialClient.query("SELECT datname FROM pg_catalog.pg_database WHERE datname = 'ciphersql_sandbox'");
        if (res.rowCount === 0) {
            console.log('Creating database ciphersql_sandbox...');
            await initialClient.query('CREATE DATABASE ciphersql_sandbox');
            console.log('Database created.');
        } else {
            console.log('Database ciphersql_sandbox already exists.');
        }
    } catch (err) {
        console.error('Error connecting to default postgres database:', err);
        process.exit(1);
    } finally {
        await initialClient.end();
    }

    const sandboxClient = new Client({
        user: process.env.PG_USER,
        host: process.env.PG_HOST,
        database: 'ciphersql_sandbox',
        password: process.env.PG_PASSWORD,
        port: process.env.PG_PORT || 5432,
    });

    try {
        await sandboxClient.connect();
        console.log('Connected to ciphersql_sandbox.');

        await sandboxClient.query(`
            DROP TABLE IF EXISTS orders;
            DROP TABLE IF EXISTS customers;
            DROP TABLE IF EXISTS employees;
        `);

        console.log('Creating tables...');
        await sandboxClient.query(`
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

        console.log('Inserting sample data...');
        await sandboxClient.query(`
            INSERT INTO employees VALUES
            (1, 'Alice', 'Smith', 'Engineering', 85000, '2020-03-15'),
            (2, 'Bob', 'Jones', 'Marketing', 55000, '2021-07-01'),
            (3, 'Carol', 'Davis', 'Engineering', 92000, '2019-11-30'),
            (4, 'Dan', 'Wilson', 'HR', 48000, '2022-01-10'),
            (5, 'Eve', 'Brown', 'Engineering', 78000, '2021-04-20');

            INSERT INTO customers VALUES 
            (1, 'John', 'Doe', 'john@example.com'),
            (2, 'Jane', 'Lee', 'jane@example.com');
            
            INSERT INTO orders VALUES 
            (1, 1, '2024-01-15', 250.00, 'completed'),
            (2, 1, '2024-02-10', 120.50, 'pending'),
            (3, 2, '2024-01-28', 89.99, 'completed');
        `);
        console.log('Sample data inserted successfully.');

    } catch (err) {
        console.error('Error setting up ciphersql_sandbox:', err);
    } finally {
        await sandboxClient.end();
    }
};

setupDatabase();

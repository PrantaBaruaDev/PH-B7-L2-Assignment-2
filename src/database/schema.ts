import { pool } from "."

export const createSchema = async() => {
    await pool.query(`
    CREATE TABLE IF NOT EXISTS users(
        id SERIAL PRIMARY KEY,
        name VARCHAR(20),
        email VARCHAR(50) UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role VARCHAR(15) DEFAULT 'contributor',

        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
    )
    `);

    await pool.query(`
    CREATE TABLE IF NOT EXISTS issues (
        id SERIAL PRIMARY KEY,
        title VARCHAR(150),
        description TEXT NOT NULL,
        type VARCHAR(20) CHECK (type IN ('bug', 'feature_request')) NOT NULL,
        status VARCHAR(15) CHECK (status IN ('open', 'in_progress', 'resolved')) DEFAULT 'open',
        reporter_id INT,

        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
    )
    `);
}
import { pool } from "."

export const createSchema = async() => {
    await pool.query(`
    CREATE TABLE IF NOT EXISTS users(
        id SERIAL PRIMARY KEY,
        name VARCHAR(20) NOT NULL,
        email VARCHAR(50) UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role VARCHAR(15) CHECK (role IN ('contributor', 'maintainer')) DEFAULT 'contributor' NOT NULL,

        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
    )
    `);

    await pool.query(`
    CREATE TABLE IF NOT EXISTS issues (
        id SERIAL PRIMARY KEY,
        title VARCHAR(150) NOT NULL,
        description TEXT NOT NULL,
        type VARCHAR(20) CHECK (type IN ('bug', 'feature_request')) NOT NULL,
        status VARCHAR(15) CHECK (status IN ('open', 'in_progress', 'resolved')) DEFAULT 'open' NOT NULL,
        reporter_id INT NOT NULL,

        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
    )
    `);
}
import { pool } from "../../database";
import { AppError } from "../../errors/AppError";
import type { RegisterUser } from "./users.interface";
import bcrypt from "bcryptjs";

class UserServices {
    private tableName: string = "users";
    
    async createUser(payload: RegisterUser){
        const { name, email, password, role } = payload;

        if(!name || !email || !password) {
            throw new AppError(400, "You must provide name, email & password properly!");
        }

        const hashPassword = await bcrypt.hash(password, 12);

        const query = `
        INSERT INTO ${this.tableName}
            (name, email, password, role)
        VALUES ($1, $2, $3, COALESCE($4, 'contributor'))
        RETURNING * 
        `;
        const values = [name, email, hashPassword, role];

        const result = await pool.query(query, values);

        delete result.rows[0].password;
        
        return result.rows[0];
    }

    async getUserByEmail(email: string) {
        const query = `
            SELECT * FROM ${this.tableName}
            WHERE email = $1
        `;
        const result = await pool.query(query, [email]);

        return result.rows[0];
    }
}

export default new UserServices();

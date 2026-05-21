import { pool } from "../../database";
import type { RegisterUser } from "./users.interface";
import bcrypt from "bcryptjs";

class UserServices {
    private tableName: string = "users";
    
    async createUser(payload: RegisterUser){
        const { name, email, password, role } = payload;

        const hashPassword = await bcrypt.hash(password, 12);

        const query = `
        INSERT INTO ${this.tableName}
            (name, email, password, role)
        VALUES ($1, $2, $3, $4)
        RETURNING * 
        `;
        const values = [name, email, hashPassword, role];

        const result = await pool.query(query, values);

        delete result.rows[0].password;
        
        return result.rows[0];
    }

    async getAllUsers(){
        const query = `
            SELECT * FROM ${this.tableName} 
        `;

        const result = await pool.query(query);
        return result.rows;
    }

    async getUserByEmail(email: string) {
        const query = `
            SELECT * FROM ${this.tableName}
            WHERE email = $1
        `;
        const result = await pool.query(query, [email]);

        return result.rows[0];
    }

    // async updateUser(payload: RegisterUser, id: string){
    //     // const { title, description, type } = payload;

    //     const query = `
    //     UPDATE ${this.tableName}
    //     SET
    //         name = COALESCE($1, title), 
    //         email = COALESCE($2, description), 
    //         password =  COALESCE($3, type)
    //     WHERE id = $4
    //     RETURNING * 
    //     `;
    //     const values = [title, description, type, id];

    //     const result = await pool.query(query, values);
    //     return result.rows[0];
    // }

    // async deleteIssues(id: string){
    //     const query = `
    //     DELETE FROM ${this.tableName} WHERE id = $1
    //     `;
    //     const values = [id];

    //     const result = await pool.query(query, values);
    //     return result;
    // }
}

export default new UserServices();

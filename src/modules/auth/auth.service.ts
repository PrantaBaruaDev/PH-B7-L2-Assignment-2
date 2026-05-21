import jwt, { type JwtPayload } from "jsonwebtoken";
import bcrypt from "bcryptjs";
import UsersService from "../users/users.service";
import { config } from "../../config";
import { pool } from "../../database";
import type { USERS } from "../users/users.interface";
import { signToken, verifyToken } from "../../utils/jwt";
import { AppError } from "../../errors/AppError";

class AuthServices {

    private async comparePassword(password: string, hash: string): Promise<boolean> {
        return await bcrypt.compare(password, hash);
    }

    async login(payload: {
        email: string; password: string;
    }) {
        const { email, password } = payload;

        const userData = await UsersService.getUserByEmail(email);

        if(!userData) {
            throw new AppError(404, "Invalid User Credentials!");
        }

        const passwordMatching = await this.comparePassword(password, userData.password)
        
        if (!passwordMatching) {
            throw new AppError(404, "Invalid Password Credentials!");
        }

        const jwtPayload = {
            id: userData.id,
            name: userData.name,
            email: userData.email,
            role: userData.role,
            created_at: userData.created_at,
            updated_at: userData.updated_at,
        }

        const { accessToken, refreshToken } = signToken(jwtPayload);
        
        delete userData.password; 

        return { userData, accessToken, refreshToken };
    }

    async generateFreshToken(token: string) {
        if(!token){
            throw new Error("Unauthorized");
        }

        const result = verifyToken(token, "refresh");

        if (!result) {
            throw new Error("Invalid or expired refresh token");
        }

        const decoded = result.decoded;

        const userData = await pool.query(`
            SELECT * FROM users WHERE id = $1
            `, [decoded.email]);
        
        if(userData.rows.length === 0){
            throw new Error("User Not Found");
        }

        const user = userData.rows[0];

        const jwtPayload = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            created_at: user.created_at,
            updated_at: user.updated_at,
        };

        const accessToken = jwt.sign(jwtPayload, config.secret as string, {
            expiresIn: "15m",
        });

        return { accessToken };
    }
}

export default new AuthServices();

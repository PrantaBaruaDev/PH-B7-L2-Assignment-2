import bcrypt from "bcryptjs";
import UsersService from "../users/users.service";
import { signToken } from "../../utils/jwt";
import { AppError } from "../../errors/AppError";

class AuthServices {

    private async comparePassword(password: string, hash: string): Promise<boolean> {
        return await bcrypt.compare(password, hash);
    }

    async login(payload: {
        email: string; password: string;
    }) {
        const { email, password } = payload;
        if(!email || !password) {
            throw new AppError(400, "You must provide email & password properly!");
        }

        const userData = await UsersService.getUserByEmail(email);
        if(!userData) {
            throw new AppError(404, "Invalid User Credentials!");
        }

        const passwordMatching = await this.comparePassword(password, userData.password);
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

        return { accessToken, refreshToken };
    }
}

export default new AuthServices();

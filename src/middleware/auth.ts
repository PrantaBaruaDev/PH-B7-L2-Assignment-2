import type { NextFunction, Request, Response } from "express";
import type { ROLES } from "../types";
import { verifyToken } from "../utils/jwt";
import usersService from "../modules/users/users.service";
import { AppError } from "../errors/AppError";


const auth = (...roles: ROLES[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const token = req.headers.authorization; 
            
            if (!token) {
                throw new AppError(401, "Access token is missing");
            }

            const decoded = verifyToken(token as string, "access");
            if (!decoded) {
                throw new AppError(401, "Invalid access token");
            }

            const user = await usersService.getUserByEmail(decoded.email);
            if (!user) {
                throw new AppError(401, "User not found");
            }

            if(roles.length && !roles.includes(user.role)){
                throw new AppError(403, "You do not have permission to access this resource!");
            }

            req.user = decoded;

            next();
        } catch (error) {
            next(error)
        }
    }
}

export default auth;
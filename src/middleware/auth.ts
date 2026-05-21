import type { NextFunction, Request, Response } from "express";
import type { ROLES } from "../types";
import { sendResponse } from "../utils/sendResponse";
import { verifyToken } from "../utils/jwt";
import usersService from "../modules/users/users.service";


const auth = (...roles: ROLES[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const token = req.headers.authorization; 
            
            if (!token) {
                return sendResponse(res, { message: "Access token is missing", error: true }, 401);
            }
            const decoded = verifyToken(token as string, "access");
            if (!decoded) {
                return sendResponse(res, { message: "Invalid access token", error: true }, 401);
            }

            const user = await usersService.getUserByEmail(decoded.email);
            if (!user) {
                return sendResponse(res, { message: "User not found", error: true }, 404);
            }

            if(roles.length && !roles.includes(user.role)){
                return sendResponse(res, {
                    message: "Forbidden!!,This role have no access!",
                    error: true,
                })
            }
            
            req.user = decoded;

            next();
        } catch (error) {
            next(error)
        }
    }
}

export default auth;
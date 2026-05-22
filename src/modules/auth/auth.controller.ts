import type { Request, Response } from "express";
import { sendResponse } from "../../utils/sendResponse";
import authService from "./auth.service";
import { verifyToken } from "../../utils/jwt";
import { AppError } from "../../errors/AppError";

const login = async (req: Request, res: Response) => {

    const result = await authService.login(req.body);

    if(!result){
        sendResponse(res,{
            message: "User not has been registered!"
        }, 404);
    }

    const { accessToken, refreshToken } = result;
    
    const decodedUser = verifyToken(accessToken, "access");
    if (!decodedUser) {
        throw new AppError(401, "Invalid access token");
    }
    if (decodedUser) {
        delete decodedUser.iat;
        delete decodedUser.exp;
    }

    res.cookie("refreshToken", refreshToken, {
        secure: false, // In production => True
        httpOnly: true,
        sameSite: "lax",
    });

    sendResponse(res, {
        message: "Login successful",
        data: {
            token: accessToken,
            user: {...decodedUser},
        }
    });
}

export const AuthController = {
    login
}
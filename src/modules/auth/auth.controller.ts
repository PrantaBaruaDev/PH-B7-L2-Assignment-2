import type { NextFunction, Request, Response } from "express";
import { sendResponse } from "../../utils/sendResponse";
import authService from "./auth.service";

const login = async (req: Request, res: Response) => {

    const result = await authService.login(req.body);

    if(!result){
        sendResponse(res,{
            message: "User not has been registered!"
        }, 404);
    }

    const { accessToken, refreshToken, userData } = result;
    
    res.cookie("refreshToken", refreshToken, {
        secure: false, // In production => True
        httpOnly: true,
        sameSite: "lax",
    });

    sendResponse(res, {
        message: "Login successful",
        data: {
            token: accessToken,
            user: {...userData},
        }
    });
}

export const AuthController = {
    login
}
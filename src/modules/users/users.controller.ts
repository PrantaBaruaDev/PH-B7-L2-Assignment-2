import type { NextFunction, Request, Response } from "express";
import { sendResponse } from "../../utils/sendResponse";
import userService from "./users.service";
import { AppError } from "../../errors/AppError";


const createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const checkUser = await userService.getUserByEmail(req.body.email);
        if(checkUser){
            throw new AppError(400, "User already exist!");
        }

        const issueData = await userService.createUser(req.body);
        
        sendResponse(res, {
            message: "User registered successfully",
            data: issueData
        }, 201);
    } catch (error) {
        next(error);
    }
}


export const usersController = {
    createUser
}
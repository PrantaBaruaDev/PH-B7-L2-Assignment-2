import type { NextFunction, Request, Response } from "express";
import { sendResponse } from "../../utils/sendResponse";
import userService from "./users.service";


const createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const checkUser = await userService.getUserByEmail(req.body.email);
        if(checkUser){
            return sendResponse(res, {
                error: true,
                message: "User already exist!"
            }, 400);
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

const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userData = await userService.getAllUsers();
        
        sendResponse(res, {
            message: "All user retrive successfully",
            data: userData
        });
    } catch (error) {
        next(error);
    }
}



export const usersController = {
    createUser, getAllUsers
}
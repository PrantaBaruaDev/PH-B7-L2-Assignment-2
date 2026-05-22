import type { NextFunction, Request, Response } from "express"
import issuesService from "./issues.service"
import { sendResponse } from "../../utils/sendResponse";
import { AppError } from "../../errors/AppError";

const createIssues = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const issueData = await issuesService.createIssues(req.body, req.user.id);
        
        sendResponse(res, {
            message: "Issue created successfully",
            data: issueData
        });
    } catch (error) {
        next(error);
    }
};

const getIssues = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const issueData = await issuesService.getAllIssues(req.query);
        
        sendResponse(res, {
            data: issueData ?? "No Data found",
        });
    } catch (error) {
        next(error);
    }
}

const getSingleIssue = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
        const issueData = await issuesService.getIssueShow(id as string);
        
        sendResponse(res, {
            data: issueData ?? "No Data found",
        });
    } catch (error) {
        next(error);
    }
}

const updateIssues = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
        const issueData = await issuesService.updateIssues(req.body, id as string, req.user);
        
        sendResponse(res, {
            message: "Issue updated successfully",
            data: issueData ?? "Not Update Data Found",
        });
    } catch (error) {
        next(error);
    }
}

const deleteIssues = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
        const issueData = await issuesService.deleteIssues(id as string);
        
        if (issueData.rowCount === 0) {
            throw new AppError(404, "Issue Record Not found!")
        }

        sendResponse(res, {
            message: "Issue deleted successfully",
        });
    } catch (error) {
        next(error);
    }
}

export const issuesController = {
    createIssues, getIssues, getSingleIssue, updateIssues, deleteIssues
}
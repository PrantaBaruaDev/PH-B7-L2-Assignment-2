import type { NextFunction, Request, Response } from "express"
import issuesService from "./issues.service"
import { sendResponse } from "../../utils/sendResponse";

const createIssues = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const issueData = await issuesService.createIssues(req.body, req.user);
        
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
        const issueData = await issuesService.getIssuesById(id as string);
        
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
            sendResponse(res, {
                message: "Issue Record Not found!",
                error: true
            }, 404);
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
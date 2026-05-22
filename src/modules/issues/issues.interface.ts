import type { ISS_STATUS, ISS_TYPE } from "../../types";
import type { ReportUser } from "../users/users.interface";

export interface ISSUES {
    id: number;
    title: string;
    description: string;
    type: ISS_TYPE;
    status: ISS_STATUS;
    reporter_id: number;
    created_at: Date;
    updated_at: Date;
};

export type NewIssues = Omit<ISSUES, "id" | "created_at" | "updated_at">;

export type IssueWithReporter = Omit<ISSUES, "reporter_id"> & {
    reporter: ReportUser | string;
};

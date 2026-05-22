import type { ROLES } from "../../types";

export interface USERS {
    id: number;
    name: string;
    email: string;
    password: string;
    role: ROLES;
    created_at: Date;
    updated_at: Date;
}; 

export type RegisterUser = Omit<USERS, "id" | "created_at" | "updated_at">;
export type RUser = Omit<USERS, "password">;

export type ReportUser = Omit<USERS, "password" | "email" | "created_at" | "updated_at">;
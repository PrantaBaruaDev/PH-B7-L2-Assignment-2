import type { JwtPayload } from "jsonwebtoken";
import { pool } from "../../database";
import { AppError } from "../../errors/AppError";
import type { ISSUES, IssueWithReporter, NewIssues } from "./issues.interface";

class IssuesServices {
    private tableName: string = "issues";
    async createIssues(payload: NewIssues, userId:string){
        const { title, description, type } = payload;

        const query = `
        INSERT INTO ${this.tableName}
            (title, description, type, reporter_id)
        VALUES ($1, $2, $3, $4)
        RETURNING * 
        `;
        const values = [title, description, type, userId];

        const result = await pool.query(query, values);
        return result.rows[0];
    }

    async getAllIssues(queryParams: any) {
        const { sort = "newest", type, status } = queryParams;

        let query = `
            SELECT * FROM ${this.tableName}
            WHERE 1=1
        `;

        const values: any[] = [];
        let index = 1;

        if (type) {
            query += ` AND type = $${index}`;
            values.push(type);
            index++;
        }

        if (status) {
            query += ` AND status = $${index}`;
            values.push(status);
            index++;
        }

        if (sort === "newest") {
            query += ` ORDER BY created_at DESC`;
        } else {
            query += ` ORDER BY created_at ASC`;
        }

        const issuesResult = await pool.query(query, values);
        const issues = issuesResult.rows;

        return await this.attachReporterDetails(issues);;
    }

    async getIssueShow(id: string){
        const issue = await this.getIssuesById(id);
        if (!issue) return null;
        const [formatted] = await this.attachReporterDetails([issue]);
        return formatted;
    }

    async updateIssues(payload: NewIssues, id: string, user: JwtPayload){
        const { title, description, type, status } = payload;
        const issue = await this.getIssuesById(id);

        if (!issue) {
            throw new AppError(404, "Issue not found");
        }

        let query;
        let values: any[] = [];

        if(user.role === "maintainer"){
            query = `
                UPDATE ${this.tableName}
                SET
                    title = COALESCE($1, title), 
                    description = COALESCE($2, description), 
                    type =  COALESCE($3, type),
                    status =  COALESCE($4, status),

                    updated_at =  NOW()
                WHERE id = $5
                RETURNING * 
            `;
            values = [title, description, type, status, id];
        }
        else if(user.role === "contributor"){
            if(issue.reporter_id !== user.id){
                throw new AppError(403, "You can only update your own issue");
            }
            if (issue.status !== "open") {
                throw new AppError(404, "Issue is not open");
            }

            query = `
                UPDATE ${this.tableName}
                SET
                    title = COALESCE($1, title), 
                    description = COALESCE($2, description), 
                    type =  COALESCE($3, type),
                    
                    updated_at =  NOW()
                WHERE id = $4
                RETURNING * 
            `;
            values= [title, description, type, id];
        } else {
            throw new AppError(401, "Unauthorized");
        }
        
        const result = await pool.query(query, values);
        return result.rows[0];
    }

    async deleteIssues(id: string){
        const query = `
        DELETE FROM ${this.tableName} WHERE id = $1
        `;
        const values = [id];

        const result = await pool.query(query, values);
        return result;
    }

    async getIssuesById(id: string){
        const query = `
            SELECT * FROM ${this.tableName} 
            WHERE id = $1
        `;
        const values = [id];

        const result = await pool.query(query, values);
        return result.rows[0];
    }

    private async attachReporterDetails(issues: ISSUES[]): Promise<IssueWithReporter[]> {
        if (issues.length === 0) {
            return [];
        }

        const reporterIds = [...new Set(issues.map(i => i.reporter_id))];

        const usersResult = await pool.query(`
            SELECT id, name, role
            FROM users
            WHERE id = ANY($1)
            `, [reporterIds]
        );

        const userMap = new Map();
        usersResult.rows.forEach(user => {
            userMap.set(user.id, user);
        });

        const finalData = issues.map(issue => {
            const { reporter_id, created_at, updated_at, ...issueReport } = issue;

            return {
            ...issueReport,
            reporter: userMap.get(reporter_id) || "User record not found!",
            created_at: created_at,
            updated_at: updated_at
        }});

        return finalData;
    }
}

export default new IssuesServices();

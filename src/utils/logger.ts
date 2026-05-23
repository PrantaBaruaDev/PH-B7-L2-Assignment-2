import { config } from "../config";

import { write } from "./fsBaseFile";

export const logger = {
    info: (message: string, meta?: unknown) => {
        const log = `\n[INFO] ${new Date().toISOString()} - ${message} ${meta ? JSON.stringify(meta) : ""}`;

        console.log(`[INFO] ${new Date().toISOString()} - ${message}`, meta || "");
        if(config.node_env === "development") {
            write("app.log", log);
        }
    },

    error: (message: string, meta?: unknown) => {
        const log = `\n[ERROR] ${new Date().toISOString()} - ${message} ${meta ? JSON.stringify(meta) : ""}`;

        console.error(`[ERROR] ${new Date().toISOString()} - ${message}`, meta || "");
        if(config.node_env === "development") {
            write("error.log", log);
        }
    }
};
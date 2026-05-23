
import express, { type Application, type Request, type Response } from "express";
import cors from "cors";
import { config } from "./config";
import { issuesRoute } from "./modules/issues/issues.route";
import globalErrorHandler from "./middleware/globalErrorHandler";
import { usersRoute } from "./modules/users/users.route";
import { authRouter } from "./modules/auth/auth.route";
import { requestLogger } from "./middleware/requestLogger";

const app: Application = express();

app.use(requestLogger);
app.use(express.json());

app.use(cors({
    origin: `${config.base_url}:${config.port}`,
}));

app.get("/", (req: Request, res: Response) => {
    res.send("DevPluse World!");
})

app.use("/api/auth", authRouter, usersRoute);
app.use("/api/issues", issuesRoute);


// Global Error Handling Middleware
app.use(globalErrorHandler);

export default app;
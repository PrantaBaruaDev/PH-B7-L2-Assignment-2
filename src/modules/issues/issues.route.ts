import { Router } from "express";
import { issuesController } from "./issues.controller";
import { USER_ROLE } from "../../types";
import auth from "../../middleware/auth";

const router = Router();

router.post("/", auth(USER_ROLE[0], USER_ROLE[1]), issuesController.createIssues);
router.get("/", auth(USER_ROLE[0], USER_ROLE[1]), issuesController.getIssues);
router.get("/:id", auth(USER_ROLE[0], USER_ROLE[1]), issuesController.getSingleIssue);
router.patch("/:id", auth(USER_ROLE[0], USER_ROLE[1]), issuesController.updateIssues);
router.delete("/:id", auth(USER_ROLE[1]), issuesController.deleteIssues); // only maintainer


export const issuesRoute = router;
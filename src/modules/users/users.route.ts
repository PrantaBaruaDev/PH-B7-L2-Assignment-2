import { Router } from "express";
import { usersController } from "./users.controller";


const router = Router();

router.post("/signup", usersController.createUser);

export const usersRoute = router;

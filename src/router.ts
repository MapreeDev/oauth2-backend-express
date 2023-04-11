import { Request, Response, Router } from "express";
import { LoginAuthController } from "./features/auth/login/Controller";
import { GetMeSessionAuthController } from "./features/auth/session/Controller";

const router = Router();

router.post("/auth/login", LoginAuthController)
router.get("/auth/session/me", GetMeSessionAuthController)

export default router;
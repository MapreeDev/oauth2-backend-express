import { Request, Response } from "express";
import { LoginAuthService } from "./Service";
import { CreateSessionAuthService } from "../session/Service";
import { HandlingError } from "#/utils/errorhandling";

export async function LoginAuthController(req: Request, res: Response){
    try {
        console.log(req.body)
        const user = await LoginAuthService({ code: req.body.code, provider: req.body.provider })
        const session  = await CreateSessionAuthService({ userId: user.id, })
        res.json(session)
    } catch (err) {
        HandlingError(err,res)
    }
}
import { HandlingError } from "#/utils/errorhandling";
import { Request, Response } from "express";

export function GetMeSessionAuthController(req: Request, res: Response){
    try {
        if(!req.user) throw new Error("Missing User");
        const userSession = req.user as any
        delete userSession.accessToken 
        delete userSession.session
        delete userSession.email
        res.json({ ...userSession, gettedAt: new Date(Date.now()).toISOString() })
    } catch (err) {
        HandlingError(err,res)
    }
}
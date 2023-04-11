import { prismaClient } from "#/database/prisma";
import { redisClient } from "#/database/redis";
import { UserWithSession } from "#/types/custom";
import { ErrorWCause, HandlingError } from "#/utils/errorhandling";
import { VerifyJWT } from "#/utils/jsonWebToken";
import { NextFunction, Request, Response } from "express";

export async function LoadAuthMiddleware(req: Request, res: Response, next: NextFunction){
    if(!req.headers.authorization) return next()
    // console.log(req.headers.authorization)
    const { authorization } = req.headers
    try {
        const JWTData = await VerifyJWT(authorization)
        if(typeof(JWTData) != "object") throw new Error("Invalid JWT Payload Type")
        if(!JWTData.accessToken) throw new Error("Missing AccessToken in JWT");
        const { accessToken } = JWTData
        let userCache = await redisClient.get(`sessions:${accessToken}`)
        if(!userCache){
            const SessionAndUser = await prismaClient.session.findUnique({
                where:{
                    accessToken
                },
                select:{
                    device: true,
                    accessTokenExpireAt: true,
                    id: true,
                    user:{
                        select:{
                            avatar: true,
                            createdAt: true,
                            email: true,
                            id: true,
                            name: true,
                        }
                    }
                }
            })
            if(!SessionAndUser) throw new Error("Session not found");
            userCache = JSON.stringify({
                ...SessionAndUser.user,
                session: {
                    accessToken,
                    accessTokenExpireAt: SessionAndUser.accessTokenExpireAt,
                    id: SessionAndUser.id
                }
            });
            await redisClient.setex(`sessions:${accessToken}`,60*10,userCache)
        }
        const userParsed = JSON.parse(userCache) as UserWithSession
        if(!userParsed.avatar || !userParsed.id || !userParsed.email) throw new Error("Malformed Session")
        if(userParsed.session.accessTokenExpireAt <= new Date(Date.now())) throw new ErrorWCause("Session Expired",{ cause: { message: "Revalidate it", needRevalidate: true } })
        console.log("USER",userParsed)
        req.user = userParsed
        next()
    } catch (err) {
        HandlingError(err,res)
    }
}

export function LogginGattedAccess(req: Request, res: Response, next: NextFunction){
    try {
        if (!req.user) throw new ErrorWCause("This route only permmit logged users")
        next()
    } catch (err) {
        HandlingError(err,res)
    }
}
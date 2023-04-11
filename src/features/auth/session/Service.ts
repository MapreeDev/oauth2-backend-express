import { prismaClient } from "#/database/prisma";
import { GenerateRandomUID } from "#/utils/uuid";
import ms from "ms";
import { CreateSessionAuthDTO } from "./DTO";
import { GenerateJWT } from "#/utils/jsonWebToken";

export async function CreateSessionAuthService(data: CreateSessionAuthDTO){
    if(!data.userId) throw new Error("Missing UserId")
    let scopes = data.scopes || []
    if(!data.scopes || data.scopes.length < 1) scopes.push("FULl")
    const refreshToken = GenerateRandomUID();
    const accessToken = GenerateRandomUID();
    await prismaClient.session.create({
        data:{
            id: GenerateRandomUID(),
            accessToken,
            refreshToken,
            accessTokenExpireAt: new Date(Date.now() + ms("7d")),
            userId: data.userId,
            device:{},
        }
    })
    const JWT = await GenerateJWT({ accessToken })
    return{
        accessToken: JWT,
        refreshToken
    }
}

export function InvalidateSessionAuthService(){
    
}

export function ListSessionAuthService(){

}

export function RefreshSessionAuthService(){

}
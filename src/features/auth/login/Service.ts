import { prismaClient } from "#/database/prisma";
import { DefaultAvatarURLConstructor } from "#/utils/template";
import { GenerateRandomUID } from "#/utils/uuid";
import { OAuth2ProvidersConfig } from "../Config";
import { ExchangeGrantToAccessAndRefreshToken } from "../Functions";
import { LoginAuthDTO } from "./DTO";

export async function LoginAuthService(data: LoginAuthDTO){
    if(!data.code) throw new Error("Missing Code")
    if(!data.provider) throw new Error("Missing Provider");
    const { code, provider } = data
    const ProviderConfig = OAuth2ProvidersConfig[provider]
    if (!ProviderConfig) throw new Error("Unsuported Provider");
    const OAuth2Data = await ExchangeGrantToAccessAndRefreshToken({
        callbackURL: `/auth/%PROVIDER%/callback`,
        code,
        provider
    })
    const profile = await ProviderConfig.getUserProfile(OAuth2Data.access_token,OAuth2Data.token_type)
    if(!profile) throw new Error("No Profile returned");
    if(!profile.email) throw new Error("Unsuported Provider");
    const { id, name, email } = profile
    const Connection = await prismaClient.connection.upsert({
        select:{
            user:{
                select:{
                    id: true,
                }
            }
        },
        create:{
            id,
            type: provider,
            accessData:{
                access_token: OAuth2Data.access_token,
                refresh_tolen: OAuth2Data.refresh_token,
            },
            user:{
                connectOrCreate:{
                    where:{
                        email
                    },
                    create:{
                        email,
                        avatar: DefaultAvatarURLConstructor({
                            text: name
                        }),
                        name,
                        id: GenerateRandomUID(),
                    }
                }
            }
        },
        update:{},
        where:{
            id,
        },
    })
    return Connection.user;
}
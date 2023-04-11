import { ErrorWCause } from "#/utils/errorhandling";
import { OAuth2Providers } from "@prisma/client"

interface IProviderResponse {
    name: string;
    id: string;
    email: string;
}

type IOAuth2ProvidersConfig = {
    [key in OAuth2Providers]:{
        token: {
            url: string;
            method: "GET" | "POST";
            pkce?: boolean;
            customHeaders?: any;
            noJsonResponse?: boolean;
        };
        onlyConnect?: boolean;
        bancary?: boolean;
        getUserProfile: (acessToken: string, tokenType?: "Bearer" | "bearer" | "Bot" | "bot" | "Basic" | "basic") => Promise<IProviderResponse>
    }
}

export const OAuth2ProvidersConfig: IOAuth2ProvidersConfig = {
    DISCORD: {
        token: {
            url: `https://discord.com/api/oauth2/token`,
            method: "POST"
        },
        getUserProfile: async (accessToken, tokenType = "Bearer") => {
            const data = await fetch(`https://discord.com/api/v10/users/@me`, {
                method: "GET",
                headers: {
                    Authorization: `${tokenType} ${accessToken}`,
                }
            }).then((res) => res.json())
            if (data.message) throw new ErrorWCause("Invalid discord_prodiver response", { cause: { message: data.message } })
            if (!data.id || !data.username || !data.discriminator) throw new Error("Invalid discord_provider response")
            return {
                name: `${data.username}#${data.discriminator}`,
                id: data.id,
                email: data.email,
            }
        }
    },
    FACEBOOK: {
        token: {
            url: `https://graph.facebook.com/v16.0/oauth/access_token`,
            method: "GET"
        },
        getUserProfile: async (accessToken, tokenType) => {
            const data = await fetch(`https://graph.facebook.com/me?access_token=${accessToken}&fields=id,email,first_name,last_name`, {
                method: "GET",
            }).then((res) => res.json())
            if (!data.id || !data.email || !data.first_name || !data.last_name) throw new ErrorWCause("Invalid Profile response")
            const { id, email, first_name, last_name } = data
            return {
                name: `${first_name} ${last_name}`,
                id,
                email
            }
        }
    },
    GOOGLE: {
        token: {
            url: "https://www.googleapis.com/oauth2/v4/token",
            method: "POST"
        },
        getUserProfile: async (accessToken, tokenType) => {
            const data = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo`, {
                method: "GET",
                headers: {
                    authorization: `${tokenType} ${accessToken}`
                }
            }).then((res) => res.json())
            if (!data.name || !data.email || !data.sub) throw new ErrorWCause("Invalid getUserProfile response")
            const { name, email, sub } = data
            return {
                id: sub,
                name,
                email
            }
        }
    },
    MAPREEDEV: {
        token: {
            method: "POST",
            url: `https://backend.mapree.dev/api/v1/auth/token`,
        },
        async getUserProfile(accessToken, tokenType) {
            const data = await fetch(`https://backend.mapree.dev/api/v1/auth/session/me`,{
                method: "GET",
                headers:{
                    authorization: accessToken
                }
            }).then((res)=>res.json())
            if(!data.id || !data.name || !data.email) throw new ErrorWCause("Malformed user returned")
            const { id, name, email } = data
            return {
                id,
                name,
                email
            }
        },
    },
}
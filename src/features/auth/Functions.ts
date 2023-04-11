import { FRONTEND_URL } from "#/utils/constants";
import { ErrorWCause } from "#/utils/errorhandling";
import { OAuth2Providers } from "@prisma/client";
import { OAuth2ProvidersConfig } from "./Config";

interface IExchangeGrantToAccessAndRefresh {
    access_token: string;
    refresh_token?: string;
    expires_in?: string | number;
    token_type?: "Bearer" | "Basic" | "Bot";
}

interface ExchangeGrantToAccessAndRefreshTokenDTO {
    provider: OAuth2Providers;
    callbackURL: string;
    code: string;
}

export async function ExchangeGrantToAccessAndRefreshToken(data: ExchangeGrantToAccessAndRefreshTokenDTO): Promise<IExchangeGrantToAccessAndRefresh> {
    if (!data.callbackURL) throw new ErrorWCause("Missing CallbackURL")
    if (!data.code) throw new ErrorWCause("Missing Code")
    if (!data.provider) throw new ErrorWCause("Missing Provider")
    const { code, provider, callbackURL } = data;
    const ProviderConfig = OAuth2ProvidersConfig[provider]
    if (!ProviderConfig) throw new Error("Unsuported Provider");
    console.log(`${FRONTEND_URL}${callbackURL.replace("%PROVIDER%", provider.toLowerCase())}`)
    let body = {
        grant_type: "authorization_code",
        client_id: `${process.env[`${provider.toUpperCase()}_ID`]}`,
        client_secret: `${process.env[`${provider.toUpperCase()}_SECRET`]}`,
        code: code,
        redirect_uri: `${FRONTEND_URL}${callbackURL.replace("%PROVIDER%", provider.toLowerCase())}`,
    } as any
    body = new URLSearchParams(body)
    let headers = {}
    if (ProviderConfig.token.method == "POST") headers = { ...headers, 'Content-Type': 'application/x-www-form-urlencoded' }
    if (ProviderConfig.token.customHeaders) headers = { ...headers, ...ProviderConfig.token.customHeaders }
    const tokenResponse = await fetch(`${ProviderConfig.token.url}${ProviderConfig.token.method == "GET" ? `?${body}` : ""}`, {
        method: ProviderConfig.token.method,
        body: (ProviderConfig.token.method == "POST") ? body : null,
        headers
    }).then(async (res) => {
        if (!ProviderConfig.token.noJsonResponse) return res.json()
        const Text = await res.text()
        const response = {} as any
        Text.split("&").forEach((item) => {
            const itemVal = item.split("=");
            response[itemVal[0]] = itemVal[1] || ""
        })
        return response
    })
    console.log(tokenResponse)
    if (tokenResponse.error) throw new Error(tokenResponse.error_description || tokenResponse.error)
    if (!tokenResponse.access_token) throw new ErrorWCause("Invalid Token response", { cause: { message: `Using ${provider.toLowerCase()} provider` } });
    const tokenRes = tokenResponse as IExchangeGrantToAccessAndRefresh
    return tokenRes
}
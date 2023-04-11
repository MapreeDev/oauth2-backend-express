import { OAuth2Providers } from "@prisma/client";

export interface LoginAuthDTO{
    code: string;
    provider: OAuth2Providers;
}
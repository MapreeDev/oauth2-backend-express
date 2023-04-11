import { Profile, Scopes, Session, User } from "@prisma/client";

export interface UserWithSession extends User{
    session: Session;
    error?: string;
    cause?: any;
    accessToken?: string;
}

declare global {
    namespace Express {
        interface Request {
            user?: UserWithSession;
        }
    }
}
import * as JWT from "jsonwebtoken";

const secret = (process.env.JWT_SECRET) ? process.env.JWT_SECRET : "test"

export interface IAuthJWT {
    iat: number;
    exp: number;
    accessToken: string;
    refreshToken: string;
}

export function GenerateJWT(data: object | string, time?: string | number): Promise<string> {
    return new Promise((resolve, reject) => {
        try {
            const Token = JWT.sign(data, secret, {
                algorithm: "HS256",
                
            })
            resolve(Token)
        } catch (err) {
            reject(err)
        }
    })
}

export function VerifyJWT(token: string): Promise<JWT.JwtPayload | IAuthJWT | string | undefined> {
    return new Promise((resolve, reject) => {
        JWT.verify(token, secret, (err, decoded) => {
            if (err) return reject(err)
            resolve(decoded)
        })
    })
}
import { v4,validate } from "uuid";

export function GenerateRandomUID(): string{
    return v4()
}

export function IsRandomUID(uid: string): boolean{
    if(!uid) throw new Error("Missing UID")
    return validate(uid)
}

const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

export function GenrateRandomBase64ID(length: number): string {
    let result = '';
    let counter = 0;
    while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
        counter += 1;
    }
    return result;
}

export function GenerateRandomNumberID(length: number){
    const Decimals = Number(String(1).repeat(length))
    return Math.floor(Math.random() * (9 * Decimals)) + (Decimals)
}
import { Request } from "express";
import * as net from "net";
import { ErrorWCause } from "./errorhandling";

export function IsAnIP(ip: string){
    return !!(net.isIP(ip) != 0)
}

export function GetIP(req: Request){
    return req.ip || String(req.headers['x-forwarded-for'] || req.socket.remoteAddress)
}

export function GetIPRange(ip: string){
    
}
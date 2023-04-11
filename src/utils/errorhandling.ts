import { Response } from "express"

export function HandlingError(err: any,res: Response){
    if (err instanceof ErrorWCause && err.cause) {
        const error = (err.cause.message) ? `${err.message}: ${err.cause.message}` : err.message
        const errorCode = (err.cause.code) ? err.cause.code : 400
        delete err.cause.code
        delete err.cause.message
        return res.status(errorCode).json({ error, ...err.cause })
    }
    if (err instanceof Error && !err.cause) return res.status(400).json({ error: err.message })
    res.status(400).json({
        error: String(err)
    })
}

export class ErrorWCause extends Error {
    override cause: any;
    constructor(errorMessage: string, errorOptions?: ErrorOptions) {
        super(errorMessage, errorOptions)
        if (errorOptions?.cause) this.cause = errorOptions.cause
    }
}
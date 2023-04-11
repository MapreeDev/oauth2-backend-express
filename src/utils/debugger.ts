export interface DebuggerDTO{
    mode: keyof typeof DebuggerCFG;
    message: string;
}

const DebuggerCFG = {
    CONTROLLER:{
        color: "\x1b[32m",
        prefix: "Controller",
    },
    MIDDLEWARE:{
        color: "\x1b[33m",
        prefix: "Middleware"
    },
    SERVICE:{
        color: "\x1b[34m",
        prefix: "Service"
    },
    UTILS:{
        color: "\x1b[35m",
        prefix: "Utils"
    },
    GENERIC:{
        color: "\x1b[36m",
        prefix: "Generic"
    },
    ERROR:{
        color: "\x1b[31m",
        prefix: "Error"
    }
}

export const DebugActive = !!process.env.DEBUG

export function Debugger(data: DebuggerDTO): any | void{
    if (!DebugActive) return
    const ModeData = DebuggerCFG[data.mode]
    if(!ModeData) return Debugger({ mode: "ERROR", message: `Mode ${data.mode} not found in call` })
    console.log(`${ModeData.color}${ModeData.prefix}:\x1b[0m ${data.message}`)
}
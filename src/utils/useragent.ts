import UAParser from "ua-parser-js";

export interface IResponseUAData{
    browser: UAParser.IBrowser;
    cpu?: string;
    device: UAParser.IDevice;
    engine: UAParser.IEngine;
    os: UAParser.IOS
}

export function GetUserAgentData(userAgent: any): IResponseUAData{
    let userAgentData = new UAParser(String(userAgent)).getResult()
    delete userAgentData.browser.major
    return {
        browser: userAgentData.browser,
        cpu: userAgentData.cpu.architecture,
        device: userAgentData.device,
        engine: userAgentData.engine,
        os: userAgentData.os,
    }
}
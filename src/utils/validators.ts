interface ValidatorResponse {
    isValid: boolean;
    validValue?: string;
    invalidateCause?: string;
}

export function EmailValidator(email: string): ValidatorResponse{
    const non_spaced_email = email.replace(/\s/g, "");
    const email_tester = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if(non_spaced_email.length <= 5) return {
        isValid: false,
        invalidateCause: "Length is bellow 5 characters"
    }
    if(non_spaced_email.length >= 256) return {
        isValid: false,
        invalidateCause: "Length is above 256 characters"
    }
    if(!email_tester.test(non_spaced_email)) return {
        isValid: false,
        invalidateCause: "Pattern desmatch"
    }
    return {
        isValid: true,
        validValue: non_spaced_email
    };
}

export function PasswordValidator(password: string): ValidatorResponse {
    const non_spaced_password = password.replace(/\s/g, "");
    if (non_spaced_password.length <= 5) return {
        isValid: false,
        invalidateCause: "Length is bellow 5 characters"
    }
    if(non_spaced_password.length >= 128) return{
        isValid: false,
        invalidateCause: "Length is above 128 characters"
    }
    return {
        isValid: true,
        validValue: non_spaced_password
    };
}

export function NameValidator(name: string): ValidatorResponse {
    const non_spaced_name = name.replace(/\s/g, "");
    if (non_spaced_name.length <= 5) return{
        isValid: false,
        invalidateCause: "Length is bellow 5 characters"
    }
    if(non_spaced_name.length >= 64) return{
        isValid: false,
        invalidateCause: "Length is above 64 characters"
    }
    return{
        isValid: true,
        validValue: non_spaced_name
    };
}

export function ParamValidator(str: string): ValidatorResponse {
    const non_spaced_str = String(str).replace(/\s/g, "");
    if (non_spaced_str.length < 32) return {
        isValid: false,
        invalidateCause: "Length is bellow 32 characters"
    }
    if (non_spaced_str.length > 64) return {
        isValid: false,
        invalidateCause: "Length is above 64 characters"
    }
    return {
        isValid: true,
        validValue: non_spaced_str
    };
}

export function URLValidator(url: string): ValidatorResponse{
    const urlRegex = /^(http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/i;
    // if (!urlRegex.test(url)) return {
    //     isValid: false,
    //     invalidateCause: "Regex does not match"
    // };
    return {
        isValid: true, 
        validValue: encodeURI(url)
    };
}
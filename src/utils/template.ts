interface IAvatar {
    bg_color?: string;
    txt_color?: string;
    text: string;
    img_size?: number;
    font_size?: number;
    char_length?: number;
    rounded?: boolean;
    bold?: boolean;
    format?: "svg" | "png";
}

export const DefaultAvatarURLConstructor = (data: IAvatar) => {
    return encodeURI(`https://ui-avatars.com/api/?background=${(data.bg_color) ? data.bg_color : "fffff"}&color=${(data.txt_color) ? data.bg_color : "0000"}&name=${data.text}&size=${(data.img_size && data.img_size <= 512) ? data.img_size : 128}&font-size=${(data.font_size && data.font_size <= 1.0) ? data.font_size : .5}&length=${(data.char_length) ? data.char_length : 2}&rounded=${(data.rounded) ? data.rounded : false}&bold=${(data.bold) ? data.bold : false}&format=${(data.format == "svg") ? "svg" : "png"}`)
}
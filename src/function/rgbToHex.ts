import { RGBColor, RGBAColor } from "..";

export function rgbToHex(rgba: RGBColor | RGBAColor): `#${string}` {

    let a, hex;
    const rgb = rgba.replace(/\s/g, '').match(/^rgba?\((\d+),(\d+),(\d+),?([^,\s)]+)?/i),
    alpha = (rgb && rgb[4] || "").trim();

    hex = rgb ?
    (Number(rgb[1]) | 1 << 8).toString(16).slice(1) +
    (Number(rgb[2]) | 1 << 8).toString(16).slice(1) +
    (Number(rgb[3]) | 1 << 8).toString(16).slice(1) : rgb;

    if (alpha !== "") a = alpha;
    else a = "01";

    // multiply before convert to HEX
    a = ((a * 255) | 1 << 8).toString(16).slice(1)
    hex = hex + a;

    return `#${hex}`;

    // TODO Full Color Option Convert





    // const rgbValues = rgb.substring(rgb.indexOf('(') + 1, rgb.lastIndexOf(')')).split(',').map((value) => parseFloat(value.trim()));
    // const [r0, g0, b0] = rgbValues.slice(0, 3)

    // const r = r0.toString(16).length == 1 ? "0" + r0.toString(16) : r0.toString(16);
    // const g = g0.toString(16).length == 1 ? "0" + g0.toString(16) : g0.toString(16);
    // const b = b0.toString(16).length == 1 ? "0" + b0.toString(16) : b0.toString(16);
    // const hex = r+g+b    

    // return `#${hex}`
}
import { rgbToHex } from ".";
import { CustomColor, RGBAColor, RGBColor } from "..";
import { CanvasPattern, CanvasGradient } from "canvas"

export function colorCheck(color: CustomColor): CustomColor {
    
    function isHexColorCode(input: string): boolean {
        const hexColorCodeRegex = /^#?([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3}|[A-Fa-f0-9]{4}|[A-Fa-f0-9]{8})$/;
        return hexColorCodeRegex.test(input);
    }

    function isRGBColorCode(input: string): boolean {
        const rgbColorCodeRegex = /^rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)$/i;
        return rgbColorCodeRegex.test(input);
    }

    function isRGBAColorCode(input: string): boolean {
        const rgbaColorCodeRegex = /^rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*[\d\.]+\s*\)$/i;
        return rgbaColorCodeRegex.test(input);
    }
      
    function isPredefinedColorName(input: string): boolean {
        const predefinedColors = [
            "White", "Yellow", "Blue", "Red", "Green", "Black", "Brown", "Ivory", "Teal", "Silver", "Purple", "Navy", "Gray", "Orange", "Maroon", "Aquamarine", "Coral", "Fuchsia", "Wheat", "Lime", "Crimson", "Khaki", "HotPink", "Magenta", "Plum", "Olive", "Cyan"
        ];
        return predefinedColors.includes(input);
    }

    if (!isHexColorCode(<string>color) && !isRGBColorCode(<string>color) && !isRGBAColorCode(<string>color) && !isPredefinedColorName(<string>color) && !(color instanceof CanvasGradient) && !(color instanceof CanvasPattern) ) {
        console.error(new Error(`\x1b[33mColor Checker: \x1b[31m${color} \x1b[32mIs not valid\n\x1b[36mValid syntaxes: \x1b[32m#hex \x1b[36m| \x1b[32mrgb \x1b[36m| \x1b[32mrgba \x1b[36m| \x1b[32mcolorName \x1b[36m| \x1b[32mCanvasGradient \x1b[36m| \x1b[32mCanvasPattern\x1b[0m`))
    } else if (isRGBAColorCode(<string>color) || isRGBColorCode(<string>color)) {
        return rgbToHex(<RGBColor | RGBAColor>color)
    } else return color
}
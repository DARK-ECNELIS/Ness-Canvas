import { InvertColor } from "..";

export function colorInvert(color: InvertColor) {

    // Vérifie si la couleur est au format hexadécimal
    const hexMatch = color.match(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/);
    if (hexMatch) {
        const hex = hexMatch[1];
        const invertedHex = (0xFFFFFF ^ parseInt(hex, 16)).toString(16).padStart(6, '0');
        return `#${invertedHex}`;
    }

    // Vérifie si la couleur est au format RGB ou RGBA
    const rgbMatch = color.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*\d+(?:\.\d+)?)?\)$/);
    if (rgbMatch) {
        const [, r, g, b] = rgbMatch;
        const invertedR = 255 - parseInt(r, 10);
        const invertedG = 255 - parseInt(g, 10);
        const invertedB = 255 - parseInt(b, 10);
        return `rgb${rgbMatch[0].startsWith('rgba') ? 'a' : ''}(${invertedR}, ${invertedG}, ${invertedB})`;
    }

    // Couleur invalide ou non prise en charge
    console.log(new Error(`\x1b[33mInvert Color: \x1b[31m${color} \x1b[32mis invalide or not supported\x1b[0m`));
}
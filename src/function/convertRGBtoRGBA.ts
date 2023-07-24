export function convertRGBtoRGBA(rgb: string, alpha: number) {
    let rgba: string;

    // Vérification de la validité de la valeur d'opacité
    if (typeof alpha !== 'number' || alpha < 0 || alpha > 1) {
        throw new Error('La valeur d\'opacité (alpha) doit être un nombre compris entre 0 et 1.');
    }

    if (typeof rgb === 'string' && (/^rgb\(/.test(rgb) || /^rgba\(/.test(rgb))) {
        // Si la valeur RGB est une chaîne de caractères au format "rgb(...)" ou "rgba(...)", ajouter ou mettre à jour l'opacité
        const rgbValues = rgb.substring(rgb.indexOf('(') + 1, rgb.lastIndexOf(')')).split(',').map((value) => parseFloat(value.trim()));
        const [r, g, b] = rgbValues.slice(0, 3).map((value) => {
            if (isNaN(value) || value < 0 || value > 255) {
                throw new Error('Les valeurs RGB doivent être des nombres compris entre 0 et 255.');
            }
            return Math.round(value);
        });
        rgba = `rgba(${r}, ${g}, ${b}, ${alpha})`;
    } else if (Array.isArray(rgb) && rgb.length === 3) {
        // Si la valeur RGB est au format [R, G, B], convertir en format RGBA
        const [r, g, b] = rgb.map((value) => {
            if (typeof value !== 'number' || value < 0 || value > 255) {
                throw new Error('Les valeurs RGB doivent être des nombres compris entre 0 et 255.');
            }
            return Math.round(value);
        });
        rgba = `rgba(${r}, ${g}, ${b}, ${alpha})`;
    } else {
        throw new Error('La valeur RGB doit être un tableau de 3 éléments [R, G, B], ou une chaîne de caractères au format "rgb(...)" ou "rgba(...)".');
    }

    return rgba;
}
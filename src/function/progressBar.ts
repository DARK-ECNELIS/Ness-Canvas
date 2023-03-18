export function progressBar(current: number, total: number, Text: string = "") {
  const barLength = 20; // Longueur de la barre
  let percent = Math.round(current / total * 100); // Pourcentage de progression
  let filledLength = Math.round(barLength * percent / 100); // Longueur remplie

  // Si la valeur actuelle est égale à la valeur maximale, afficher la barre à 100%
  if (current === total) {
    percent = 100;
    filledLength = barLength;
  }

  const emptyLength = barLength - filledLength; // Longueur vide
  const filledBar = '='.repeat(filledLength); // Caractères remplis
  const emptyBar = ' '.repeat(emptyLength); // Caractères vides
  const bar = `[${filledBar}${emptyBar}]`; // Barre de progression

  // Si la valeur actuelle est égale à la valeur maximale, ajouter un retour à la ligne
  if (current === total) {
    process.stdout.write('\r' + Text + bar + ` ${percent}% ` + ' \x1b[32mComplete\x1b[0m\n');
  } else {
    // Effacer la ligne et afficher la barre de progression
    process.stdout.write('\r' + Text + bar + ` ${percent}% \x1b[0m`);
  }
}
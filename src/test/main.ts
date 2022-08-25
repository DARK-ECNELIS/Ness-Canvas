import { loadImage } from "canvas";
import { CustomProfile, NessBuilder } from "..";
import RankupBuilder from "../Managers/RankupBuilder";

async function test() {
  const background = await loadImage('https://media.discordapp.net/attachments/1006600590408818810/1006600665298116728/background-3147808.jpg');
  
  const avatar = await loadImage('https://media.discordapp.net/attachments/758031322244710601/1000153437813616650/perso_anime_U565bW7EhY2InkF.png');

  const rank = await loadImage('https://cdn.discordapp.com/attachments/1006600590408818810/1006600664929030255/background-2412739.jpg?size=4096')

  new NessBuilder(700, 250)
  .setCornerRadius(15) // round the edges of the image
  .setBackground(background) // Add Background
  .setFrame("Square", { x: 25, y:25 }, { widht: 150, height: 150 }, { radius: 15, content: {imageOrText: avatar}}) // Add image in a square frame
  .setFrame("Polygones", { x: 550, y:25 }, { widht: 130, height: 130 }, {radius: 6, content: { imageOrText: 33, textOptions: { font: "sans-serif", size: 80, color: "#000000", textAlign: "center", textBaseline: "middle" }}}) // Write "33" in a polygones frame
  .setExp({x: 45, y: 200}, {width: 655, height: 30}, 20, 65) // Draw an experience bar
  .setText('Hello World!', {x:350, y:100}, {size: 40, font: 'Impact'}) // Write "Hello World!"

  .generatedTo('src/test/', "test", "PNG");

  // new CustomProfile('classic', background, avatar, 'Octogon').generatedTo('src/test/', "test", "PNG")

  // new RankupBuilder("classic", rank, 33, "Square").generatedTo('src/test', "rank", "PNG")
}

test()
import { loadImage } from "canvas";
import { CustomProfile, NessBuilder } from "../main";
import RankupBuilder from "../Managers/RankupBuilder";

async function test() {
  const background = await loadImage('https://media.discordapp.net/attachments/983525978091442236/983526115610083368/fly.jpg');
  
  const avatar = await loadImage('https://media.discordapp.net/attachments/758031322244710601/1000153437813616650/perso_anime_U565bW7EhY2InkF.png');

  const rank = await loadImage('https://cdn.discordapp.com/attachments/1006600590408818810/1006600664929030255/background-2412739.jpg?size=4096')

  // new NessBuilder(700, 250).setCornerRadius(15).setBackground(background).setFrame("Square", { x: 25, y:25 }, { widht: 150, height: 150 }, 15, avatar).setExp({x: 45, y: 200}, {width: 655, height: 30}, 20, 65).generatedTo('src/test/', "test", "PNG");

  // new CustomProfile('classic', background, avatar, 'Square').generatedTo('src/test/', "test", "PNG")

  new RankupBuilder("classic", rank, avatar, "Square").generatedTo('src/test', "rank", "PNG")
}

test()
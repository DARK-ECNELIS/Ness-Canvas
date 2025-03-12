import { Canvas, CanvasGradient, loadImage } from "canvas";
import { NessBuilder } from "..";
// import RankupBuilder from "../Managers/RankupBuilder";
// import {canvasGif} from '../Managers/test';
// const fs = require('fs');
// const path = require('path');

async function test() {

const background = await loadImage('./src/test/assets/image/background/background-3147808.jpg');
const avatar = await loadImage('https://media.discordapp.net/attachments/758031322244710601/1000153437813616650/perso_anime_U565bW7EhY2InkF.png?ex=67d2a639&is=67d154b9&hm=e5c84540dc404bb1491483f197193ce6edc20b9b151ad29b2bc3613bd94e1bfe&');
const builder = new NessBuilder(700, 250);

const gradient = builder.context.createLinearGradient(25, 25, 185 , 185  );

gradient.addColorStop(0, 'red');
gradient.addColorStop(1/6, 'orange');
gradient.addColorStop(2/6, 'yellow');
gradient.addColorStop(3/6, 'green');
gradient.addColorStop(4/6, 'blue');
gradient.addColorStop(5/6, 'indigo');
gradient.addColorStop(1, 'violet');


const gradient2 = builder.context.createLinearGradient(25, 200, 660 , 130);

gradient2.addColorStop(0, 'red');
gradient2.addColorStop(1/6, 'orange');
gradient2.addColorStop(2/6, 'yellow');
gradient2.addColorStop(3/6, 'green');
gradient2.addColorStop(4/6, 'blue');
gradient2.addColorStop(5/6, 'indigo');
gradient2.addColorStop(1, 'violet');

  builder.setCornerRadius(15)
  .setBackground(background)
  // .setAxis("BottomRight")
  .setFrame("Square", { x: 25, y: 25, size: 80 }, { type: "Image", content: avatar, color: gradient, lineWidth: 5 })
  .setFrame("Hexagon", { x: 520, y: 25, size: 80, rotate: 90 }, { type: "Text", content: "33", color: "Black", textOptions: { size: 50 } })
  .setExp({ x: 40, y: 200, width: 620, height: 30, radius: 15 }, 50, { outlineColor1: gradient2, outlineColor2: "HotPink", color2: "Plum" })
  .setText('Hello World!', {x:250, y:100}, {size: 40, font: '*Impact'})
  .generatedTo('.', "test", "png");

}

test();


// https://thumbs.gfycat.com/GaseousHandmadeBurro-max-1mb.gif
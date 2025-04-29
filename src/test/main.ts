import { loadImage } from "canvas";
import { NessBuilder } from "..";

async function test() {
  const background = await loadImage('./src/test/assets/image/background/background-3147808.jpg');

  const builder = new NessBuilder(700, 250);
  
  builder.setCornerRadius(15)
  
  .setBackground(background)
  .setBanner({ x: 50, y: 50, size1: 500, size2: 100, n: 6, color: "#0000FF", lineWidth: 5, extend: 50, join: "miter" })
  .generatedTo('./src/test', "test", "png");
};

/*
  x et y pour la position par defaut
  size1 la longueur
  size2 la hauteur
  n le nombre de coté (6 => 3 à droit 3 à gauche)
  color la couleur
  lineWidth la largeur des ligne
  extend les bordure sont etirer vers l'interrieur en positif et etirer vers l'exterieur en negatif
  join la valeur des liaison entre chaque line (liaison arrondir, pointu ou par defaut)
*/

test();



























// import { Canvas, CanvasGradient, loadImage, registerFont } from "canvas";
// import { NessBuilder } from "..";
// // import RankupBuilder from "../Managers/RankupBuilder";
// // import {canvasGif} from '../Managers/test';
// // const fs = require('fs');
// // const path = require('path');

// async function test() {

// const background = await loadImage('./src/test/assets/image/background/background-3147808.jpg');
// const avatar = await loadImage('https://media.discordapp.net/attachments/777308989280485376/1366791225641930863/perso_anime_U565bW7EhY2InkF.png?ex=68123b05&is=6810e985&hm=85952a2696ae9ce1883ac39a673c9b132aeb06352c4113a80b9a8fb2cbf69a29&=&format=png&quality=lossless');
// const builder = new NessBuilder(700, 250);

// const gradient = builder.context.createLinearGradient(25, 25, 185 , 185  );

// gradient.addColorStop(0, 'red');
// gradient.addColorStop(1/6, 'orange');
// gradient.addColorStop(2/6, 'yellow');
// gradient.addColorStop(3/6, 'green');
// gradient.addColorStop(4/6, 'blue');
// gradient.addColorStop(5/6, 'indigo');
// gradient.addColorStop(1, 'violet');


// const gradient2 = builder.context.createLinearGradient(25, 200, 660 , 130);

// gradient2.addColorStop(0, 'red');
// gradient2.addColorStop(1/6, 'orange');
// gradient2.addColorStop(2/6, 'yellow');
// gradient2.addColorStop(3/6, 'green');
// gradient2.addColorStop(4/6, 'blue');
// gradient2.addColorStop(5/6, 'indigo');
// gradient2.addColorStop(1, 'violet');

//   builder.setCornerRadius(15)
//   .setBackground(background)
//   .setAxis("BottomRight")
//   .setFrame("Square", { x: 25, y: 25, size: 80 }, { type: "Image", content: avatar, color: gradient, lineWidth: 5 })
//   .setFont("Movie Font", 50)
//   .setFrame("Hexagon", { x: 520, y: 25, size: 80, rotate: 45 }, { type: "Text", content: "33", color: "Orange", textOptions: { color: "Blue" } })
//   .setExp({ x: 40, y: 200, width: 620, height: 30, radius: 15 }, 50, { outlineColor1: gradient2, outlineColor2: "HotPink", color2: gradient2 })
//   // .setFont("Sketch Gothic School",  170)
//   .setFont("Sketch Gothic School", 50)
//   .setText('Hello World!', {x:250, y:100})
//   .generatedTo('./src/test', "test", "png");

// }

// test();


// // https://thumbs.gfycat.com/GaseousHandmadeBurro-max-1mb.gif
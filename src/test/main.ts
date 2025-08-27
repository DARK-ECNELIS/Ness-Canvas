import { loadImage } from "canvas";
import { NessBuilder } from "..";
import { Banner } from "../Interfaces";

async function test() {
  const background = await loadImage('./src/test/assets/image/background/background-3147808.jpg');
  const banner = await loadImage('./src/test/assets/image/background/poster-885148.jpg');
  const builder = new NessBuilder(700, 250);

  const gradient2 = builder.context.createLinearGradient(150, 75, 600 , 175);

  gradient2.addColorStop(0, 'red');
  gradient2.addColorStop(1/6, 'orange');
  gradient2.addColorStop(2/6, 'yellow');
  gradient2.addColorStop(3/6, 'green');
  gradient2.addColorStop(4/6, 'blue');
  gradient2.addColorStop(5/6, 'indigo');
  gradient2.addColorStop(1, 'violet');
  
  builder.setCornerRadius(15)
  
  builder

  .setBackground(background)
    .setFont("Sketch Gothic School", 50)
    // .setFrame("Square", { location:{x: 350, y: 125}, size: 50, Quadrilateral: { radius: 0}, outline: { size: 2, color: "Aquamarine"} }, { type: "Color", content: "Black", color: "Red"})
  // .setBanner({ location: {x: 350, y: 125}, size: {width: 500, height: 100}, Side: {n: 3, extend: -50}, outline: {size: 5, join: "miter",color: "Silver" } }, {type: "Text", color: "Silver", content: "Hellow Wolrd", textOptions: { backgroundColor: gradient2, color: "Black" }})
  .setAxis("BottomRight")
  .setExp({ location: {x: 40, y: 200}, size: {width: 620, height: 30}, radius: 15 }, 50, { backOutlineColor: "White", backColor: gradient2, outlineColor: "HotPink", color: gradient2, transparency: 50 })


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
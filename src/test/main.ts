import { Canvas, CanvasGradient, loadImage } from "canvas";
import { NessBuilder } from "..";
// import RankupBuilder from "../Managers/RankupBuilder";
// import {canvasGif} from '../Managers/test';
// const fs = require('fs');
// const path = require('path');

async function test() {
  // const canvas = new Canvas(400, 400);
  // const context = canvas.getContext('2d')

  const builder = new NessBuilder(400, 400)

  const gradient = builder.context.createLinearGradient(0, 0, 200, 0);
  gradient.addColorStop(0, "green");
  gradient.addColorStop(0.7, "white");
  gradient.addColorStop(1, "pink");

  // const canvas = new Canvas(400, 400);
    
  // const ctx = canvas.getContext('2d');

  // // Coordonnées du centre du cercle et rayon
  // const centerX = 200;
  // const centerY = 200
  // const angle = Math.PI/5;

  // ctx.strokeStyle = "white"
  // ctx.lineWidth = 3;

  // ctx.moveTo(centerX, centerY);
  // ctx.lineTo(200 + (100/2) * Math.cos(angle * 4) , 200);
  // ctx.stroke()

  // writeFileSync("./test.png", ctx.canvas.toBuffer());





  // const avatar = await loadImage('https://media.discordapp.net/attachments/758031322244710601/1000153437813616650/perso_anime_U565bW7EhY2InkF.png');
  // const canvas = new Canvas(400, 400);

  // const centerX = 200;
  // const centerY = 200;
  // const radius = 100;
  // const builder = new NessBuilder(400, 400)
  builder
  // // .setLoading("Circle", { x: 200, y:200, size: 100, outline: { color: "#00FF00", width: 15 }, progress: 50, color: "#8b4513"})
  // .setAxis("TopLeft")
  // .setFrame("Rectangle", { x: 200, y: 200, size: 50 }, { type: "Text", color: "Brown", content: "TL", textOptions: { size: 50 } })
  // .setAxis("TopRight")
  // .setFrame("Rectangle", { x: 200, y: 200, size: 50 }, { type: "Text", color: "Brown", content: "TR", textOptions: { size: 50 } })
  // .setAxis("TopCenter")
  // .setFrame("Rectangle", { x: 200, y: 200, size: 50 }, { type: "Text", color: "Brown", content: "T", textOptions: { size: 50 } })
  // .setAxis("BottomLeft")
  // .setFrame("Rectangle", { x: 200, y: 200, size: 50 }, { type: "Text", color: "Brown", content: "BL", textOptions: { size: 50 } })
  // .setAxis("BottomRight")
  // .setFrame("Rectangle", { x: 200, y: 200, size: 50 }, { type: "Text", color: "Brown", content: "BR", textOptions: { size: 50 } })
  // .setAxis("BottomCenter")
  // .setFrame("Rectangle", { x: 200, y: 200, size: 50 }, { type: "Text", color: "Brown", content: "B", textOptions: { size: 50 } })
  // .setAxis("Left")
  // .setFrame("Rectangle", { x: 200, y: 200, size: 50 }, { type: "Text", color: "Brown", content: "L", textOptions: { size: 50 } })
  // .setAxis("Right")
  // .setFrame("Rectangle", { x: 200, y: 200, size: 50 }, { type: "Text", color: "Brown", content: "R", textOptions: { size: 50 } })
  
  .setAxis("Center")
  .setLoading("Rectangle", { x: 200, y: 200, size: 50, fill: { type: "Line", start: "UpLeftToDownRight" }, rotate: 45, color: /*"rgb(255,0,0)"*/ gradient, progress: 50, outline: { color: "White", width: 3}, QuadrilateralOption: { height: 100, width: 150, radius: 20} })
  // .setFrame("Rectangle", { x: 200, y: 200, size: 100, QuadrilateralOption: { radius: 50, height: 100, width: 150 }}, { type: "Color", content: "Coral", color: "Lime" })
//   .setFrame("Heptagon", { x: 200, y: 200, size: 100 }, { type: "Text", color: "Green", content: "O", textOptions: { size: 50 } })
// .setAxis(Axis.Center)

  // const builder = new NessBuilder(250, 110);
  // const gradient = builder.context.createLinearGradient(55, 5, 105, 55);
  // gradient.addColorStop(0, "magenta");
  // gradient.addColorStop(0.5, "yellow");
  // gradient.addColorStop(1.0, "red");

  // builder.setFrame("Octagon", { x: 5, y: 5, size: 50 }, { type: "Color", color: "Aquamarine", content: "Coral" })
  // .setFrame("Square", { x: 65, y: 5, size: 50, QuadrilateralOprion: { radius: 15 } }, { type: "Empty", color: gradient, content: "Empty" })
  // .setFrame("Circle", { x: 125, y: 5, size: 50 }, { type: "Text", color: "#A52A2A", content: "HI", textOptions: { size: 20, color: "rgb(0,230,100)" }})
  // .setFrame("Nonagon", { x: 185, y: 5, size: 50 }, { type: "Text", color: "Blue", content: "YO", textOptions: { size: 20, color: "rgba(255,230,255,1)", backgroundColor: "HotPink" }})
  // .setFrame("Triangle", { x: 5, y: 55, size: 50 }, { type: "Image", color: "rgb(0,230,100)", content: avatar })
  .generatedTo(".", "test", "png")

}

test();


// https://thumbs.gfycat.com/GaseousHandmadeBurro-max-1mb.gif
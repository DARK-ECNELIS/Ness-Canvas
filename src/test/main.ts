import { gifVersion, loadImage } from "canvas";
import { CustomProfile, Edge, FilterBuilder, GifBuilder, ImageChannels, NessBuilder } from "..";
import { gifExtractor } from "../function"
// import RankupBuilder from "../Managers/RankupBuilder";
// import {canvasGif} from '../Managers/test';
// const fs = require('fs');
// const path = require('path');

async function test() {
  const background = await loadImage('https://media.discordapp.net/attachments/1006600590408818810/1006600665298116728/background-3147808.jpg');
  
  const avatar = await loadImage('https://media.discordapp.net/attachments/758031322244710601/1000153437813616650/perso_anime_U565bW7EhY2InkF.png');

  // const rank = await loadImage('https://cdn.discordapp.com/attachments/1006600590408818810/1006600664929030255/background-2412739.jpg?size=4096')

  // const filter = new FilterBuilder(avatar)
  // await filter.Invert();

  
  // const web = await loadImage("./assets/image/background/web-3876081.jpg")
  const gif = "./assets/image/gif/stickMan.gif"
  const gif2 = "./assets/image/gif/tvHS.gif"
  const image = await loadImage('https://upload.wikimedia.org/wikipedia/commons/9/9a/Gull_portrait_ca_usa.jpg');

  const builder = new GifBuilder(700, 250)
  .setCornerRadius(15)
  .setBackground(background) // Add Background
  .setImage(gif, {sx: 250, sy: 25, sWidth: 250, sHeight: 150})
  .setFrame("Square", { x: 25, y:25 }, { width: 150, height: 150 }, { content: {imageOrText: avatar}})
  .setFrame("Circle", { x: 500, y: 50 }, { width: 150, height: 150 }, { content: {imageOrText: image}})
  .setFrame("Pentagone", { x: 300, y: 100 }, { width: 150, height: 150 }, { content: {imageOrText: gif2}})
  // .setFrame("Polygones", { x: 550, y:25 }, { width: 130, height: 130 }, {radPik: 6, content: { imageOrText: 33, textOptions: { font: "sans-serif", size: 80, color: "#000000", textAlign: "center", textBaseline: "middle" }}})
  // .setExp(false, {x: 45, y: 200}, {width: 655, height: 30}, 20, 65)
  // .setText('Hello World!', {x:350, y:100}, {size: 40, font: 'Impact'})

  await builder.generatedTo(".", "test")
  // console.log(await builder.toDataURL())
  // console.log(await builder.toBuffer())

  // const background = await loadImage('https://media.discordapp.net/attachments/1006600590408818810/1006600665298116728/background-3147808.jpg');
  // const avatar = await loadImage('https://media.discordapp.net/attachments/758031322244710601/1000153437813616650/perso_anime_U565bW7EhY2InkF.png');
  

  // const ness = new NessBuilder(700, 250) // Set Image format
  // .setCornerRadius(15) // round the edges of the image
  // .setBackground(background) // Add Background
  // .setFrame("Square", { x: 25, y:25 }, { width: 150, height: 150 }, { radPik: 15, content: {imageOrText: avatar}}) // Add image in a square frame
  // .setFrame("Polygones", { x: 550, y:25 }, { width: 130, height: 130 }, {radPik: 6, content: { imageOrText: image }}) // Write "33" in a polygones frame
  // .setExp(false, {x: 45, y: 200}, {width: 655, height: 30}, 20, 65) // Draw an experience bar
  // .setText('Hello World!', {x:350, y:100}, {size: 40, font: 'Impact'}) // Write "Hello World!"
  // .generatedTo('.', "test", "png");




























// const file = fs.readFileSync(path.resolve(__dirname, 'TalkativeBigBunting-size_restricted.gif'));

// canvasGif(
// 	file,
// 	(ctx, width, height, totalFrames, currentFrame) => {
// 		console.log(`Rendered frame ${currentFrame}`);
// 	},
// 	{
// 		coalesce: false, // whether the gif should be coalesced first (requires graphicsmagick), default: false
// 		delay: 0, // le délai entre chaque trame en ms, default: 0
// 		repeat: 0, // how many times the GIF should repeat, default: 0 (runs forever)
// 		algorithm: "neuquant", // the algorithm the encoder should use, default: 'neuquant',
// 		optimiser: true, // whether the encoder should use the in-built optimiser, default: false,
// 		fps: 30, // the amount of frames to render per second, default: 60
// 		quality: 100, // the quality of the gif, a value between 1 and 100, default: 100
// 	}
// ).then((buffer) =>
// 	fs.writeFileSync(path.resolve(__dirname, 'output2.gif'), buffer)
// );
}

test();


// https://thumbs.gfycat.com/GaseousHandmadeBurro-max-1mb.gif
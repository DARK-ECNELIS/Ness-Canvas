import { loadImage } from "canvas";
import { CustomProfile, Edge, FilterBuilder, GifBuilder, ImageChannels, NessBuilder } from "..";
// import RankupBuilder from "../Managers/RankupBuilder";

// import {canvasGif} from '../Managers/test';
// const fs = require('fs');
// const path = require('path');

async function test() {
  const background = await loadImage('https://media.discordapp.net/attachments/1006600590408818810/1006600665298116728/background-3147808.jpg');
  
  const avatar = await loadImage('https://media.discordapp.net/attachments/758031322244710601/1000153437813616650/perso_anime_U565bW7EhY2InkF.png');

  // const rank = await loadImage('https://cdn.discordapp.com/attachments/1006600590408818810/1006600664929030255/background-2412739.jpg?size=4096')

  const filter = new FilterBuilder(avatar)
  await filter.Invert();
  
  const builder = new GifBuilder(700, 250)
  .setCornerRadius(15)
  .setBackground(background)
  .setFrame("Square", { x: 25, y:25 }, { width: 150, height: 150 }, { radius: 15, content: {imageOrText: filter.getCanvas()}})
  .setFrame("Polygones", { x: 550, y:25 }, { width: 130, height: 130 }, {radius: 6, content: { imageOrText: 33, textOptions: { font: "sans-serif", size: 80, color: "#000000", textAlign: "center", textBaseline: "middle" }}})
  .setExp(false, {x: 45, y: 200}, {width: 655, height: 30}, 20, 65)
  .setText('Hello World!', {x:350, y:100}, {size: 40, font: 'Impact'})

  await builder.test("https://thumbs.gfycat.com/GaseousHandmadeBurro-max-1mb.gif", avatar)




























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

test()


// https://thumbs.gfycat.com/GaseousHandmadeBurro-max-1mb.gif
import { loadImage } from "canvas";
import { CustomProfile, FilterBuilder, NessBuilder } from "..";
// import RankupBuilder from "../Managers/RankupBuilder";


// import {canvasGif} from '../Managers/test';
const fs = require('fs');
const path = require('path');

async function test() {
  const background = await loadImage('https://media.discordapp.net/attachments/1006600590408818810/1006600665298116728/background-3147808.jpg');
  
  const avatar = await loadImage('https://media.discordapp.net/attachments/758031322244710601/1000153437813616650/perso_anime_U565bW7EhY2InkF.png');

  const rank = await loadImage('https://cdn.discordapp.com/attachments/1006600590408818810/1006600664929030255/background-2412739.jpg?size=4096')


  const filter = new FilterBuilder(avatar)
  await filter.BoxBlur(15, 5, 1);
  
  const back = new FilterBuilder(background)
  await back.StackBlur(180);

  new NessBuilder(700, 250)
  // .test("https://thumbs.gfycat.com/GaseousHandmadeBurro-max-1mb.gif", avatar)
  .setCornerRadius(15) // round the edges of the image
  .setBackground(back.getCanvas()) // Add Background
  .setFrame("Square", { x: 25, y:25 }, { width: 150, height: 150 }, { radius: 15, content: {imageOrText: filter.getCanvas()}}) // Add image in a square frame
  .setFrame("Polygones", { x: 550, y:25 }, { width: 130, height: 130 }, {radius: 6, content: { imageOrText: 33, textOptions: { font: "sans-serif", size: 80, color: "#000000", textAlign: "center", textBaseline: "middle" }}}) // Write "33" in a polygones frame
  .setExp(false, {x: 45, y: 200}, {width: 655, height: 30}, 20, 65) // Draw an experience bar
  .setExp(true, {x: 500, y: 150}, {width: 30, height: 50}, -20, 130) // Draw an experience bar
  .setExp(true, {x: 200, y: 50}, {width: 30, height: 160}, 20, 65) // Draw an experience bar
  .setText('Hello World!', {x:350, y:100}, {size: 40, font: 'Impact'}) // Write "Hello World!"
  .generatedTo('src/test/', "test", "PNG");

  // // // new CustomProfile('classic', background, avatar, 'Octogon').generatedTo('src/test/', "test", "PNG")

  // // // new RankupBuilder("classic", rank, 33, "Square").generatedTo('src/test', "rank", "PNG")








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
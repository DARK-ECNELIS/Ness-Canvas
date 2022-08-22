# Ness-Canvas

[![npm version](https://badge.fury.io/js/ness-canvas.svg)](https://badge.fury.io/js/ness-canvas)

Ness-Canvas is a small canvas Builder for [Canvas](https://github.com/Automattic/node-canvas).

## Inslallation

```bash
$ npm install ness-canvas
```

If you are not used to canvas, the latter can request a specific installation that you will find [here](https://github.com/Automattic/node-canvas/blob/master/Readme.md)

## Quick Example

```js
const { NessBuilder } = require('ness-canvas')
const { loadImage } = require('canvas')

const background = await loadImage('https://media.discordapp.net/attachments/983525978091442236/983526115610083368/fly.jpg');
const avatar = await loadImage('https://media.discordapp.net/attachments/758031322244710601/1000153437813616650/perso_anime_U565bW7EhY2InkF.png');

const builder = new NessBuilder(700, 250) // Set Image format
  .setCornerRadius(15) // round the edges of the image
  .setBackground(background) // Add Background
  .setFrame("Square", { x: 25, y:25 }, { widht: 150, height: 150 }, { radius: 15, content: {imageOrText: avatar}}) // Add image in a square frame
  .setFrame("Polygones", { x: 550, y:25 }, { widht: 130, height: 130 }, {radius: 6, content: { imageOrText: 33, textOptions: { font: "sans-serif", size: 80, color: "#000000", textAlign: "center", textBaseline: "middle" }}}) // Write "33" in a polygones frame
  .setExp({x: 45, y: 200}, {width: 655, height: 30}, 20, 65) // Draw an experience bar
  .setText('Hello World!', {x:350, y:100}, {size: 40, font: 'Impact'}) // Write "Hello World!"


  // Generate canvas in a specific file
  builder.generateTo('FileLocation', 'ImageName', "PNG | JPEG | JPG")

  // Recover the canvas buffer
  Builder.getBuffer()
```
## Result

![alt text](https://github.com/DARK-ECNELIS/Ness-Canvas/blob/main/src/test/test.png?raw=true)
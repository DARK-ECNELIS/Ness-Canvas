# Ness-Canvas

<div align="center">
  <br/>
  <p>
    <a href="https://discord.gg/sjABtBmTWa"><img src="https://dcbadge.vercel.app/api/server/sjABtBmTWa?style=plastic&theme=discord-inverted&compact=true" alt="discord server" />
    </a>
  </p>
  <p>
    <a href="https://www.npmjs.com/package/ness-canvas"><img src="https://badge.fury.io/js/ness-canvas.png" alt="npm version" height=18 />
    </a>
    <a href="https://www.npmjs.com/package/ness-canvas"><img src="https://img.shields.io/npm/dt/ness-canvas.png" alt="npm download" height=18 />
    </a>
  </p>
</div>


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

const background = await loadImage('https://media.discordapp.net/attachments/1006600590408818810/1006600665298116728/background-3147808.jpg');
const avatar = await loadImage('https://media.discordapp.net/attachments/758031322244710601/1000153437813616650/perso_anime_U565bW7EhY2InkF.png');

const builder = new NessBuilder(700, 250) // Set Image format
  .setCornerRadius(15) // round the edges of the image
  .setBackground(background) // Add Background
  .setFrame("Square", { x: 25, y:25 }, { width: 150, height: 150 }, { radPik: 15, content: {imageOrText: avatar}}) // Add image in a square frame
  .setFrame("Polygones", { x: 550, y:25 }, { width: 130, height: 130 }, {radPik: 6, content: { imageOrText: 33, textOptions: { font: "sans-serif", size: 80, color: "#000000", textAlign: "center", textBaseline: "middle" }}}) // Write "33" in a polygones frame
  .setExp(false, {x: 45, y: 200}, {width: 655, height: 30}, 20, 65) // Draw an experience bar
  .setText('Hello World!', {x:350, y:100}, {size: 40, font: 'Impact'}) // Write "Hello World!"
  .generatedTo('src/test/', "test", "png");

  // Generate canvas in a specific file
  builder.generateTo('FileLocation', 'ImageName', "PNG | JPEG | JPG")

  // Recover the canvas buffer
  Builder.getBuffer()

// Add a filter to an image

const filter = new FilterBuilder(avatar);
await filter.Invert();
  
new NessBuilder(avatar.width, avatar.height)
  .setCornerRadius(15)
  .setBackground(filter.getCanvas())
  .generatedTo("src/test/", "testFilter", "png");
```
## Result

<div style="display:flex; text-align:center; justify-content:space-evenly">
  <div style="display:inline-block">
    <h3>NessBuilder</h3>
    <img style="display:block" src="https://github.com/DARK-ECNELIS/Ness-Canvas/blob/main/Assets/test.png?raw=true" height=80/>
  </div>
  <div style="display:inline-block">
    <h3>FilterBuilder && NessBuilder</h3>
    <img src="https://github.com/DARK-ECNELIS/Ness-Canvas/blob/main/Assets/FilterImage/Invert.png?raw=true" height= 80/>
  </div>
</div>


## Documentation

This project is an implementation of the Canvas module. For more on the latter visit the [Canvas Module Guide](https://github.com/Automattic/node-canvas). All utility methods are documented below.

The filter builder has documentation specifying all filters you find [here](https://github.com/DARK-ECNELIS/Ness-Canvas/blob/main/FilterGuide.md).
> ⚠️ You can find an example of using the Gif Builder [here](https://github.com/DARK-ECNELIS/Ness-Canvas/blob/main/GifGuide.md)


<div style="display:flex; text-align:center; justify-content:space-evenly">
  <div style="display:inline-block">
    <h3>GifBuilder</h3>
    <img style="display:block" src="https://github.com/DARK-ECNELIS/Ness-Canvas/blob/main/Assets/test.gif?raw=true" height=80/>
  </div>
</div>

## Builder

* [NessBuilder()]()
* ~~[RankupBuilder()]()~~
* ~~[CustomProfile()]()~~

### Utility Methods

* [NessBuider()](#nessbuilder)
  * [setCornerRadius()](#setcornerradius)
  * [setBackground()](#setbackground)
  * [draw()](#draw)
  * [setFrame()](#setframe)
  * [setText()](#settext)
  * [setExp()](#setexp)
  * [toBuffer()](#tobuffer)
  * [generatedTo()](#generatedto)

### NessBuilder()

> ```ts
> NessBuilder(width: number, height: number) => Builder
> ```

Creates a Canvas instance. This method works in Node.js.

```js
const { NessBuilder } = require('ness-canvas')
const builder = new NessBuilder(250, 300)
```

### setCornerRadius()

> ```ts
> setCornerRadius(radius: number) => this
> ```

Round the edges of the canvas

```js
const { NessBuilder } = require('ness-canvas')
const builder = new NessBuilder(250, 300)

builder.setCornerRadius(15)
```

### setBackground()

> ```ts
> setBackground(image: CanvasImage) => this
> ```

Replaces the canvas space with an image

```js
const { NessBuilder } = require('ness-canvas')
const { loadImage } = require('canvas')
const builder = new NessBuilder(250, 300)
const image = await loadImage('http://supremacy.wolf/image.png')

builder.setBackground(image)
```

### draw()

> ```ts
> draw(image: CanvasImage, imageOption: ImagelocationOption, locationOption?: DrawlocationOption) => this
> ```

Draw an image to S coordinates with D dimensions

```js
const { NessBuilder } = require('ness-canvas')
const { loadImage } = require('canvas')
const builder = new NessBuilder(250, 300)
const image = await loadImage('http://supremacy.wolf/image.png')

// The coordinates x and y are the position of the upper left corner of the image on the canvas
builder.draw(image, {sx: 25, sy: 25, sWidth: 100, sHeight: 75});

// or for more precision

// The Drawlocationoption parameter has not yet been fully tested and it is not recommended to use it for the moment
builder.draw(image, {sx: 25, sy: 25, sWidth: 100, sHeight: 75}, {dx: ?, dy: ?, dWidth: ?, dHeight: ?});
```

### setFrame()

> ```ts
> setFrame(typeShape: Shape, coordinate: FramelocationOption, size: FrameSizeOption, options?: FrameOption) => this
> ```

Draw a frame containing an image or a text

```js
const { NessBuilder } = require('ness-canvas')
const { loadImage } = require('canvas')
const builder = new NessBuilder(250, 300)
const image = await loadImage('http://supremacy.wolf/image.png')

// Draw a predefined frame
builder.setFrame("Octogon", { x: 25, y:25 }, { width: 150, height: 150 })

// Draw a predefined frame containing an image
builder.setFrame("Square", { x: 25, y:25 }, { width: 150, height: 150 }, { radPik: 15, content: {imageOrText: image}})


// Draw a predefined frame containing an text
builder.setFrame("Polygones", { x: 550, y:25 }, { width: 130, height: 130 }, {radPik: 6, content: { imageOrText: 'Hello'}});

// Draw a predefined frame with custom text
builder.setFrame("Pentagone", { x: 550, y:25 }, { width: 130, height: 130 }, {content: { imageOrText: 'Hello', textOptions: { font: "sans-serif", size: 80, color: "#000000", textAlign: "center", textBaseline: "middle" }}});

```
### setText()

> ```ts
> setText(text: string, coordinate: {x: number, y: number}, option: TextOption) => this
> ```

Writes text in the canvas

```js
const { NessBuilder } = require('ness-canvas')
const builder = new NessBuilder(250, 300)

builder.setText("Hello World", { x: 62, y: 150 }, { font: "sans-serif", size: 80, color: "#000000", textAlign: "center", textBaseline: "middle" })
```
### setExp()

> ```ts
> setExp(location: ExpLocationOption, size: ExpSizeOption, radius: number, cloneWidth: number, color?: CustomColor) => this
> ```

Draws a bar that can act as an experience bar

```js
const { NessBuilder } = require('ness-canvas')
const builder = new NessBuilder(250, 300)

builder.setExp(false, {x: 45, y: 200}, {width: 655, height: 30}, 20, 65)
```

### toBuffer()

> ```ts
> toBuffer() => this
> ```

Returns a Buffer of the image contained in the canvas

```js
const { NessBuilder } = require('ness-canvas')
const builder = new NessBuilder(250, 300)

builder.toBuffer()
```

### generatedTo()

> ```ts
> generatedTo(location: string, name: string, type: ImageExtention) => this
> ```

Generates an image of the canvas in a specific path

```js
const { NessBuilder } = require('ness-canvas')
const builder = new NessBuilder(250, 300)

builder.generatedTo('src/path/', "name", "png")
```
  
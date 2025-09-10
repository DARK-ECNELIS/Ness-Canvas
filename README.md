# Ness-Canvas 2.5.3

<div align="center">
  <br/>
  <p>
    <a href="https://discord.gg/sjABtBmTWa"><h1>Join Discord</h1></a>
  </p>
  <p>
    <a href="https://discord.gg/sjABtBmTWa">
      <img alt="Discord" src="https://img.shields.io/discord/726208970489987152?style=plastic&logo=discord&label=Discord&color=%239400D3&link=https%3A%2F%2Fdiscord.gg%2FsjABtBmTWa">
    </a>
    <a href="https://www.npmjs.com/package/ness-canvas"><img src="https://badge.fury.io/js/ness-canvas.png" alt="npm version" height=18 />
    </a>
    <a href="https://www.npmjs.com/package/ness-canvas"><img src="https://img.shields.io/npm/dt/ness-canvas.png" alt="npm download" height=18 />
    </a>
  </p>
</div>


Ness-Canvas is a small canvas Builder for <a href="https://github.com/Automattic/node-canvas" style="color: #00FFFF">Canvas</a>.

## Inslallation

```bash
$ npm install ness-canvas
```

If you are not used to canvas, the latter can request a specific installation that you will find <a href="https://github.com/Automattic/node-canvas/blob/master/Readme.md" style="color: #00FFFF">here</a>

## Quick Example

```js
const { NessBuilder } = require('ness-canvas')
const { loadImage } = require('canvas')

const background = await loadImage('https://media.discordapp.net/attachments/1006600590408818810/1006600665298116728/background-3147808.jpg');
const avatar = await loadImage('https://media.discordapp.net/attachments/758031322244710601/1000153437813616650/perso_anime_U565bW7EhY2InkF.png');
const builder = new NessBuilder(700, 250);

const gradient = builder.context.createLinearGradient(25, 25, 185 , 185  );
const gradient2 = builder.context.createLinearGradient(25, 200, 660 , 130);

gradient.addColorStop(0, 'red');
...
gradient2.addColorStop(0, 'red');
...

builder.setCornerRadius(15)
  .setBackground(background)
  .setAxis("BottomRight")
  .setFrame("Square", { x: 25, y: 25, size: 80 }, { type: "Image", content: avatar, color: gradient, lineWidth: 5 })
  .setFrame("Hexagon", { x: 520, y: 25, size: 80, rotate: 90 }, { type: "Text", content: "33", color: "Black", textOptions: { size: 50 } })
  .setExp({ x: 40, y: 200, width: 620, height: 30, radius: 15 }, 50, { outlineColor1: gradient2, outlineColor2: "HotPink", color2: "Plum" })
  .setText('Hello World!', {x:250, y:100}, {size: 40, font: '*Impact'})
  .generatedTo('.', "test", "png");

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

This project is an implementation of the Canvas module. For more on the latter visit the <a href="https://github.com/Automattic/node-canvas" style="color: #00FFFF">Canvas Module Guide</a>. All utility methods are documented below.

The filter builder has documentation specifying all filters you find <a href="https://github.com/DARK-ECNELIS/Ness-Canvas/blob/main/FilterGuide.md" style="color: #00FFFF">here</a>.


> ⚠️ Gif Builder has been move in a external package you can find <a href="https://www.npmjs.com/package/gif-ness-canvas" style="color: #00FFFF">here</a><br>
> ⚠️ You can also find an example of using the Gif Builder <a href="https://github.com/DARK-ECNELIS/Gif-Ness-Canvas/blob/main/README.md" style="color: #00FFFF">here</a>


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
---
### Methods

<!-- * [NessBuider()](#nessbuilder) -->
* <a href="#context" style="color: #F97E72">context</a>

* <a href="#setcornerradius" style="color: #F97E72">setCornerRadius</a>
* <a href="#setbackground" style="color: #F97E72 ">setBackground</a>
* <a href="#setAxis" style="color: #F97E72">setAxis</a>

* <a href="#setFont" style="color: #F97E72">setFont</a>
* <a href="#setText" style="color: #F97E72">setText</a>

* <a href="#setImage" style="color: #F97E72 ">setImage

* <a href="#setFrame" style="color: #F97E72 ">setFrame</a>
* <a href="#setBanner" style="color: #F97E72">setBanner</a> (Not add to the doc yet)

* <a href="#setExp" style="color: #F97E72">setExp</a>
* <a href="#setloading" style="color: #F97E72">setLoading</a> (Doc need to be update)

* <a href="#toBuffer" style="color: #F97E72">toBuffer</a>
* <a href="#generatedTo" style="color: #F97E72">generatedTo</a>
* <a href="#toDataURL" style="color: #F97E72">toDataURL</a>

---
### Types

* <a href="#CustomColor" style="color: #F97E72">CustomColor</a> (Not add to the doc yet)
* <a href="#CanvasImage" style="color: #F97E72">CanvasImage</a> (Not add to the doc yet)
* <a href="#IntRange" style="color: #F97E72">IntRange</a> (Not add to the doc yet)
* <a href="#Text" style="color: #F97E72">Text</a> (Not add to the doc yet)

---
### NessBuilder()

> ```ts
> NessBuilder(width: number, height: number) => Builder
> ```

Creates a Canvas instance. This method works in Node.js.

<details><summary><strong><font color="#CC33FF">Description</font></strong></summary> 

* **width**: Specifies the width of the element in pixels
* **height**: Specify the height of the element in pixels
</details>

<details><summary><strong><font color= "#7c00a5">Example</font></strong></summary> 

```js
const { NessBuilder } = require('ness-canvas')
const builder = new NessBuilder(250, 300)
```
</details>

### context

> ```ts
> context => CanvasRenderingContext2D
> ```

Canvas context.

<details><summary><strong><font color="#CC33FF">Description</font></strong></summary>

Give access to Node Canvas context methods
</details>

<details><summary><strong><font color= "#7c00a5">Example</font></strong></summary> 

```js
const { NessBuilder } = require('ness-canvas')
const builder = new NessBuilder(250, 300)

builder.context.beginPath()...
builder.context.moveTo...
...
builder.context.clip...
builder.context.closePath...
builder.context.fill...
```
</details>

### setCornerRadius()

> ```ts
> setCornerRadius(radius: number, outline?: number, color?: CustomColor) => this
> ```
> Type definition [CustomColor](#CustomColor)

Round the edges of the canvas

<details><summary><strong><font color="#CC33FF">Description</font></strong></summary> 

* **radius**: Rounded the edges of the canvas
* **outline**: ouline size (default 3)
* **color**: outline color (default white)

</details>

</details>

<details><summary><strong><font color= "#7c00a5">Example</font></strong></summary>

```js
const { NessBuilder } = require('ness-canvas')
const builder = new NessBuilder(250, 300)

builder.setCornerRadius(15)
```
<div style="display:inline-block">
  <img style="display:block" src="https://github.com/DARK-ECNELIS/Ness-Canvas/blob/main/Assets/Radius.png?raw=true" height=180/>
  </div>
</details>


### setBackground()

> ```ts
> setBackground(imageColor: CanvasImage | CustomColor): this;
> ```
> Type definition [CanvasImage](#CanvasImage) | [CustomColor](#CustomColor)

Replaces the space of the canvas with an image, a plain color or a degrader

<details><summary><strong><font color="#CC33FF">Description</font></strong></summary> 

* **imageColor**: Define the type and background to use (Valid syntaxes: #hex(a) | rgb(a) | colorName | CanvasGradient | CanvasPattern)
</details>

<details><summary><strong><font color= "#7c00a5">Example</font></strong></summary>

```js
const { NessBuilder } = require('ness-canvas')
const { loadImage } = require('canvas')

const builder = new NessBuilder(400, 200)
const img = await loadImage("./assets/image/background/color-2174052.png");

const patern = builder.context.createPattern(img, "repeat");
const linGradient = builder.context.createLinearGradient(0, 0, 400, 0);
const radGradient = builder.context.createRadialGradient(200, 100, 75, 200, 100, 200);

linGradient.addColorStop(...);
radGradient.addColorStop(...);

builder.setBackground(img);
builder.setBackground("Coral");
builder.setBackground("#ff0000");
builder.setBackground("rgb(155, 135, 85)");
builder.setBackground("rgba(155, 135, 85, 0.5)");
builder.setBackground(linGradient);
builder.setBackground(radGradient);
builder.setBackground(patern); // Patern have a bug where he just zoom upper left corner so don't use it
```

<div style="display:inline-block">
  <img style="display:block" src="https://github.com/DARK-ECNELIS/Ness-Canvas/blob/main/Assets/SetBackground.png?raw=true" height=180/>
  </div>
</details>

### setAxis()

> ```ts
> setBackground(imageColor: CanvasImage | CustomColor): this;
> ```
> Type definition [CanvasImage](#CanvasImage) | [CustomColor](#CustomColor)

Replaces the space of the canvas with an image, a plain color or a degrader

<details><summary><strong><font color="#CC33FF">Description</font></strong></summary> 

* **imageColor**: Define the type and background to use (Valid syntaxes: #hex(a) | rgb(a) | colorName | CanvasGradient | CanvasPattern)
</details>

<details><summary><strong><font color= "#7c00a5">Example</font></strong></summary>

```js
const { NessBuilder } = require('ness-canvas')
const { loadImage } = require('canvas')

const builder = new NessBuilder(400, 200)
const img = await loadImage("./assets/image/background/color-2174052.png");

const patern = builder.context.createPattern(img, "repeat");
const linGradient = builder.context.createLinearGradient(0, 0, 400, 0);
const radGradient = builder.context.createRadialGradient(200, 100, 75, 200, 100, 200);

linGradient.addColorStop(...);
radGradient.addColorStop(...);

builder.setBackground(img);
builder.setBackground("Coral");
builder.setBackground("#ff0000");
builder.setBackground("rgb(155, 135, 85)");
builder.setBackground("rgba(155, 135, 85, 0.5)");
builder.setBackground(linGradient);
builder.setBackground(radGradient);
builder.setBackground(patern); // Patern have a bug where he just zoom upper left corner so don't use it
```

<div style="display:inline-block">
  <img style="display:block" src="https://github.com/DARK-ECNELIS/Ness-Canvas/blob/main/Assets/SetBackground.png?raw=true" height=180/>
  </div>
</details>

### setFont()

>```ts
> setFont(name: string, size?: number): this
>```

Change Font used

<details><summary><strong><font color="#CC33FF">Description</font></strong></summary>

* **name**: System font name
* **size**: Font default size
> Also works with `registerFont`, but it is still advisable to install the fonts directly in your operating system because registerFont does not work for everyone.

</details>

<details><summary><strong><font color= "#7c00a5">Example</font></strong></summary>

```js
const { NessBuilder } = require('ness-canvas')
const builder = new NessBuilder(250, 300)

builder.setFont("Sketch Gothic School", 50)

.setFrame("Square", { location:{x: 350, y: 125}, size: 50, Quadrilateral: { radius: 0}, outline: { size: 2, color: "Aquamarine"} }, { type: "Text", content: "Hellow world", text: { color: "Brown"}})
...
.setFont("Arial", 15)
.setText(...)
...
```

</details>

### setText()

> ```ts
> setText(text: string, coordinate: {x: number, y: number}, option?: Text) => this
> ```
> Type definition [Text](#Text)

Writes text in the canvas

<details><summary><strong><font color="#CC33FF">Description</font></strong></summary>

* **text**: Text to write
* <details><summary><strong>coordinate</strong>: Location to write text</summary>

  * **x**: location of text on axis x
  * **y**: location of text on axis y
  </details>

* <details><summary><strong>option</strong>: Adjust text configuration</summary>

    * **size**: Text size
    * **`font?`**: Change font to use, add `*` for use font system (*Arial, *Calibri, ...)
    * **`color?`**: Text color (Valid syntaxes: #hex(a) | rgb(a) | colorName | CanvasGradient | CanvasPattern)
    * **`backgroundColor?`**: Background color (Valid syntaxes: #hex(a) | rgb(a) | colorName | CanvasGradient | CanvasPattern)
    * **`stroke?`**: Write text with no fill
    * **`textAlign?`**: Align the text on the vertical axis
    * **`textBaseline?`**: Align the text on the horizontal axis
    > The use of `*` for `font` is intended for future addition not yet implemented

    </details>

</details>

<details><summary><strong><font color= "#7c00a5">Example</font></strong></summary>

```js
const { NessBuilder } = require('ness-canvas')
const builder = new NessBuilder(250, 300)

builder.setText("Hello World", { x: 62, y: 150 }, { font: "sans-serif", size: 80, color: "#000000", textAlign: "center", textBaseline: "middle" })
```

</details>

### setImage()

> ```ts
> setImage(image: CanvasImage, imageOption: ImagelocationOption, locationOption?: DrawlocationOption): this;
> ```
> Type definition [CanvasImage](#CanvasImage)

Draw an image or a Canvas to S coordinates with D dimensions

<details><summary><strong><font color="#CC33FF">Description</font></strong></summary> 

* **image**: Image after use `LoadImage` from Node-Canvas or a Canvas (Patern and Gradiant Not supported)

* <details><summary><strong>imageOption</strong>: Source image coordinates to draw in the context of Canvas</summary>

  * **sx**: Coordinate X in the destination canvas (upper left corner of the source image)
  * **sy**: Coordinate Y in the destination canvas (upper left corner of the source image)
  * **`sWidth?`**: Width of the image drawn in the Canvas
  * **`sHeight?`**: Height of the image drawn in the Canvas
  > `sWidth & sHeight` This allows you to adjust the size of the image. If this argument is not specified, the image will take its normal whidth or height
  </detail>

* <details><summary><strong>locationOption?</strong>: Modify image coordinates to draw in the context of Canvas</summary>

  * **dx**: Coordinate X from image source to draw in the canvas (upper left corner) 
  * **dy**: Coordinate Y from image source to draw in the canvas (upper left corner)
  * **`dWidth?`**: Width of the image Modify (imageOption) to draw in the canvas
  * **`dHeight?`**: Height of the image Modify (imageOption) to draw in the canvas
  </details>

</details>

<details><summary><strong><font color= "#7c00a5">Example</font></strong></summary>

```js
const { NessBuilder } = require('ness-canvas')
const { loadImage } = require('canvas')

const builder = new NessBuilder(250, 300)
const image = await loadImage('./assets/image/background/color-2174052.png')

builder.setImage(image, {sx: 25, sy: 25, sWidth: 100, sHeight: 75});

builder.setImage(image, {sx: 25, sy: 25, sWidth: 100, sHeight: 75}, {dx: 0, dy: 25, dWidth: 200, dHeight: 150});
```

</details>

### setFrame()

> ```ts
> setFrame<T extends FrameType, S extends Shape>(shape: S, frame: Frame<S>, content: Content<T>): this;
> ```

Draw a frame containing an image, a text or a color

<details><summary><strong><font color="#CC33FF">Description</font></strong></summary>

* **shape**: Shape of your frame (Square/Circle/...)
* <details><summary><strong>frame</strong>: Frame positioning in Canvas</summary>

  * <details><summary><strong>location</strong>: Frame location in Canvas </summary>
  
    * **x**: Frame location on axis x
    * **y**: Frame location on axis y
    </details>

  * **size**: Frame size
  * <details><summary><strong>outline</strong>: Frame ouline parameter </summary>

    * **size**: Frame Outline Size
    * **color**: Frame Outline Color (Valid syntaxes: #hex(a) | rgb(a) | colorName | CanvasGradient | CanvasPattern)
    </details>

  * **`rotate?`**: Frame Rotation
  * <details><summary><strong>Quadrilateral?</strong>: Option for the square and the rectangle shape</summary>
  
    * **radius**: Corner Radius
    * **width**: Replace Size parameter for axis x
    * **height**: Replace Size parameter for axis y
    
    > `width & height` is used for the rectangle `shape`
    </details>

  > `Quadrilateral` Additional parameter for the square and Rectangle of `shape`
  
  </details>

* <details><summary><strong>content</strong>: Modify Frame property </summary>

  * **type**: Specifies the type of content to use
  * **content**: Frame content (Image | Gradiant | Patern | Text)
  * <details><summary><strong>text?</strong>: Modify Text property (not used if <strong>type</strong> is not of type <strong>Text</strong> and <strong>content</strong> is not a text or a number) </summary>

    * **size**: Text size
    * **`color?`**: Text color (Valid syntaxes: #hex(a) | rgb(a) | colorName | CanvasGradient | CanvasPattern)
    * **`backgroundColor?`**: Background color (Valid syntaxes: #hex(a) | rgb(a) | colorName | CanvasGradient | CanvasPattern)
    * **`stroke?`**: Write text with no fill
    * **`textAlign?`**: Align the text on the vertical axis
    * **`textBaseline?`**: Align the text on the horizontal axis

    </details>

  </details>

</details>

<details><summary><strong><font color= "#7c00a5">Example</font></strong></summary>

```js
const { NessBuilder } = require('ness-canvas')
const { loadImage } = require('canvas')

const builder = new NessBuilder(250, 300)
const image = await loadImage('./assets/image/background/color-2174052.png')
const linGradient = builder.context.createLinearGradient(0, 0, 240, 0);

builder.setFrame("Pentagon", { location: { x: 100, y: 100 }, size: 80 }, { type: "Color", content: "Coral", color: "Blue" })

builder.setFrame("Square", { location: { x: 10, y: 10 }, size: 50 }, { type: "Empty", content: "Empty", color: "Blue" })

linGradient.addColorStop(...)

builder.setFrame("Square", { location: { x: 220, y: 165 }, size: 50 }, { type: "Text", content: "linGrad I am out context but not my color gradiant", color: "Blue", text: { size: 20, color: linGradient, backgroundColor: "White" } })

```

<div style="display:flex; flex-wrap: wrap; justify-content:">
  <img style="display:block margin: 10px;" src="https://github.com/DARK-ECNELIS/Ness-Canvas/blob/main/Assets/setFrameOptionColor.png?raw=true" height=180/>
  <img style="display:block; margin: 10px;" src="https://github.com/DARK-ECNELIS/Ness-Canvas/blob/main/Assets/setFrameOptionText.png?raw=true" height=180/>
  <img style="display:block; margin: 10px;" src="https://github.com/DARK-ECNELIS/Ness-Canvas/blob/main/Assets/setFrameOptionText2.png?raw=true" height=180/>
  <img style="display:block; margin: 10px;" src="https://github.com/DARK-ECNELIS/Ness-Canvas/blob/main/Assets/setFrameShape.png?raw=true" height=180/>
  <img style="display:block; margin: 10px;" src="https://github.com/DARK-ECNELIS/Ness-Canvas/blob/main/Assets/setFrameCoordinate.png?raw=true" height=180/>
  </div>
  
</details>


</details>

### setExp()

> ```ts
> setExp(exp: Experience, progress: IntRange<0, 101>, color?: ExperienceColor) => this
> ```
> Type definition [IntRange](#IntRange)

Draws a bar that can act as an experience bar

<details><summary><strong><font color="#CC33FF">Description</font></strong></summary>

* <details><summary><strong>exp</strong>: Experience bar positioning in Canvas</summary>

  * <details><summary><strong>location</strong>: Experience bar location in Canvas </summary>
    
      * **x**: Experience bar location on axis x
      * **y**: Experience bar location on axis y
      </details>
  * <details><summary><strong>size</strong>: Experience bar location in Canvas </summary>
    
    * **Width**: Width of the Experience bar
    * **Height**: Height of the Experience bar
    </details>
  * **`rotate?`**: Pivot the Experience bar to a certain degree
  * **`radius?`**: Round the edge
  </details>
* **progress**: Progress of filling from 0% to 100%

* <details><summary><strong>color?</strong>: Adjust Bar color</summary>

  * **backColor**: Color of the bar in the background
  * **color**: Filling bar color
  * **outlineColor**: Color of the contour of the bar in the background
  * **backOutlineColor**: Contour color of the filling bar
  * **`transparency?`**: Background transparency
  > Valid syntaxes: #hex(a) | rgb(a) | colorName | CanvasGradient | CanvasPattern

  </details>

</details>

<details><summary><strong><font color= "#7c00a5">Example</font></strong></summary>

```js
const { NessBuilder } = require('ness-canvas')
const builder = new NessBuilder(250, 300)

builder.setExp({ location: { x: 30, y: 30 }, size: { width: 400, height: 30 }, radius: 10, rotate: 90 }, 50)

builder.setExp({ location: { x: 30, y: 30 }, size: { width: 400, height: 30 } }, 50, { backColor: "Red", backOutlineColor: "Coral" })

```

</details>

### setLoading()

>```ts
> setLoading<D extends ShapeLoad, S extends Shape>(shape: Shape, option: LoadingOption<D, S>): this
>```
<details><summary><strong><font color="#CC33FF">Description</font></strong></summary>

* **shape**: Frame shape (Square/Circle/Polygone...)


* <details><summary><strong>option</strong>: FrameLoading positioning in Canvas.</summary>

  * **x**: Frame location on axis x
  * **y**: Frame location on axis y
  * **size**: Frame size
  * **`rotate?`**: Frame Rotation

  * <details><summary><strong>fill</strong>: Modify the filling parameters</summary> 

    * **type**: Filling type (linear or hourly)
    * **start**: Only for hourly filling type (Default start to 12h)
    
    </details>

  * **color**: Frame content Color (Valid syntaxes: #hex(a) | rgb(a) | colorName | CanvasGradient | CanvasPattern)
  * **progress**: Progress of filling from 0% to 100%
  * <details><summary><strong>outline</strong>: Modify Outline parameters</summary>

    * **widht**: line size
    * **color**: line color (Valid syntaxes: #hex(a) | rgb(a) | colorName | CanvasGradient | CanvasPattern)
    </details>

  * <details><summary><strong>QuadrilateralOption?</strong>: Option for the square and the rectangle shape</summary>
  
    * **radius**: Corner Radius
    * **width**: Replace Size parameter for axis x
    * **height**: Replace Size parameter for axis y
    
    > `width & height` is used for the rectangle `shape`
    </details>

  </details>

</details>

<details><summary><strong><font color= "#7c00a5">Example</font></strong></summary>

```js
const { NessBuilder } = require('ness-canvas')
const builder = new NessBuilder(250, 300)

builder.setLoading("Decagon", { x: 300, y: 300, size: 250, fill: { type: "Line" }, color: radGradient, outline: { color: "Green", width: 3 }, progress: 50, QuadrilateralOption: { width: 250, height: 100, radius: 0 } })
```

</details>

### toBuffer()

> ```ts
> toBuffer(ext?: ImageExtention | "raw" | "pdf") => Promise<void>
> ```
Returns a Buffer of the image contained in the canvas (default png format)
<details><summary><strong><font color="#CC33FF">Description</font></strong></summary>

* **ext**: Convert Buffer to image extension, pdf or raw format

</details>

<details><summary><strong><font color= "#7c00a5">Example</font></strong></summary>

```js
const { NessBuilder } = require('ness-canvas')
const builder = new NessBuilder(250, 300)

builder.toBuffer()
```

</details>

### generatedTo()

> ```ts
> generatedTo(location: string, name: string, type: ImageExtention) => Promise<void>
> ```

Generates an image of the canvas in a specific path
<details><summary><strong><font color="#CC33FF">Description</font></strong></summary>

* **Location**: Generation path
* **name**: File name
* **type**: Image extension (png, jpg, jpeg, bmp, tif, tiff)

</details>

<details><summary><strong><font color= "#7c00a5">Example</font></strong></summary>

```js
const { NessBuilder } = require('ness-canvas')
const builder = new NessBuilder(250, 300)

builder.generatedTo('src/myFolder/', "name", "png")
```
</details>

### toDataURL()

> ```ts
> toDataURL() => string
> ```

Returns canvas to base64 encoded string

<details><summary><strong><font color= "#7c00a5">Example</font></strong></summary>

```js
const { NessBuilder } = require('ness-canvas')
const builder = new NessBuilder(250, 300)
...

builder.toDataURL()
```
</details>


____





### CustomColor

### CanvasImage
### IntRange
### Text
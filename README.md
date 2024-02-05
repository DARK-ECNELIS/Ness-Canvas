# Ness-Canvas 2.4.0 Comming Soon

<div align="center">
  <br/>
  <p>
    <a href="https://discord.gg/sjABtBmTWa"><h1>Join Discord > <img src="https://dcbadge.vercel.app/api/server/sjABtBmTWa?style=plastic&theme=discord-inverted&compact=true" alt="discord server" />
    </a>
  </p>
  <p>
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

### Utility Methods

<!-- * [NessBuider()](#nessbuilder) -->
* <a href="#setcornerradius" style="color: #F97E72">setCornerRadius</a>

* <a href="#setbackground" style="color: #F97E72 ">setBackground</a>
* <a href="#setImage" style="color: #F97E72 ">setImage
* <a href="#setFrame" style="color: #F97E72 ">setFrame</a>
* <a href="#setText" style="color: #F97E72">setText</a>
* <a href="#setExp" style="color: #F97E72">setExp</a>
* <a href="#setloading" style="color: #F97E72">setLoading</a>
* <a href="#setAxis" style="color: #F97E72">setAxis</a>
* <a href="#toBuffer" style="color: #F97E72">toBuffer</a>
* <a href="#generatedTo" style="color: #F97E72">generatedTo</a>
* <a href="#toDataURL" style="color: #F97E72">toDataURL</a>
<!-- * setFont -->

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

### setCornerRadius()

> ```ts
> setCornerRadius(radius: number) => this
> ```

Round the edges of the canvas

<details><summary><strong><font color="#CC33FF">Description</font></strong></summary> 

* **radius**: Rounded the edges of the canvas

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

### setImage()

> ```ts
> setImage(image: CanvasImage, imageOption: ImagelocationOption, locationOption?: DrawlocationOption): this;
> ```

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
> setFrame<T extends FrameType, S extends Shape>(shape: S, frame: FrameOption<S>, options: FrameContent<T>): this;
> ```

Draw a frame containing an image, a text or a color

<details><summary><strong><font color="#CC33FF">Description</font></strong></summary>

* **shape**: Shape of your frame (Square/Circle/...)
* <details><summary><strong>frame</strong>: Frame positioning in Canvas</summary>

  * **x**: Frame location on axis x
  * **y**: Frame location on axis y
  * **size**: Frame size
  * **`rotate?`**: Frame Rotation
  * <details><summary><strong>QuadrilateralOption?</strong>: Option for the square and the rectangle shape</summary>
  
    * **radius**: Corner Radius
    * **width**: Replace Size parameter for axis x
    * **height**: Replace Size parameter for axis y
    
    > `width & height` is used for the rectangle `shape`
    </details>

  > `QuadrilateralOption` Additional parameter for the square and Rectangle of `shape`
  
  </details>

* <details><summary><strong>options</strong>: Modify Frame property </summary>

  * **type**: Specifies the type of content to use
  * **content**: Frame content (Image | Gradiant | Patern | Text)
  * **color**: Frame Outline Color (Valid syntaxes: #hex(a) | rgb(a) | colorName | CanvasGradient | CanvasPattern)
  * **`lineWidth?`**: Frame line size
  * <details><summary><strong>textOptions?</strong>: Modify Text property (not used if <strong>type</strong> is not of type <strong>Text</strong> and <strong>content</strong> is not a text or a number) </summary>

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

</details>

<details><summary><strong><font color= "#7c00a5">Example</font></strong></summary>

```js
const { NessBuilder } = require('ness-canvas')
const { loadImage } = require('canvas')

const builder = new NessBuilder(250, 300)
const image = await loadImage('./assets/image/background/color-2174052.png')
const linGradient = builder.context.createLinearGradient(0, 0, 240, 0);

builder.setFrame("Pentagon", { x: 100, y: 100, size: 80 }, { type: "Color", content: "Coral", color: "Blue" })

builder.setFrame("Square", { x: 10, y: 10, size: 50 }, { type: "Empty", content: "Empty", color: "Blue" })

linGradient.addColorStop(...)

builder.setFrame("Square", { x: 220, y: 165, size: 50 }, { type: "Text", content: "linGrad I am out context but not my color gradiant", color: "Blue", textOptions: { size: 20, color: linGradient, backgroundColor: "White" } })

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


### setText()

> ```ts
> setText(text: string, coordinate: {x: number, y: number}, option: TextOption) => this
> ```

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

### setExp()

> ```ts
> setExp(option: ExpOption, progress: IntRange<0, 101>, color?: ExpColor) => this
> ```

Draws a bar that can act as an experience bar

<details><summary><strong><font color="#CC33FF">Description</font></strong></summary>

* <details><summary><strong>option</strong>: Location to write text</summary>

  * **x**: location of th e Experience bar on 
  * **y**: location of the Experience bar
  * **Width**: Width of the Experience bar
  * **Height**: Height of the Experience bar
  * **`rotate?`**: Pivot the Experience bar to a certain degree
  * **`radius?`**: Round the edge
  * **`alphat?`**: Set the transparency of the bar in the background
  </details>
* **progress**: Progress of filling from 0% to 100%

* <details><summary><strong>Expcolor?</strong>: Adjust text configuration</summary>

  * **`color1?`**: Color of the bar in the background
  * **`color2?`**: Filling bar color
  * **`outlineColor1?`**: Color of the contour of the bar in the background
  * **`outlineColor2?`**: Contour color of the filling bar
  > Valid syntaxes: #hex(a) | rgb(a) | colorName | CanvasGradient | CanvasPattern

  </details>

</details>

<details><summary><strong><font color= "#7c00a5">Example</font></strong></summary>

```js
const { NessBuilder } = require('ness-canvas')
const builder = new NessBuilder(250, 300)

builder.setExp({ x: 30, y: 30, width: 400, height: 30, radius: 10, rotate: 90 }, 50)

builder.setExp({ x: 30, y: 30, width: 400, height: 30 }, 50, { color1: "Red", outlineColor2: "Coral" })

```

</details>

### setLoading()

>```ts
> setLoading<D extends ShapeLoad, S extends Shape>(shape: Shape, option: LoadingOption<D, S>): this
>```
<details><summary><strong><font color="#CC33FF">Description</font></strong></summary>

* **shape**: Frame shape (Square/Circle/Polygone...)


* <details><summary><strong>option</strong>:</summary>

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

### setAxis()

>```ts
> setAxis(axis: Axis): this
>```

Change X and Y axis for the element

<details><summary><strong><font color="#CC33FF">Description</font></strong></summary>

* **axis**: Change where is the x0, y0 for the element
>  The default axis is defined on `Center` the 0 on the image. If you are used to using <font color="#00FFFF">Canvas</font> and you do not want to change the start -up axis, you must use the axis `BottomRight` the BR on the image

</details>

<details><summary><strong><font color= "#7c00a5">Example</font></strong></summary>

```js
const { NessBuilder } = require('ness-canvas')
const builder = new NessBuilder(250, 300)

builder.setFrame(...) // Axis => O
.setAxis("BottomRight")
.setFrame(...) // Axis => BR
```

<div style="display:inline-block">
  <img style="display:block" src="https://github.com/DARK-ECNELIS/Ness-Canvas/blob/main/Assets/Axis.png?raw=true" height=180/>
</div>

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
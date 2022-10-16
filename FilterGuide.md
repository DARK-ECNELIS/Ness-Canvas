# FilterBuilder

<div align="center">
  <br/>
  <p>
    <a href="https://discord.gg/sjABtBmTWa"><img src="https://dcbadge.vercel.app/api/server/sjABtBmTWa?style=plastic&theme=discord-inverted&compact=true" alt="discord server" />
    </a>
  </p>
  <p>
    <a href="https://www.npmjs.com/package/ness-canvas"><img src="https://badge.fury.io/js/ness-canvas.svg" alt="npm version" height=18 />
    </a>
    <a href="https://www.npmjs.com/package/ness-canvas"><img src="https://img.shields.io/npm/dt/ness-canvas.svg" alt="npm download" height=18 />
    </a>
  </p>
</div>



## Infos

> 26 filters can be used and configured


## Quick Example

```js
const { NessBuilder, FilterBuilder } = require('ness-canvas')
const { loadImage } = require('canvas')

const avatar = await loadImage('https://media.discordapp.net/attachments/758031322244710601/1000153437813616650/perso_anime_U565bW7EhY2InkF.png');

// Usage with NessBuilder

const filter = new FilterBuilder(avatar)
await filter.Invert();
  
new NessBuilder(avatar.width, avatar.height)
  .setCornerRadius(15)
  .setBackground(filter.getCanvas())
  .generatedTo("Assets/FilterImage/", "example", "PNG")


// Usage basic

const filter = new FilterBuilder(avatar)
await filter.Invert();
filter.generatedTo("src/test/", "testFilter", "png"); // Generate the image in a folder

filter.getBuffer() // Get Buffer

// Using multiple filters

const filter = new FilterBuilder(avatar);
await filter.Invert();

const filter2 = new FilterBuilder(filter.getCanvas());
await filter2.Flip(false);
filter2.generatedTo("src/test/", "testFilter", "png");
```
## Result

<div style="display:flex; text-align:center; justify-content:space-evenly">
  <div style="display:inline-block">
    <h1>Beford</h1>
    <img style="display:block" src="https://media.discordapp.net/attachments/758031322244710601/1000153437813616650/perso_anime_U565bW7EhY2InkF.png" height=200/>
  </div>
  <div style="display:inline-block">
    <H1>After</H1>
    <img src="https://github.com/DARK-ECNELIS/Ness-Canvas/blob/main/Assets/FilterImage/example.png?raw=true" height= 200/>
  </div>
</div>

## Documentation

FilterBuilder is a Class that allows to add filters on an image that can be used in turn by NessBuilder or be generated.

### Utility Methods
* [Binarize()](#Binarize)
* [BoxBlur()](#BoxBlur)
* [GaussianBlur()](#GaussianBlur)
* [StackBlur()](#StackBlur)
* [BrightnessContrastGimp()](#BrightnessContrastGimp)
* [BrightnessContrastPhotoshop()](#BrightnessContrastPhotoshop)
* [Channels()](#Channels)
* [Desaturate()](#Desaturate)
* [Dither()](#Dither) A revoir
* [Edge()](#Edge)
* [Emboss()](#Emboss)
* [Enrich()](#Enrich)
* [Flip()](#Flip)
* [Gamma()](#Gamma)
* [GreyScale()](#GreyScale)
* [HSLAdjustment()](#HSLAdjustment)
* [Invert()](#Invert)
* [Mosaic()](#Mosaic)
* [Oil()](#Oil)
* [Posterize()](#Posterize)
* [Sepia()](#Sepia)
* [Sharpen()](#Sharpen)
* [Solarize()](#Solarize)
* [Transpose()](#Transpose) A revoir
* [Twril()](#Twril)



### Binarize()
<div style="display:flex;">

```ts
Binarize(threshold: number) => Promise<ImageData>
```
<img style="margin-left:50px"  src="https://github.com/DARK-ECNELIS/Ness-Canvas/blob/main/Assets/FilterImage/Binarize_1.0.png?raw=true" height=50/>
</div>

```md
# threshold 0.0 <= n <= 1.0
```

### BoxBlur()
<div style="display:flex;">

```ts
BoxBlur(hRadius: number, vRadius: number, quality: number) => Promise<ImageData>
```
<img style="margin-left:50px"  src="https://github.com/DARK-ECNELIS/Ness-Canvas/blob/main/Assets/FilterImage/BoxBlur_5_5_2.png?raw=true" height=50/>
</div>

```md
# hRadius 1 <= n <= 20
# vRadius 1 <= n <= 20
# quality 1 <= n <= 10
```

### GaussianBlur()
<div style="display:flex;">

```ts
GaussianBlur(strength: number) => Promise<ImageData>
```
<img style="margin-left:50px"  src="https://github.com/DARK-ECNELIS/Ness-Canvas/blob/main/Assets/FilterImage/GaussianBlur_2.png?raw=true" height=50/>
</div>

```md
# strength 1 <= n <= 4
```

### StackBlur()
<div style="display:flex;">

```ts
StackBlur(radius: number) => Promise<ImageData>
```
<img style="margin-left:50px"  src="https://github.com/DARK-ECNELIS/Ness-Canvas/blob/main/Assets/FilterImage/StackBlur_30.png?raw=true" height=50/>
</div>

```md
# 1 <= n <= 180
```

### BrightnessContrastGimp()
<div style="display:flex;">

```ts
BrightnessContrastGimp(brightness: number, contrast: number) => Promise<ImageData>
```
<img style="margin-left:50px"  src="https://github.com/DARK-ECNELIS/Ness-Canvas/blob/main/Assets/FilterImage/BrightnessContrastGimp_-50_50.png?raw=true" height=50/>
<img style="margin-left:50px"  src="https://github.com/DARK-ECNELIS/Ness-Canvas/blob/main/Assets/FilterImage/BrightnessContrastGimp_50_-50.png?raw=true" height=50/>
</div>

```md
* GIMP algorithm modified. pretty close to fireworks
# brightness -100 <= n <= 100
# contrast -100 <= n <= 100
```

### BrightnessContrastPhotoshop()
<div style="display:flex;">

```ts
BrightnessContrastPhotoshop(brightness: number, contrast: number) => Promise<ImageData>
```
<img style="margin-left:50px"  src="https://github.com/DARK-ECNELIS/Ness-Canvas/blob/main/Assets/FilterImage/BrightnessContrastPhotoshop_-50_50.png?raw=true" height=50/>
<img style="margin-left:50px"  src="https://github.com/DARK-ECNELIS/Ness-Canvas/blob/main/Assets/FilterImage/BrightnessContrastPhotoshop_50_-50.png?raw=true" height=50/>
</div>

```md
* More like the new photoshop algorithm
# brightness -100 <= n <= 100
# contrast -100 <= n <= 100
```

### Channels()
<div style="display:flex;">

```ts
Channels(channel: ImageChannels) => Promise<ImageData>
```
<img style="margin-left:50px"  src="https://github.com/DARK-ECNELIS/Ness-Canvas/blob/main/Assets/FilterImage/Channels_Red.png?raw=true" height=50/>
<img style="margin-left:50px"  src="https://github.com/DARK-ECNELIS/Ness-Canvas/blob/main/Assets/FilterImage/Channels_Bleu.png?raw=true" height=50/>
<img style="margin-left:50px"  src="https://github.com/DARK-ECNELIS/Ness-Canvas/blob/main/Assets/FilterImage/Channels_Green.png?raw=true" height=50/>
</div>

```md
# channel => enum ImageChannels { Red = 1, Green = 2, Bleu = 3 }
```

### Desaturate()
<div style="display:flex;">

```ts
Desaturate() => Promise<ImageData>
```
<img style="margin-left:50px"  src="https://github.com/DARK-ECNELIS/Ness-Canvas/blob/main/Assets/FilterImage/Desaturate.png?raw=true" height=50/>
</div>

```md
```

### Dither()
<div style="display:flex;">

```ts
Dither(levels: number) => Promise<ImageData>
```
<img style="margin-left:50px"  src="https://github.com/DARK-ECNELIS/Ness-Canvas/blob/main/Assets/FilterImage/Dither_5.png?raw=true" height=50/>
</div>

```md
# levels 2 <= n <= 255
```
```fix
- Bug
```

### Edge()
<div style="display:flex;">

```ts
Edge() => Promise<ImageData>
```
<img style="margin-left:50px"  src="https://github.com/DARK-ECNELIS/Ness-Canvas/blob/main/Assets/FilterImage/Edge.png?raw=true" height=50/>
</div>

```md
```

### Emboss()
<div style="display:flex;">

```ts
Emboss() => Promise<ImageData>
```
<img style="margin-left:50px"  src="https://github.com/DARK-ECNELIS/Ness-Canvas/blob/main/Assets/FilterImage/Emboss.png?raw=true" height=50/>
</div>

```md
```

### Enrich()
<div style="display:flex;">

```ts
Enrich() => Promise<ImageData>
```
<img style="margin-left:50px"  src="https://github.com/DARK-ECNELIS/Ness-Canvas/blob/main/Assets/FilterImage/Enrich.png?raw=true" height=50/>
</div>

```md
```

### Flip()
<div style="display:flex;">

```ts
Flip(vertical: boolean) => Promise<ImageData>
```
<img style="margin-left:50px"  src="https://github.com/DARK-ECNELIS/Ness-Canvas/blob/main/Assets/FilterImage/Flip_True.png?raw=true" height=50/>
<img style="margin-left:50px"  src="https://github.com/DARK-ECNELIS/Ness-Canvas/blob/main/Assets/FilterImage/Flip_False.png?raw=true" height=50/>
</div>

```md
# vertical => True : False
```

### Gamma()
<div style="display:flex;">

```ts
Gamma(gamma: number) => Promise<ImageData>
```
<img style="margin-left:50px"  src="https://github.com/DARK-ECNELIS/Ness-Canvas/blob/main/Assets/FilterImage/Gamma_0.png?raw=true" height=50/>
<img style="margin-left:50px"  src="https://github.com/DARK-ECNELIS/Ness-Canvas/blob/main/Assets/FilterImage/Gamma_3.png?raw=true" height=50/>
<img style="margin-left:50px"  src="https://github.com/DARK-ECNELIS/Ness-Canvas/blob/main/Assets/FilterImage/Gamma_5.png?raw=true" height=50/>
</div>

```md
# gamma 0 <= n <= 3 <= n
```

### GreyScale()
<div style="display:flex;">

```ts
GreyScale() => Promise<ImageData>
```
<img style="margin-left:50px"  src="https://github.com/DARK-ECNELIS/Ness-Canvas/blob/main/Assets/FilterImage/GreyScale.png?raw=true" height=50/>
</div>

```md
```

### HSLAdjustment()
<div style="display:flex;">

```ts
HSLAdjustment(hueDelta: number, satDelta: number, lightness: number) => Promise<ImageData>
```
<img style="margin-left:50px"  src="https://github.com/DARK-ECNELIS/Ness-Canvas/blob/main/Assets/FilterImage/HSLAdjustment_-140_-50_-4.png?raw=true" height=50/>
<img style="margin-left:50px"  src="https://github.com/DARK-ECNELIS/Ness-Canvas/blob/main/Assets/FilterImage/HSLAdjustment_67_50_31.png?raw=true" height=50/>
<img style="margin-left:50px"  src="https://github.com/DARK-ECNELIS/Ness-Canvas/blob/main/Assets/FilterImage/HSLAdjustment_137_59_-6.png?raw=true" height=50/>
</div>

```md
# hueDelta  -180 <= n <= 180
# satDelta  -100 <= n <= 100
# lightness -100 <= n <= 100
```

### Invert()
<div style="display:flex;">

```ts
Invert() => Promise<ImageData>
```
<img style="margin-left:50px"  src="https://github.com/DARK-ECNELIS/Ness-Canvas/blob/main/Assets/FilterImage/Invert.png?raw=true" height=50/>
</div>

```md
```

### Mosaic()
<div style="display:flex;">

```ts
Mosaic(blockSize: number) => Promise<ImageData>
```
<img style="margin-left:50px"  src="https://github.com/DARK-ECNELIS/Ness-Canvas/blob/main/Assets/FilterImage/Mosaic_12.png?raw=true" height=50/>
<img style="margin-left:50px"  src="https://github.com/DARK-ECNELIS/Ness-Canvas/blob/main/Assets/FilterImage/Mosaic_53.png?raw=true" height=50/>
</div>

```md
# blockSize 1 <= n <= 100
```

### Oil()
<div style="display:flex;">

```ts
Oil(range: number, levels: number) => Promise<ImageData>
```
<img style="margin-left:50px"  src="https://github.com/DARK-ECNELIS/Ness-Canvas/blob/main/Assets/FilterImage/Oil_5_223.png?raw=true" height=50/>
</div>

```md
# range  1 <= n <= 5
# levels 1 <= n <= 256
```

### Posterize()
<div style="display:flex;">

```ts
Posterize(levels: number) => Promise<ImageData>
```
<img style="margin-left:50px"  src="https://github.com/DARK-ECNELIS/Ness-Canvas/blob/main/Assets/FilterImage/Posterize_4.png?raw=true" height=50/>
<img style="margin-left:50px"  src="https://github.com/DARK-ECNELIS/Ness-Canvas/blob/main/Assets/FilterImage/Posterize_12.png?raw=true" height=50/>
</div>

```md
# levels 2 <= n <= 255
```

### Sepia()
<div style="display:flex;">

```ts
Sepia() => Promise<ImageData>
```
<img style="margin-left:50px"  src="https://github.com/DARK-ECNELIS/Ness-Canvas/blob/main/Assets/FilterImage/Sepia.png?raw=true" height=50/>
</div>

```md
```

### Sharpen()
<div style="display:flex;">

```ts
Sharpen(factor: number) => Promise<ImageData>
```
<img style="margin-left:50px"  src="https://github.com/DARK-ECNELIS/Ness-Canvas/blob/main/Assets/FilterImage/Sharpen_10.png?raw=true" height=50/>
<img style="margin-left:50px"  src="https://github.com/DARK-ECNELIS/Ness-Canvas/blob/main/Assets/FilterImage/Sharpen_50.png?raw=true" height=50/>
</div>

```md
# factor 1 <= n
```

### Solarize()
<div style="display:flex;">

```ts
Solarize() => Promise<ImageData>
```
<img style="margin-left:50px"  src="https://github.com/DARK-ECNELIS/Ness-Canvas/blob/main/Assets/FilterImage/Solarize.png?raw=true" height=50/>
</div>

```md
```

### Transpose()
<div style="display:flex;">

```ts
Transpose() => Promise<ImageData>
```
<img style="margin-left:50px"  src="https://github.com/DARK-ECNELIS/Ness-Canvas/blob/main/Assets/FilterImage/Transpose.png?raw=true" height=50/>
</div>

```diff
- Useless
```

### Twril()
<div style="display:flex;">

```ts
Twril(centerX: number, centerY: number, radius: number, angle: number, edge: Edge, smooth: boolean) => Promise<ImageData>
```
<img style="margin-left:50px"  src="https://github.com/DARK-ECNELIS/Ness-Canvas/blob/main/Assets/FilterImage/Twril_0.1_0.1_100_360_Transparent_false.png?raw=true" height=50/>
<img style="margin-left:50px"  src="https://github.com/DARK-ECNELIS/Ness-Canvas/blob/main/Assets/FilterImage/Twril_0.1_0.1_100_360_Wrap_true.png?raw=true" height=50/>
<img style="margin-left:50px"  src="https://github.com/DARK-ECNELIS/Ness-Canvas/blob/main/Assets/FilterImage/Twril_0.5_0.5_100_360_Clamp_false.png?raw=true" height=50/>
<img style="margin-left:50px"  src="https://github.com/DARK-ECNELIS/Ness-Canvas/blob/main/Assets/FilterImage/Twril_0.5_0.5_100_360_Wrap_true.png?raw=true" height=50/>
</div>

```md
# centerX 0.0 <= n <= 1.0
# centerY 0.0 <= n <= 1.0
# radius
# angle(degree)
# Edge => enum Edge { Clamp = 1, Wrap = 2, Transparent = 0 }
# smooth
```
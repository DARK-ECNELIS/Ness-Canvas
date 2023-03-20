# GifBuilder

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



## Infos

> Gifbuilder uses the same methods as Nessbuilder, whose documentation you will find [here]().

> The only difference is that the gifbuilder takes into account the gif type image and therefore can generate GIF. The GIF generate reading size will depend on the reading size of the GIFs which has been given to it, more precisely it will take the shortest.


## Quick Example

```js
const background = await loadImage('https://media.discordapp.net/attachments/1006600590408818810/1006600665298116728/background-3147808.jpg');
const avatar = await loadImage('https://media.discordapp.net/attachments/758031322244710601/1000153437813616650/perso_anime_U565bW7EhY2InkF.png');
const gif = "./assets/image/gif/stickMan.gif"
const gif2 = "./assets/image/gif/tvHS.gif"
const image = await loadImage('https://upload.wikimedia.org/wikipedia/commons/9/9a/Gull_portrait_ca_usa.jpg');

const builder = new GifBuilder(700, 250)
.setCornerRadius(15)
.setBackground(background) // Add Backgr  ound
.setImage(gif, {sx: 250, sy: 25, sWidth: 250, sHeight: 150})
.setFrame("Square", { x: 25, y:25 }, { width: 150, height: 150 }, { content: {imageOrText: avatar}})
.setFrame("Circle", { x: 500, y: 50 }, { width: 150, height: 150 }, { content: {imageOrText: image}})
.setFrame("Pentagone", { x: 300, y: 100 }, { width: 150, height: 150 }, { content: {imageOrText: gif2}})

await builder.generatedTo(".", "test")
// console.log(await builder.toDataURL())
// console.log(await builder.toBuffer())
```
## Result

<div style="display:flex; text-align:center; justify-content:space-evenly">
  <div style="display:inline-block">
    <h3>GifBuilder</h3>
    <img style="display:block" src="https://github.com/DARK-ECNELIS/Ness-Canvas/blob/main/Assets/test.gif?raw=true" height=180/>
  </div>
  <div style="display:inline-block">
    <h3>Console Log</h3>
    <img src="https://github.com/DARK-ECNELIS/Ness-Canvas/blob/main/Assets/GifConsole.png?raw=true" height= 80/>
  </div>
</div>
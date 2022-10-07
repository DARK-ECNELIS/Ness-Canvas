import { writeFile, writeFileSync } from "fs";
import { Canvas, CanvasRenderingContext2D, loadImage, registerFont, Image } from "canvas";
import type { CanvasImage, CustomColor, ImageExtention, Shape, ImagelocationOption, DrawlocationOption, FramelocationOption, FrameSizeOption, ExpLocationOption, ExpSizeOption, FrameOption, TextOption, RegisterFont } from "..";

import { readFileSync } from "fs";
import Filter from "./FilterBuilder";
const GIFEncoder = require('gif-encoder-2')

const gifFrames = require('gif-frames');


export default class NessBuilder {
  
  protected canvas: Canvas;
  private context: CanvasRenderingContext2D;

  private canvasSize = {
    width: 0,
    height: 0
  };

  private frameCoordinate = { x: 0, y: 0, w: 0, h: 0 };
  private frameTextCoordinate = { x: 0, y: 0};

  private effect = null;

  constructor(width: number, height: number) {
    
    this.setCanvas(width, height);
    this.context = this.canvas.getContext('2d');
  };

  /**
   * New Canvas Dimension
   *
   * @param width x-dimension in pixels
   * @param height y-dimension in pixels
   */
  private setCanvas(width: number, height: number): this {
    this.canvas = new Canvas(width, height);
    this.canvasSize.width = width;
    this.canvasSize.height = height;

    return this;
  };

  /**
   * canvas outline radius
   *
   * @param radius The radius to set
   */
  public setCornerRadius(radius: number): this {
    this.context.lineWidth = 3;
    this.context.strokeStyle = "#FFFFFF"
    
    this.context.moveTo(2 + radius, 2);
    this.context.lineTo((this.canvasSize.width - 2) - radius, 2);
    this.context.quadraticCurveTo((this.canvasSize.width - 2), 2, (this.canvasSize.width - 2), 2 + radius);
    this.context.lineTo((this.canvasSize.width - 2), (this.canvasSize.height - 2) - radius);
    this.context.quadraticCurveTo((this.canvasSize.width - 2), (this.canvasSize.height - 2), (this.canvasSize.width - 2) - radius, (this.canvasSize.height - 2));
    this.context.lineTo(2 + radius, (this.canvasSize.height - 2));
    this.context.quadraticCurveTo(2, (this.canvasSize.height - 2), 2, (this.canvasSize.height - 2) - radius);
    this.context.lineTo(2, 2 + radius);
    this.context.quadraticCurveTo(2, 2, 2 + radius, 2);

    this.context.stroke();
    this.context.clip();

    return this;
  };

  /**
   * Sets the canvas background.
   * @param image The image to set (no link, use loadImage() from canvas)
   */
  public setBackground(image: CanvasImage) {
    this.setImage(image, { sx: 0, sy: 0, sWidth: this.canvas.width, sHeight: this.canvas.height })
    
    return this;
  };

  /**
   * Draw an image to S coordinates with D dimensions
   *
   * @param image The image to set (no link, use loadImage() from canvas)
   * @param imageOption Source image coordinates to draw in the context of Canvas
   * @param locationOption Modify image coordinates to draw in the context of Canvas
   */
  public setImage(image: CanvasImage, imageOption: ImagelocationOption, locationOption?: DrawlocationOption) {

    if (locationOption) {
      this.context.drawImage(image, locationOption.dx, locationOption.dy, locationOption.dWidth, locationOption.dHeight, imageOption.sx, imageOption.sy, imageOption.sWidth, imageOption.sHeight)
    }
    else if (imageOption.sWidth && imageOption.sHeight) {
      
      const draf = new Canvas(imageOption.sWidth - imageOption.sx, imageOption.sHeight - imageOption.sy);
      const draft = draf.getContext("2d");
      draft.drawImage(image, 0, 0, imageOption.sWidth - imageOption.sx, imageOption.sHeight - imageOption.sy);
      const draftData = draft.getImageData(0, 0, draft.canvas.width, draft.canvas.height);
      
      const filter = new Filter(image).Invert()

      // draft.putImageData(filter, imageOption.sWidth - imageOption.sx, imageOption.sHeight - imageOption.sy)

      // draft.clearRect(0, 0, imageOption.sWidth - imageOption.sx, imageOption.sHeight - imageOption.sy)
      // draft.beginPath()
      // draft.putImageData(filter, imageOption.sWidth - imageOption.sx, imageOption.sHeight - imageOption.sy)

      this.context.drawImage(filter, imageOption.sx, imageOption.sy, imageOption.sWidth, imageOption.sHeight);
    }
    else this.context.drawImage(image, imageOption.sx, imageOption.sy);
    
    // if (this.effect == null) {
    //   const ImageData = this.context.getImageData(imageOption.sx, imageOption.sy, <number>image.width, <number>image.height);

    //   new Filter(this.context).Invert(ImageData);
    //   this.context.putImageData(ImageData, 0, 0)



    // }

    return this;
  };

  /**
   * Sets a predefined frame
   *
   * @param typeShape Frame format
   * @param coordinate Coordinate X and Y from upper left corner of the frame
   * @param size Frame size
   * @param options Frame configuration
   */
  public setFrame(typeShape: Shape, coordinate: FramelocationOption, size: FrameSizeOption, options?: FrameOption): this {

    // Sauvegarde de la position et taille du frame
    this.frameCoordinate.x = coordinate.x
    this.frameCoordinate.y = coordinate.y
    this.frameCoordinate.w = size.width
    this.frameCoordinate.h = size.height

    this.context.save();
    this.context.beginPath();

    const r = coordinate.x + size.width;
    const b = coordinate.y + size.height;
    this.context.strokeStyle = options.outline? options.outline.color : "#FF0000";
    this.context.lineWidth = options.outline?.lineWidth? options.outline.lineWidth : 3;

    switch (typeShape) {
      case "Square": {
        this.context.moveTo(coordinate.x + options.radius, coordinate.y);
        this.context.lineTo(r - options.radius, coordinate.y);
        this.context.quadraticCurveTo(r, coordinate.y, r, coordinate.y + options.radius);
        this.context.lineTo(r, coordinate.y + size.height - options.radius);
        this.context.quadraticCurveTo(r, b, r - options.radius, b);
        this.context.lineTo(coordinate.x + options.radius, b);
        this.context.quadraticCurveTo(coordinate.x, b, coordinate.x, b - options.radius);
        this.context.lineTo(coordinate.x, coordinate.y + options.radius);
        this.context.quadraticCurveTo(coordinate.x, coordinate.y, coordinate.x + options.radius, coordinate.y);

        this.frameTextCoordinate.x = coordinate.x + size.width/2;
        this.frameTextCoordinate.y = coordinate.y + size.height/2;
        break;
      };
      case "Octogon": {
        this.context.moveTo(coordinate.x, coordinate.y + (size.height/4));
        this.context.lineTo(coordinate.x + (size.width/4), coordinate.y);
        this.context.lineTo(coordinate.x + (size.width/1.7), coordinate.y);
        this.context.lineTo(coordinate.x + (size.width/1.2), coordinate.y + (size.height/4));
        this.context.lineTo(coordinate.x + (size.width/1.2), coordinate.y + (size.height/1.7));
        this.context.lineTo(coordinate.x + (size.width/1.7), coordinate.y + (size.width/1.2));
        this.context.lineTo(coordinate.x + (size.width/4), coordinate.y + (size.height/1.2));
        this.context.lineTo(coordinate.x, coordinate.y + (size.height/1.7));
        this.context.lineTo(coordinate.x, coordinate.y + (size.height/4));
        this.context.lineTo(coordinate.x + (size.width/4), coordinate.y);
        
        this.frameTextCoordinate.x = coordinate.x + (size.width/1.2)/2;
        this.frameTextCoordinate.y = coordinate.y + (size.height/1.2)/2;
        break;
      };
      case "Pentagone": {
        this.context.moveTo(coordinate.x, coordinate.y + size.height*0.35);
        this.context.lineTo(coordinate.x + size.width/2, coordinate.y);
        this.context.lineTo(coordinate.x + size.width, coordinate.y + size.height*0.35);
        this.context.lineTo(coordinate.x + size.width*0.85, coordinate.y + size.height / 1.08);
        this.context.lineTo(coordinate.x + size.width*0.15, coordinate.y + size.height / 1.08);
        this.context.lineTo(coordinate.x, coordinate.y + size.height*0.35);
        
        this.frameTextCoordinate.x = coordinate.x + size.width/2;
        this.frameTextCoordinate.y = coordinate.y + size.height/2;
        break;
      };
      case "Circle": {
        this.context.arc(coordinate.x + size.width / 2, coordinate.y + size.height / 2, size.width / 2, 0, 2 * Math.PI);
        this.frameTextCoordinate.x = coordinate.x + size.width / 2;
        this.frameTextCoordinate.y = coordinate.y + size.height / 2;
        break;
      };
      case "SymmetricalStar": {
        let rot = Math.PI / 2 * 3;
        const spikes = options.radius;
        const step = Math.PI / spikes;
        this.context.beginPath();

        for (let i = 0; i < spikes; i++) {
          let x = coordinate.x + size.width / 2 + Math.cos(rot) * size.width / 4;
          let y = coordinate.y + size.height / 2 + Math.sin(rot) * size.height / 4;
          this.context.lineTo(x, y);
          rot += step;

          x = coordinate.x + size.width / 2 + Math.cos(rot) * size.width / 2;
          y = coordinate.y + size.height / 2 + Math.sin(rot) * size.height / 2;
          this.context.lineTo(x, y);
          rot += step;
        }

        this.frameTextCoordinate.x = coordinate.x + size.width / 2 + Math.cos(rot);
        this.frameTextCoordinate.y = coordinate.y + size.height / 2 + Math.cos(rot);
        this.context.closePath();
        break;
      };
      case "Polygones": {
        let rot = Math.PI / 2 * 3;
        const spikes = options.radius;
        const step = Math.PI / spikes;
        this.context.beginPath();

        for (let i = 0; i < spikes; i++) {
          let x = coordinate.x + size.width / 2 + Math.cos(rot) * size.width / 2;
          let y = coordinate.y + size.height / 2 + Math.sin(rot) * size.height / 2;

          this.context.lineTo(x, y);
          rot += step;
          this.context.lineTo(x, y);
          rot += step;
        }

        this.frameTextCoordinate.x = coordinate.x + size.width / 2 + Math.cos(rot);
        this.frameTextCoordinate.y = coordinate.y + size.height / 2 + Math.cos(rot);
        this.context.closePath();
        break;
      }
    };
    this.context.stroke();
    this.context.clip();

    if (typeof options?.content?.imageOrText == "object") {
      return this.setFrameBackground(options.content.imageOrText);
    } else if (typeof options?.content?.imageOrText == "string" || typeof options?.content?.imageOrText == "number") {
      this.restore();
      
      this.setText(options.content.imageOrText.toString(), { x: this.frameTextCoordinate.x, y: this.frameTextCoordinate.y }, { size: options.content?.textOptions?.size, font: 'sans-serif', color: options.content.textOptions.color, textAlign: options.content?.textOptions?.textAlign, textBaseline: options.content?.textOptions?.textBaseline });
      
      return this;
    } else {
      this.restore();
      return this;
    }
  };

  // Définition du background du cadre
  private setFrameBackground(image: CanvasImage) {
    this.setImage(image, {sx: this.frameCoordinate.x, sy: this.frameCoordinate.y, sWidth: this.frameCoordinate.w, sHeight: this.frameCoordinate.h});

    this.context.restore();

    return this
  };

  /**
   * Set text to canvas
   * 
   * @param text Text to write
   * @param coordinate Text location
   * @param option Text option
   */
  public setText(text: string, coordinate: {x: number, y: number}, option: TextOption) {

    if (typeof option.font !== "string") {
      this.setFont(option.font.path, option.font.option)
    };

    this.context.font = `${option.size}px ${option.font}`;
    this.context.fillStyle = option.color ? option.color : "#FFF";
    this.context.textAlign = option.textAlign;
    this.context.textBaseline = option.textBaseline;
    option.stroke ? this.context.strokeText(text, coordinate.x, coordinate.y) : this.context.fillText(text, coordinate.x, coordinate.y);

    return this;
  };

  /**
   * Set new font
   * 
   * @param path Path to font file (file.ttf)
   * @param option Font settings
   */
  private setFont(path: string, option: RegisterFont["option"]) {
    registerFont(path, { family: option.family, weight: option.weight, style: option.style});
    
    return this;
  };

  // Restore la sélection
  private restore() {
    this.context.restore();
    
    return this;
  };
  
  /**
   * Set progress bar
   *
   * @param location Coordinate to set ExpBar
   * @param size Size of the first progression bar
   * @param radius Radius to set
   * @param cloneWidth Size of the second progression bar
   * @param color Text color (a degrade can be applied with <createRadialGradient | createLinearGradient] of the Canvas module), White color is used by Default
   */
  public setExp(horizontal: boolean, location: ExpLocationOption, size: ExpSizeOption, radius: number, cloneWidth: number, color?: CustomColor) {
    
    this.context.save();
    this.context.beginPath();
    this.context.strokeStyle = color? color : "#FF0000";
    this.context.lineWidth = 0.1;

    if (!horizontal) {

      // Barre N°1
      this.context.moveTo(location.x, location.y);
      this.context.lineTo(size.width, location.y);
      this.context.quadraticCurveTo(size.width + radius, location.y, size.width + radius, location.y + (size.height /2));
      this.context.quadraticCurveTo(size.width + radius, size.height + location.y, size.width, size.height + location.y);
      this.context.lineTo(location.x, size.height + location.y);
      this.context.quadraticCurveTo(location.x - radius, size.height + location.y, location.x - radius, location.y + (size.height /2));
      this.context.quadraticCurveTo(location.x - radius, location.y, location.x, location.y);

      this.context.fillStyle = "#FFFFFF20"
      this.context.fill()
      this.context.stroke();

      if ((cloneWidth * 100) / size.width < 6.8) {
        this.context.clip()
      }


      // Barre N°2
      this.context.beginPath();
      this.context.strokeStyle = color? color : "#000000";
      this.context.lineWidth = 2;
      
      this.context.moveTo(location.x, location.y);
      this.context.lineTo(cloneWidth, location.y);
      this.context.quadraticCurveTo(cloneWidth + radius, location.y, cloneWidth + radius, location.y + (size.height /2));
      this.context.quadraticCurveTo(cloneWidth + radius, location.y + size.height, cloneWidth, location.y + size.height);
      this.context.lineTo(location.x, location.y + size.height);
      this.context.quadraticCurveTo(location.x - radius, location.y + size.height, location.x - radius, location.y + (size.height /2));
      this.context.quadraticCurveTo(location.x - radius, location.y, location.x, location.y);

    } else {

      // Barre N°1
      this.context.moveTo(location.x, location.y);
      this.context.lineTo(location.x, size.height);
      this.context.quadraticCurveTo(location.x, size.height + radius, location.x + (size.width /2), size.height + radius);
      this.context.quadraticCurveTo(size.width + location.x, size.height + radius, size.width + location.x, size.height);
      this.context.lineTo(size.width + location.x, location.y);
      this.context.quadraticCurveTo(size.width + location.x, location.y - radius, location.x + (size.width / 2), location.y - radius);
      this.context.quadraticCurveTo(location.x, location.y - radius, location.x, location.y);

      this.context.fillStyle = "#FFFFFF20"
      this.context.fill()
      this.context.stroke();

      if ((cloneWidth * 100) / size.width < 6.8) {
        this.context.clip()
      }


      // Barre N°2
      this.context.beginPath();
      this.context.strokeStyle = color? color : "#000000";
      this.context.lineWidth = 2;
      
      this.context.moveTo(location.x, location.y);
      this.context.lineTo(location.x, cloneWidth);
      this.context.quadraticCurveTo(location.x, cloneWidth + radius, location.x + (size.width/2), cloneWidth + radius);      
      this.context.quadraticCurveTo(location.x + size.width, cloneWidth + radius, location.x + size.width, cloneWidth);
      this.context.lineTo(location.x + size.width, location.y);
      this.context.quadraticCurveTo(location.x + size.width, location.y - radius, location.x + (size.width/2), location.y - radius);
      this.context.quadraticCurveTo(location.x, location.y - radius, location.x, location.y);

    };

    this.context.fillStyle = "#BB00FF"
    this.context.fill()
    this.context.stroke();

    this.context.restore();
    return this;

  };

    /**
     * No more information, wait next update
     */
  toBuffer() {
    return this.canvas.toBuffer();
  };

  /**
   * Transforms the embed to a plain object
   * 
   * @param location Image Generation Path
   * @param name Image name
   * @param type Image extention
   */
  public generatedTo(location: string, name: string, type: ImageExtention): void {
    writeFileSync(`${location}/${name}.${type}`, this.toBuffer());
  };

  public async test(gifUrl: `https://${string}.gif`, imageUrl: Image) {
    // const gif = readFileSync('src/test/stickMan.gif');
    // const encoder = new GIFEncoder(this.canvas.width, this.canvas.height, "octree", false, 0);
    // encoder.setFrameRate(20)
    // encoder.setQuality(1)
    // encoder.setThreshold(100)
    // encoder.start();

    // const { frames, width, height } = decodeGif(gif);

    // frames.forEach( async (frame, i) => {

    //   this.setCanvas(width, height);

    //   const data = createImageData(frame.data, width, height)
    //   this.context.putImageData(data, 0, 0)
    //   this.setCornerRadius(15);

    //   // const image = new ImageData(element, 1, 1)
      
    //   // const buf = Buffer.from(data.data)
    //   // this.setBackground(await loadImage(buf))
    //   // this.context.putImageData(image, this.canvas.width, this.canvas.height)
    //   encoder.addFrame(this.context)
    // });

    // encoder.finish()
    // encoder.out.getData()


    
  // I used gifFrames to get the image buffer array
  const imageBufferArray = await gifFrames({ url: gifUrl, frames: "all", cumulative: true});
  const data = imageBufferArray.map(data => data.getImage()._obj)
  const encoder = new GIFEncoder(this.canvas.width, this.canvas.height, 'neuquant', true);
  // const encoder = new GIFEncoder(this.canvas.width, this.canvas.height, 'neuquant', true);
  encoder.setTransparent(false)
  encoder.start();

  const width = this.canvas.width, height = this.canvas.height;
  
  for (let i = 0; i < data.length; i += 1) {
    const image = await loadImage(data[i]);

    const testCanvas = this.setCanvas(width, height)
    .setCornerRadius(30)
    .setBackground(image)
    .setFrame("Square", { x: 25, y:25 }, { width: 150, height: 150 }, { radius: 15, content: {imageOrText: imageUrl}})
    .setFrame("Polygones", { x: 550, y:25 }, { width: 130, height: 130 }, {radius: 6, content: { imageOrText: 33, textOptions: { font: "sans-serif", size: 80, color: "#000000", textAlign: "center", textBaseline: "middle" }}})
    .setExp(false, {x: 45, y: 200}, {width: 655, height: 30}, 20, 65)
    .setText('Hello World!', {x:350, y:100}, {size: 40, font: 'Impact'})
    
    encoder.addFrame(testCanvas.context);
  }
  encoder.finish();
  const gifBuffer = encoder.out.getData();
  return writeFile('src/test/test4.gif', gifBuffer, (err) => { console.log(err) });

    // writeFile('src/test/test3.gif', encoder.out.getData(), error => {
    //   console.log(error)
    // })
  }
}
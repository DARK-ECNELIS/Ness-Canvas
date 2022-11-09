import { writeFile, writeFileSync } from "fs";
import { Canvas, CanvasRenderingContext2D, loadImage, registerFont, Image } from "canvas";
import { CanvasImage, CustomColor, ImageExtention, Shape, ImagelocationOption, DrawlocationOption, FramelocationOption, FrameSizeOption, ExpLocationOption, ExpSizeOption, FrameOption, TextOption, RegisterFont, NessBuilder } from "..";

import { readFileSync } from "fs";
import Filter from "./FilterBuilder";
import { gifFrames } from "../gif-frames-update/gif-frames";

const GIFEncoder = require('gif-encoder-2')



export default class GifBuilder {
  
  protected declare canvas: Canvas;
  protected declare context: CanvasRenderingContext2D;

  private framePlacement = [];
  
  constructor (width, height) {
    this.canvas = new Canvas(width, height)
  }

  /**
   * canvas outline radius
   * @param radius The radius to set
   */
  public setCornerRadius(radius: number): this {
    this.framePlacement.push({id: 0, radius})
    return this;
  };

  /**
   * Sets the canvas background.
   * @param image The image to set (no link, use loadImage() from canvas)
   */
  public setBackground(image: CanvasImage) {
    this.framePlacement.push({id: 1, image})
    return this;
  };

  /**
   * Draw an image to S coordinates with D dimensions
   * @param image The image to set (no link, use loadImage() from canvas)
   * @param imageOption Source image coordinates to draw in the context of Canvas
   * @param locationOption Modify image coordinates to draw in the context of Canvas
   */
  public setImage(image: CanvasImage, imageOption: ImagelocationOption, locationOption?: DrawlocationOption) {
    this.framePlacement.push({id: 2, image, imageOption, locationOption})
    return this;
  };

  /**
   * Sets a predefined frame
   * @param typeShape Frame format
   * @param coordinate Coordinate X and Y from upper left corner of the frame
   * @param size Frame size
   * @param options Frame configuration
   */
  public setFrame(typeShape: Shape, coordinate: FramelocationOption, size: FrameSizeOption, options?: FrameOption): this {
    this.framePlacement.push({id: 3, typeShape, coordinate, size, options})
    return this;
  };

  /**
   * Set text to canvas
   * @param text Text to write
   * @param coordinate Text location
   * @param option Text option
   */
  public setText(text: string, coordinate: {x: number, y: number}, option: TextOption) {
    this.framePlacement.push({id: 4, text, coordinate, option})
    return this;
  };
  
  /**
   * Set progress bar
   * @param location Coordinate to set ExpBar
   * @param size Size of the first progression bar
   * @param radius Radius to set
   * @param cloneWidth Size of the second progression bar
   * @param color Text color (a degrade can be applied with <createRadialGradient | createLinearGradient] of the Canvas module), White color is used by Default
   */
  public setExp(horizontal: boolean, location: ExpLocationOption, size: ExpSizeOption, radius: number, cloneWidth: number, color?: CustomColor) {
    this.framePlacement.push({id: 5, horizontal, location, size, radius, cloneWidth, color})
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
   * @param location Image Generation Path
   * @param name Image name
   * @param type Image extention
   */
  public generatedTo(location: string, name: string, type: ImageExtention): void {
    writeFileSync(`${location}/${name}.${type}`, this.toBuffer());
  };

  public async test(gifUrl: `https://${string}.gif`, imageUrl: Image) {
      
    // I used gifFrames to get the image buffer array
    const imageBufferArray = await gifFrames({
      url: gifUrl, frames: "all", cumulative: true,
      outputType: "jpg",
      quality: 100
    });
    const data = imageBufferArray.map(data => data.getImage()._obj)
    const encoder = new GIFEncoder(this.canvas.width, this.canvas.height, 'neuquant', true);
    // const encoder = new GIFEncoder(this.canvas.width, this.canvas.height, 'neuquant', true);
    encoder.setTransparent(false)
    encoder.start();

    const width = this.canvas.width, height = this.canvas.height;
    
    for (let i = 0; i < data.length; i += 1) {
      const image = await loadImage(data[i]);
      const builder = new NessBuilder(width, height);

      this.framePlacement.forEach(e => {
        switch (e.id) {
          case 0: {
            builder.setCornerRadius(e.radius);
            break;
          };
          case 1: {
            builder.setBackground(image);
            break;
          };
          case 2: {
            builder.setImage(e.image, e.imageOption, e.locationOption);
            break;
          };
          case 3: {
            builder.setFrame(e.typeShape, e.coordinate, e.size, e.options);
            break;
          };
          case 4: {
            builder.setText(e.text, e.coordinate, e.option)
            break;
          };
          case 5: {
            builder.setExp(e.horizontal, e.location, e.size, e.radius, e.cloneWidth, e.color)
            break;
          };
        }
      });

      encoder.addFrame(builder.context);
    }
    encoder.finish();
    const gifBuffer = encoder.out.getData();
    return writeFile('src/test/test4.gif', gifBuffer, (err) => { console.log(err) });

    // writeFile('src/test/test3.gif', encoder.out.getData(), error => {
    //   console.log(error)
    // })
  }
}
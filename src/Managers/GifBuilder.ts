import { writeFile, writeFileSync } from "fs";
import { Canvas, CanvasRenderingContext2D, loadImage, Image } from "canvas";
import { CanvasImage, CustomColor, ImageExtention, Shape, ImagelocationOption, DrawlocationOption, FramelocationOption, FrameSizeOption, ExpLocationOption, ExpSizeOption, FrameOption, TextOption, RegisterFont, NessBuilder } from "..";

import { readFileSync } from "fs";
import Filter from "./FilterBuilder";
import { gifFrames } from "../gif-frames-update/gif-frames";
import { gifExtractor } from "../function";

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
  public setBackground(image: CanvasImage | `${string}.gif`) {
    this.framePlacement.push({id: 1, image})
    return this;
  };

  /**
   * Draw an image to S coordinates with D dimensions
   * @param image The image to set (no link, use loadImage() from canvas)
   * @param imageOption Source image coordinates to draw in the context of Canvas
   * @param locationOption Modify image coordinates to draw in the context of Canvas
   */
  public setImage(image: CanvasImage | `${string}.gif`, imageOption: ImagelocationOption, locationOption?: DrawlocationOption) {
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

  public async test() {

    const encoder = new GIFEncoder(this.canvas.width, this.canvas.height, 'neuquant', true);
    // const encoder = new GIFEncoder(this.canvas.width, this.canvas.height, 'octree', true);
    encoder.setTransparent(false)
    encoder.start();


    const data = {setImage: [], setBackground: [], setFrame: [], length: 0};

    for (let e of this.framePlacement) {


      if (!e.image && !e.options?.content?.imageOrText) continue;
      // console.log(typeof e.options?.content?.imageOrText)

      let imageData = { data: undefined, image: undefined };

      if (/.gif$/.test(e.image || e.options?.content?.imageOrText )) {
        imageData = await gifExtractor(e.image || e.options?.content?.imageOrText)
      } else {
        imageData.data = e.image || e.options?.content?.imageOrText;
      }

      // console.log(e.image)
      data.length < imageData.data.length && data.length !== 0 && typeof data == "object"? "" : data.length = imageData.data.length

      switch (e.id) {
        case 1: {
          data.setBackground.push(imageData.data);
          break;
        };
        case 2: {
          data.setImage.push(imageData.data);
          break;
        };
        case 3: {
          data.setFrame.push(imageData.data);
          break;
        };
      }
    }

    
    const builder = new NessBuilder(this.canvas.width, this.canvas.height);

    for (let i = 0; i < data.length; i += 1/*, x = 0, y = 0, z = 0*/) {

        let x = 0;
        let y = 0;
        let z = 0;
      
        const loadImagePromises = [];
      
        for (const e of this.framePlacement) {
          switch (e.id) {
            case 0: {
              builder.setCornerRadius(e.radius);
              break;
            };
            case 1: {
              if (typeof data.setBackground[0] == "object") {
                loadImagePromises.push(loadImage(data.setBackground[0][i]).then(image => builder.setBackground(image)));
              } else {
                loadImagePromises.push(loadImage(data.setBackground[0]).then(image => builder.setBackground(image)));
              }
              break;
            };
            case 2: {
              if (typeof data.setImage[y] == 'object') {
                loadImagePromises.push(loadImage(data.setImage[y][i]).then(image => {
                  builder.setImage(image, e.imageOption, e.locationOption);
                }));
              } else {
                loadImagePromises.push(loadImage(data.setImage[y]).then(image => {
                  builder.setImage(image, e.imageOption, e.locationOption);
                }));
              }
              y++;
              break;
            };
            case 3: {
              if (typeof data.setFrame[z] == 'object') {
                loadImagePromises.push(loadImage(data.setFrame[z][i]).then(image => {
                  e.options.content.imageOrText = image;
                  builder.setFrame(e.typeShape, e.coordinate, e.size, e.options);
                }));
              } else {
                loadImagePromises.push(loadImage(data.setFrame[z]).then(image => {
                  e.options.content.imageOrText = image;
                  builder.setFrame(e.typeShape, e.coordinate, e.size, e.options);
                }));
              }
              z++;
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
        }
      
        await Promise.all(loadImagePromises);
        console.log("Test")
        await encoder.addFrame(builder.context);
        console.log("Test End")
      }
    encoder.finish();
    // const gifBuffer = await encoder.out.getData();
    // return writeFile('test.gif', gifBuffer, (err) => { if (err) console.log(err)});

    writeFile('test.gif', encoder.out.getData(), error => {
      console.log(error)
    })
  }
  public async toDataURL() {
    const base64String = Buffer.from(await this.toBuffer()).toString('base64');

    return base64String;
  };
}
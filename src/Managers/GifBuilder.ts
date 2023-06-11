import { writeFileSync } from "fs";
import { Canvas, CanvasRenderingContext2D, Image } from "canvas";
import { CanvasImage, CustomColor, Shape, ImagelocationOption, DrawlocationOption, FrameOption, ExpLocationOption, ExpSizeOption, FrameContent, TextOption, NessBuilder, FrameType } from "..";
import { gifExtractor, progressBar } from "../function";

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
   * @param outline Line size (default 3)
   * @param color Line color (default #FFFFFF)
   */
  public setCornerRadius(radius: number, outline: number = 3, color: CustomColor = "#FFFFFF"): this {
    this.framePlacement.push({id: 0, radius, outline, color})
    return this;
  };

  /**
   * Sets the canvas background.
   * @param imageColor The image to set (no link, use loadImage() from canvas) or a custom color (Valid syntaxes: #hex | rgb | rgba | colorName | CanvasGradient | CanvasPattern)
   */
  public setBackground(imageColor: CanvasImage | `${string}`/*.gif*/ | CustomColor): this {
    this.framePlacement.push({id: 1, imageColor})
    return this;
  };

  /**
   * Draw an image to S coordinates with D dimensions
   * @param image The image to set (no link, use loadImage() from canvas)
   * @param imageOption Source image coordinates to draw in the context of Canvas
   * @param locationOption Modify image coordinates to draw in the context of Canvas
   */
  public setImage(image: CanvasImage | `${string}`/*.gif*/, imageOption: ImagelocationOption, locationOption?: DrawlocationOption): this {
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
  public setFrame<T extends FrameType, S extends Shape>(typeShape: Shape, coordinate: FrameOption<S>, options?: FrameContent<T>): this {
    this.framePlacement.push({id: 3, typeShape, coordinate, options})
    return this;
  };

  /**
   * Set text to canvas
   * @param text Text to write
   * @param coordinate Text location
   * @param option Text option
   */
  public setText(text: string, coordinate: {x: number, y: number}, option: TextOption): this {
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
  public setExp(horizontal: boolean, location: ExpLocationOption, size: ExpSizeOption, radius: number, cloneWidth: number, color?: CustomColor): this {
    this.framePlacement.push({id: 5, horizontal, location, size, radius, cloneWidth, color})
    return this;
  };

  /**
   * Return canvas Buffer
   */
  public async toBuffer() {

    const data = {setImage: [], setBackground: [], setFrame: [], length: 0};
    const encoder = new GIFEncoder(this.canvas.width, this.canvas.height, 'neuquant', true);
    // const encoder = new GIFEncoder(this.canvas.width, this.canvas.height, 'octree', true);
    
    encoder.setTransparent(false)
    encoder.start();

    for (let e of this.framePlacement) {

      let imageData: Array<Image>;

      if (!e.image && !e.options?.content?.imageOrText && e.imageColor) continue;
      if (/.gif$/.test(e.image || e.options?.content?.imageOrText || e.imageColor)) {
        imageData = await gifExtractor(e.image || e.options?.content?.imageOrText || e.imageColor)
      } else if (e.imageColor && typeof e.imageColor !== "object") {
        continue;
      } else {
        imageData = e.image || e.options?.content?.imageOrText || e.imageColor
      };

      data.length < imageData.length && data.length !== 0 && typeof data == "object" && (typeof e.image?.length !== undefined || typeof e.imageColor?.length !== undefined || typeof e.options?.content?.imageOrText?.length !== 'undefined')? "" : data.length = imageData.length;

      switch (e.id) {
        case 1: {
          data.setBackground.push(imageData);
          break;
        };
        case 2: {
          data.setImage.push(imageData);
          break;
        };
        case 3: {
          data.setFrame.push(imageData);
          break;
        };
      };
    };

    const builder = new NessBuilder(this.canvas.width, this.canvas.height);

    for (let i = 0; i < data.length; i++) {

      let x = 0, y = 0, z = 0;      
      
      for (const e of this.framePlacement) {
        switch (e.id) {
          case 0: {
            builder.setCornerRadius(e.radius, e.outline, e.color);
            break;
          };
          case 1: {
            if (!data.setBackground[0].complete && !data.setBackground[0][i]) {
              builder.setBackground(e.imageColor);
            } else if (!data.setBackground[0].complete) {
              builder.setBackground(data.setBackground[0][i]);
            } else {
              builder.setBackground(data.setBackground[0]);
            };
            break;
          };
          case 2: {
            if (!data.setImage[y].complete) {
              builder.setImage(data.setImage[y][i], e.imageOption, e.locationOption);
            } else {
              builder.setImage(data.setImage[y], e.imageOption, e.locationOption);
            };
            y++;
            break;
          };
          case 3: {
            if (!data.setFrame[z].complete) {
              e.options.content.imageOrText = data.setFrame[z][i];
              builder.setFrame(e.typeShape, e.coordinate, e.size);
            } else {
              e.options.content.imageOrText = data.setFrame[z];
              builder.setFrame(e.typeShape, e.coordinate, e.size);
            };
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
        };
      };
      
      progressBar(i +1, data.length, "\x1b[34mGif builder: \x1b[33m")
      await encoder.addFrame(builder.context);
    };

    encoder.finish();
    return encoder.out.getData();
  };

  /**
   * Generated image from canvas
   * @param location Image Generation Path
   * @param name Image name
   */
  public async generatedTo(location: string, name: string) {
    writeFileSync(`${location}/${name}.gif`, await this.toBuffer());
  };

  /**
   * Returns a base64 encoded string
   */
  public async toDataURL() {
    return Buffer.from(await this.toBuffer()).toString('base64');
  };
  
}
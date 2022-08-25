import { writeFileSync } from "fs"
import { Canvas, CanvasRenderingContext2D, registerFont } from "canvas"
import { CanvasImage, CustomColor, Shape } from "../../typings";
import { ImagelocationOption, DrawlocationOption, FramelocationOption, FrameSizeOption, ExpLocationOption, ExpSizeOption, FrameOption, TextOption, RegisterFont } from "../../typings/Interface";

export default class NessBuilder {
  
  protected canvas: Canvas;
  private context: CanvasRenderingContext2D;

  private canvasSize = {
    width: 0,
    height: 0
  };

  private frameCoordinate = { x: 0, y: 0, w: 0, h: 0 };
  private frameTextCoordinate = { x: 0, y: 0};

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
    this.draw(image, { sx: 0, sy: 0, sWidht: this.canvas.width, sHeight: this.canvas.height })
    
    return this;
  };

  /**
   * Draw an image to S coordinates with D dimensions
   *
   * @param image The image to set (no link, use loadImage() from canvas)
   * @param imageOption Source image coordinates to draw in the context of Canvas
   * @param locationOption Modify image coordinates to draw in the context of Canvas
   */
  public draw(image: CanvasImage, imageOption: ImagelocationOption, locationOption?: DrawlocationOption) {

    if (locationOption) {
      this.context.drawImage(image, locationOption.dx, locationOption.dy, locationOption.dWidht, locationOption.dHeight, imageOption.sx, imageOption.sy, imageOption.sWidht, imageOption.sHeight)
    }
    else if (imageOption.sWidht && imageOption.sHeight) {
      this.context.drawImage(image, imageOption.sx, imageOption.sy, imageOption.sWidht, imageOption.sHeight);
    }
    else this.context.drawImage(image, imageOption.sx, imageOption.sy);

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
    this.frameCoordinate.w = size.widht
    this.frameCoordinate.h = size.height

    this.context.save();
    this.context.beginPath();

    const r = coordinate.x + size.widht;
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

        this.frameTextCoordinate.x = coordinate.x + size.widht/2;
        this.frameTextCoordinate.y = coordinate.y + size.height/2;
        break;
      };
      case "Octogon": {
        this.context.moveTo(coordinate.x, coordinate.y + (size.height/4));
        this.context.lineTo(coordinate.x + (size.widht/4), coordinate.y);
        this.context.lineTo(coordinate.x + (size.widht/1.7), coordinate.y);
        this.context.lineTo(coordinate.x + (size.widht/1.2), coordinate.y + (size.height/4));
        this.context.lineTo(coordinate.x + (size.widht/1.2), coordinate.y + (size.height/1.7));
        this.context.lineTo(coordinate.x + (size.widht/1.7), coordinate.y + (size.widht/1.2));
        this.context.lineTo(coordinate.x + (size.widht/4), coordinate.y + (size.height/1.2));
        this.context.lineTo(coordinate.x, coordinate.y + (size.height/1.7));
        this.context.lineTo(coordinate.x, coordinate.y + (size.height/4));
        this.context.lineTo(coordinate.x + (size.widht/4), coordinate.y);
        
        this.frameTextCoordinate.x = coordinate.x + (size.widht/1.2)/2;
        this.frameTextCoordinate.y = coordinate.y + (size.height/1.2)/2;
        break;
      };
      case "Pentagone": {
        this.context.moveTo(coordinate.x, coordinate.y + size.height*0.35);
        this.context.lineTo(coordinate.x + size.widht/2, coordinate.y);
        this.context.lineTo(coordinate.x + size.widht, coordinate.y + size.height*0.35);
        this.context.lineTo(coordinate.x + size.widht*0.85, coordinate.y + size.height / 1.08);
        this.context.lineTo(coordinate.x + size.widht*0.15, coordinate.y + size.height / 1.08);
        this.context.lineTo(coordinate.x, coordinate.y + size.height*0.35);
        
        this.frameTextCoordinate.x = coordinate.x + size.widht/2;
        this.frameTextCoordinate.y = coordinate.y + size.height/2;
        break;
      };
      case "Circle": {
        this.context.arc(coordinate.x + size.widht / 2, coordinate.y + size.height / 2, size.widht / 2, 0, 2 * Math.PI);
        this.frameTextCoordinate.x = coordinate.x + size.widht / 2;
        this.frameTextCoordinate.y = coordinate.y + size.height / 2;
        break;
      };
      case "SymmetricalStar": {
        let rot = Math.PI / 2 * 3;
        const spikes = options.radius;
        const step = Math.PI / spikes;
        this.context.beginPath();

        for (let i = 0; i < spikes; i++) {
            let x = coordinate.x + size.widht / 2 + Math.cos(rot) * size.widht / 4;
            let y = coordinate.y + size.height / 2 + Math.sin(rot) * size.height / 4;
            this.context.lineTo(x, y);
            rot += step;

            x = coordinate.x + size.widht / 2 + Math.cos(rot) * size.widht / 2;
            y = coordinate.y + size.height / 2 + Math.sin(rot) * size.height / 2;
            this.context.lineTo(x, y);
            rot += step;
        }

        this.frameTextCoordinate.x = coordinate.x + size.widht / 2 + Math.cos(rot);
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
            let x = coordinate.x + size.widht / 2 + Math.cos(rot) * size.widht / 2;
            let y = coordinate.y + size.height / 2 + Math.sin(rot) * size.height / 2;

            this.context.lineTo(x, y);
            rot += step;
            this.context.lineTo(x, y);
            rot += step;
          }

          this.frameTextCoordinate.x = coordinate.x + size.widht / 2 + Math.cos(rot);
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
    this.draw(image, {sx: this.frameCoordinate.x, sy: this.frameCoordinate.y, sWidht: this.frameCoordinate.w, sHeight: this.frameCoordinate.h});

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
  public setExp(location: ExpLocationOption, size: ExpSizeOption, radius: number, cloneWidth: number, color?: CustomColor) {
    
    // Barre N°1
    this.context.save();
    this.context.beginPath();
    this.context.strokeStyle = color? color : "#FF0000";
    this.context.lineWidth = 0.1;
    
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

    this.context.fillStyle = "#BB00FF"
    this.context.fill()
    this.context.stroke();

    this.context.restore();
    return this;
  };

  /**
   * For image canvases, encodes the canvas as a PNG.
   */
  protected toBuffer() {
    return this.canvas.toBuffer();
  };

  /**
   * Transforms the embed to a plain object
   * 
   * @param location Image Generation Path
   * @param name Image name
   * @param type Image Type
   */
  public generatedTo(location: string, name: string, type: "PNG"): void {
  writeFileSync(`${location}/${name}.${type}`, this.toBuffer());
};

}
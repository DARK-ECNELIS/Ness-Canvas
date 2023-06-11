import { writeFileSync } from "fs";
import { Canvas, CanvasRenderingContext2D, registerFont } from "canvas";
import { CanvasImage, CustomColor, ImageExtention, Shape, ImagelocationOption, DrawlocationOption, ExpLocationOption, ExpSizeOption, FrameOption, TextOption, FontOption, CustomFont, FrameContent, FrameType, ShapeEnum, LoadingOption, ShapeLoad, Axis } from "..";
import { colorCheck } from "../function";

export default class NessBuilder {
  
  protected canvas: Canvas;
  public context: CanvasRenderingContext2D;

  private canvasSize = {
    width: 0,
    height: 0
  };

  private axis: Axis;
  private frameCoordinate: FrameOption<Shape>;
  private frameTextCoordinate = { x: 0, y: 0};
  private fontData: CustomFont = [];

  constructor(width: number, height: number) {
    this.setCanvas(width, height);
    this.context = this.canvas.getContext('2d');
  };

  // private async initialize(dataPath: `${string}.ttf`, dataFont: FontOption): Promise<void> {
  //   if (registerFont) {
  //     await this.registerFont(dataPath, dataFont);
  //   }
  //   // Continuer avec l'initialisation du reste de votre objet ici
  // }

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
   * @param outline Line size (default 3)
   * @param color Line color (default #FFFFFF)
   */
  public setCornerRadius(radius: number, outline: number = 3, color: CustomColor = "#FFFFFF"): this {
    this.context.lineWidth = outline;
    this.context.strokeStyle = colorCheck(color)
    
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
   * @param imageColor The image to set (no link, use loadImage() from canvas) or a custom color (Valid syntaxes: #hex | rgb | rgba | colorName | CanvasGradient | CanvasPattern)
   */
  public setBackground(imageColor: CanvasImage | CustomColor): this {
    if (typeof imageColor == "object") {
      this.setImage(<CanvasImage>imageColor, { sx: 0, sy: 0, sWidth: this.canvas.width, sHeight: this.canvas.height })
    } else {
      this.context.fillStyle = colorCheck(imageColor)
      this.context.fillRect(0, 0, this.canvas.width, this.canvas.height)
    }
    return this;
  };

  /**
   * Draw an image to S coordinates with D dimensions
   *
   * @param image The image to set (no link, use loadImage() from canvas)
   * @param imageOption Source image coordinates to draw in the context of Canvas
   * @param locationOption Modify image coordinates to draw in the context of Canvas
   */
  public setImage(image: CanvasImage, imageOption: ImagelocationOption, locationOption?: DrawlocationOption): this {

    if (locationOption) {
      this.context.drawImage(image, locationOption.dx, locationOption.dy, locationOption.dWidth, locationOption.dHeight, imageOption.sx, imageOption.sy, imageOption.sWidth, imageOption.sHeight)
    }
    else if (imageOption.sWidth && imageOption.sHeight) {
      this.context.drawImage(image, imageOption.sx, imageOption.sy, imageOption.sWidth, imageOption.sHeight);
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
  public setFrame<T extends FrameType, S extends Shape>(shape: S, frame: FrameOption<S>, options: FrameContent<T>): this {

    // ["Square", "Rectangle"].includes(shape)? frame.QuadrilateralOprion? "" : frame.QuadrilateralOprion.radius = 15 : "";
    
    // Sauvegarde de la position et taille du frame
    // this.frameCoordinate = frame;
    this.context.save();

    this.context.strokeStyle = options.color? colorCheck(options.color) : "#FF0000";
    this.context.lineWidth = options.lineWidth? options.lineWidth : 3;
   
    this.setShape(shape, frame);

    // this.context.closePath();
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
  
  private setShape<S extends Shape>(shape: S, frame: FrameOption<S>): this {

    const axis = this.getAxis(frame);
    frame.x = axis.x, frame.y = axis.y;
    this.frameCoordinate = frame;

    if (frame.rotate) this.setRotation(frame.x , frame.y , frame.rotate);

    this.context.beginPath();

    const radius = (["Square", "Rectangle"].includes(shape) && frame.QuadrilateralOprion)? frame.QuadrilateralOprion.radius : 15;
    const sizeX = frame.QuadrilateralOprion?.width? frame.QuadrilateralOprion.width : frame.size;
    const sizeY = frame.QuadrilateralOprion?.height? frame.QuadrilateralOprion.height : frame.size;

    const r = frame.x + sizeX;
    const b = frame.y + sizeY;

    switch (shape) {
      case "Square": {
        this.context.moveTo(frame.x + radius - frame.size, frame.y - frame.size);
        this.context.lineTo(r - radius, frame.y - frame.size);
        this.context.quadraticCurveTo(r, frame.y - frame.size, r, frame.y + radius - frame.size);
        this.context.lineTo(r, frame.y + frame.size - radius);
        this.context.quadraticCurveTo(r, b, r - radius, b);
        this.context.lineTo(frame.x + radius - frame.size, b);
        this.context.quadraticCurveTo(frame.x - frame.size, b, frame.x - frame.size, b - radius);
        this.context.lineTo(frame.x - frame.size, frame.y + radius - frame.size);
        this.context.quadraticCurveTo(frame.x - frame.size, frame.y - frame.size, frame.x + radius - frame.size, frame.y - frame.size);

        this.frameTextCoordinate = { x: frame.x, y: frame.y };
        break;
      }
      case "Rectangle": {
        const sizeX = frame.QuadrilateralOprion?.width? frame.QuadrilateralOprion.width : frame.x;
        const r = frame.x + sizeX;

        this.context.moveTo(frame.x + radius - sizeX, frame.y - sizeY);
        this.context.lineTo(r - radius, frame.y - sizeY);
        this.context.quadraticCurveTo(r, frame.y - sizeY, r, frame.y + radius - sizeY);
        this.context.lineTo(r, frame.y + sizeY - radius);
        this.context.quadraticCurveTo(r, b, r - radius, b);
        this.context.lineTo(frame.x + radius - sizeX, b);
        this.context.quadraticCurveTo(frame.x - sizeX, b, frame.x - sizeX, b - radius);
        this.context.lineTo(frame.x - sizeX, frame.y + radius - sizeY);
        this.context.quadraticCurveTo(frame.x - sizeX, frame.y - sizeY, frame.x + radius - sizeX, frame.y - sizeY);

        this.frameTextCoordinate = { x: frame.x, y: frame.y };
        break;
      }
      case "Circle": {
        this.context.arc(frame.x, frame.y, frame.size , 0, 2 * Math.PI);
        this.frameTextCoordinate = { x: frame.x, y: frame.y };
        break;
      }
      default: {
        const angle = (Math.PI * 2) / ShapeEnum[shape as keyof typeof ShapeEnum];

        for (let i = 0; i <= ShapeEnum[shape as keyof typeof ShapeEnum]; i++) {
          const x = frame.x + frame.size * Math.cos(angle * i);
          const y = frame.y + frame.size * Math.sin(angle * i);
        
          if (i === 0) this.context.moveTo(x, y);
          else this.context.lineTo(x, y);
        };
        this.frameTextCoordinate = { x: frame.x, y: frame.y };
        break;
      };
      
      // case "SymmetricalStar": {
      //   let rot = Math.PI / 2 * 3;
      //   const spikes = options.radPik;
      //   const step = Math.PI / spikes;
      //   this.context.beginPath();

      //   for (let i = 0; i < spikes; i++) {
      //     let x = frame.x + frame.size / 2 + Math.cos(rot) * frame.size / 4;
      //     let y = frame.y + frame.size / 2 + Math.sin(rot) * frame.size / 4;
      //     this.context.lineTo(x, y);
      //     rot += step;

      //     x = frame.x + frame.size / 2 + Math.cos(rot) * frame.size / 2;
      //     y = frame.y + frame.size / 2 + Math.sin(rot) * frame.size / 2;
      //     this.context.lineTo(x, y);
      //     rot += step;
      //   }

      //   this.frameTextCoordinate.x = frame.x + frame.size / 2 + Math.cos(rot);
      //   this.frameTextCoordinate.y = frame.y + frame.size / 2 + Math.cos(rot);
      //   this.context.closePath();
      //   break;
      // };
    };
    
    // this.context.closePath();
    return this;
  };

  private setRotation(centerX: number, centerY: number, angle: number) {
    this.context.translate(centerX, centerY);
    this.context.rotate((angle * Math.PI)/180)
    this.context.translate(-centerX, -centerY);
  };

  // Définition du background du cadre
  private setFrameBackground(image: CanvasImage): this {

    this.setRotation(this.frameCoordinate.x , this.frameCoordinate.y , -this.frameCoordinate.rotate);

    while (this.frameCoordinate.rotate > 45 || this.frameCoordinate.rotate < -45) {
      if (this.frameCoordinate.rotate > 0) this.frameCoordinate.rotate -= 45;
      else this.frameCoordinate.rotate = -this.frameCoordinate.rotate;
    }

    const size = this.frameCoordinate.rotate? 0.009 * this.frameCoordinate.rotate : 0;
    const size2 = this.frameCoordinate.rotate? 0.018 * this.frameCoordinate.rotate : 0;

    
    this.setImage(image, {sx: this.frameCoordinate.x - this.frameCoordinate.size*(1 + size), sy: this.frameCoordinate.y - this.frameCoordinate.size*(1 + size), sWidth: this.frameCoordinate.size*(2 + size2), sHeight: this.frameCoordinate.size*(2 + size2) });

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
    this.context.fillStyle = option.color ? colorCheck(option.color) : "#FFF";
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
   * @param color Text color. White color is used by Default
   */
  public setExp(horizontal: boolean, location: ExpLocationOption, size: ExpSizeOption, radius: number, cloneWidth: number, color?: CustomColor): this {
    
    this.context.save();
    this.context.beginPath();
    this.context.strokeStyle = color? colorCheck(color) : "#FF0000";
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
      this.context.strokeStyle = color? colorCheck(color) : "#000000";
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

      this.context.moveTo(location.x + size.height, location.y);
      this.context.lineTo(location.x + size.height, size.width);
      this.context.quadraticCurveTo(location.x + size.height, size.width + radius, location.x + (size.height/2), size.width + radius);
      this.context.quadraticCurveTo(location.x, size.width + radius, location.x, size.width);
      this.context.lineTo(location.x, location.y);

      this.context.quadraticCurveTo(location.x, location.y - radius, location.x + (size.height/2), location.y - radius);
      this.context.quadraticCurveTo(location.x + size.height, location.y - radius, location.x + size.height, location.y);

      this.context.fillStyle = "#FFFFFF20"
      this.context.fill()
      this.context.stroke();

      if ((cloneWidth * 100) / size.width < 6.8) {
        this.context.clip()
      }


      // Barre N°2
      this.context.beginPath();
      this.context.strokeStyle = color? colorCheck(color) : "#000000";
      this.context.lineWidth = 2;
      
      this.context.moveTo(location.x + size.height, location.y);
      this.context.lineTo(location.x + size.height, cloneWidth);
      this.context.quadraticCurveTo(location.x + size.height, cloneWidth + radius, location.x + (size.height/2), cloneWidth + radius);
      this.context.quadraticCurveTo(location.x, cloneWidth + radius, location.x, cloneWidth);
      this.context.lineTo(location.x, location.y);

      this.context.quadraticCurveTo(location.x, location.y - radius, location.x + (size.height/2), location.y - radius);
      this.context.quadraticCurveTo(location.x + size.height, location.y - radius, location.x + size.height, location.y);
    };

    this.context.fillStyle = "#BB00FF"
    this.context.fill()
    this.context.stroke();

    this.context.restore();
    return this;
  };

  public setAxis(axis: Axis): this {
    this.axis = axis;
    return this;
  };

  private getAxis<S extends Shape>(frame: FrameOption<S>) {
    // Problème avec le rectangle
    if (this.axis == "TopLeft") return { x: frame.x - frame.size, y: frame.y - frame.size };
    else if (this.axis == "TopCenter") return { x: frame.x, y: frame.y - frame.size };
    else if (this.axis == "TopRight") return { x: frame.x + frame.size, y: frame.y - frame.size };
    else if (this.axis == "BottomLeft") return { x: frame.x - frame.size, y: frame.y + frame.size };
    else if (this.axis == "BottomCenter") return { x: frame.x, y: frame.y + frame.size };
    else if (this.axis == "BottomRight") return { x: frame.x + frame.size, y: frame.y + frame.size };
    else if (this.axis == "Left") return { x: frame.x - frame.size, y: frame.y };
    else if (this.axis == "Right") return { x: frame.x + frame.size, y: frame.y };
    else return { x: frame.x, y: frame.y };
  };

  /**
   * Return canvas Buffer
   */
  public toBuffer(): Buffer {
    return this.canvas.toBuffer();
  };

  /**
   * Generated image from canvas
   * 
   * @param location Image Generation Path
   * @param name Image name
   * @param type Image extention
   */
  public generatedTo(location: string, name: string, type: ImageExtention): void {
    writeFileSync(`${location}/${name}.${type}`, this.toBuffer());
  };

  /**
   * Returns a base64 encoded string
   */
  public toDataURL(): string {
    return this.canvas.toDataURL();
  };

}
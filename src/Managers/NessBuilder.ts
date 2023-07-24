import { writeFileSync } from "fs";
import { Canvas, CanvasRenderingContext2D, registerFont } from "canvas";
import { CanvasImage, CustomColor, ImageExtention, Shape, ImagelocationOption, DrawlocationOption, ExpLocationOption, ExpSizeOption, FrameOption, TextOption, CustomFont, FrameContent, FrameType, ShapeEnum, LoadingOption, ShapeLoad, Axis, LoadingDirection, Hourly } from "..";
import { colorCheck, convertRGBtoRGBA } from "../function";

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
  private loadingDirection: number;

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

    this.context.save();
    this.context.strokeStyle = options.color? colorCheck(options.color) : "#FF0000";
    this.context.lineWidth = options.lineWidth? options.lineWidth : 3;
   
    this.setShape(shape, frame);

    // this.context.closePath();
    this.context.stroke();
    this.context.clip();

    if (options.type == "Image") {
      return this.setFrameBackground(<CanvasImage>options.content);
    } else if (options.type == "Text") {
      const textOptions = options.textOptions;

      if (textOptions?.backgroundColor) {
        this.context.fillStyle = colorCheck(textOptions.backgroundColor);
        this.context.fill();
      };
      this.restore();

      this.setText(options.content.toString(), { x: this.frameTextCoordinate.x, y: this.frameTextCoordinate.y }, { size: textOptions.size, font: textOptions.font? textOptions.font : "*Arial" , color: textOptions.color? colorCheck(textOptions.color) : "#FFFFFF", textAlign: textOptions.textAlign? textOptions.textAlign : "center", textBaseline: textOptions.textBaseline? textOptions.textBaseline : "middle" });
      
      return this;
    } else if (options.type == "Color") {
      this.context.fillStyle = colorCheck(<CustomColor>options.content);

      this.context.fill();
      this.restore();
      return this;
    } else {
      this.restore();
      return this;
    }
  };
  
  // Mise en palce d'un cadre
  private setShape<S extends Shape>(shape: S, frame: FrameOption<S>): this {

    const axis = this.getAxis(frame);
    frame.x = axis.x, frame.y = axis.y;
    this.frameCoordinate = frame;
    
    if (frame.rotate) this.setRotation(frame.x, frame.y, frame.rotate);

    this.context.beginPath();

    const radius = (["Square", "Rectangle"].includes(shape) && frame.QuadrilateralOption)? frame.QuadrilateralOption.radius : 15;

    const sizeX = (frame.QuadrilateralOption as any)?.width? (frame.QuadrilateralOption as any).width : frame.size;
    const sizeY = (frame.QuadrilateralOption as any)?.height? (frame.QuadrilateralOption as any).height : frame.size;

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
        const sizeX = (frame.QuadrilateralOption as any)?.width? (frame.QuadrilateralOption as any).width : frame.x;
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

  // Tourner l'élément
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
  public setText(text: string, coordinate: {x: number, y: number}, option: TextOption): this {
    this.setFont(option.font, option.size);

    this.context.fillStyle = option.color ? colorCheck(option.color) : "#FFF";
    this.context.textAlign = option.textAlign;
    this.context.textBaseline = option.textBaseline;
    option.stroke ? this.context.strokeText(text, coordinate.x, coordinate.y) : this.context.fillText(text, coordinate.x, coordinate.y);

    return this;
  };
  
  /**
   * Change font to use
   * 
   * @param name Add * to use the system font (*Arial) or CustomFont (RegisterFont)
   * @param size Font size
   */
  public setFont(name: string, size?: number): this {
    if (this.getFont(name)) {
      this.context.font = `${size}px ${name.replace("*", "")}`;
    };
    return this;
  };

  // Récupère une police enregistrer hormis celle du système
  private getFont(name: string, option?: { path?: `${string}.ttf` }): boolean {
    const dataF = this.fontData.find(x => x.font.family === name)
    if (option?.path) {
      const dataP = this.fontData.find(x => x.file === option.path)
  
      if (dataP) {
        console.error(`\x1b[33mRegisterFont: \x1b[32mThis file (\x1b[31m${option.path.replace(/^.*[\\/]/, "")}\x1b[32m) has already been register for \x1b[35m${dataP.font.family}\x1b[0m`);
        return false;
      } else if (dataF) {
        console.error(`\x1b[33mRegisterFont: \x1b[32mThis name (\x1b[31m${dataF.font.family}\x1b[32m) has already been register for \x1b[35m${dataF.file.replace(/^.*[\\/]/, "")}\x1b[0m`);
        return false;
      }

      return true;
    } else {
      if (!dataF && !name.startsWith('*')) {
        console.error(`\x1b[33mRegisterFont: \x1b[31m${name} \x1b[32mis not part of the police register\x1b[0m`);
        return false;
      }

      return true;
    }
  }

  /**
   * register a new font
   * 
   * @param path Path to font file (file.ttf)
   * @param option Font default settings
   */
  public registerFont(font: CustomFont) {

    font.forEach(e => {
      if (this.getFont(e.font.family, { path: e.file })) {
        registerFont(e.file, e.font);
        this.fontData.push({ file: e.file, font: e.font });
        console.log(`\x1b[33mRegisterFont: \x1b[35m${e.font.family} \x1b[30m| \x1b[32msize - \x1b[35m${e.font.size? e.font.size + "px" : "Default"} \x1b[30m| \x1b[32mStyle - \x1b[35m${e.font.style}\x1b[0m`);
      };
    });


    // return this;
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

  public setLoading<D extends ShapeLoad, S extends Shape>(shape: Shape, option: LoadingOption<D, S>): this {

    const progress = option.progress/100;
    // const endAngle = progress * 2 * Math.PI;
    
    // -1.57 < 0 > 1.57
    // const startAngle = 3.14
    // const startAngle = 0
    // const startHour = 8.24

    
    const regex = /^(\d{1,2})h(\d{1})(?!\d)$/;
    const match = option.fill.start?.match(regex)
    
    if (match) {
      option.fill.start = <D extends "Circle"? Hourly : never>`${match[1]}h0${match[2]}`
    };

    const startAngle = ((parseFloat(option.fill.start?.replace("h", ".")) - 3) / 12) * 2 * Math.PI;
    const endAngle = (startAngle + progress * 2 * Math.PI) % (2 * Math.PI);
    let rotate = 0;

    if (option.fill.start) {
      this.setLoadingDirection(<LoadingDirection>option.fill.start);
    };

    this.context.save();
    this.context.beginPath();
    this.context.lineWidth = option.outline.width? option.outline.width : 5;

    this.setShape(shape, option);
    rotate = option.rotate;
    option.rotate = undefined;
    this.context.globalAlpha = 0.38
    this.context.fillStyle = option.color

    this.setRotation(option.x, option.y, this.loadingDirection + -rotate);
    this.context.fill()
    this.setRotation(option.x, option.y, rotate + -this.loadingDirection);

    this.context.closePath()
    this.context.clip();
    this.context.beginPath();
  
    this.context.strokeStyle = option.color? colorCheck(option.color): "#FF0000";
    this.context.fillStyle = option.color? colorCheck(option.color) : "#FF0000";
    this.context.globalAlpha = 1

    if (option.fill.type == "Circle") {
      this.context.moveTo(option.x, option.y);
      shape.includes("Rectangle")? option.size = (option.QuadrilateralOption as any).width >= (option.QuadrilateralOption as any).height? (option.QuadrilateralOption as any).width : (option.QuadrilateralOption as any).height : undefined
      this.context.arc(option.x, option.y, option.size*1.5, startAngle, endAngle);
    } else {
      let axis = this.getAxis(option);
      const radius = ["Square", "Rectangle"].includes(shape)? 15 : 0;

      while (rotate > 45 || rotate < -45) {
        if (rotate > 0) rotate -= 45;
        else rotate = -rotate;
      };

      // D = C √2
      // D = (option.size + radius) √2
      // D <=> max
      // if rotate => D = ((rotate * (option.size + radius)) /45) √2


      const size = rotate? 0.45 * rotate+radius : 0;
      const size2 = rotate? 0.45 * rotate+radius : 0;

      // const max = (option.progress * (option.size*2 + size))/100;
      let max = ((option.progress * (option.size + radius)) /60) * Math.sqrt(2);

      // console.log(max)
      let x,y;

      if (shape.includes("Square")) {
        x = axis.x - option.size - size;
        y = axis.y - option.size - size2;

        // this.setRotation(axis.x, axis.y, -rotate);
        this.setRotation(axis.x, axis.y, this.loadingDirection + -rotate);
        // console.log(this.loadingDirection)

        this.context.moveTo(x - size, y - size2);
        this.context.lineTo(x + max, y - size2);
        this.context.lineTo(x + max, axis.y + option.size + size2);
        this.context.lineTo(x - size, axis.y + option.size + size2)
        this.setRotation(axis.x, axis.y, rotate + -this.loadingDirection);
        // this.setRotation(axis.x, axis.y, -this.loadingDirection);
      } else {
        // option.x = (option.QuadrilateralOption as any).width;
        // option.y = (option.QuadrilateralOption as any).height;
        axis = this.getAxis(option)

        x = axis.x - (option.QuadrilateralOption as any).width;
        y = axis.y - (option.QuadrilateralOption as any).height;
        option.size = (option.QuadrilateralOption as any).height;
        max = ((option.progress * ((option.QuadrilateralOption as any).width)) /100) ;
        console.log(x, max, size, option.size, max*2)
        
        this.setRotation(axis.x, axis.y, this.loadingDirection + -rotate);
        
        this.context.moveTo(x - size, y - size2*2);
        this.context.lineTo(x + max*2, y - size2*2);
        this.context.lineTo(x + max*2, axis.y + option.size *2 + size2);
        this.context.lineTo(x - size, axis.y + option.size *2 + size2)
        this.setRotation(axis.x, axis.y, rotate + -this.loadingDirection);
        // this.setRotation(axis.x, axis.y, -this.loadingDirection);
      }
    }
    this.setRotation(option.x, option.y, this.loadingDirection + -rotate);
    this.context.fill()
    this.setRotation(option.x, option.y, rotate + -this.loadingDirection);

    this.context.closePath()
    this.context.beginPath();

    this.context.strokeStyle = option.outline.color? colorCheck(option.outline.color) : "#FF0000";
    this.context.fillStyle = "rgba(0,0,0,0)"
    
    this.setShape(shape, option);
    this.context.fill();
    this.context.stroke();
    this.context.closePath()
    this.restore();

    return this;
  };

  private setLoadingDirection(direction: LoadingDirection) {
    if (direction == "DownRightToUpLeft") {
      this.loadingDirection = -135
    } else if (direction == "DownToUp") {
      this.loadingDirection = -90;
    } else if (direction == "DownLeftToUpRight") {
      this.loadingDirection = -45
    } else if (direction == "LeftToRight") {
      this.loadingDirection = 0;
    } else if (direction == "UpLeftToDownRight") {
      this.loadingDirection = 45
    } else if (direction == "UpToDown") {
      this.loadingDirection = 90;
    } else if (direction == "UpRightToDownLeft") {
      this.loadingDirection = 135
    } else if (direction == "RightToLeft") {
      this.loadingDirection = 180;
    }
  }

  public setAxis(axis: Axis): this {
    this.axis = axis;
    return this;
  };

  // Change l'axe par default du cadre donné
  private getAxis<S extends Shape>(frame: FrameOption<S>) {
    
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
import { writeFileSync } from "fs";
import { Canvas, CanvasRenderingContext2D, CanvasPattern, CanvasGradient } from "canvas";
import { CanvasImage, CustomColor, ImageExtention, Shape, ImagelocationOption, DrawlocationOption, Text, FrameType, ShapeEnum, ShapeLoad, Axis, LoadingDirection, Hourly, IntRange, Banner, AxisInt, Frame, Content, Loading, Experience, ExperienceColor } from "..";
import { colorCheck } from "../function";

export default class NessBuilder {
  
  protected canvas: Canvas;
  public context: CanvasRenderingContext2D;

  private canvasSize = {
    width: 0,
    height: 0
  };

  private axis: Axis;
  private frameCoordinate: Frame<Shape>;
  private frameTextCoordinate = { x: 0, y: 0};
  private loadingDirection: number;

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
   * Special image background
   * @param color CustomColor<CanvasGradient | CanvasPattern>
   */
  private customBackground(color: CustomColor) {
    const canvas = new Canvas(this.canvas.width, this.canvas.height);
    const context = canvas.getContext("2d");
    
    context.fillStyle = color
    context.fillRect(0, 0, canvas.width, canvas.height)

    this.setImage(canvas, { sx: 0, sy:0 })
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
    if (typeof imageColor == "object" && !(imageColor instanceof CanvasPattern) && !(imageColor instanceof CanvasGradient)) {
      this.setImage(<CanvasImage>imageColor, { sx: 0, sy: 0, sWidth: this.canvas.width, sHeight: this.canvas.height })
    } else if ((imageColor instanceof CanvasPattern) || (imageColor instanceof CanvasGradient)) {
      this.customBackground(imageColor);
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
   * @param size Frame size (40px => 80px)
   * @param options Frame configuration
   */
  public setFrame<T extends FrameType, S extends Shape>(shape: S, frame: Frame<S>, content: Content<T>): this {

    this.context.save();
    this.context.strokeStyle = colorCheck(frame.outline.color)
    this.context.lineWidth = frame.outline.size;

    this.setShape(shape, frame);

    this.context.stroke();
    this.context.clip();

    if (content.type == "Image") {
      return this.setFrameBackground(<CanvasImage>content.content);
    } else if (content.type == "Text") {
      
      // if (frame.rotate) this.setRotation(frame.x, frame.y, -frame.rotate)

      const textOptions = content.text;

      if (textOptions?.backgroundColor) {
        this.context.fillStyle = colorCheck(textOptions.backgroundColor);
        this.context.fill();
      };
      
      this.setText(content.content.toString(), { x: this.frameTextCoordinate.x, y: this.frameTextCoordinate.y }, { color: textOptions?.color? textOptions.color : "#FFFFFF", textAlign: textOptions?.textAlign? textOptions.textAlign : "center", textBaseline: textOptions?.textBaseline? textOptions.textBaseline : "middle" });
      
      this.restore();

      return this;
    } else if (content.type == "Color") {
      this.context.fillStyle = colorCheck(<CustomColor>content.content);

      this.context.fill();
      this.restore();
      return this;
    } else {
      this.restore();
      return this;
    }
  };
  
  // Mise en palce d'un cadre
  private setShape<S extends Shape>(shape: S, frame: Frame<S>): this {

    const axis = this.getAxis({location: { x: frame.location.x, y: frame.location.y }, size: frame.size });
    // frame.x = axis.x, frame.y = axis.y;
    this.frameCoordinate = {...frame, ...axis};
    
    if (frame.rotate) this.setRotation(axis.x, axis.y, frame.rotate);

    this.context.beginPath();

    const radius = (["Square", "Rectangle"].includes(shape) && frame.Quadrilateral)? frame.Quadrilateral.radius : 15;

    const sizeX = (frame.Quadrilateral as any)?.width && shape.includes("Rectangle") ? (frame.Quadrilateral as any).width : frame.size;
    const sizeY = (frame.Quadrilateral as any)?.height && shape.includes("Rectangle") ? (frame.Quadrilateral as any).height : frame.size;

    const r = axis.x + sizeX;
    const b = axis.y + sizeY;

    switch (shape) {
      case "Square": {
        this.context.moveTo(axis.x + radius - frame.size, axis.y - frame.size);
        this.context.lineTo(r - radius, axis.y - frame.size);
        this.context.quadraticCurveTo(r, axis.y - frame.size, r, axis.y + radius - frame.size);
        this.context.lineTo(r, axis.y + frame.size - radius);
        this.context.quadraticCurveTo(r, b, r - radius, b);
        this.context.lineTo(axis.x + radius - frame.size, b);
        this.context.quadraticCurveTo(axis.x - frame.size, b, axis.x - frame.size, b - radius);
        this.context.lineTo(axis.x - frame.size, axis.y + radius - frame.size);
        this.context.quadraticCurveTo(axis.x - frame.size, axis.y - frame.size, axis.x + radius - frame.size, axis.y - frame.size);

        this.frameTextCoordinate = { x: axis.x, y: axis.y };
        break;
      }
      case "Rectangle": {
        const sizeX = (frame.Quadrilateral as any)?.width? (frame.Quadrilateral as any).width : axis.x;
        const r = axis.x + sizeX;

        this.context.moveTo(axis.x + radius - sizeX, axis.y - sizeY);
        this.context.lineTo(r - radius, axis.y - sizeY);
        this.context.quadraticCurveTo(r, axis.y - sizeY, r, axis.y + radius - sizeY);
        this.context.lineTo(r, axis.y + sizeY - radius);
        this.context.quadraticCurveTo(r, b, r - radius, b);
        this.context.lineTo(axis.x + radius - sizeX, b);
        this.context.quadraticCurveTo(axis.x - sizeX, b, axis.x - sizeX, b - radius);
        this.context.lineTo(axis.x - sizeX, axis.y + radius - sizeY);
        this.context.quadraticCurveTo(axis.x - sizeX, axis.y - sizeY, axis.x + radius - sizeX, axis.y - sizeY);

        this.frameTextCoordinate = { x: axis.x, y: axis.y };
        break;
      }
      case "Circle": {
        this.context.arc(axis.x, axis.y, frame.size , 0, 2 * Math.PI);
        this.frameTextCoordinate = { x: axis.x, y: axis.y };
        break;
      }
      default: {
        const angle = (Math.PI * 2) / ShapeEnum[shape as keyof typeof ShapeEnum];

        for (let i = 0; i <= ShapeEnum[shape as keyof typeof ShapeEnum]; i++) {
          const x = axis.x + frame.size * Math.cos(angle * i);
          const y = axis.y + frame.size * Math.sin(angle * i);
        
          if (i === 0) this.context.moveTo(x, y);
          else this.context.lineTo(x, y);
        };
        this.frameTextCoordinate = { x: axis.x, y: axis.y };
        break;
      };
      
      // case "SymmetricalStar": {
      //   let rot = Math.PI / 2 * 3;
      //   const spikes = options.radPik;
      //   const step = Math.PI / spikes;
      //   this.context.beginPath();

      //   for (let i = 0; i < spikes; i++) {
      //     let x = axis.x + frame.size / 2 + Math.cos(rot) * frame.size / 4;
      //     let y = axis.y + frame.size / 2 + Math.sin(rot) * frame.size / 4;
      //     this.context.lineTo(x, y);
      //     rot += step;

      //     x = axis.x + frame.size / 2 + Math.cos(rot) * frame.size / 2;
      //     y = axis.y + frame.size / 2 + Math.sin(rot) * frame.size / 2;
      //     this.context.lineTo(x, y);
      //     rot += step;
      //   }

      //   this.frameTextCoordinate.x = axis.x + frame.size / 2 + Math.cos(rot);
      //   this.frameTextCoordinate.y = axis.y + frame.size / 2 + Math.cos(rot);
      //   break;
      // };
    };

    this.context.closePath()
    
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

    this.setRotation(this.frameCoordinate.location.x , this.frameCoordinate.location.y , -this.frameCoordinate.rotate);

    while (this.frameCoordinate.rotate > 45 || this.frameCoordinate.rotate < -45) {
      if (this.frameCoordinate.rotate > 0) this.frameCoordinate.rotate -= 45;
      else this.frameCoordinate.rotate = -this.frameCoordinate.rotate;
    }

    const size = this.frameCoordinate.rotate? 0.009 * this.frameCoordinate.rotate : 0;
    const size2 = this.frameCoordinate.rotate? 0.018 * this.frameCoordinate.rotate : 0;
    
    if (typeof image == "object" && !(image instanceof CanvasPattern) && !(image instanceof CanvasGradient)) {
      if (this.frameCoordinate.rotate == undefined || this.frameCoordinate.rotate % 90 === 0 || this.frameCoordinate.rotate == 0) {
        this.setImage(image, {sx: this.frameCoordinate.location.x, sy: this.frameCoordinate.location.y, sWidth: this.frameCoordinate.size*(2 + size2), sHeight: this.frameCoordinate.size*(2 + size2) });
      } else {
        this.setImage(image, {sx: this.frameCoordinate.location.x /*- this.frameCoordinate.size*(1 + size)*/, sy: this.frameCoordinate.location.y /*- this.frameCoordinate.size*(1 + size)*/, sWidth: this.frameCoordinate.size*(2 + size2), sHeight: this.frameCoordinate.size*(2 + size2) });
      }
    } else {
      this.customBackground(image);
    }

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
  public setText(text: string, coordinate: {x: number, y: number}, option?: Text): this {

    this.context.fillStyle = option?.color ? colorCheck(option.color) : "#FFF";
    this.context.textAlign = option?.textAlign;
    this.context.textBaseline = option?.textBaseline;
    option?.stroke ? this.context.strokeText(text, coordinate.x, coordinate.y) : this.context.fillText(text, coordinate.x, coordinate.y);

    return this;
  };
  
  /**
   * Change font to use
   * 
   * @param name System font name
   * @param size Font size
   */
  public setFont(name: string, size?: number): this {
    this.context.font = `${size}px ${name}` 

    return this;

    //  * @param name Add * to use the system font (*Arial) or CustomFont (RegisterFont)
    // if (this.getFont(name)) {
      // this.context.font = `${size}px ${name.replace("*", "")}`;
    // };
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
   * @param progress Progression of the second progression bar 0 - 100%
   * @param color Text color. White color is used by Default
   */
  public setExp(exp: Experience, progress: IntRange<0, 101>, color?: ExperienceColor): this {
    
    const axis = this.getAxis({ location: exp.location, size: exp.size.width, height: exp.size.height })
    this.setRotation(axis.x, axis.y, exp.rotate);

    this.context.save();
    this.context.beginPath();
    this.context.strokeStyle = color?.backOutlineColor? colorCheck(color.backOutlineColor) : "#FF0000";
    this.context.lineWidth = 2;

    this.context.globalAlpha = color.transparency ? color.transparency/100 : 0.3;

    // Barre N°1
    this.context.moveTo(axis.x - exp.size.width, axis.y - exp.size.height);
    this.context.lineTo(axis.x, axis.y - exp.size.height);
    this.context.quadraticCurveTo(axis.x + exp.radius, axis.y - exp.size.height, axis.x + exp.radius, axis.y - (exp.size.height /2));
    this.context.quadraticCurveTo(axis.x + exp.radius, axis.y, axis.x, axis.y);
    this.context.lineTo(axis.x - exp.size.width, axis.y);
    this.context.quadraticCurveTo(axis.x - exp.size.width - exp.radius, axis.y, axis.x - exp.size.width - exp.radius, axis.y - (exp.size.height /2));
    this.context.quadraticCurveTo(axis.x - exp.size.width - exp.radius, axis.y - exp.size.height, axis.x - exp.size.width, axis.y - exp.size.height);

    this.context.fillStyle = color?.backColor? colorCheck(color.backColor) : "#FFFFFF"
    this.context.fill()
    this.context.stroke();

    if ((progress * 100) / exp.size.width < 6.8) {
      this.context.clip()
    }
    this.context.closePath()

    const progressFill = ((progress * exp.size.width) / 100) - axis.x + exp.location.x

    this.context.globalAlpha = 1;

    // Barre N°2
    this.context.beginPath();
    this.context.strokeStyle = color?.outlineColor? colorCheck(color.outlineColor) : "#000000";
    this.context.lineWidth = 2;

    this.context.moveTo(axis.x - exp.size.width, axis.y - exp.size.height);
    this.context.lineTo(axis.x + progressFill, axis.y - exp.size.height);
    this.context.quadraticCurveTo(axis.x + exp.radius + progressFill, axis.y - exp.size.height, axis.x + exp.radius + progressFill, axis.y - (exp.size.height /2));
    this.context.quadraticCurveTo(axis.x + exp.radius + progressFill, axis.y, axis.x + progressFill, axis.y);
    this.context.lineTo(axis.x - exp.size.width, axis.y);
    this.context.quadraticCurveTo(axis.x - exp.size.width - exp.radius, axis.y, axis.x - exp.size.width - exp.radius, axis.y - (exp.size.height /2));
    this.context.quadraticCurveTo(axis.x - exp.size.width - exp.radius, axis.y - exp.size.height, axis.x - exp.size.width, axis.y - exp.size.height);


    // this.context.moveTo(axis.x, axis.y);
    // this.context.lineTo(axis.x + progressFill, axis.y);
    // this.context.quadraticCurveTo(axis.x + progressFill + exp.radius, axis.y, axis.x + progressFill + exp.radius, axis.y + (exp.size.height /2));
    // this.context.quadraticCurveTo(axis.x + progressFill + exp.radius, axis.y + exp.size.height, axis.x + progressFill, axis.y + exp.size.height);
    // this.context.lineTo(axis.x, axis.y + exp.size.height);
    // this.context.quadraticCurveTo(axis.x - exp.radius, axis.y + exp.size.height, axis.x - exp.radius, axis.y + (exp.size.height /2));
    // this.context.quadraticCurveTo(axis.x - exp.radius, axis.y, axis.x, axis.y);


    this.context.fillStyle = color?.color? colorCheck(color.color) : "#BB00FF";
    this.context.fill();
    this.context.stroke();

    this.context.restore();
    return this;
  };

  public setLoading<D extends ShapeLoad, S extends Shape>(shape: Shape, option: Loading<S, D>): this {

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

    const startAngle = (((option.fill.start? parseFloat(option.fill.start?.replace("h", ".")) : 0) - 3) / 12) * 2 * Math.PI;
    const endAngle = (startAngle + progress * 2 * Math.PI) % (2 * Math.PI);
    let rotate = 0;

    if (option.fill.start) {
      this.setLoadingDirection(<LoadingDirection>option.fill.start);
    };

    this.context.save();
    this.context.beginPath();
    this.context.lineWidth = option.outline.size;

    this.setShape(shape, option);
    rotate = option.rotate;
    option.rotate = undefined;
    this.context.globalAlpha = 0.38
    this.context.fillStyle = option.color

    this.setRotation(option.location.x, option.location.y, this.loadingDirection + -rotate);
    this.context.fill()
    this.setRotation(option.location.x, option.location.y, rotate + -this.loadingDirection);

    this.context.closePath()
    this.context.clip();
    this.context.beginPath();
  
    this.context.strokeStyle = option.color? colorCheck(option.color): "#FF0000";
    this.context.fillStyle = option.color? colorCheck(option.color) : "#FF0000";
    this.context.globalAlpha = 1

    if (option.fill.type == "Circle") {
      this.context.moveTo(option.location.x, option.location.y);
      shape.includes("Rectangle")? option.size = (option.QuadrilateralOption as any).width >= (option.QuadrilateralOption as any).height? (option.QuadrilateralOption as any).width : (option.QuadrilateralOption as any).height : undefined
      this.context.arc(option.location.x, option.location.y, option.size*1.5, startAngle, endAngle);
    } else {
      let axis = this.getAxis({location: { x: option.location.x, y: option.location.y }, size: option.size });
      const radius = ["Square", "Rectangle"].includes(shape)? option.QuadrilateralOption.radius : 0;

      while (rotate > 45 || rotate < -45) {
        if (rotate > 0) rotate -= 45;
        else rotate = -rotate;
      };

      // D = C √2
      // D = (option.size + radius) √2
      // D <=> max
      // if rotate => D = ((rotate * (option.size + radius)) /45) √2


      const size = rotate? 0.45 * rotate+radius : 0;
      // const size2 = rotate? 0.45 * rotate+radius : 0;

      // const max = (option.progress * (option.size*2 + size))/100;
      let max = ((option.progress * (option.size + radius)) /100)*2;

      // console.log(max)
      let x = axis.x - option.size - size, y = axis.y - option.size - size;

      if (["Rectangle", "Square"].includes(shape)) {

        if (shape.includes("Rectangle")) {
          x = axis.x - (option.QuadrilateralOption as any).width;
          y = axis.y - (option.QuadrilateralOption as any).height;
          option.size = ((option.QuadrilateralOption as any).height)*2;
          max = ((option.progress * ((option.QuadrilateralOption as any).width)) /100)*2;
        }

        this.setRotation(axis.x, axis.y, this.loadingDirection + -rotate);

        this.context.moveTo(x - size, y - size);
        this.context.lineTo(x + max, y - size);
        this.context.lineTo(x + max, axis.y + option.size + size);
        this.context.lineTo(x - size, axis.y + option.size + size)
        this.setRotation(axis.x, axis.y, rotate + -this.loadingDirection);
      } else {

        this.setRotation(axis.x, axis.y, this.loadingDirection + -rotate);
        
        this.context.moveTo(x - size, y - size*4);
        this.context.lineTo(x + max, y - size*4);
        this.context.lineTo(x + max, axis.y + option.size *4 + size);
        this.context.lineTo(x - size, axis.y + option.size *4 + size)
        this.setRotation(axis.x, axis.y, rotate + -this.loadingDirection);
      }
    }
    this.setRotation(option.location.x, option.location.y, this.loadingDirection + -rotate);
    this.context.fill()
    this.setRotation(option.location.x, option.location.y, rotate + -this.loadingDirection);

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
  private getAxis(axis: AxisInt) {

    const { location: { x, y }, size, height } = axis
    const heightSize = height? height : size;

    if (this.axis == "TopLeft") return { x: x - size, y: y - heightSize };
    else if (this.axis == "TopCenter") return { x, y: y - heightSize };
    else if (this.axis == "TopRight") return { x: x + size, y: y - heightSize };
    else if (this.axis == "BottomLeft") return { x: x - size, y: y + heightSize };
    else if (this.axis == "BottomCenter") return { x, y: y + heightSize };
    else if (this.axis == "BottomRight") return { x: x + size, y: y + heightSize };
    else if (this.axis == "Left") return { x: x - size, y };
    else if (this.axis == "Right") return { x: x + size, y };
    else return { x, y };
  };

  public setBanner<T extends FrameType>(banner: Banner, content: Content<T>) {

    const { location: { x, y }, size: { width, height }, outline: { size, color, join }, Side: { n, extend } } = banner

    const axis = this.getAxis({ location: { x, y }, size: width/2, height: height/2 })

    this.context.save();
    this.context.strokeStyle = color? colorCheck(color) : "#FF0000";
    this.context.lineWidth = size? size : 3;
    this.context.lineJoin = join;
    
    this.context.beginPath();
    this.context.moveTo(axis.x - width/2, axis.y - height/2);
    this.context.lineTo(axis.x + width/2, axis.y - height/2);

    switch (n) {
      default: {
        const angle = (Math.PI * 2) / (n*2);
        let b = 0

        for (let i = n; i <= n*2; i++) {
          const autoX = axis.x + width/2 + extend * Math.sin(angle * i);
          const autoY = axis.y + (height/2) * Math.cos(angle * i);

          this.context.lineTo(autoX, autoY);
          b = i;
        };
        
        this.context.lineTo(axis.x - width/2, axis.y + height/2);

        for (let i = 0; i <= n; i++) {
          const autoX = axis.x - width/2 + extend * Math.sin(angle * i);
          const autoY = axis.y + (height/2) * Math.cos(angle * i);

          this.context.lineTo(autoX, autoY);
        };

        this.frameTextCoordinate = { x: axis.x, y: axis.y };
        break;
      };
    };

    this.context.closePath()
    this.context.stroke();
    this.context.clip();

    if (content.type == "Image") {
      return this.setImage(<CanvasImage>content.content, { sx: axis.x - width/2 + (extend < 0 ? extend : 0), sy: axis.y - height/2, sWidth: width - (extend < 0 ? extend*2 : 0), sHeight: height })
    } else if (content.type == "Text") {
      
      // if (frame.rotate) this.setRotation(frame.x, frame.y, -frame.rotate)

      const textOptions = content.text;

      if (textOptions?.backgroundColor) {
        this.context.fillStyle = colorCheck(textOptions.backgroundColor);
        this.context.fill();
      };
      
      this.setText(content.content.toString(), { x: this.frameTextCoordinate.x, y: this.frameTextCoordinate.y }, { color: textOptions?.color? textOptions.color : "#FFFFFF", textAlign: textOptions?.textAlign? textOptions.textAlign : "center", textBaseline: textOptions?.textBaseline? textOptions.textBaseline : "middle" });
      
      this.restore();

      return this;
    } else if (content.type == "Color") {
      this.context.fillStyle = colorCheck(<CustomColor>content.content);

      this.context.fill();
      this.restore();
      return this;
    } else {
      this.restore();
      return this;
    }
  }

  /**
   * Return canvas Buffer
   */
  public toBuffer(ext?: ImageExtention | "raw" | "pdf"): Buffer {
    if (ext == "jpeg" || ext == "jpg") return this.canvas.toBuffer("image/jpeg");
    else if (ext == "png") return this.canvas.toBuffer("image/png");
    else if (ext == "raw") return this.canvas.toBuffer("raw");
    else if (ext == "pdf") return this.canvas.toBuffer("application/pdf");
    else return this.canvas.toBuffer();
  };

  /**
   * Generated image from canvas
   * 
   * @param location Image Generation Path
   * @param name Image name
   * @param type Image extention
   */
  public generatedTo(path: string, name: string, type: ImageExtention): void {

    if (type == "png" || type == "jpeg" || type == "jpg") writeFileSync(`${path}/${name}.${type}`, this.toBuffer(type));
    else writeFileSync(`${path}/${name}.${type}`, this.toBuffer());
  };

  /**
   * Returns a base64 encoded string
   */
  public toDataURL(): string {
    return this.canvas.toDataURL();
  };

}
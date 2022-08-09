import { writeFileSync } from "fs"
import { Canvas, CanvasRenderingContext2D } from "canvas"
import { CanvasImage, CustomColor, Shape } from "../../typings";
import { ImagelocationOption, DrawlocationOption, FramelocationOption, FrameSizeOption, ExpLocationOption, ExpSizeOption } from "../../typings/Interface";

export default class NessBuilder {
  
  protected canvas: Canvas;
  private context: CanvasRenderingContext2D;

  private canvasSize = {
    width: 0,
    height: 0
  };

  private frameCoordinate = { x: 0, y: 0, w: 0, h: 0 };

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
   * @param radius Frame outline radius (is ignored if the frame does not have this functionality)
   * @param image Image to be placed in the frame
   * @param options
   * 
   * @param options - The employee who is responsible for the project.
   * @param options.color - Frame color (a degrade can be applied with [createRadialGradient | createLinearGradient] of canvas module).
   * @param options.lineWidth - Frame line size.
   */
  public setFrame(typeShape: Shape, coordinate: FramelocationOption, size: FrameSizeOption, radius: number, image?: CanvasImage, options?: {color?: CustomColor, lineWidth?: number}): this {

    // Sauvegarde de la position et taille du frame
    this.frameCoordinate.x = coordinate.x
    this.frameCoordinate.y = coordinate.y
    this.frameCoordinate.w = size.widht
    this.frameCoordinate.h = size.height

    this.context!.save();
    this.context!.beginPath();

    const r = coordinate.x + size.widht;
    const b = coordinate.y + size.height;

    switch (typeShape) {
      case "Square": {
        this.context!.strokeStyle = options.color? options.color : "#FF0000";
        this.context!.lineWidth = options.lineWidth;
        this.context!.moveTo(coordinate.x + radius, coordinate.y);
        this.context!.lineTo(r - radius, coordinate.y);
        this.context!.quadraticCurveTo(r, coordinate.y, r, coordinate.y + radius);
        this.context!.lineTo(r, coordinate.y + size.height - radius);
        this.context!.quadraticCurveTo(r, b, r - radius, b);
        this.context!.lineTo(coordinate.x + radius, b);
        this.context!.quadraticCurveTo(coordinate.x, b, coordinate.x, b - radius);
        this.context!.lineTo(coordinate.x, coordinate.y + radius);
        this.context!.quadraticCurveTo(coordinate.x, coordinate.y, coordinate.x + radius, coordinate.y);
        break;
      };
    };
    this.context!.stroke();
    this.context!.clip();

    if (image) {
      return this.setFrameBackground(image);
    } else return this.restore();
  };

  // Définition du background du cadre
  private setFrameBackground(image: CanvasImage) {
    this.draw(image, {sx: this.frameCoordinate.x, sy: this.frameCoordinate.y, sWidht: this.frameCoordinate.w, sHeight: this.frameCoordinate.h});

    this.context.restore();

    return this
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
   * @param color Couleur du cadre (un dégrader peut être appliquer avec <[createRadialGradient | createLinearGradient] du module canvas)
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
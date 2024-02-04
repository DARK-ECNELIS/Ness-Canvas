import { CanvasImage, CustomColor, FrameType, LoadingDirection, Progress, Shape, ShapeLoad, Hourly, IntRange } from ".";

/**
 * Source image coordinates to draw in the context of Canvas.
 */
export interface ImagelocationOption {
  /**
   * Coordinate X in the destination canvas (the upper left corner of the source image).
   */
   sx: number;
   /**
    * Coordinate Y in the destination canvas (the upper left corner of the source image).
    */
   sy: number;
  /**
   * Width of the image drawn in the Canvas. This allows you to adjust the size of the image. If this argument is not specified, the image will take its normal width.
   */
   sWidth?: number;
   /**
    * Height of the image drawn in the Canvas. This allows you to adjust the size of the image. If this argument is not specified, the image will take its normal height.
    */
   sHeight?: number;
}

/**
 * Modify image coordinates to draw in the context of Canvas.
 */
export interface DrawlocationOption {
  /**
   * Coordinate X from the upper left corner of the image source to draw in the canvas.
   */
   dx: number;
  /**
   * Coordinate Y from the upper left corner of the image source to draw in the canvas.
   */
   dy: number;
  /**
   * Width of the image Modify (ImagelocationOption) to draw in the canvas.
   */
   dWidth?: number;
  /**
   * Height of the image Modify (ImagelocationOption) to draw in the canvas.
   */
   dHeight?: number;
}

/**
 * Frame positioning in Canvas.
 */
export interface FrameOption <S extends Shape> {
  /**
   * Coordinate X from the upper left corner of the frame to draw in the canvas.
   */
   x: number;
  /**
   * Coordinate Y from the upper left corner of the frame to draw in the canvas.
   */
   y: number;
   /**
    * Frame size
    */
   size: number;
   /**
    * Pivot the frame of a certain degree
    */
   rotate?: number;
   /**
    * Additional parameter for the square and Rectangle
    */
   QuadrilateralOption?: S extends "Rectangle" ? {
      /**
       * Corner Radius
       */
      radius: number,
      /**
       * Replace Size parameter for axis x
       */
      width: number;
      /**
       * Replace Size parameter for axis y
       */
      height: number;
   } : S extends "Square" ? {
      /**
       * Corner Radius
       */
      radius: number,
   } : never
}

/**
 * Frame configuration
 */
export interface FrameContent <T extends FrameType> {
   /**
    * Type of frame content to use
    */
   type: T,
   /**
    * Image, text or color to be placed in the frame
    */
   content: T extends "Image"? CanvasImage : T extends "Text"? string | number : T extends "Color"? CustomColor : "Empty",
   /**
    * Text configuration (not used if imageOrText is a CanvasImage)
    */
   textOptions?: T extends "Text" ? TextOption : never;
   /**
    * Frame line color (a degrade can be applied with [createRadialGradient | createLinearGradient] of canvas module)
    */
   color: CustomColor,
   /**
    * Frame line size
    */
   lineWidth?: number
}

export interface LoadingOption <D extends ShapeLoad, S extends Shape> {
   x: number;
   y: number;
   size: number;
   fill: {
      type: D;
      start?: D extends "Circle" ? Hourly : LoadingDirection;
   }
   rotate?: number;
   color: CustomColor;
   progress: Progress;
   outline: {
      width: number;
      color: CustomColor;
   },
   QuadrilateralOption?: S extends "Rectangle" ? {
      /**
       * Corner Radius
       */
      radius: number,
      /**
       * Replace Size parameter for axis x
       */
      width: number;
      /**
       * Replace Size parameter for axis y
       */
      height: number;
   } : S extends "Square" ? {
      /**
       * Corner Radius
       */
      radius: number,
   } : never
}

export interface ExpOption {
   /**
    * Coordinate X from the upper left corner ExpBar location
    */
   x: number;
   /**
    * Coordinate Y from the upper left corner ExpBar location
    */
   y: number;
   /**
    * Width from ExpBar
    */
   width: number;
   /**
    * Height from ExpBar
    */
   height: number;
   /**
    * Pivot the frame of a certain degree
    */
   rotate?: number;
   /**
    * Corner Radius
    */
   radius?: number,
   alphat?: IntRange<0, 101>
}

/**
 * Text configuration
 */
export interface TextOption {
   /**
    * text size
    */
   size: number,
   /**
    *  change font to use (add * for use font system) example: *Arial or 
    */
   font?: string,
   /**
    * Text color (a degrade can be applied with <createRadialGradient | createLinearGradient] of the Canvas module), White color is used by Default
    */
   color?: CustomColor,
   /**
    * Background of text color (a degrade can be applied with <createRadialGradient | createLinearGradient] of the Canvas module), White color is used by Default
    */
   backgroundColor?: CustomColor,
   /**
    * write text with no fill (Color change for white and not compatible with number)
    */
   stroke?: boolean,
   /**
    * Text alignment on the X axis
    */
   textAlign?: "left" | "right" | "center" | "start" | "end",
   /**
    * Text alignment on the Y axis
    */
   textBaseline?: "top" | "hanging" | "middle" | "alphabetic" | "ideographic" | "bottom"
}

export interface FontOption {
   /**
    * Default name to use
    */
   family: string,
   /**
    * Default font size
    */
   size?: string,
   /**
    * Default police style
    */
   style?: "italic" | "normal" | "oblique" | "inherit" | "initial" | "unset"
}

export interface ExpColor { 
   color1?: CustomColor,
   color2?: CustomColor,
   outlineColor1?: CustomColor,
   outlineColor2?: CustomColor
}
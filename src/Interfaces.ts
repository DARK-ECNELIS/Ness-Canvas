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
   * Coordinate X  of the image source to draw in the canvas.
   */
   dx: number;
  /**
   * Coordinate Y  of the image source to draw in the canvas.
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
   * Frame location on axis x.
   */
   x: number;
  /**
   * Frame location on axis y.
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

/**
 * FrameLoading positioning in Canvas.
 */
export interface LoadingOption <D extends ShapeLoad, S extends Shape> {
   /**
    * Frame location on axis x
    */
   x: number;
   /**
    * Frame location on axis y
    */
   y: number;
   /**
    * Frame size
    */
   size: number;
   /**
    * Modify the filling parameters
    */
   fill: {
      /**
       * Filling type (linear or hourly)
       */
      type: D;
      /**
       * Only for hourly filling type (Default start to 12h)
       */
      start?: D extends "Circle" ? Hourly : LoadingDirection;
   }
   /**
    * Frame Rotation
    */
   rotate?: number;
   /**
    * Frame content Color (Valid syntaxes: #hex(a) | rgb(a) | colorName | CanvasGradient | CanvasPattern)
    */
   color: CustomColor;
   /**
    * Progress of filling from 0% to 100%
    */
   progress: Progress;
   /**
    * Modify Outline parameters
    */
   outline: {
      /**
       * line size
       */
      width: number;
      /**
       * line color (Valid syntaxes: #hex(a) | rgb(a) | colorName | CanvasGradient | CanvasPattern)
       */
      color: CustomColor;
   },
   /**
    * Option for the square and the rectangle shape
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
 * Exp bar positioning in Canvas.
 */
export interface ExpOption {
   /**
    * Coordinate X of ExpBar location
    */
   x: number;
   /**
    * Coordinate Y of ExpBar location
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
    * Text color (Valid syntaxes: #hex(a) | rgb(a) | colorName | CanvasGradient | CanvasPattern)
    */
   color?: CustomColor,
   /**
    * Background color (Valid syntaxes: #hex(a) | rgb(a) | colorName | CanvasGradient | CanvasPattern)
    */
   backgroundColor?: CustomColor,
   /**
    * write text with no fill
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

/**
* Adjust Bar color
*/
export interface ExpColor { 
   /**
    * Color of the bar in the background
    */
   color1?: CustomColor,
   /**
    * Filling bar color
    */
   color2?: CustomColor,
   /**
    * Color of the contour of the bar in the background
    */
   outlineColor1?: CustomColor,
   /**
    * Contour color of the filling bar
    */
   outlineColor2?: CustomColor
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
import { CanvasImage, CustomColor } from ".";

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
 * Coordinates to draw frame in Canvas.
 */
export interface FramelocationOption {
  /**
   * Coordinate X from the upper left corner of the frame to draw in the canvas.
   */
   x: number;
  /**
   * Coordinate Y from the upper left corner of the frame to draw in the canvas.
   */
   y: number;
}

/**
 * Coordinates to draw frame in Canvas.
 */
export interface FrameSizeOption {
  /**
   * frame width
   */
   width: number;
  /**
   * frame height
   */
   height: number;
}

/**
 * Coordinates to draw ExpBar in Canvas.
 */
export interface ExpLocationOption {
  /**
   * Coordinate X from the upper left corner ExpBar location
   */
   x: number;
  /**
   * Coordinate Y from the upper left corner ExpBar location
   */
   y: number;
}

/**
 * Coordinates to draw frame in Canvas.
 */
export interface ExpSizeOption {
  /**
   * Width from ExpBar
   */
   width: number;
  /**
   * Height from ExpBar
   */
   height: number;
}

/**
 * Frame configuration
 */
export interface FrameOption {
   /**
    * Dépend du shape utiliser
    * - Square => Outline radius
    * - SymmetricalStar => Number of summits
    * - Polygones => Number of sides
    * ignored for others frames
    */
   radPik?: number,
   /**
    * Frame content configuration
    */
   content?: {
      /**
       * Image or text to be placed in the frame
       */
      imageOrText: CanvasImage | number | string,
      /**
       * Text configuration (not used if imageOrText is a CanvasImage)
       */
      textOptions?: TextOption
   },
   /**
    * Frame outline configuration
    */
   outline?: {
      /**
       * Frame color (a degrade can be applied with [createRadialGradient | createLinearGradient] of canvas module)
       */
      color: CustomColor,
      /**
       * Frame line size
       */
      lineWidth?: number
   }
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
    *  system font name | register font name
    */
   font: string | RegisterFont,
   /**
    * Text color (a degrade can be applied with <createRadialGradient | createLinearGradient] of the Canvas module), White color is used by Default
    */
   color?: CustomColor,

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


export interface RegisterFont {

   /**
    * Path to font file (file.ttf)
    */
   path: string,
   /**
    * Default option
    */
   option: {
      /**
       * Default name to use
       */
      family: string,
      /**
       * Default font size
       */
      weight?: string,
      /**
       * Default police style
       */
      style?: "italic" | "normal" | "oblique" | "inherit" | "initial" | "unset"
   }
}
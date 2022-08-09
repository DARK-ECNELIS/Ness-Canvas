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
   sWidht?: number;
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
   dWidht?: number;
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
   widht: number;
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
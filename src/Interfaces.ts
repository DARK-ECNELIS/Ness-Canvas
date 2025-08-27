import { CanvasImage, CustomColor, FrameType, LoadingDirection, Progress, Shape, ShapeLoad, Hourly, IntRange } from ".";

/**
 * Two-dimensional point on the canvas
 */
interface Location {
   /**
    * Horizontal coordinate (X-axis)
    */
   x: number;
 
   /**
    * Vertical coordinate (Y-axis)
    */
   y: number;
}

/**
 * Size on two-dimensional canvas point 
 */
interface Size {
   /**
    * Size on X-axis
    */
   width: number;
   /**
    * Size on Y-axis
    */
   height: number;
}

/**
 * Outline parameter
 */
type Outline<IsBanner extends boolean = false> = {
   /**
    * Outline size
    */
   size: number
   /**
    * Outline color
    * 
    * colorName | #hex(a) | rgb(a) | CanvasGradient | CanvasPattern
    */
   color: CustomColor
   join?: IsBanner extends true ? CanvasLineJoin : never;
} & (
  IsBanner extends true
    ? {
         /**
          * Connection type between drawing segments 
          * 
          * bevel | miter | round
          */
         join: CanvasLineJoin
      }
    : { join?: never }
);

type Quadrilateral<S extends Shape> =
  S extends "Square" ? {
    /**
     * Corner Radius
     */
    radius: number,
  } :
  S extends "Rectangle" ? {
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
  } :
  never;

export interface AxisInt {
   /**
    * Axis default position on the two-dimensional canvas point
    */
   location: Location
   /**
    * Content size on the two-dimensional canvas point
    */
   size: number
   /**
    * Vertical size (Y-axis) 
    */
   height?: number
}

export interface Frame <S extends Shape> {
   /**
    * Frame position on the two-dimensional canvas point
    */
   location: Location
   /**
    * Frame size
    */
   size: number
   /**
    * Outline parameter
    */
   outline: Outline
   /**
    * Frame rotation
    */
   rotate?: number
   /**
    * Square/Rectangle additional parameter
    */
   Quadrilateral?: Quadrilateral<S>
}

export interface Content <T extends FrameType> {
   /**
    * Frame Content Type
    */
   type: T,
   /**
    * Image, text or color to place in the frame
    * 
    * Color: colorName | #hex(a) | rgb(a) | CanvasGradient | CanvasPattern
    */
   content: T extends "Image"? CanvasImage : T extends "Text"? string | number : T extends "Color"? CustomColor : "Empty",
   /**
    * Text configuration (not used if imageOrText is a CanvasImage)
    */
   text?: T extends "Text" ? Text : never;
}

export interface Loading <S extends Shape, D extends ShapeLoad> {
   /**
    * Loading position on the two-dimensional canvas point
    */
   location: Location
   /**
    * Loading size
    */
   size: number
   /**
    * Fill progression from 0% to 100%
    */
   progress: Progress
   /**
    * Outline color
    * 
    * colorName | #hex(a) | rgb(a) | CanvasGradient | CanvasPattern
    */
   color: CustomColor
   /**
    * Outline parameter
    */
   outline: Outline
   /**
    * Fill parameter
    */
   fill: {
      /**
       * Fill type (linear or hourly)
       */
      type: D;
      /**
       * Only for hourly fill type (Default start to 12h)
       */
      start?: D extends "Circle" ? Hourly : LoadingDirection;
   }
   /**
    * Loading rotation
    */
   rotate?: number
   /**
    * Square/Rectangle additional parameter
    */
   QuadrilateralOption?: Quadrilateral<S>
}

export interface Banner {
   /**
    * Banner position on the two-dimensional canvas point
    */
   location: Location
   /**
    * Banner size
    */
   size: Size
   /**
    * Outline parameter
    */
   outline: Outline<true>
   /**
    * Side parameter
    */
   Side: {
      /**
       * Number of segments
       */
      n: number
      /**
       * Stretching segments
       * 
       * positive number extends inward and negative number outwards
       */
      extend: number
   }

}

export interface Experience {
   /**
    * Experience position on the two-dimensional canvas point
    */
   location: Location
   /**
    * Experience size
    */
   size: Size
   /**
    * Experience rotation
    */
   rotate?: number
   /**
    * Corner Radius
    */
   radius?: number
}

export interface ExperienceColor {
   /**
    * Color
    * 
    * colorName | #hex(a) | rgb(a) | CanvasGradient | CanvasPattern
    */
   color: CustomColor
   /**
    * Outline color
    * 
    * colorName | #hex(a) | rgb(a) | CanvasGradient | CanvasPattern
    */
   outlineColor: CustomColor
   /**
    * Background color
    * 
    * colorName | #hex(a) | rgb(a) | CanvasGradient | CanvasPattern
    */
   backColor: CustomColor
   /**
    * Background outline color
    * 
    * colorName | #hex(a) | rgb(a) | CanvasGradient | CanvasPattern
    */
   backOutlineColor: CustomColor
   /**
    * Background transparency
    */
   transparency?: IntRange<0,101>
}

export interface Text {
   /**
    * Text color
    * 
    * colorName | #hex(a) | rgb(a) | CanvasGradient | CanvasPattern
    */
   color?: CustomColor,
   /**
    * Background color
    * 
    * colorName | #hex(a) | rgb(a) | CanvasGradient | CanvasPattern
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





// export interface FontOption {
//    /**
//     * Default name to use
//     */
//    family: string,
//    /**
//     * Default font size
//     */
//    size?: string,
//    /**
//     * Default police style
//     */
//    style?: "italic" | "normal" | "oblique" | "inherit" | "initial" | "unset"
// }
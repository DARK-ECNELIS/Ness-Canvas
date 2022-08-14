import { Image } from "canvas";

declare type CustomColor = string | CanvasGradient | CanvasPattern;
declare type CanvasImage = Image | HTMLOrSVGImageElement | HTMLVideoElement | HTMLCanvasElement | ImageBitmap

declare type Preset = 'classic';
declare type Shape = "Square" | "Octogon" | "Pentagone";

declare type ImageType = "PNG"

export { Preset, Shape, CustomColor, CanvasImage, ImageType }
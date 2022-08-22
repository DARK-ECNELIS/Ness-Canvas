import { Image } from "canvas";

declare type CustomColor = string | CanvasGradient | CanvasPattern;
declare type CanvasImage = Image | HTMLOrSVGImageElement | HTMLVideoElement | HTMLCanvasElement | ImageBitmap

declare type Preset = 'classic';
declare type Shape = "Square" | "Octogon" | "Pentagone" | "Circle" | "SymmetricalStar" | "Polygones";

declare type ImageExtention = "PNG" | "JPG" | "JPEG"


export { Preset, Shape, CustomColor, CanvasImage, ImageExtention }
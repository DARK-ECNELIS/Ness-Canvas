import { Image } from "canvas";

declare type CustomColor = `#${string}` | CanvasGradient | CanvasPattern;
declare type CanvasImage = Image | HTMLOrSVGImageElement | HTMLVideoElement | HTMLCanvasElement | ImageBitmap

declare type Preset = 'classic';
declare type Shape = "Square" | "Octogon" | "Pentagone" | "Circle" | "SymmetricalStar" | "Polygones";

declare type ImageExtention = "PNG" | "JPG" | "JPEG"


export { Preset, Shape, CustomColor, CanvasImage, ImageExtention }

export { default as NessBuilder } from './Managers/NessBuilder';
export { default as CustomProfile } from './Extra/CustomProfile';
export { default as RankupBuilder } from './Extra/RankupBuilder';

export { ImagelocationOption, DrawlocationOption, FramelocationOption, FrameSizeOption, ExpLocationOption, ExpSizeOption, FrameOption, TextOption, RegisterFont } from './Interface'
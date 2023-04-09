import { Canvas, Image } from "canvas";

declare type CustomColor = `#${string}` | CanvasGradient | CanvasPattern;
declare type CanvasImage = Image | Canvas

declare type Preset = 'classic';
declare type Shape = "Square" | "Octogon" | "Pentagone" | "Circle" | "SymmetricalStar" | "Polygones";

declare type ImageExtention = "png" | "jpg" | "jpeg"

enum ImageChannels {
  Red = 1,
  Green = 2,
  Bleu = 3
};

enum Edge {
  Clamp = 1,
  Wrap = 2,
  Transparent = 0
};


export { Preset, Shape, CustomColor, CanvasImage, ImageExtention, ImageChannels, Edge }

export { default as NessBuilder } from './Managers/NessBuilder';
export { default as FilterBuilder } from './Managers/FilterBuilder';
export { default as GifBuilder } from './Managers/GifBuilder';
export { default as CustomProfile } from './Extra/CustomProfile';
export { default as RankupBuilder } from './Extra/RankupBuilder';

export { ImagelocationOption, DrawlocationOption, FramelocationOption, FrameSizeOption, ExpLocationOption, ExpSizeOption, FrameOption, TextOption, RegisterFont } from './Interfaces';
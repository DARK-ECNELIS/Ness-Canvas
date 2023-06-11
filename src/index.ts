import { Canvas, Image } from "canvas";
import { FontOption } from "./Interfaces";

declare type CustomColor = `#${string}` | RGBColor | RGBAColor | ColorName | CanvasGradient | CanvasPattern;

declare type RGBColor = `rgb(${number},${number},${number})`;
declare type RGBAColor = `rgba(${number},${number},${number},${number})`;
declare type CanvasImage = Image | Canvas
declare type Preset = 'classic';
declare type Shape = "Triangle" | "Square" | "Rectangle" | "Pentagon" | "Hexagon" | "Heptagon" | "Octagon" | "Nonagon" | "Decagon" | "Hendecagon" | "Dodecagon" | "Circle" /*| "SymmetricalStar" | "Polygones"*/;

declare type ShapeLoad = "Circle" | "Bar";

declare type ImageExtention = "png" | "jpg" | "jpeg"

declare type ColorName = "White" | "Yellow" | "Blue" | "Red" | "Green" | "Black" | "Brown" | "Ivory" | "Teal" | "Silver" | "Purple" | "Navy" | "Gray" | "Orange" | "Maroon" | "Aquamarine" | "Coral" | "Fuchsia" | "Wheat" | "Lime" | "Crimson" | "Khaki" | "HotPink" | "Magenta" | "Plum" | "Olive" | "Cyan";

declare type CustomFont = Array<{file: `${string}.ttf`, font: FontOption}>
declare type FrameType = "Image" | "Text" | "Color" | "Empty";
declare type Axis = "Left" | "Center" | "Right" | "TopLeft" |
"TopCenter" | "TopRight" | "BottomLeft" | "BottomCenter" | "BottomRight"

enum ShapeEnum {
  Triangle = 3,
  Square = undefined,
  Rectangle = undefined,
  Pentagon = 5,
  Hexagon = 6,
  Heptagon = 7,
  Octagon = 8,
  Nonagon = 9,
  Decagon = 10,
  Hendecagon = 11,
  Dodecagon = 12
}

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


type Enumerate<N extends number, Acc extends number[] = []> = Acc['length'] extends N
  ? Acc[number]
  : Enumerate<N, [...Acc, Acc['length']]>

type IntRange<F extends number, T extends number> = Exclude<Enumerate<T>, Enumerate<F>>

declare type Progress = IntRange<0, 100>


export { Preset, Shape, CustomColor, CanvasImage, ImageExtention, ImageChannels, Edge, CustomFont, FrameType, ShapeEnum, ShapeLoad, Progress, Axis }

export { default as NessBuilder } from './Managers/NessBuilder';
export { default as FilterBuilder } from './Managers/FilterBuilder';
export { default as GifBuilder } from './Managers/GifBuilder';
export { default as CustomProfile } from './Extra/CustomProfile';
export { default as RankupBuilder } from './Extra/RankupBuilder';

export { ImagelocationOption, DrawlocationOption, FrameOption, ExpLocationOption, ExpSizeOption, FrameContent, TextOption, FontOption, LoadingOption } from './Interfaces';
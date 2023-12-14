import { Canvas, CanvasRenderingContext2D, ImageData } from "canvas";
import { writeFileSync } from "fs";
import { CanvasImage, Edge, ImageChannels, ImageExtention } from "..";

export default class FilterBuilder {
  private dataDraft: ImageData;
  private dstImageData: ImageData;
  private context: CanvasRenderingContext2D;
  private canvas: Canvas;

  private srcPixels: Uint8ClampedArray;
  private srcWidth: number;
  private srcHeight: number;
  private srcLength: number;
  private dstPixels: Uint8ClampedArray;
  private tmpImageData: ImageData;
  private tmpPixels: Uint8ClampedArray;

  private filter: string;

  constructor(image: CanvasImage) {
    
    this.canvas = new Canvas(<number>image.width, <number>image.height);
    this.context = this.canvas.getContext("2d");

    this.context.drawImage(image, 0, 0, image.width, image.height);

    this.dataDraft = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
    this.srcPixels = this.dataDraft.data;
    this.srcWidth = this.dataDraft.width;
    this.srcHeight = this.dataDraft.height;
    this.dstImageData = this.createImageData(this.srcWidth, this.srcHeight);
    this.srcLength = this.srcPixels.length;
    this.dstPixels = this.dstImageData.data;
    this.tmpImageData = this.createImageData(this.srcWidth, this.srcHeight);
    this.tmpPixels = this.tmpImageData.data
  };

  private createImageData(width: number, height: number) {
    return this.context.createImageData(width, height);
  };

  private clamp(value: number) {
    return value > 255 ? 255 : value < 0 ? 0 : value;
  };

  private buildMap(func: (arg0: number) => number) {
    const m = []
    for (let k = 0, v: number; k < 256; k+= 1) {
      m[k] = (v = func(k)) > 255 ? 255 : v < 0 ? 0 : v | 0;
    };
    return m;
  };

  private applyMap(path: Uint8ClampedArray, dst: Uint8ClampedArray, map: { [x: string]: any; }) {
    for (let i = 0; i < path.length; i += 4) {
      dst[i]     = map[path[i]];
      dst[i + 1] = map[path[i + 1]];
      dst[i + 2] = map[path[i + 2]];
      dst[i + 3] = path[i + 3];
    };
  };

  private mapRGB(path: Uint8ClampedArray, dst: Uint8ClampedArray, func: (arg0: number) => number) {
    this.applyMap(path, dst, this.buildMap(func));
  };

  private getPixelIndex(x: number, y: number, width: number, height: number, edge: Edge) {
    if (x < 0 || x >= width || y < 0 || y >= height) {
      switch (edge) {
        case 1: { // clamp
          x = x < 0 ? 0 : x >= width ? width - 1 : x;
          y = y < 0 ? 0 : y >= height ? height - 1 : y;
          break;
        };
        case 2: { // wrap
          x = (x %= width) < 0 ? x + width : x;
          y = (y %= height) < 0 ? y + height : y;
          break;
        };
        default: { // transparent
          return null;
        };
      };
    };
    return (y * width + x) << 2;
  };

  private getPixel(path: Uint8ClampedArray | number[], x: number, y: number, width: number, height: number, edge: Edge) {
    if (x < 0 || x >= width || y < 0 || y >= height) {
      switch (edge) {
        case 1: { // clamp
          x = x < 0 ? 0 : x >= width ? width - 1 : x;
          y = y < 0 ? 0 : y >= height ? height - 1 : y;
          break;
        };
        case 2: { // wrap
          x = (x %= width) < 0 ? x + width : x;
          y = (y %= height) < 0 ? y + height : y;
          break;
        };
        default: { // transparent
          return 0;
        };
      };
    };
    
    const i = (y * width + x) << 2;

    // ARGB
    return path[i + 3] << 24 | path[i] << 16 | path[i + 1] << 8 | path[i + 2];
  };

  private getPixelByIndex(path: { [x: string]: number; }, i: number) {
    return path[i + 3] << 24 | path[i] << 16 | path[i + 1] << 8 | path[i + 2];
  };

  private copyBilinear(path: Uint8ClampedArray | number[], x: number, y: number, width: number, height: number, dst: Uint8ClampedArray | number[], dstIndex: number, edge: Edge) {
    let fx = x < 0 ? x - 1 | 0 : x | 0, // Math.floor(x)
      fy = y < 0 ? y - 1 | 0 : y | 0, // Math.floor(y)
      wx = x - fx,
      wy = y - fy,
      i: number,
      nw = 0, ne = 0, sw = 0, se = 0,
      cx: number, cy: number,
      r: number, g: number, b: number, a: number;
    
    if (fx >= 0 && fx < (width - 1) && fy >= 0 && fy < (height - 1)) {
      // in bounds, no edge actions required
      i = (fy * width + fx) << 2;

      if (wx || wy) {
        nw = path[i + 3] << 24 | path[i] << 16 | path[i + 1] << 8 | path[i + 2];
            
        i += 4;
        ne = path[i + 3] << 24 | path[i] << 16 | path[i + 1] << 8 | path[i + 2];
            
        i = (i - 8) + (width << 2);
        sw = path[i + 3] << 24 | path[i] << 16 | path[i + 1] << 8 | path[i + 2];
            
        i += 4;
        se = path[i + 3] << 24 | path[i] << 16 | path[i + 1] << 8 | path[i + 2];
      } else {
        // no interpolation required
        dst[dstIndex]     = path[i];
        dst[dstIndex + 1] = path[i + 1];
        dst[dstIndex + 2] = path[i + 2];
        dst[dstIndex + 3] = path[i + 3];
        return;
      };
    } else {
      // edge actions required
      nw = this.getPixel(path, fx, fy, width, height, edge);
      
      if (wx || wy) {
        ne = this.getPixel(path, fx + 1, fy, width, height, edge);
        sw = this.getPixel(path, fx, fy + 1, width, height, edge);
        se = this.getPixel(path, fx + 1, fy + 1, width, height, edge);
      } else {
        // no interpolation required
        dst[dstIndex]     = nw >> 16 & 0xFF;
        dst[dstIndex + 1] = nw >> 8  & 0xFF;
        dst[dstIndex + 2] = nw       & 0xFF;
        dst[dstIndex + 3] = nw >> 24 & 0xFF;
        return;
      };
    };
    
    cx = 1 - wx;
    cy = 1 - wy;
    r = ((nw >> 16 & 0xFF) * cx + (ne >> 16 & 0xFF) * wx) * cy + ((sw >> 16 & 0xFF) * cx + (se >> 16 & 0xFF) * wx) * wy;
    g = ((nw >> 8  & 0xFF) * cx + (ne >> 8  & 0xFF) * wx) * cy + ((sw >> 8  & 0xFF) * cx + (se >> 8  & 0xFF) * wx) * wy;
    b = ((nw       & 0xFF) * cx + (ne       & 0xFF) * wx) * cy + ((sw       & 0xFF) * cx + (se       & 0xFF) * wx) * wy;
    a = ((nw >> 24 & 0xFF) * cx + (ne >> 24 & 0xFF) * wx) * cy + ((sw >> 24 & 0xFF) * cx + (se >> 24 & 0xFF) * wx) * wy;
    
    dst[dstIndex]     = r > 255 ? 255 : r < 0 ? 0 : r | 0;
    dst[dstIndex + 1] = g > 255 ? 255 : g < 0 ? 0 : g | 0;
    dst[dstIndex + 2] = b > 255 ? 255 : b < 0 ? 0 : b | 0;
    dst[dstIndex + 3] = a > 255 ? 255 : a < 0 ? 0 : a | 0;
  };

  /**
   * @param r 0 <= n <= 255
   * @param g 0 <= n <= 255
   * @param b 0 <= n <= 255
   * @return Array(h, s, l)
   */
  private rgbToHsl(r: number, g: number, b: number) {
    r /= 255;
    g /= 255;
    b /= 255;
    // max = Math.max(r, g, b)
    // min = Math.min(r, g, b)

    let max = (r > g) ? (r > b) ? r : b : (g > b) ? g : b,
    min = (r < g) ? (r < b) ? r : b : (g < b) ? g : b,
    chroma = max - min,
    h = 0,
    s = 0,
    // Lightness
    l = (min + max) / 2;

    if (chroma !== 0) {
      // Hue
      if (r === max) {
        h = (g - b) / chroma + ((g < b) ? 6 : 0);
      } else if (g === max) {
        h = (b - r) / chroma + 2;
      } else {
        h = (r - g) / chroma + 4;
      };
      h /= 6;

      // Saturation
      s = (l > 0.5) ? chroma / (2 - max - min) : chroma / (max + min);
    };

    return [h, s, l];
  };

  /**
   * @param h 0.0 <= n <= 1.0
   * @param s 0.0 <= n <= 1.0
   * @param l 0.0 <= n <= 1.0
   * @return Array(r, g, b)
   */
  private hslToRgb(h: number, s: number, l: number) {
    let m1: number, m2: number, hue: number,
      r: number, g: number, b: number,
      rgb = [];

    if (s === 0) {
      r = g = b = l * 255 + 0.5 | 0;
      rgb = [r, g, b];
    } else {
      if (l <= 0.5) {
        m2 = l * (s + 1);
      } else {
        m2 = l + s - l * s;
      };

      m1 = l * 2 - m2;
      hue = h + 1 / 3;

      let tmp: number;
      for (var i = 0; i < 3; i += 1) {
        if (hue < 0) {
          hue += 1;
        } else if (hue > 1) {
          hue -= 1;
        };

        if (6 * hue < 1) {
          tmp = m1 + (m2 - m1) * hue * 6;
        } else if (2 * hue < 1) {
          tmp = m2;
        } else if (3 * hue < 2) {
          tmp = m1 + (m2 - m1) * (2 / 3 - hue) * 6;
        } else {
          tmp = m1;
        };

        rgb[i] = tmp * 255 + 0.5 | 0;

        hue -= 1 / 3;
      };
    };

    return rgb;
  };

  private async ConvolutionFilter(matrixX: number, matrixY: number, matrix: any[], divisor?: number, bias?: number, preserveAlpha?: boolean, clamp?: boolean, color?: number, alpha?: number) {

    divisor = divisor || 1;
    bias = bias || 0;

    // default true
    (preserveAlpha !== false) && (preserveAlpha = true);
    (clamp !== false) && (clamp = true);

    color = color || 0;
    alpha = alpha || 0;

    let index = 0,
    rows = matrixX >> 1,
    cols = matrixY >> 1,
    clampR = color >> 16 & 0xFF,
    clampG = color >>  8 & 0xFF,
    clampB = color       & 0xFF,
    clampA = alpha * 0xFF;

    for (let y = 0; y < this.srcHeight; y += 1) {
      for (let x = 0; x < this.srcWidth; x += 1, index += 4) {
        let r = 0,
        g = 0,
        b = 0,
        a = 0,
        replace = false,
        mIndex = 0,
        v: number;

        for (let row = -rows; row <= rows; row += 1) {
          let rowIndex = y + row, offset: number;

          if (0 <= rowIndex && rowIndex < this.srcHeight) {
            offset = rowIndex * this.srcWidth;
          } else if (clamp) {
            offset = y * this.srcWidth;
          } else {
            replace = true;
          };

          for (let col = -cols; col <= cols; col += 1) {
            const m = matrix[mIndex++];

            if (m !== 0) {
              let colIndex = x + col;

              if (!(0 <= colIndex && colIndex < this.srcWidth)) {
                if (clamp) {
                  colIndex = x;
                } else {
                  replace = true;
                };
              };

              if (replace) {
                r += m * clampR;
                g += m * clampG;
                b += m * clampB;
                a += m * clampA;
              } else {
                const p = (offset + colIndex) << 2;
                r += m * this.srcPixels[p];
                g += m * this.srcPixels[p + 1];
                b += m * this.srcPixels[p + 2];
                a += m * this.srcPixels[p + 3];
              };
            };
          };
        };

        this.dstPixels[index]     = (v = r / divisor + bias) > 255 ? 255 : v < 0 ? 0 : v | 0;
        this.dstPixels[index + 1] = (v = g / divisor + bias) > 255 ? 255 : v < 0 ? 0 : v | 0;
        this.dstPixels[index + 2] = (v = b / divisor + bias) > 255 ? 255 : v < 0 ? 0 : v | 0;
        this.dstPixels[index + 3] = preserveAlpha ? this.srcPixels[index + 3] : (v = a / divisor + bias) > 255 ? 255 : v < 0 ? 0 : v | 0;
      };
    };

    return this.dstImageData;
  };

  // // // // // // // // // // // // // //

  private async Clone(srcImageData: ImageData) {
    return this.Copy(srcImageData, this.createImageData(srcImageData.width, srcImageData.height));
  };

  private async Copy(srcImageData: ImageData, dstImageData: ImageData) {
    let srcPixels = srcImageData.data, srcLength = srcPixels.length, dstPixels = dstImageData.data;

    while (srcLength--) {
      dstPixels[srcLength] = srcPixels[srcLength];
    };

    return dstImageData;
  };

  private async ColorMatrixFilter(matrix: any[]) {
    const m0  = matrix[0],
    m1  = matrix[1],
    m2  = matrix[2],
    m3  = matrix[3],
    m4  = matrix[4],
    m5  = matrix[5],
    m6  = matrix[6],
    m7  = matrix[7],
    m8  = matrix[8],
    m9  = matrix[9],
    m10 = matrix[10],
    m11 = matrix[11],
    m12 = matrix[12],
    m13 = matrix[13],
    m14 = matrix[14],
    m15 = matrix[15],
    m16 = matrix[16],
    m17 = matrix[17],
    m18 = matrix[18],
    m19 = matrix[19];

    let value: number, i: number, r: number, g: number, b: number, a: number;
    for (i = 0; i < this.srcLength; i += 4) {
      r = this.srcPixels[i];
      g = this.srcPixels[i + 1];
      b = this.srcPixels[i + 2];
      a = this.srcPixels[i + 3];

      this.dstPixels[i]     = (value = r *  m0 + g *  m1 + b *  m2 + a *  m3 +  m4) > 255 ? 255 : value < 0 ? 0 : value | 0;
      this.dstPixels[i + 1] = (value = r *  m5 + g *  m6 + b *  m7 + a *  m8 +  m9) > 255 ? 255 : value < 0 ? 0 : value | 0;
      this.dstPixels[i + 2] = (value = r * m10 + g * m11 + b * m12 + a * m13 + m14) > 255 ? 255 : value < 0 ? 0 : value | 0;
      this.dstPixels[i + 3] = (value = r * m15 + g * m16 + b * m17 + a * m18 + m19) > 255 ? 255 : value < 0 ? 0 : value | 0;
    }

    return this.dstImageData;
  };
  // // // // // // // // // // // // // //

  /**
   * @param threshold 0.0 <= n <= 1.0
   */
  public async Binarize(threshold = 0.5) {

    if (0.0 > threshold || threshold > 1.0) {
      threshold = 0.5;
    }

    threshold *= 255;

    for (let i = 0; i < this.srcLength; i += 4) {
      const avg = this.srcPixels[i] + this.srcPixels[i + 1] + this.srcPixels[i + 2] / 3;

      this.dstPixels[i] = this.dstPixels[i + 1] = this.dstPixels[i + 2] = avg <= threshold ? 0 : 255;
      this.dstPixels[i + 3] = 255;
    }

    this.filter = "Binarize";
    return this.dstImageData;
  };

  /**
   * @param hRadius 1 <= n <= 20
   * @param vRadius 1 <= n <= 20
   * @param quality 1 <= n <= 10
   */
  public async BoxBlur(hRadius = 3, vRadius = 3, quality = 2) {
    function Blur(src: Uint8ClampedArray, dst: Uint8ClampedArray, width: number, height: number, radius: number) {
      const tableSize = radius * 2 + 1,
      radiusPlus1 = radius + 1,
      widthMinus1 = width - 1;

      let r: number, g: number, b: number, a: number;
      
      let srcIndex = 0,
      dstIndex: number,
      p: number, next: number, prev: number,
      i: number, l: number, x: number, y: number,
      nextIndex: number, prevIndex: number;

      const sumTable = [];
      
      for (i = 0, l = 256 * tableSize; i < l; i += 1) {
        sumTable[i] = i / tableSize | 0;
      };

      for (y = 0; y < height; y += 1) {
        r = g = b = a = 0;
        dstIndex = y;

        p = srcIndex << 2;
        r += radiusPlus1 * src[p];
        g += radiusPlus1 * src[p + 1];
        b += radiusPlus1 * src[p + 2];
        a += radiusPlus1 * src[p + 3];

        for (i = 1; i <= radius; i += 1) {
          p = (srcIndex + (i < width ? i : widthMinus1)) << 2;
          r += src[p];
          g += src[p + 1];
          b += src[p + 2];
          a += src[p + 3];
        };

        for (x = 0; x < width; x += 1) {
          p = dstIndex << 2;
          dst[p]     = sumTable[r];
          dst[p + 1] = sumTable[g];
          dst[p + 2] = sumTable[b];
          dst[p + 3] = sumTable[a];

          nextIndex = x + radiusPlus1;
          if (nextIndex > widthMinus1) {
            nextIndex = widthMinus1;
          };

          prevIndex = x - radius;
          if (prevIndex < 0) {
            prevIndex = 0;
          };

          next = (srcIndex + nextIndex) << 2;
          prev = (srcIndex + prevIndex) << 2;

          r += src[next]     - src[prev];
          g += src[next + 1] - src[prev + 1];
          b += src[next + 2] - src[prev + 2];
          a += src[next + 3] - src[prev + 3];
          
          dstIndex += height;
        };
        srcIndex += width;
      };
    };

    for (var i = 0; i < quality; i += 1) {
      // only use the srcPixels on the first loop
      Blur(i ? this.dstPixels : this.srcPixels,  this.tmpPixels,  this.srcWidth,  this.srcHeight, hRadius);
      Blur( this.tmpPixels, this.dstPixels,  this.srcHeight,  this.srcWidth, vRadius);
    };

    this.filter = "BoxBlur";
    return  this.dstImageData;
  };

  /**
   * @ param strength 1 <= n <= 4
   */
  public async GaussianBlur(strength = 2) {
    let size: number, matrix: number[], divisor: number;

    switch (strength) {
      case 2: {
        size = 5;
        matrix = [
          1, 1, 2, 1, 1,
          1, 2, 4, 2, 1,
          2, 4, 8, 4, 2,
          1, 2, 4, 2, 1,
          1, 1, 2, 1, 1
        ];
        divisor = 52;
        break;
      }
      case 3: {
        size = 7;
        matrix = [
          1, 1, 2,  2, 2, 1, 1,
          1, 2, 2,  4, 2, 2, 1,
          2, 2, 4,  8, 4, 2, 2,
          2, 4, 8, 16, 8, 4, 2,
          2, 2, 4,  8, 4, 2, 2,
          1, 2, 2,  4, 2, 2, 1,
          1, 1, 2,  2, 2, 1, 1
        ];
        divisor = 140;
        break;
      }
      case 4: {
        size = 15;
        matrix = [
          2 ,2 , 3 , 4 , 5 , 5 , 6 , 6 , 6 , 5 , 5 , 4 , 3 ,2 ,2,
          2 ,3 , 4 , 5 , 7 , 7 , 8 , 8 , 8 , 7 , 7 , 5 , 4 ,3 ,2,
          3 ,4 , 6 , 7 , 9 ,10 ,10 ,11 ,10 ,10 , 9 , 7 , 6 ,4 ,3,
          4 ,5 , 7 , 9 ,10 ,12 ,13 ,13 ,13 ,12 ,10 , 9 , 7 ,5 ,4,
          5 ,7 , 9 ,11 ,13 ,14 ,15 ,16 ,15 ,14 ,13 ,11 , 9 ,7 ,5,
          5 ,7 ,10 ,12 ,14 ,16 ,17 ,18 ,17 ,16 ,14 ,12 ,10 ,7 ,5,
          6 ,8 ,10 ,13 ,15 ,17 ,19 ,19 ,19 ,17 ,15 ,13 ,10 ,8 ,6,
          6 ,8 ,11 ,13 ,16 ,18 ,19 ,20 ,19 ,18 ,16 ,13 ,11 ,8 ,6,
          6 ,8 ,10 ,13 ,15 ,17 ,19 ,19 ,19 ,17 ,15 ,13 ,10 ,8 ,6,
          5 ,7 ,10 ,12 ,14 ,16 ,17 ,18 ,17 ,16 ,14 ,12 ,10 ,7 ,5,
          5 ,7 , 9 ,11 ,13 ,14 ,15 ,16 ,15 ,14 ,13 ,11 , 9 ,7 ,5,
          4 ,5 , 7 , 9 ,10 ,12 ,13 ,13 ,13 ,12 ,10 , 9 , 7 ,5 ,4,
          3 ,4 , 6 , 7 , 9 ,10 ,10 ,11 ,10 ,10 , 9 , 7 , 6 ,4 ,3,
          2 ,3 , 4 , 5 , 7 , 7 , 8 , 8 , 8 , 7 , 7 , 5 , 4 ,3 ,2,
          2 ,2 , 3 , 4 , 5 , 5 , 6 , 6 , 6 , 5 , 5 , 4 , 3 ,2 ,2
        ];
        divisor = 2044;
        break;
      }
      default: {
        size = 3;
        matrix = [
          1, 2, 1,
          2, 4, 2,
          1, 2, 1
        ];
        divisor = 16;
        break;
      };
    };

    this.filter = "GaussianBlur";
    return await this.ConvolutionFilter(size, size, matrix, divisor, 0, false);
  };

  /**
   * @param radius 1 <= n <= 180
   */
  public async StackBlur(radius = 6) {
    const mul_table = [
      512,512,456,512,328,456,335,512,405,328,271,456,388,335,292,512,
      454,405,364,328,298,271,496,456,420,388,360,335,312,292,273,512,
      482,454,428,405,383,364,345,328,312,298,284,271,259,496,475,456,
      437,420,404,388,374,360,347,335,323,312,302,292,282,273,265,512,
      497,482,468,454,441,428,417,405,394,383,373,364,354,345,337,328,
      320,312,305,298,291,284,278,271,265,259,507,496,485,475,465,456,
      446,437,428,420,412,404,396,388,381,374,367,360,354,347,341,335,
      329,323,318,312,307,302,297,292,287,282,278,273,269,265,261,512,
      505,497,489,482,475,468,461,454,447,441,435,428,422,417,411,405,
      399,394,389,383,378,373,368,364,359,354,350,345,341,337,332,328,
      324,320,316,312,309,305,301,298,294,291,287,284,281,278,274,271,
      268,265,262,259,257,507,501,496,491,485,480,475,470,465,460,456,
      451,446,442,437,433,428,424,420,416,412,408,404,400,396,392,388,
      385,381,377,374,370,367,363,360,357,354,350,347,344,341,338,335,
      332,329,326,323,320,318,315,312,310,307,304,302,299,297,294,292,
      289,287,285,282,280,278,275,273,271,269,267,265,263,261,259
    ];      
     
    const shg_table = [
       9, 11, 12, 13, 13, 14, 14, 15, 15, 15, 15, 16, 16, 16, 16, 17, 
      17, 17, 17, 17, 17, 17, 18, 18, 18, 18, 18, 18, 18, 18, 18, 19, 
      19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 20, 20, 20,
      20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 21,
      21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21,
      21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 22, 22, 22, 22, 22, 22, 
      22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22,
      22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 23,
      23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23,
      23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23,
      23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 
      23, 23, 23, 23, 23, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 
      24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24,
      24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24,
      24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24,
      24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24
    ];
      
    function BlurStack() {
      this.r = 0;
      this.g = 0;
      this.b = 0;
      this.a = 0;
      this.next = null;
    };
      
    this.dstImageData = await this.Clone(this.dataDraft);
    this.dstPixels = this.dstImageData.data;

    let x: number, y: number, i: number, p: number, yp: number, yi: number, yw: number,
    r_sum: number, g_sum: number, b_sum: number, a_sum: number, 
    r_out_sum: number, g_out_sum: number, b_out_sum: number, a_out_sum: number,
    r_in_sum: number, g_in_sum: number, b_in_sum: number, a_in_sum: number, 
    pr: number, pg: number, pb: number, pa: number, rbs: number,
    div = radius + radius + 1,
    w4 = this.srcWidth << 2,
    widthMinus1  = this.srcWidth - 1,
    heightMinus1 = this.srcHeight - 1,
    radiusPlus1  = radius + 1,
    sumFactor = radiusPlus1 * ( radiusPlus1 + 1 ) / 2,
    stackStart = new BlurStack(),
    stack = stackStart,
    stackIn: { r: number; g: number; b: number; a: number; next: any; }, stackOut: { r: any; g: any; b: any; a: any; next: any; }, stackEnd: any,
    mul_sum = mul_table[radius],
    shg_sum = shg_table[radius];
        
    for (i = 1; i < div; i += 1) {
      stack = stack.next = new BlurStack();
      if (i == radiusPlus1) {
        stackEnd = stack;
      };
    };
        
    stack.next = stackStart;
    yw = yi = 0;
        
    for (y = 0; y < this.srcHeight; y += 1) {
      r_in_sum = g_in_sum = b_in_sum = a_in_sum = r_sum = g_sum = b_sum = a_sum = 0;
        
      r_out_sum = radiusPlus1 * (pr = this.dstPixels[yi]);
      g_out_sum = radiusPlus1 * (pg = this.dstPixels[yi + 1]);
      b_out_sum = radiusPlus1 * (pb = this.dstPixels[yi + 2]);
      a_out_sum = radiusPlus1 * (pa = this.dstPixels[yi + 3]);
      
      r_sum += sumFactor * pr;
      g_sum += sumFactor * pg;
      b_sum += sumFactor * pb;
      a_sum += sumFactor * pa;
      
      stack = stackStart;
      
      for (i = 0; i < radiusPlus1; i += 1) {
        stack.r = pr;
        stack.g = pg;
        stack.b = pb;
        stack.a = pa;
        stack = stack.next;
      };
      
      for (i = 1; i < radiusPlus1; i += 1) {
        p = yi + ((widthMinus1 < i ? widthMinus1 : i) << 2);
        r_sum += (stack.r = (pr = this.dstPixels[p])) * (rbs = radiusPlus1 - i);
        g_sum += (stack.g = (pg = this.dstPixels[p + 1])) * rbs;
        b_sum += (stack.b = (pb = this.dstPixels[p + 2])) * rbs;
        a_sum += (stack.a = (pa = this.dstPixels[p + 3])) * rbs;
        
        r_in_sum += pr;
        g_in_sum += pg;
        b_in_sum += pb;
        a_in_sum += pa;
        
        stack = stack.next;
      };
      
      stackIn = stackStart;
      stackOut = stackEnd;
      
      for (x = 0; x < this.srcWidth; x += 1) {
        this.dstPixels[yi]     = (r_sum * mul_sum) >> shg_sum;
        this.dstPixels[yi + 1] = (g_sum * mul_sum) >> shg_sum;
        this.dstPixels[yi + 2] = (b_sum * mul_sum) >> shg_sum;
        this.dstPixels[yi + 3] = (a_sum * mul_sum) >> shg_sum;
        
        r_sum -= r_out_sum;
        g_sum -= g_out_sum;
        b_sum -= b_out_sum;
        a_sum -= a_out_sum;
        
        r_out_sum -= stackIn.r;
        g_out_sum -= stackIn.g;
        b_out_sum -= stackIn.b;
        a_out_sum -= stackIn.a;
        
        p =  (yw + ((p = x + radius + 1) < widthMinus1 ? p : widthMinus1)) << 2;
        
        r_in_sum += (stackIn.r = this.dstPixels[p]);
        g_in_sum += (stackIn.g = this.dstPixels[p + 1]);
        b_in_sum += (stackIn.b = this.dstPixels[p + 2]);
        a_in_sum += (stackIn.a = this.dstPixels[p + 3]);
        
        r_sum += r_in_sum;
        g_sum += g_in_sum;
        b_sum += b_in_sum;
        a_sum += a_in_sum;
        
        stackIn = stackIn.next;
        
        r_out_sum += (pr = stackOut.r);
        g_out_sum += (pg = stackOut.g);
        b_out_sum += (pb = stackOut.b);
        a_out_sum += (pa = stackOut.a);
        
        r_in_sum -= pr;
        g_in_sum -= pg;
        b_in_sum -= pb;
        a_in_sum -= pa;
        
        stackOut = stackOut.next;

        yi += 4;
      };
      
      yw += this.srcWidth;
    };
        
    for (x = 0; x < this.srcWidth; x += 1) {
      g_in_sum = b_in_sum = a_in_sum = r_in_sum = g_sum = b_sum = a_sum = r_sum = 0;
      
      yi = x << 2;
      r_out_sum = radiusPlus1 * (pr = this.dstPixels[yi]);
      g_out_sum = radiusPlus1 * (pg = this.dstPixels[yi + 1]);
      b_out_sum = radiusPlus1 * (pb = this.dstPixels[yi + 2]);
      a_out_sum = radiusPlus1 * (pa = this.dstPixels[yi + 3]);
      
      r_sum += sumFactor * pr;
      g_sum += sumFactor * pg;
      b_sum += sumFactor * pb;
      a_sum += sumFactor * pa;
      
      stack = stackStart;
      
      for (i = 0; i < radiusPlus1; i += 1) {
        stack.r = pr;
        stack.g = pg;
        stack.b = pb;
        stack.a = pa;
        stack = stack.next;
      };
      
      yp = this.srcWidth;
      
      for (i = 1; i <= radius; i += 1) {
        yi = (yp + x) << 2;
        
        r_sum += (stack.r = (pr = this.dstPixels[yi])) * (rbs = radiusPlus1 - i);
        g_sum += (stack.g = (pg = this.dstPixels[yi + 1])) * rbs;
        b_sum += (stack.b = (pb = this.dstPixels[yi + 2])) * rbs;
        a_sum += (stack.a = (pa = this.dstPixels[yi + 3])) * rbs;
        
        r_in_sum += pr;
        g_in_sum += pg;
        b_in_sum += pb;
        a_in_sum += pa;
        
        stack = stack.next;
      
        if (i < heightMinus1) {
          yp += this.srcWidth;
        };
      };
      
      yi = x;
      stackIn = stackStart;
      stackOut = stackEnd;
      
      for (y = 0; y < this.srcHeight; y += 1) {
        p = yi << 2;
        this.dstPixels[p]     = (r_sum * mul_sum) >> shg_sum;
        this.dstPixels[p + 1] = (g_sum * mul_sum) >> shg_sum;
        this.dstPixels[p + 2] = (b_sum * mul_sum) >> shg_sum;
        this.dstPixels[p + 3] = (a_sum * mul_sum) >> shg_sum;
        
        r_sum -= r_out_sum;
        g_sum -= g_out_sum;
        b_sum -= b_out_sum;
        a_sum -= a_out_sum;
        
        r_out_sum -= stackIn.r;
        g_out_sum -= stackIn.g;
        b_out_sum -= stackIn.b;
        a_out_sum -= stackIn.a;
        
        p = (x + (((p = y + radiusPlus1) < heightMinus1 ? p : heightMinus1) * this.srcWidth)) << 2;
        
        r_sum += (r_in_sum += (stackIn.r = this.dstPixels[p]));
        g_sum += (g_in_sum += (stackIn.g = this.dstPixels[p + 1]));
        b_sum += (b_in_sum += (stackIn.b = this.dstPixels[p + 2]));
        a_sum += (a_in_sum += (stackIn.a = this.dstPixels[p + 3]));
        
        stackIn = stackIn.next;
        
        r_out_sum += (pr = stackOut.r);
        g_out_sum += (pg = stackOut.g);
        b_out_sum += (pb = stackOut.b);
        a_out_sum += (pa = stackOut.a);
        
        r_in_sum -= pr;
        g_in_sum -= pg;
        b_in_sum -= pb;
        a_in_sum -= pa;
        
        stackOut = stackOut.next;
        
        yi += this.srcWidth;
      };
    };

    this.filter = "StackBlur";
    return this.dstImageData;
  };

  /**
  * GIMP algorithm modified. pretty close to fireworks
  * @param brightness -100 <= n <= 100
  * @param contrast -100 <= n <= 100
  */
  public async BrightnessContrastGimp(brightness: number, contrast: number) {
    
    // fix to -1 <= n <= 1
    brightness /= 100;
    
    // fix to -99 <= n <= 99
    contrast *= 0.99;
    // fix to -1 < n < 1
    contrast /= 100;
    // apply GIMP formula
    contrast = Math.tan((contrast + 1) * (Math.PI / 4));

    // get the average color
    for (var avg = 0, i = 0; i < this.srcLength; i += 4) {
      avg += (this.srcPixels[i] * 19595 + this.srcPixels[i + 1] * 38470 + this.srcPixels[i + 2] * 7471) >> 16;
    };
    avg = avg / (this.srcLength / 4);

    this.mapRGB(this.srcPixels, this.dstPixels, function (value) {
      if (brightness < 0) {
        value = value * (1 + brightness);
      } else if (brightness > 0) {
        value = value + ((255 - value) * brightness);
      };
      //value += brightness;

      if (contrast !== 0) {
        value = (value - avg) * contrast + avg;
      };
      return value + 0.5 | 0;
    });

    this.filter = "BrightnessContrastGimp";
    return this.dstImageData;
  };

  /**
   * more like the new photoshop algorithm
   * @param brightness -100 <= n <= 100
   * @param contrast -100 <= n <= 100
   */
  public async BrightnessContrastPhotoshop(brightness: number, contrast: number) {
    // fix to 0 <= n <= 2;
    brightness = (brightness + 100) / 100;
    contrast = (contrast + 100) / 100;

    this.mapRGB(this.srcPixels, this.dstPixels, function (value) {
        value *= brightness;
        value = (value - 127.5) * contrast + 127.5;
        return value + 0.5 | 0;
    });

    this.filter = "BrightnessContrastPhotoshop";
    return this.dstImageData;
  };

  /**
   * @param channel enum ImageChannels { Red = 1, Green = 2, Bleu = 3 }
   */
  public async Channels(channel: ImageChannels) {
    let matrix = [];

    switch (channel) {
      case 2: { // green
        matrix = [
          0, 1, 0, 0, 0,
          0, 1, 0, 0, 0,
          0, 1, 0, 0, 0,
          0, 0, 0, 1, 0
        ];
        break;
      };
      case 3: { // blue
        matrix = [
          0, 0, 1, 0, 0,
          0, 0, 1, 0, 0,
          0, 0, 1, 0, 0,
          0, 0, 0, 1, 0
        ];
        break;
      };
      default: { // red
        matrix = [
          1, 0, 0, 0, 0,
          1, 0, 0, 0, 0,
          1, 0, 0, 0, 0,
          0, 0, 0, 1, 0
        ];
        break;
      };
    };

    this.filter = "Channels";
    return await this.ColorMatrixFilter(matrix);
  };

  /**
   * sets to the average of the highest and lowest contrast
   */
  public async Desaturate() {
    
    for (var i = 0; i < this.srcLength; i += 4) {
      const r = this.srcPixels[i],
      g = this.srcPixels[i + 1],
      b = this.srcPixels[i + 2],
      max = (r > g) ? (r > b) ? r : b : (g > b) ? g : b,
      min = (r < g) ? (r < b) ? r : b : (g < b) ? g : b,
      avg = ((max + min) / 2) + 0.5 | 0;

      this.dstPixels[i] = this.dstPixels[i + 1] = this.dstPixels[i + 2] = avg;
      this.dstPixels[i + 3] = this.srcPixels[i + 3];
    };

    this.filter = "Desaturate";
    return this.dstImageData;
  };

  /**
   * Floyd-Steinberg algorithm
   * @param levels 2 <= n <= 255
   */
  public async Dither(levels: number) {
    this.dstImageData = await this.Clone(this.dataDraft);
    levels = levels < 2 ? 2 : levels > 255 ? 255 : levels;

    // Build a color map using the same algorithm as the posterize filter.
    let posterize: any[],
    levelMap = [],
    levelsMinus1 = levels - 1,
    j = 0,
    k = 0,
    i: number;
    
    for (i = 0; i < levels; i += 1) {
      levelMap[i] = (255 * i) / levelsMinus1;
    };

    posterize = this.buildMap(function (value) {
      const ret = levelMap[j];

      k += levels;

      if (k > 255) {
        k -= 255;
        j += 1;
      }

      return ret;
    });

    // Apply the dithering algorithm to each pixel
    let x: number, y: number,
    index: number,
    old_r: number, old_g: number, old_b: number,
    new_r: number, new_g: number, new_b: number,
    err_r: number, err_g: number, err_b: number,
    nbr_r: number, nbr_g: number, nbr_b: number,
    srcWidthMinus1 = this.srcWidth - 1,
    srcHeightMinus1 = this.srcHeight - 1,
    A = 7 / 16,
    B = 3 / 16,
    C = 5 / 16,
    D = 1 / 16;
    
    for (y = 0; y < this.srcHeight; y += 1) {
      for (x = 0; x < this.srcWidth; x += 1) {
        // Get the current pixel.
        index = (y * this.srcWidth + x) << 2;
        
        old_r = this.dstPixels[index];
        old_g = this.dstPixels[index + 1];
        old_b = this.dstPixels[index + 2];
        
        // Quantize using the color map
        new_r = posterize[old_r];
        new_g = posterize[old_g];
        new_b = posterize[old_b];
        
        // Set the current pixel.
        this.dstPixels[index]     = new_r;
        this.dstPixels[index + 1] = new_g;
        this.dstPixels[index + 2] = new_b;
        
        // Quantization errors
        err_r = old_r - new_r;
        err_g = old_g - new_g;
        err_b = old_b - new_b;
          
        // Apply the matrix.
        // x + 1, y
        index += 1 << 2;
        if (x < srcWidthMinus1) {
          nbr_r = this.dstPixels[index]     + A * err_r;
          nbr_g = this.dstPixels[index + 1] + A * err_g;
          nbr_b = this.dstPixels[index + 2] + A * err_b;
          
          this.dstPixels[index]     = nbr_r > 255 ? 255 : nbr_r < 0 ? 0 : nbr_r | 0;
          this.dstPixels[index + 1] = nbr_g > 255 ? 255 : nbr_g < 0 ? 0 : nbr_g | 0;
          this.dstPixels[index + 2] = nbr_b > 255 ? 255 : nbr_b < 0 ? 0 : nbr_b | 0;
        };
        
        // x - 1, y + 1
        index += (this.srcWidth - 2) << 2;
        if (x > 0 && y < srcHeightMinus1) {
          nbr_r = this.dstPixels[index]     + B * err_r;
          nbr_g = this.dstPixels[index + 1] + B * err_g;
          nbr_b = this.dstPixels[index + 2] + B * err_b;
          
          this.dstPixels[index]     = nbr_r > 255 ? 255 : nbr_r < 0 ? 0 : nbr_r | 0;
          this.dstPixels[index + 1] = nbr_g > 255 ? 255 : nbr_g < 0 ? 0 : nbr_g | 0;
          this.dstPixels[index + 2] = nbr_b > 255 ? 255 : nbr_b < 0 ? 0 : nbr_b | 0;
        };
        
        // x, y + 1
        index += 1 << 2;
        if (y < srcHeightMinus1) {
          nbr_r = this.dstPixels[index]     + C * err_r;
          nbr_g = this.dstPixels[index + 1] + C * err_g;
          nbr_b = this.dstPixels[index + 2] + C * err_b;
          
          this.dstPixels[index]     = nbr_r > 255 ? 255 : nbr_r < 0 ? 0 : nbr_r | 0;
          this.dstPixels[index + 1] = nbr_g > 255 ? 255 : nbr_g < 0 ? 0 : nbr_g | 0;
          this.dstPixels[index + 2] = nbr_b > 255 ? 255 : nbr_b < 0 ? 0 : nbr_b | 0;
        };
        
        // x + 1, y + 1
        index += 1 << 2;
        if (x < srcWidthMinus1 && y < srcHeightMinus1) {
          nbr_r = this.dstPixels[index]     + D * err_r;
          nbr_g = this.dstPixels[index + 1] + D * err_g;
          nbr_b = this.dstPixels[index + 2] + D * err_b;
          
          this.dstPixels[index]     = nbr_r > 255 ? 255 : nbr_r < 0 ? 0 : nbr_r | 0;
          this.dstPixels[index + 1] = nbr_g > 255 ? 255 : nbr_g < 0 ? 0 : nbr_g | 0;
          this.dstPixels[index + 2] = nbr_b > 255 ? 255 : nbr_b < 0 ? 0 : nbr_b | 0;
        };
      };
    };
  
    this.filter = "Dither";
    return this.dstImageData;
  };

  public async Edge() {
    //pretty close to Fireworks 'Find Edges' effect

    this.filter = "Edge";
    return this.ConvolutionFilter(3, 3, [
      -1, -1, -1,
      -1,  8, -1,
      -1, -1, -1
    ]);
  };

  public async Emboss() {
    
    this.filter = "Emboss";
    return this.ConvolutionFilter(3, 3, [
      -2, -1, 0,
      -1,  1, 1,
      0,  1, 2
    ]);
  };

  public async Enrich() {

    this.filter = "Enrich";
    return this.ConvolutionFilter(3, 3, [
      0, -2,  0,
      -2, 20, -2,
      0, -2,  0
    ], 10, -40);
  };

  public async Flip(vertical: boolean) {
    let x: number, y: number, srcIndex: number, dstIndex: number;

    for (y = 0; y < this.srcHeight; y += 1) {
      for (x = 0; x < this.srcWidth; x += 1) {
        srcIndex = (y * this.srcWidth + x) << 2;
        if (vertical) {
          dstIndex = ((this.srcHeight - y - 1) * this.srcWidth + x) << 2;
        } else {
          dstIndex = (y * this.srcWidth + (this.srcWidth - x - 1)) << 2;
        };

        this.dstPixels[dstIndex]     = this.srcPixels[srcIndex];
        this.dstPixels[dstIndex + 1] = this.srcPixels[srcIndex + 1];
        this.dstPixels[dstIndex + 2] = this.srcPixels[srcIndex + 2];
        this.dstPixels[dstIndex + 3] = this.srcPixels[srcIndex + 3];
      };
    };

    this.filter = "Flip";
    return this.dstImageData;
  };

  /**
   * @param gamma 0 <= n <= 3 <= n
   */
  public async Gamma(gamma: number) {
    
    this.mapRGB(this.srcPixels, this.dstPixels, function (value) {
      value = (255 * Math.pow(value / 255, 1 / gamma) + 0.5);
      return value > 255 ? 255 : value + 0.5 | 0;
    });

    this.filter = "Gamma";
    return this.dstImageData;
  };

  public async GreyScale() {
    for (var i = 0; i < this.srcLength; i += 4) {
      var intensity = (this.srcPixels[i] * 19595 + this.srcPixels[i + 1] * 38470 + this.srcPixels[i + 2] * 7471) >> 16;
      //var intensity = (this.srcPixels[i] * 0.3086 + this.srcPixels[i + 1] * 0.6094 + this.srcPixels[i + 2] * 0.0820) | 0;
      this.dstPixels[i] = this.dstPixels[i + 1] = this.dstPixels[i + 2] = intensity;
      this.dstPixels[i + 3] = this.srcPixels[i + 3];
    };

    this.filter = "GreyScale";
    return this.dstImageData;
  };

  /**
   * @param hueDelta  -180 <= n <= 180
   * @param satDelta  -100 <= n <= 100
   * @param lightness -100 <= n <= 100
   */
  public async HSLAdjustment(hueDelta: number, satDelta: number, lightness: number) {

    hueDelta /= 360;
    satDelta /= 100;
    lightness /= 100;

    const rgbToHsl = this.rgbToHsl;
    const hslToRgb = this.hslToRgb;
    let h: number, s: number, l: number, hsl: any[], rgb: any[], i: number;

    for (i = 0; i < this.srcLength; i += 4) {
      // convert to HSL
      hsl = rgbToHsl(this.srcPixels[i], this.srcPixels[i + 1], this.srcPixels[i + 2]);

      // hue
      h = hsl[0] + hueDelta;
      while (h < 0) {
        h += 1;
      };
      while (h > 1) {
        h -= 1;
      };

      // saturation
      s = hsl[1] + hsl[1] * satDelta;
      if (s < 0) {
        s = 0;
      } else if (s > 1) {
        s = 1;
      };

      // lightness
      l = hsl[2];
      if (lightness > 0) {
        l += (1 - l) * lightness;
      }
      else if (lightness < 0) {
        l += l * lightness;
      };

      // convert back to rgb
      rgb = hslToRgb(h, s, l);

      this.dstPixels[i]     = rgb[0];
      this.dstPixels[i + 1] = rgb[1];
      this.dstPixels[i + 2] = rgb[2];
      this.dstPixels[i + 3] = this.srcPixels[i + 3];
    };

    this.filter = "HSLAdjustment";
    return this.dstImageData;
  };
  
  public async Invert() {

    this.mapRGB(this.srcPixels, this.dstPixels, function (value) {
      return 255 - value;
    });
  
    this.filter = "Invert";
    return this.dstImageData;
  };

  /**
   * @param blockSize  1 <= n <= 100
   */
  public async Mosaic(blockSize: number) {
    
    let cols = Math.ceil(this.srcWidth / blockSize),
    rows = Math.ceil(this.srcHeight / blockSize),
    row: number, col: number,
    x_start: number, x_end: number, y_start: number, y_end: number,
    x: number, y: number, yIndex: number, index: number, size: number,
    r: number, g: number, b: number, a: number;

    for (row = 0; row < rows; row += 1) {
      y_start = row * blockSize;
      y_end   = y_start + blockSize;
      
      if (y_end > this.srcHeight) {
        y_end = this.srcHeight;
      };
      
      for (col = 0; col < cols; col += 1) {
        x_start = col * blockSize;
        x_end   = x_start + blockSize;
          
        if (x_end > this.srcWidth) {
          x_end = this.srcWidth;
        };

        // get the average color from the src
        r = g = b = a = 0;
        size = (x_end - x_start) * (y_end - y_start);

        for (y = y_start; y < y_end; y += 1) {
          yIndex = y * this.srcWidth;
          
          for (x = x_start; x < x_end; x += 1) {
            index = (yIndex + x) << 2;
            r += this.srcPixels[index];
            g += this.srcPixels[index + 1];
            b += this.srcPixels[index + 2];
            a += this.srcPixels[index + 3];
          };
        };

        r = (r / size) + 0.5 | 0;
        g = (g / size) + 0.5 | 0;
        b = (b / size) + 0.5 | 0;
        a = (a / size) + 0.5 | 0;

        // fill the dst with that color
        for (y = y_start; y < y_end; y += 1) {
          yIndex = y * this.srcWidth;
          
          for (x = x_start; x < x_end; x += 1) {
            index = (yIndex + x) << 2;
            this.dstPixels[index]     = r;
            this.dstPixels[index + 1] = g;
            this.dstPixels[index + 2] = b;
            this.dstPixels[index + 3] = a;
          };
        };
      };
    };

    this.filter = "Mosaic";
    return this.dstImageData;
  };

  /**
   * @param range  1 <= n <= 5
   * @param levels 1 <= n <= 256
   */
  public async Oil(range: number, levels: number) {
    let index = 0,
    rh = [],
    gh = [],
    bh = [],
    rt = [],
    gt = [],
    bt = [],
    x: number, y: number, i: number, row: number, col: number,
    rowIndex: number, colIndex: number, offset: number, srcIndex: number,
    sr: number, sg: number, sb: number, ri: number, gi: number, bi: number,
    r: number, g: number, b: number;
    
    for (y = 0; y < this.srcHeight; y += 1) {
      for (x = 0; x < this.srcWidth; x += 1) {
        for (i = 0; i < levels; i += 1) {
          rh[i] = gh[i] = bh[i] = rt[i] = gt[i] = bt[i] = 0;
        };
        
        for (row = -range; row <= range; row += 1) {
          rowIndex = y + row;
          
          if (rowIndex < 0 || rowIndex >= this.srcHeight) {
            continue;
          }
          
          offset = rowIndex * this.srcWidth;
            
          for (col = -range; col <= range; col += 1) {
            colIndex = x + col;
            if (colIndex < 0 || colIndex >= this.srcWidth) {
              continue;
            };
              
            srcIndex = (offset + colIndex) << 2;
            sr = this.srcPixels[srcIndex];
            sg = this.srcPixels[srcIndex + 1];
            sb = this.srcPixels[srcIndex + 2];
            ri = (sr * levels) >> 8;
            gi = (sg * levels) >> 8;
            bi = (sb * levels) >> 8;
            rt[ri] += sr;
            gt[gi] += sg;
            bt[bi] += sb;
            rh[ri] += 1;
            gh[gi] += 1;
            bh[bi] += 1;
          };
        };

        r = g = b = 0;
        for (i = 1; i < levels; i += 1) {
          if(rh[i] > rh[r]) {
            r = i;
          };
          if(gh[i] > gh[g]) {
            g = i;
          };
          if(bh[i] > bh[b]) {
            b = i;
          };
        };

        this.dstPixels[index]     = rt[r] / rh[r] | 0;
        this.dstPixels[index + 1] = gt[g] / gh[g] | 0;
        this.dstPixels[index + 2] = bt[b] / bh[b] | 0;
        this.dstPixels[index + 3] = this.srcPixels[index + 3];
        index += 4;
      };
    };

    this.filter = "Oil";
    return this.dstImageData;
  };

  /**
   * @param levels 2 <= n <= 255
   */
  public async Posterize(levels: number) {
    levels = levels < 2 ? 2 : levels > 255 ? 255 : levels;

    let levelMap = [],
    levelsMinus1 = levels - 1,
    j = 0,
    k = 0,
    i: number;

    for (i = 0; i < levels; i += 1) {
      levelMap[i] = (255 * i) / levelsMinus1;
    };

    this.mapRGB(this.srcPixels, this.dstPixels, function (value) {
      const ret = levelMap[j];

      k += levels;

      if (k > 255) {
        k -= 255;
        j += 1;
      };

      return ret;
    });

    this.filter = "Posterize";
    return this.dstImageData;
  };

  public async Sepia() {

    let r: number, g: number, b: number, i: number, value: number;

    for (i = 0; i < this.srcLength; i += 4) {
      r = this.srcPixels[i];
      g = this.srcPixels[i + 1];
      b = this.srcPixels[i + 2];

      this.dstPixels[i]     = (value = r * 0.393 + g * 0.769 + b * 0.189) > 255 ? 255 : value < 0 ? 0 : value + 0.5 | 0;
      this.dstPixels[i + 1] = (value = r * 0.349 + g * 0.686 + b * 0.168) > 255 ? 255 : value < 0 ? 0 : value + 0.5 | 0;
      this.dstPixels[i + 2] = (value = r * 0.272 + g * 0.534 + b * 0.131) > 255 ? 255 : value < 0 ? 0 : value + 0.5 | 0;
      this.dstPixels[i + 3] = this.srcPixels[i + 3];
    };

    this.filter = "Sepia";
    return this.dstImageData;
  };

  /**
   * @param factor 1 <= n
   */
  public async Sharpen(factor: number) {
    //Convolution formula from VIGRA

    this.filter = "Sharpen";
    return this.ConvolutionFilter(3, 3, [
      -factor/16,     -factor/8,      -factor/16,
      -factor/8,       factor*0.75+1, -factor/8,
      -factor/16,     -factor/8,      -factor/16
    ]);
  };

  public async Solarize() {
    this.mapRGB(this.srcPixels, this.dstPixels, function (value) {
      return value > 127 ? (value - 127.5) * 2 : (127.5 - value) * 2;
    });

    this.filter = "Solarize";
    return this.dstImageData;
  };

  public async Transpose() {
    let srcIndex: number, dstIndex: number;
    
    for (let y = 0; y < this.srcHeight; y += 1) {
      for (let x = 0; x < this.srcWidth; x += 1) {
        srcIndex = (y * this.srcWidth + x) << 2;
        dstIndex = (x * this.srcHeight + y) << 2;

        this.dstPixels[dstIndex]     = this.srcPixels[srcIndex];
        this.dstPixels[dstIndex + 1] = this.srcPixels[srcIndex + 1];
        this.dstPixels[dstIndex + 2] = this.srcPixels[srcIndex + 2];
        this.dstPixels[dstIndex + 3] = this.srcPixels[srcIndex + 3];
      };
    };
    
    this.filter = "Transpose";
    return this.dstImageData;
  };

  /**
   * @param centerX 0.0 <= n <= 1.0
   * @param centerY 0.0 <= n <= 1.0
   * @param radius
   * @param angle(degree)
   * @param edge enum Edge { Clamp = 1, Wrap = 2, Transparent = 0 }
   * @param smooth
   */
  public async Twril(centerX: number, centerY: number, radius: number, angle: number, edge: Edge, smooth: boolean) {
    //convert position to px
    centerX = this.srcWidth  * centerX;
    centerY = this.srcHeight * centerY;

    // degree to radian
    angle *= (Math.PI / 180);

    let radius2 = radius * radius,
    max_y = this.srcHeight - 1,
    max_x = this.srcWidth - 1,
    dstIndex = 0,
    x: number, y: number, dx: number, dy: number, distance: number, a: number, tx: number, ty: number, srcIndex: number, pixel: any, i: any;

    for (y = 0; y < this.srcHeight; y += 1) {
      for (x = 0; x < this.srcWidth; x += 1) {
        dx = x - centerX;
        dy = y - centerY;
        distance = dx * dx + dy * dy;

        if (distance > radius2) {
          // out of the effected area. just copy the pixel
          this.dstPixels[dstIndex]     = this.srcPixels[dstIndex];
          this.dstPixels[dstIndex + 1] = this.srcPixels[dstIndex + 1];
          this.dstPixels[dstIndex + 2] = this.srcPixels[dstIndex + 2];
          this.dstPixels[dstIndex + 3] = this.srcPixels[dstIndex + 3];
        } else {
          // main formula
          distance = Math.sqrt(distance);
          a  = Math.atan2(dy, dx) + (angle * (radius - distance)) / radius;
          tx = centerX + distance * Math.cos(a);
          ty = centerY + distance * Math.sin(a);

          // copy target pixel
          if (smooth) {
            // bilinear
            this.copyBilinear(this.srcPixels, tx, ty, this.srcWidth, this.srcHeight, this.dstPixels, dstIndex, edge);
          } else {
            // nearest neighbor
            // round tx, ty
            
            srcIndex = ((ty + 0.5 | 0) * this.srcWidth + (tx + 0.5 | 0)) << 2;
            this.dstPixels[dstIndex]     = this.srcPixels[srcIndex];
            this.dstPixels[dstIndex + 1] = this.srcPixels[srcIndex + 1];
            this.dstPixels[dstIndex + 2] = this.srcPixels[srcIndex + 2];
            this.dstPixels[dstIndex + 3] = this.srcPixels[srcIndex + 3];
          };
        };
        
        dstIndex += 4;
      };
    };

    this.filter = "Twril";
    return this.dstImageData;
  };

  /**
   * Return the canvas after applying the effects
   */
  public getCanvas() {
    this.context.putImageData(this.dstImageData, 0, 0)
    console.log(`\x1b[34mFilter Apply: \x1b[33m${this.filter}\x1b[0m`)
    return this.context.canvas;
  };


  /**
   * Generated image from canvas
   * @param location Image Generation Path
   * @param name Image name
   * @param type Image extention
   */
  public generatedTo(location: string, name: string, type: ImageExtention): void {
    this.context.putImageData(this.dstImageData, 0,0)
    const canvas = <Canvas><unknown>this.context.canvas;

    return writeFileSync(`${location}/${name}.${type}`, canvas.toBuffer());
  };

  /**
   * Return canvas Buffer
   */
  public toBuffer(): Buffer {    
    this.context.putImageData(this.dstImageData, 0,0)
    const canvas = <Canvas><unknown>this.context.canvas;

    return canvas.toBuffer();
  };

  /**
   * Returns a base64 encoded string
   */
  public toDataURL() {
    return this.canvas.toDataURL();
  };
}
import { Canvas, CanvasRenderingContext2D, ImageData } from "canvas";
import { CanvasImage } from "..";
import NessBuilder from "./NessBuilder";

export default class FilterBuilder extends NessBuilder {
  protected declare context: CanvasRenderingContext2D
  private dataDraft: ImageData;
  private dstImageData: ImageData;
  private draft2D: CanvasRenderingContext2D;

  private srcPixels: Uint8ClampedArray;
  private srcWidth: number;
  private srcHeight: number;
  private srcLength: number;
  private dstPixels: Uint8ClampedArray;
  private tmpImageData: ImageData;
  private tmpPixels: Uint8ClampedArray;

  constructor(image: CanvasImage) {

    super(<number>image.width, <number>image.height);
    
    const draft = new Canvas(<number>image.width, <number>image.height);
    this.draft2D = draft.getContext("2d");

    this.draft2D.drawImage(image, 0, 0, image.width, image.height);

    this.dataDraft = this.draft2D.getImageData(0, 0, draft.width, draft.height);
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

  private getPixelIndex(x: number, y: number, width: number, height: number, edge: any) {
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

  private getPixel(path: number[], x: number, y: number, width: number, height: number, edge: any) {
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

  private copyBilinear(path: number[], x: number, y: number, width: number, height: number, dst: { [x: string]: number; }, dstIndex: number, edge: any) {
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

  
  private async ConvolutionFilter(matrixX: number, matrixY: number, matrix: any[], divisor: number, bias: number, preserveAlpha: boolean, clamp?: boolean, color?: number, alpha?: number) {

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

  private async Copy(srcImageData: ImageData, dstImageData) {
    let srcPixels = srcImageData.data, srcLength = srcPixels.length, dstPixels = dstImageData.data;

    while (srcLength--) {
      dstPixels[srcLength] = srcPixels[srcLength];
    };

    return dstImageData;
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

      let r, g, b, a;
      
      let srcIndex = 0,
      dstIndex,
      p, next, prev,
      i, l, x, y,
      nextIndex, prevIndex;

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

    return  this.dstImageData;
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

    let x, y, i, p, yp, yi, yw,
    r_sum, g_sum, b_sum, a_sum, 
    r_out_sum, g_out_sum, b_out_sum, a_out_sum,
    r_in_sum, g_in_sum, b_in_sum, a_in_sum, 
    pr, pg, pb, pa, rbs,
    div = radius + radius + 1,
    w4 = this.srcWidth << 2,
    widthMinus1  = this.srcWidth - 1,
    heightMinus1 = this.srcHeight - 1,
    radiusPlus1  = radius + 1,
    sumFactor = radiusPlus1 * ( radiusPlus1 + 1 ) / 2,
    stackStart = new BlurStack(),
    stack = stackStart,
    stackIn, stackOut, stackEnd,
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

    return this.dstImageData;
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

    return await this.ConvolutionFilter(size, size, matrix, divisor, 0, false);
  };

  public async Invert() {

    this.mapRGB(this.srcPixels, this.dstPixels, function (value) {
      return 255 - value;
    });
  
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

    return this.dstImageData;
  };

  public getCanvas() {
    console.log(this.dstImageData)
    this.draft2D.putImageData(this.dstImageData, 0, 0)
    return this.draft2D.canvas;
  }
}







// this.setImage(image, { sx: 0, sy: 0, sWidht: this.canvas.width, sHeight: this.canvas.height })
// const ImageData = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height)

 
// // function createImageData (w, h) {
// //   return this.context.createImageData(w, h);
// // }

// function mapRGB(src, dst, func) {
//   applyMap(src, dst, buildMap(func));
// }

// function applyMap(src, dst, map) {
//   for (var i = 0, l = src.length; i < l; i += 4) {
//     dst[i]     = map[src[i]];
//     dst[i + 1] = map[src[i + 1]];
//     dst[i + 2] = map[src[i + 2]];
//     dst[i + 3] = src[i + 3];
//   }
// }

// function buildMap(f) {
//   for (var m = [], k = 0, v; k < 256; k += 1) {
//       m[k] = (v = f(k)) > 255 ? 255 : v < 0 ? 0 : v | 0;
//   }
//   return m;
// }


// const srcPixels    = ImageData.data,
// srcWidth     = ImageData.width,
// srcHeight    = ImageData.height,
// srcLength    = srcPixels.length,
// dstImageData = this.context.createImageData(srcWidth, srcHeight),
// dstPixels    = dstImageData.data;

// mapRGB(srcPixels, dstPixels, function (value) {
//   return 255 - value;
// });

// this.context.putImageData(dstImageData, 0, 0);

// // this.utils.mapRGB(srcPixels, dstPixels, function (value) {
//   // return 255 - value;
// // });
// // // // // // // // // // // // // // // // //  

// // this.setImage(image, { sx: 0, sy: 0, sWidht: this.canvas.width, sHeight: this.canvas.height })

// return this;
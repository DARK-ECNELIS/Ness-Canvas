import getPixels = require("get-pixels");
import { Initializer, MultiRange } from "multi-integer-range";
import savePixels = require("save-pixels");


// Originally from gif-frames (https://github.com/benwiley4000/gif-frames)
// Copyright (c) 2017 Ben Wiley

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

/**
 * 
 * @param options.quality 1-100
 * @param callback
 */
function gifFrames (options: {url: string, frames: Initializer, cumulative: any, outputType: "jpeg" | "jpg", quality: number}): Promise<any> {
  
  var reject: (err: any) => void;
  var resolve: (res: unknown) => void;
  var promise: Promise<any>;
  const callback = function (arg0: any, arg1?: any) {}

  promise = new Promise(function (_resolve, _reject) {
    resolve = function(res: unknown) {
      callback(null, res);
      _resolve(res);
    };
    reject = function(err: any) {
      callback(err);
      _reject(err);
    };
  });

  if (!options.url) {
    new Error('"url" option is required.');
    return promise;
  };
  if (!options.frames && options.frames !== 0) {
    new Error('"frames" option is required.');
    return promise;
  };

  const acceptedFrames = options.frames === 'all' ? 'all' : new MultiRange(options.frames);

  getPixels(options.url, function(err, pixels) {
    if (err) {
      reject(err);
      return;
    };
    if (pixels.shape.length < 4) {
      reject(new Error('"url" input should be multi-frame GIF.'));
      return;
    };

    const frameData = [];let maxAccumulatedFrame = 0;

    for (let i = 0; i < pixels.shape[0]; i++) {
      if (acceptedFrames !== 'all' && ! acceptedFrames.has(i)) {
        continue;
      };
      (function (frameIndex) {
        frameData.push({
          getImage: function() {
            if (options.cumulative && frameIndex > maxAccumulatedFrame) {
              let lastFrame = pixels.pick(maxAccumulatedFrame);

              for (var f = maxAccumulatedFrame + 1; f <= frameIndex; f++) {
                var frame = pixels.pick(f);

                for (var x = 0; x < frame.shape[0]; x++) {
                  for (var y = 0; y < frame.shape[1]; y++) {
                    if (frame.get(x, y, 3) === 0) {
                      // if alpha is fully transparent, use the pixel
                      // from the last frame
                      frame.set(x, y, 0, lastFrame.get(x, y, 0));
                      frame.set(x, y, 1, lastFrame.get(x, y, 1));
                      frame.set(x, y, 2, lastFrame.get(x, y, 2));
                      frame.set(x, y, 3, lastFrame.get(x, y, 3));
                    }
                  }
                }
                lastFrame = frame;
              }
              maxAccumulatedFrame = frameIndex;
            };
            return savePixels(pixels.pick(frameIndex), options.outputType, {
              quality: options.quality
            });
          },
          frameIndex: frameIndex
        });
      })(i);
    };
    resolve(frameData);
  });
  
  return promise;
}

export { gifFrames }
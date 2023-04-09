import { Bitmap } from 'node-bitmap'
import { readFile } from 'fs'
import { lookup } from 'mime-types'
import ndarray from 'ndarray';
import jpeg from 'jpeg-js'
import parseDataURI = require('parse-data-uri')
import pack from 'ndarray-pack';

const PNG = require('pngjs').PNG
const GifReader = require('omggif').GifReader

function handlePNG(data: any, cb: (arg0: any, arg1?: ndarray.NdArray<Uint8Array>) => void) {
  const png = new PNG();
  png.parse(data, function (err: any, img_data: { data: Iterable<number>; width: number; height: number; }) {
    if (err) {
      cb(err)
      return
    }
    cb(null, ndarray(new Uint8Array(img_data.data),
      [img_data.width | 0, img_data.height | 0, 4],
      [4, 4 * img_data.width | 0, 1],
      0))
  })
}

function handleJPEG(data: jpeg.BufferLike, cb: (arg0: Error, arg1?: ndarray.NdArray<any>) => void) {
  let jpegData: jpeg.BufferRet & { comments?: string[]; }
  try {
    jpegData = jpeg.decode(data)
  }
  catch (e) {
    cb(e)
    return
  }
  if (!jpegData) {
    cb(new Error("Error decoding jpeg"))
    return
  }
  const nshape = [jpegData.height, jpegData.width, 4]
  const result = ndarray(jpegData.data, nshape)
  cb(null, result.transpose(1, 0))
}

function handleGIF(data: any, cb: (arg0: any, arg1?: ndarray.NdArray<Uint8Array>) => void) {
  let reader: { numFrames: () => number; height: any; width: any; decodeAndBlitFrameRGBA: (arg0: number, arg1: Uint8Array) => void; }
  try {
    reader = new GifReader(data)
  } catch (err) {
    cb(err)
    return
  }
  if (reader.numFrames() > 0) {
    let ndata: Uint8Array
    const nshape = [reader.numFrames(), reader.height, reader.width, 4]
    try {
      ndata = new Uint8Array(nshape[0] * nshape[1] * nshape[2] * nshape[3])
    } catch (err) {
      cb(err)
      return
    }
    const result = ndarray(ndata, nshape)
    try {
      for (let i = 0; i < reader.numFrames(); ++i) {
        reader.decodeAndBlitFrameRGBA(i, ndata.subarray(
          result.index(i, 0, 0, 0),
          result.index(i + 1, 0, 0, 0)))
      }
    } catch (err) {
      cb(err)
      return
    }
    cb(null, result.transpose(0, 2, 1))
  } else {
    const nshape = [reader.height, reader.width, 4]
    const ndata = new Uint8Array(nshape[0] * nshape[1] * nshape[2])
    const result = ndarray(ndata, nshape)
    try {
      reader.decodeAndBlitFrameRGBA(0, ndata)
    } catch (err) {
      cb(err)
      return
    }
    cb(null, result.transpose(1, 0))
  }
}

function handleBMP(data: any, cb: (arg0: any, arg1?: ndarray.NdArray<Uint8Array>) => void) {
  const bmp = new Bitmap(data)
  try {
    bmp.init()
  } catch (e) {
    cb(e)
    return
  }
  const bmpData = bmp.getData()
  const nshape = [bmpData.getHeight(), bmpData.getWidth(), 4]
  const ndata = new Uint8Array(nshape[0] * nshape[1] * nshape[2])
  const result = ndarray(ndata, nshape)
  pack(bmpData, result)
  cb(null, result.transpose(1, 0))
}


function doParse(mimeType: string, data: jpeg.BufferLike, cb: (arg0: any, arg1?: ndarray.NdArray<Uint8Array>) => void) {
  switch (mimeType) {
    case 'image/png':
      handlePNG(data, cb)
      break

    case 'image/jpg':
    case 'image/jpeg':
      handleJPEG(data, cb)
      break

    case 'image/gif':
      handleGIF(data, cb)
      break

    case 'image/bmp':
      handleBMP(data, cb)
      break

    default:
      cb(new Error("Unsupported file type: " + mimeType))
  }
}

export function getPixels(url: string, type: any, cb?: (arg0: Error) => void) {
  if (!cb) {
    cb = <any>type
    type = ''
  }
  if (Buffer.isBuffer(url)) {
    if (!type) {
      cb(new Error('Invalid file type'))
      return
    }
    doParse(type, url, cb)
  } else if (url.indexOf('data:') === 0) {
    try {
      const buffer = parseDataURI(url)
      if (buffer) {
        process.nextTick(function () {
          doParse(type || buffer.mimeType, buffer.data, cb)
        })
      } else {
        process.nextTick(function () {
          cb(new Error('Error parsing data URI'))
        })
      }
    } catch (err) {
      process.nextTick(function () {
        cb(err)
      })
    }
  } else if (url.indexOf('http://') === 0 || url.indexOf('https://') === 0) {
    const fetch = require('node-fetch');

    fetch(url)
      .then((res: { ok: any; headers: { get: (arg0: string) => any; }; buffer: () => Promise<any>; }) => {
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        const contentType = res.headers.get('content-type');
        return res.buffer().then((body: any) => ({ contentType, body }));
      })
      .then(({ contentType, body }) => {
        if (!contentType) {
          throw new Error('Invalid content-type');
        }
        doParse(contentType, body, cb);
      })
      .catch((err: any) => {
        console.error(err);
      });
  } else {
    readFile(url, function (err, data) {
      if (err) {
        cb(err)
        return
      }
      type = type || <string>lookup( url)
      if (!type) {
        cb(new Error('Invalid file type'))
        return
      }
      doParse(type, data, cb)
    })
  }
}

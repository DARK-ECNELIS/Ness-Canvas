import { loadImage } from "canvas";
import { gifFrames } from "../gif-frames-update/gif-frames";

export async function gifExtractor(gif: `${string}.gif`) {
    
    // I used gifFrames to get the image buffer array
    const imageBufferArray = await gifFrames({
        url: gif, frames: "all", cumulative: true,
        outputType: "jpg",
        quality: 100
    });

    const data = imageBufferArray.map(data => data.getImage()._obj);
    const image = await loadImage(data[0]);
    
    console.log(`\x1b[34mGif extractor: \x1b[33m${data.length} Image[${image.height}x${image.width}] \x1b[32mComplete\x1b[0m`);
    return { data, image };
}
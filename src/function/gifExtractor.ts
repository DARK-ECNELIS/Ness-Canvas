import { Image, loadImage } from "canvas";
import { gifFrames } from "./gifFrames";

export async function gifExtractor(gif: `${string}.gif`) {
    
    // I used gifFrames to get the image buffer array
    const imageBufferArray = await gifFrames({
        url: gif, frames: "all", cumulative: true,
        outputType: "jpg",
        quality: 100
    });

    const promises = imageBufferArray.map(async data => loadImage(data.getImage()._obj));
    const data: Array<Image> = await Promise.all(promises);

    console.log(`\x1b[34mGif extractor: \x1b[33m${data.length} Image[${(await data[0]).height}x${(await data[0]).width}] \x1b[32mComplete\x1b[0m`);
    return data;
}
/// <reference types="node" />
import { Canvas } from "canvas";
import { CanvasImage, CustomColor, Shape } from "../../typings";
import { ImagelocationOption, DrawlocationOption, FramelocationOption, FrameSizeOption, ExpLocationOption, ExpSizeOption, FrameOption, TextOption } from "../../typings/Interface";
export default class NessBuilder {
    protected canvas: Canvas;
    private context;
    private canvasSize;
    private frameCoordinate;
    private frameTextCoordinate;
    constructor(width: number, height: number);
    /**
     * New Canvas Dimension
     *
     * @param width x-dimension in pixels
     * @param height y-dimension in pixels
     */
    private setCanvas;
    /**
     * canvas outline radius
     *
     * @param radius The radius to set
     */
    setCornerRadius(radius: number): this;
    /**
     * Sets the canvas background.
     * @param image The image to set (no link, use loadImage() from canvas)
     */
    setBackground(image: CanvasImage): this;
    /**
     * Draw an image to S coordinates with D dimensions
     *
     * @param image The image to set (no link, use loadImage() from canvas)
     */
    draw(image: CanvasImage, imageOption: ImagelocationOption, locationOption?: DrawlocationOption): this;
    /**
     * Sets a predefined frame
     *
     * @param typeShape Frame format
     * @param coordinate Coordinate X and Y from upper left corner of the frame
     * @param size Frame size
     * @param options Frame configuration
     */
    setFrame(typeShape: Shape, coordinate: FramelocationOption, size: FrameSizeOption, options?: FrameOption): this;
    private setFrameBackground;
    /**
     * Set text to canvas
     *
     * @param text Text to write
     * @param option Text option
     * @param coordinate Text location
     */
    setText(text: string, option: TextOption, coordinate: {
        x: number;
        y: number;
    }): this;
    /**
     * Set new font
     *
     * @param path Path to font file (file.ttf)
     * @param option Font settings
     */
    private setFont;
    private restore;
    /**
     * Set progress bar
     *
     * @param location Coordinate to set ExpBar
     * @param size Size of the first progression bar
     * @param radius Radius to set
     * @param cloneWidth Size of the second progression bar
     * @param color Couleur du cadre (un dégrader peut être appliquer avec <[createRadialGradient | createLinearGradient] du module canvas)
     */
    setExp(location: ExpLocationOption, size: ExpSizeOption, radius: number, cloneWidth: number, color?: CustomColor): this;
    /**
     * For image canvases, encodes the canvas as a PNG.
     */
    protected toBuffer(): Buffer;
    /**
     * Transforms the embed to a plain object
     *
     * @param location Image Generation Path
     * @param name Image name
     * @param type Image Type
     */
    generatedTo(location: string, name: string, type: "PNG"): void;
}
//# sourceMappingURL=NessBuilder.d.ts.map
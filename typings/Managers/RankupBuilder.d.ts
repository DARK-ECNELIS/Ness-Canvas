import { Image } from "canvas";
import { CanvasImage, Preset, Shape } from "../../typings";
import NessBuilder from "./NessBuilder";
export default class RankupBuilder extends NessBuilder {
    private preset;
    private avatar;
    constructor(presetType: Preset, Background: Image, avatar: CanvasImage, shape: Shape);
    private init;
    generatedTo(location: string, name: string, type: "PNG"): void;
}
//# sourceMappingURL=RankupBuilder.d.ts.map
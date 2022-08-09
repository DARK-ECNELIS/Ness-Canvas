import { CanvasImage, Preset, Shape } from "../../typings";
import NessBuilder from "./NessBuilder";
export default class CustomProfile extends NessBuilder {
    private preset;
    private avatar;
    constructor(presetType: Preset, background: CanvasImage, avatar: CanvasImage, shape: Shape);
    private init;
    generatedTo(location: string, name: string, type: "PNG"): void;
}
//# sourceMappingURL=CustomProfile.d.ts.map
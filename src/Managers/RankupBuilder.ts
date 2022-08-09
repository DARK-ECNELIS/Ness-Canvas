import { Image } from "canvas";
import { writeFileSync } from "fs";
import { CanvasImage, Preset, Shape } from "../../typings";
import NessBuilder from "./NessBuilder";

export default class RankupBuilder extends NessBuilder {

  private preset = {
    classic: {cornerRadius: 15}
  }

  private avatar = {
    Square: {
      x: 15, y: 15,
      w: 100, h: 100,
      radius: 15,
    }
  }

  constructor(presetType: Preset, Background: Image, avatar: CanvasImage, shape: Shape) {
    if (presetType == 'classic') {
      super(740, 128)
    } else {
      super(0, 0)
    }

    this.init(Background, this.preset[presetType].cornerRadius, avatar, shape)
  };

  private init(background: CanvasImage, radius: number, avatar: CanvasImage, shape: Shape) {
    this.setCornerRadius(radius);
    this.setBackground(background);
    this.setFrame(shape, {x: this.avatar[shape].x, y: this.avatar[shape].y}, {widht: this.avatar[shape].w, height: this.avatar[shape].h}, this.avatar[shape].radius, avatar, {lineWidth: 3});
    
    return this;
  };

  // this.generatedTo("asset/test/test.png");
  public generatedTo(location: string, name: string, type: "PNG"): void {
    writeFileSync(`${location}/${name}.${type}`, this.toBuffer());
  };
}
import { Image } from "canvas";
import { writeFileSync } from "fs";
import type { CanvasImage, Preset, Shape } from "..";
import NessBuilder from "../Managers/NessBuilder";

export default class RankupBuilder extends NessBuilder {

  private preset = {
    classic: {cornerRadius: 15}
  }

  private avatar = {
    Square: {
      x: 15, y: 15,
      w: 100, h: 100,
      radius: 15,
    },
    Octogon: {
      x: 15, y: 15,
      w: 115, h: 115,
      radius: 5,
    }
  }

  constructor(presetType: Preset, Background: Image, avatar: CanvasImage | number, shape: Shape) {
    if (presetType == 'classic') {
      super(740, 128)
    } else {
      super(0, 0)
    }

    this.init(Background, this.preset[presetType].cornerRadius, avatar, shape)
  };

  private init(background: CanvasImage, radius: number, avatar: CanvasImage | number, shape: Shape) {
    this.setCornerRadius(radius);
    this.setBackground(background);
    this.setFrame(shape, {x: this.avatar[shape].x, y: this.avatar[shape].y}, {width: this.avatar[shape].w, height: this.avatar[shape].h}, { radPik: this.avatar[shape].radius, content: { imageOrText: avatar }, outline: { color: "#FF0000", lineWidth: 3 }});
    
    return this;
  };

  // this.generatedTo("asset/test/test.png");
  public generatedTo(location: string, name: string, type: "png"): void {
    writeFileSync(`${location}/${name}.${type}`, this.toBuffer());
  };
}
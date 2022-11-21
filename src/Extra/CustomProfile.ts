import { writeFileSync } from "fs";
import type { CanvasImage, Preset, Shape } from "..";
import NessBuilder from "../Managers/NessBuilder";

export default class CustomProfile extends NessBuilder {

  private preset = {
    classic: {cornerRadius: 30}
  }

  private avatar = {
    Square: {
      x: 25, y: 25,
      w: 150, h: 150,
      radius: 15,
    },
    Octogon: {
      x: 25, y: 25,
      w: 175, h: 175,
      radius: 5,
    }
  }

  constructor(presetType: Preset, background: CanvasImage, avatar: CanvasImage, shape: Shape) {
    if (presetType == 'classic') {
      super(700, 250);
    } else {
      super(0, 0)
    }
    
    this.init(background, this.preset[presetType].cornerRadius, avatar, shape)
  };

  private init(background: CanvasImage, radius: number, avatar: CanvasImage, shape: Shape)  {
    this.setCornerRadius(radius);
    this.setBackground(background);
    this.setFrame(shape, {x: this.avatar[shape].x, y: this.avatar[shape].y}, {width: this.avatar[shape].w, height: this.avatar[shape].h}, {radPik: this.avatar[shape].radius, content: {imageOrText: avatar }, outline: { color: "#FF0000", lineWidth: 8 }});
    this.setExp(false, {x: 45, y: 200}, {width: 655, height: 30}, 20, 65);
    
    return this;
  };

  // this.generatedTo("asset/test/test.png");
  public generatedTo(location: string, name: string, type: "png"): void {
    writeFileSync(`${location}/${name}.${type}`, this.toBuffer());
  };

}
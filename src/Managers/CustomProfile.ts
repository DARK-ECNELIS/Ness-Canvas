import { writeFileSync } from "fs";
import { CanvasImage, Preset, Shape } from "../../typings";
import NessBuilder from "./NessBuilder";

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
    this.setFrame(shape, {x: this.avatar[shape].x, y: this.avatar[shape].y}, {widht: this.avatar[shape].w, height: this.avatar[shape].h}, this.avatar[shape].radius, avatar, {lineWidth: 8});
    this.setExp({x: 45, y: 200}, {width: 655, height: 30}, 20, 65);
    
    return this;
  };

  // this.generatedTo("asset/test/test.png");
  public generatedTo(location: string, name: string, type: "PNG"): void {
    writeFileSync(`${location}/${name}.${type}`, this.toBuffer());
  };

}
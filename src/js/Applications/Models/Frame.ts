import {Model} from "chomex";
import Const from "../../Constants";

export default class Frame extends Model {

  static __ns = "Frame";

  static default = {
    user: {
      addressbar: false,
      alias: "MEMORY",
      description: "前回選択サイズ",
      id: "user",
      muted: false,
      position: {left: 40, top: 40},
      size: { width: Const.GameWidth * (2 / 3), height: Const.GameHeight * (2 / 3) },
      url: Const.KanColleURL,
      zoom: 2 / 3,
    },
    classic: {
      addressbar: false,
      alias: "CLASSIC",
      description: "1期の大きさ",
      id: "classic",
      muted: false,
      position: {left: 40, top: 40},
      size: { width: Const.GameWidth * (2 / 3), height: Const.GameHeight * (2 / 3) },
      url: Const.KanColleURL,
      zoom: 2 / 3,
    },
    original: {
      addressbar: false,
      alias: "ORIGINAL",
      description: "公式の大きさ",
      id: "original",
      muted: false,
      position: {left: 40, top: 40},
      size: {width: Const.GameWidth, height: Const.GameHeight},
      url: Const.KanColleURL,
      zoom: 1,
    },
    small: {
      addressbar: false,
      alias: "SMALL",
      description: "公式の半分",
      id: "small",
      muted: false,
      position: { left: 40, top: 40 },
      protected: true,
      size: { width: Const.GameWidth * (1 / 2), height: Const.GameHeight * (1 / 2) },
      url: Const.KanColleURL,
      zoom: 1 / 2,
    },
    mini: {
      addressbar: false,
      alias: "MINI",
      description: "公式の1/4",
      id: "mini",
      muted: false,
      position: { left: 40, top: 40 },
      protected: true,
      size: { width: Const.GameWidth * (1 / 4), height: Const.GameHeight * (1 / 4) },
      url: Const.KanColleURL,
      zoom: 1 / 4,
    }
  };

  /**
   * 直近、選択された窓を返す
   */
  static latest(): Frame {
    const user = this.find<Frame>("user");
    if (user) return user;
    return this.new(this.default.user);
  }

  id: string;
  alias: string;
  description: string;

  zoom: number;
  muted: boolean;

  private addressbar: boolean;
  private url: string;
  position: {
    left: number;
    top: number;
  };
  size: {
    width: number;
    height: number;
  };

  createData(): chrome.windows.CreateData {
    return {
      type: this.addressbar ? "normal" : "popup",
      url: this.url || Const.KanColleURL,
      ...this.size,
      ...this.position,
    };
  }
}

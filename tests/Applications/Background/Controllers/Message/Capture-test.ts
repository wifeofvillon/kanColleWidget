// import "canvas";
import {Screenshot} from "../../../../../src/js/Applications/Background/Controllers/Message/Capture";
import {when} from "../../../../tools";

describe("CaptureControllers", () => {
  describe("ScreenshotController", () => {
    when(chrome.tabs.query).callbacks([{}]);
    when(chrome.tabs.captureVisibleTab).callbacks("data:image/png;base64,xxx");
    Object.defineProperty(HTMLImageElement.prototype, "src", { set(src) { this.onload(); }, get() { return; } });
    it("TODO: なんかアサーションする", async () => {
      const res = await Screenshot();
      expect(res.status).toBe(202);
    });
  });
});

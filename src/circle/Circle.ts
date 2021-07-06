import { gsap } from "gsap";
import Cursor from '../Cursor';

interface LooseObject {
  [key: string]: any
}

class Circle extends Cursor {
  options: LooseObject;
  iconWrapper: HTMLDivElement;

  // Normal signature with defaults
  constructor(options: LooseObject) {
    super(options);

    this.options = options;

    this.init();
  }

  init() {
    this.iconWrapper = document.createElement("div");
    this.iconWrapper.style.background = "#ff1a16";
    this.iconWrapper.style.width = `${this.options.size}px`;
    this.iconWrapper.style.height = `${this.options.size}px`;
    this.iconWrapper.style.borderRadius = '50%';

    this.addCursorToBody(this.iconWrapper);
    this.calculate();

  }

  /**
     * Runs on requestAnimationFrame to execute calculations on current mouse position and
     * updates the cursor position and styling.
     */
   calculate() {
    let self = this;
    this.calculateEngine(function (velocity: any, theta: number, x: number, y: number) {
      self.render();
    });
  } 

   /**
   * Update the styling for cursor based on recalculated data
   */
  render() {
    let rotateStyle = {
      pointerEvents: "none",
      zIndex: "1000",
      display: this.state.hide ? "none" : "inline-block",
      position: "absolute",
      width: this.options.size + "px",
      height: this.options.size + "px",
      left: this.state.x + "px",
      top: this.state.y + "px",
  };
    Object.assign(this.rotateWrapper.style, rotateStyle);
  }

}

  export { Circle };
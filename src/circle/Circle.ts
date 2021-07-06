import { gsap } from "gsap";
import Cursor from '../Cursor';

interface LooseObject {
  [key: string]: any
}

class Circle extends Cursor {
  options: LooseObject;
  scaleData: LooseObject;
  bigAnimateData: LooseObject;
  iconWrapper: HTMLDivElement;
  bigWrapper: HTMLDivElement;

  // Normal signature with defaults
  constructor(options: LooseObject) {
    super(options);

    this.options = options;

     /**
     * Animation data to be mutated by tweening engine
     */
      this.bigAnimateData = {
        x: 0,
        y: 0
      }

      /**
     * Controls the cursor scale
     */
    this.scaleData = {
      v: 1
    }

      
    this.init();
  }

  init() {
    this.iconWrapper = document.createElement("div");
    this.iconWrapper.style.background = "#ff1a16";
    this.iconWrapper.style.width = `${this.options.size-30}px`;
    this.iconWrapper.style.height = `${this.options.size-30}px`;
    this.iconWrapper.style.borderRadius = '50%';
    document.body.appendChild(this.iconWrapper);


    this.bigWrapper = document.createElement("div");
    this.bigWrapper.style.background = "#ff1a16";
    this.bigWrapper.style.width = `${this.options.size}px`;
    this.bigWrapper.style.height = `${this.options.size}px`;
    this.bigWrapper.style.borderRadius = '50%';
    
    this.addCursorToBody(this.bigWrapper);
    this.calculate();
  }


  /**
     * Runs on requestAnimationFrame to execute calculations on current mouse position and
     * updates the cursor position and styling.
     */
   calculate() {
    let self = this;
    this.calculateEngine(function (velocity: any, theta: number, x: number, y: number) {
      self.calculateSkew(velocity);
      self.render();
    });
  } 

  /**
   * Determine skew effect by manipulating scale based on the mouse velocity
   * 
   * @param {object} velocity Contains speed and change on the x and y-axis
   */
   calculateSkew(velocity: any) {
    this.scaleData = {
        v: 1 + (Math.abs(velocity.v) * 0.8),
    }
  }

   /**
   * Update the styling for cursor based on recalculated data
   */
  render() {
    let bigStyle = {
      pointerEvents: "none",
      zIndex: "1000",
      display: this.state.hide ? "none" : "inline-block",
      position: "absolute",
      width: this.options.size + "px",
      height: this.options.size + "px",
      left: this.state.x + "px",
      top: this.state.y + "px",
      transform: "rotate(" + this.state.theta + "deg)"
  };

  let scaleStyle = {
    display: "inline-block",
    position: "absolute",
    height: "100%",
    width: "100%",
    transform: "scale3d(" + this.scaleData.v + ",1,1)"
};

  let iconStyle = {
    pointerEvents: "none",
    zIndex: "1000",
    position: "absolute",
    left: this.state.rawX - (10 / 2) + "px",
    top: this.state.rawY - (10 / 2) + "px",
    transform: "translate3d(0,0,0)"
};
    Object.assign(this.rotateWrapper.style, bigStyle);
    Object.assign(this.scaleWrapper.style, scaleStyle);
    Object.assign(this.iconWrapper.style, iconStyle);
  }

}

  export { Circle };
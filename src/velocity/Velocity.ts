import { gsap } from "gsap";
import Cursor from '../Cursor';
import cursor from './cursor.png';

interface LooseObject {
  [key: string]: any
}

class Velocity extends Cursor {
  options: LooseObject;
  scaleData: LooseObject;
  innerRotation: any;
  animationComplete: boolean;
  mouseCalculateTime: number;
  iconWrapper: HTMLDivElement;
  icon: HTMLImageElement;

  // Normal signature with defaults
  constructor(options: LooseObject) {
    super(options);

    this.options = options;

    /**
     * Controls the cursor scale
     */
    this.scaleData = {
        x: 1,
        y: 1
    }

    /**
     * Rotation of the inner container
     */
    this.innerRotation = {
        rotate: 0
    };
  
    this.init();
  }

  /**
     * Setyp the stage by adding cursor markup and initial positions. 
     * Add event listeners for the mouse then begin recursive calculations.
     */
   init() {
    this.iconWrapper = document.createElement("div");
    this.icon = document.createElement("img");
    this.icon.src = cursor;
    this.iconWrapper.appendChild(this.icon);
    this.addCursorToBody(this.iconWrapper);

    this.render();
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
      self.calculateArrowDirection(theta);
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
        x: 1 + (velocity.v* 0.5),
        y: 1 - (velocity.v * 0.3)
    }
  }

  /**
     * Add tween to the rotation of cursor based on its angle of movement.
     * 
     * @param {number} theta 
     * @param {object} velocity 
     */
   calculateArrowDirection(theta: number) {
      if(!this.animationComplete) {
        gsap.to(this.innerRotation, {duration: .4, rotate: theta + 90, onUpdate: this.onRotateUpdate.bind(this) });
      }
    }

  /**
   * Update rotation animation data
   */
   onRotateUpdate() {
     this.state.rotate = this.innerRotation.rotate;
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
        transform: "rotate(" + this.state.theta + "deg)"
    };

    let scaleStyle = {
        display: "inline-block",
        position: "absolute",
        height: "100%",
        width: "100%",
        transform: "scale(" + this.scaleData.x + ", " + this.scaleData.y + ")"
    };


    let iconStyle = {
        height: "100%",
        width: "100%",
        transform: "rotate(" + this.state.theta*-1 + "deg)"
    };

    let imgStyle = {
        position: "relative",
        height: "100%",
        width: "100%",
        transform: "rotate(" + this.state.rotate + "deg)"
    }

    Object.assign(this.rotateWrapper.style, rotateStyle);
    Object.assign(this.scaleWrapper.style, scaleStyle);
    Object.assign(this.iconWrapper.style, iconStyle);
    Object.assign(this.icon.style, imgStyle);
  }
}

export { Velocity };
import { gsap } from "gsap";
import cursor from './cursor.png';

interface Options {
  delay?: number;
  size?: number;
}

interface LooseObject {
  [key: string]: any
}

class Velocity {
  options: LooseObject;
  state: LooseObject;
  animateData: LooseObject;
  scaleData: LooseObject;
  time: any;
  stored: LooseObject;
  velocity: any;
  theta: number;
  innerRotation: any;
  animationComplete: boolean;
  mouseCalculateTime: number;
  rotateWrapper: HTMLDivElement;
  scaleWrapper: HTMLDivElement;
  iconWrapper: HTMLDivElement;
  icon: HTMLImageElement;


  // Normal signature with defaults
  constructor(options: Options) {
    this.options = options;
    /**
     * Stores current cursor data
     */
    this.state = {
        x: 0,
        y: 0,
        rotate: 0,
        hide: true
    }

    /**
     * Animation data to be mutated by tweening engine
     */
    this.animateData = {
        x: 0,
        y: 0
    }

    /**
     * Controls the cursor scale
     */
    this.scaleData = {
        x: 1,
        y: 1
    }

    /**
     * Time to calculate delta
     */
    this.time = null;

    /**
     * Previous coordinates to calculate rate of change
     */
    this.stored = {
        x: null,
        y: null
    }

    /**
     * Current cursor velocity
     */
    this.velocity = {};

    /**
     * Current cursor angle
     */
    this.theta = 0;

    /**
     * Rotation of the inner container
     */
    this.innerRotation = {
        rotate: 0
    };

    this.animationComplete = false;

    this.mouseCalculateTime = Date.now();

    /**
     * Instance methods
     */
    this.onMouseLeave = this.onMouseLeave.bind(this);
    this.onAnimationComplete = this.onAnimationComplete.bind(this);

    this.init();

  }

  /**
     * Setyp the stage by adding cursor markup and initial positions. 
     * Add event listeners for the mouse then begin recursive calculations.
     */
   init() {
    this.addCursorToBody();
    this.render();
    document.body.style.cursor = "none";
    document.body.style.minHeight = "100vh";
    document.body.addEventListener("mousemove", this.onMouseMove.bind(this));
    document.body.addEventListener("mouseenter", this.onMouseEnter.bind(this));
    document.body.addEventListener("mouseleave", this.onMouseLeave.bind(this));
    this.calculate();

  }

  /**
     * Create cursor markup and append to the body
     */
   addCursorToBody() {
    this.rotateWrapper = document.createElement("div");
    this.scaleWrapper = document.createElement("div");
    this.iconWrapper = document.createElement("div");
    this.icon = document.createElement("img");
    this.icon.src = cursor;

    this.iconWrapper.appendChild(this.icon);
    this.scaleWrapper.appendChild(this.iconWrapper);
    this.rotateWrapper.appendChild(this.scaleWrapper);
    document.body.appendChild(this.rotateWrapper);
  }

  /**
   * On mouse move trigger a tween to the current mouse position.
   * 
   * @param {object} e Mouse event 
   */ 
  onMouseMove = (e: MouseEvent) => {
    this.animationComplete = false;
    gsap.to(this.animateData, {duration: this.options.delay, x: e.clientX - (this.options.size / 2), y: e.clientY - (this.options.size / 2), ease: "linear.easeIn"});
  }

  /**
     * On the mouse entering the document, reveal the cursor
     * 
     * @param {*} e Mouse event
     */
  onMouseEnter = (e: MouseEvent) => {
    this.state.hide = false;
  }

  /**
     * On mouse leaving the document, hide the cursor
     * 
     * @param {*} e 
     */
  onMouseLeave = (e: MouseEvent) =>  {
    this.state.hide = true;
  }

  /**
     * Runs on requestAnimationFrame to execute calculations on current mouse position and
     * updates the cursor position and styling.
     */
  calculate() {
    if(this.stored.y && this.stored.x) {
      let dy = this.animateData.y - this.stored.y;
      let dx = this.animateData.x - this.stored.x;

      let velocity = this.calculateVelocity(dx,dy);
      this.theta = this.calculateRotation(dx,dy);
      this.calculateSkew(velocity);
      this.calculateArrowDirection(this.theta);


      this.stored = {
          x: this.animateData.x,
          y: this.animateData.y
      }

      this.state.x = this.animateData.x;
      this.state.y = this.animateData.y;

      this.render();
    } else {
      this.stored = {
        x: this.animateData.x,
        y: this.animateData.y
      }
    }
    
    window.requestAnimationFrame(this.calculate.bind(this));
  } 

  /**
   * 
   * @param {*} dx Difference on the x-axis
   * @param {*} dy Difference on the y-axis
   */
   calculateRotation(dx: number, dy: number) {
      var theta = Math.atan2(dy, dx); // range (-PI, PI]
      theta *= 180 / Math.PI; // rads to degs, range (-180, 180]
      return theta;
  }

  /**
   * 
   * @param {*} dx Difference on the x-axis
   * @param {*} dy Difference on the y-axis
   */
   calculateVelocity(dx: number, dy: number) {
      if(this.time) {
          let newTime = Date.now();  
          let interval = newTime - this.time;
          let velocity = {
              v: Math.sqrt(dx*dx+dy*dy)/interval,
              x: dx / interval,
              y: dy / interval
          } 
          this.time = newTime;

          this.velocity = velocity;
          return velocity;
      } else {
          this.time = Date.now();
          this.velocity = 0;
          return 0;
      }
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
   * Animate the cursor back to 0 degrees after cursor animation is completed
   */
    onAnimationComplete() {
      this.animationComplete = true;
      gsap.to(this.innerRotation, { duration: .4, rotate: 0, onUpdate: this.onRotateUpdate.bind(this) });
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
        transform: "rotate(" + this.theta + "deg)"
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
        transform: "rotate(" + this.theta*-1 + "deg)"
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
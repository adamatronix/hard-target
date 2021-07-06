import { gsap } from "gsap";

interface LooseObject {
  [key: string]: any
}

class Cursor {
  private time: any;
  rotateWrapper: HTMLDivElement;
  scaleWrapper: HTMLDivElement;
  animateData: LooseObject;
  stored: LooseObject;
  options: LooseObject;
  state: LooseObject;
  // Normal signature with defaults
  constructor(options: LooseObject) {
    this.options = options;
    /**
     * Time to calculate delta
     */
     this.time = null;

     /**
     * Stores current cursor data
     */
    this.state = {
      x: 0,
      y: 0,
      rotate: 0,
      velocity: 0,
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
     * Previous coordinates to calculate rate of change
     */
    this.stored = {
      x: null,
      y: null
    }

    document.body.style.cursor = "none";
    document.body.style.minHeight = "100vh";
    document.body.addEventListener("mousemove", this.onMouseMove.bind(this));
    document.body.addEventListener("mouseenter", this.onMouseEnter.bind(this));
    document.body.addEventListener("mouseleave", this.onMouseLeave.bind(this));
  }

  /**
   * On mouse move trigger a tween to the current mouse position.
   * 
   * @param {object} e Mouse event 
   */ 
   onMouseMove = (e: MouseEvent) => {
    const x = e.clientX - (this.options.size / 2);
    const y = e.clientY - (this.options.size / 2);
    gsap.to(this.animateData, {duration: this.options.delay, x: x, y: y, ease: "linear.easeIn"});
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
     * Create cursor markup and append to the body
     */
   addCursorToBody(iconWrapper: HTMLDivElement) {
    this.rotateWrapper = document.createElement("div");
    this.scaleWrapper = document.createElement("div");

    this.scaleWrapper.appendChild(iconWrapper);
    this.rotateWrapper.appendChild(this.scaleWrapper);
    document.body.appendChild(this.rotateWrapper);
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

        return velocity;
    } else {
        this.time = Date.now();
        return 0;
    }
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
     * Runs on requestAnimationFrame to execute calculations on current mouse position and
     * updates the cursor position and styling.
     */
   calculateEngine(callback: (velocity: any, theta: number, x: number, y: number) => void) {
    const render = () => {

      if(this.stored.y && this.stored.x) {
        let dy = this.animateData.y - this.stored.y;
        let dx = this.animateData.x - this.stored.x;
  
        let velocity = this.calculateVelocity(dx,dy);
        let theta = this.calculateRotation(dx,dy);
        
  
        this.stored = {
            x: this.animateData.x,
            y: this.animateData.y
        }
  
        callback(velocity, theta, this.animateData.x, this.animateData.y);
        this.state.x = this.animateData.x;
        this.state.y = this.animateData.y;
        this.state.theta = theta;
  
      } else {
        this.stored = {
          x: this.animateData.x,
          y: this.animateData.y
        }
      }


      window.requestAnimationFrame(render.bind(this));
    }

    render();
  }
}

export default Cursor;
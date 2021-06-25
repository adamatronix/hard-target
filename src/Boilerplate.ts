class Boilerplate {
  x: number;
  y: number;

  // Normal signature with defaults
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
    console.log(`${this.x},${this.y}`);
  }
}

export { Boilerplate };
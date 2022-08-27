class Sketch extends Engine {
  preload() {
    this._scl = 0.8; // scale of the sketch
    this._lines_num = 400; // numbers of lines in the circle
    this._noise_scl = 0.001; // simplex noise scale
  }

  setup() {
    const noise = new SimplexNoise();
    const noise_scl = this._noise_scl * rand(1, 4); // actual noise scale is randomized

    // initialize the lines array
    this._lines = [];
    // create the lines
    for (let i = 0; i < this._lines_num; i++) {
      // start position is randomized in the circle
      const rho = rand(0, this.width / 2);
      const theta = rand(0, Math.PI * 2);

      const x = rho * Math.cos(theta);
      const y = rho * Math.sin(theta);

      this._lines.push(new Line(x, y, this.width * 2, noise_scl, noise));
    }

    // generate the lines
    this._lines.forEach((l) => l.generate());
  }

  draw() {
    // all the coordinates are relative to the center of the canvas
    this.ctx.save();
    this.background("rgb(15, 15, 15)");
    this.ctx.translate(this.width / 2, this.height / 2);
    this.ctx.rotate(this._theta);
    this.ctx.scale(this._scl, this._scl);

    // draw the outer circle
    this.ctx.strokeStyle = "rgb(240, 240, 240)";
    this.ctx.lineWidth = 6;

    this.ctx.beginPath();
    this.ctx.arc(0, 0, this.width / 2 - this.ctx.lineWidth / 2, 0, Math.PI * 2);
    this.ctx.stroke();

    // create a clipping region
    this.ctx.beginPath();
    this.ctx.arc(0, 0, this.width / 2, 0, Math.PI * 2);
    this.ctx.clip();

    // draw the lines
    this._lines.forEach((l) => {
      l.show(this.ctx);
    });

    this.ctx.restore();
    this.noLoop();
  }

  click() {
    this.setup();
    this.draw();
  }

  keydown(e) {
    switch (e.keyCode) {
      case 13: // enter
        this.saveFrame();
        break;
      default:
        break;
    }
  }
}

/**
 * Get a random number between min and max
 * @param {number} min - minimum number
 * @param {number} max - maximum number
 * @returns {number} random number between min and max (included)
 */
const rand = (min = 0, max = 1) => {
  return Math.random() * (max - min) + min;
};

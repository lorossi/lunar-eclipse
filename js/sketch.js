class Sketch extends Engine {
  preload() {
    this._scl = 0.6; // scale of the sketch
    this._lines_num = 250; // numbers of lines in the circle
    this._noise_scl = 0.0015; // scale of the angle
  }

  setup() {
    const noise = new SimplexNoise();

    const noise_scl = rand(0.5, 2) * this._noise_scl;

    this._lines = [];
    for (let i = 0; i < this._lines_num; i++) {
      const len = this.width * rand(3, 10);
      const rho = (this.width / 2) * rand();
      const theta = Math.PI * 2 * rand();

      const x = rho * Math.cos(theta);
      const y = rho * Math.sin(theta);

      this._lines.push(new Line(x, y, len, noise_scl, noise));
    }

    this._theta = Math.random() * Math.PI * 2;
  }

  draw() {
    const nx = Math.random() * 10000;
    const ny = Math.random() * 10000;

    this.ctx.save();
    this.background("rgb(15, 15, 15)");
    this.ctx.translate(this.width / 2, this.height / 2);
    this.ctx.rotate(this._theta);
    this.ctx.scale(this._scl, this._scl);

    this.ctx.strokeStyle = "rgb(230, 230, 230)";
    this.ctx.lineWidth = 6;

    this.ctx.beginPath();
    this.ctx.arc(0, 0, this.width / 2 - this.ctx.lineWidth / 2, 0, Math.PI * 2);
    this.ctx.stroke();

    this.ctx.beginPath();
    this.ctx.arc(0, 0, this.width / 2, 0, Math.PI * 2);
    this.ctx.clip();

    this._lines.forEach((l) => {
      l.move(nx, ny);
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
    if (e.keyCode == 13) {
      this.saveFrame();
    }
  }
}

const rand = (min = 0, max = 1) => {
  return Math.random() * (max - min) + min;
};

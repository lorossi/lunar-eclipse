class Sketch extends Engine {
  preload() {
    this._scl = 0.8; // scale of the sketch
    this._lines_num = 350; // numbers of lines in the circle
    this._noise_scl = 0.0005;
  }

  setup() {
    const noise = new SimplexNoise();
    const noise_scl = this._noise_scl * rand(1, 4);

    this._lines = [];
    for (let i = 0; i < this._lines_num; i++) {
      const rho = rand(0, this.width / 2);
      const theta = rand(0, Math.PI * 2);

      const x = rho * Math.cos(theta);
      const y = rho * Math.sin(theta);

      this._lines.push(new Line(x, y, this.width * 2, noise_scl, noise));
    }

    this._lines.forEach((l) => l.generate());
  }

  draw() {
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

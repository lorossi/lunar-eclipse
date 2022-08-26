class Sketch extends Engine {
  preload() {
    this._scl = 0.6;
    this._lines_num = 750;
    this._noise_r = 0.25;
  }

  setup() {
    this._noise = new SimplexNoise();

    this._lines = [];
    const max_len = this.width;
    for (let i = 0; i < this._lines_num; i++) {
      const x = (Math.random() - 0.5) * this.width;
      const y = (Math.random() - 0.5) * this.height;

      this._lines.push(new Line(x, y, max_len, this._noise));
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

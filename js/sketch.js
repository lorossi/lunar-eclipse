class Sketch extends Engine {
  preload() {
    this._scl = 0.4;
    this._lines_num = 200;
    this._duration = 600;
    this._noise_r = 0.1;
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
  }

  draw() {
    const percent = (this.frameCount % this._duration) / this._duration;
    const nx = this._noise_r * (1 + Math.cos(percent * Math.PI * 2));
    const ny = this._noise_r * (1 + Math.sin(percent * Math.PI * 2));

    this.ctx.save();
    this.background("rgb(15, 15, 15)");
    this.ctx.translate(this.width / 2, this.height / 2);
    this.ctx.scale(this._scl, this._scl);

    this.ctx.strokeStyle = "rgb(245, 245, 245)";
    this.ctx.lineWidth = 4;

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
  }

  click() {
    this.saveFrame();
  }
}

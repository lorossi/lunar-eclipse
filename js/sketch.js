class Sketch extends Engine {
  preload() {
    this._scl = 0.3;
    this._lines_num = 500;
    this._duration = 900;
    this._noise_r = 0.5;
    this._recording = false;
    this._on_demand = true;
  }

  setup() {
    if (this._recording) {
      this._capturer = new CCapture({
        format: "png",
      });
      this._capturer.start();
      console.log("Recording started");
    }

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

    if (this._recording) {
      if (this.frameCount % 60 == 0) {
        console.log(`Recording at ${Math.floor(percent * 100)}%`);
      }
      if (this.frameCount < this._duration) {
        this._capturer.capture(this.canvas);
      } else {
        this._recording = false;
        this._capturer.stop();
        this._capturer.save();
        console.log("Recording complete");
      }
    } else if (this._on_demand) {
      this.noLoop();
    }
  }

  click() {
    if (this._on_demand) {
      this.setup();
      this.loop();
    }
  }

  keydown(e) {
    if (e.keyCode == 13 && this._on_demand) {
      this.saveFrame();
    }
  }
}

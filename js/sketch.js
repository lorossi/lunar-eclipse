// Press ENTER to save a frame
// Press Q to switch to high quality
// Press W to switch to low quality (ON BY DEFAULT)

class Sketch extends Engine {
  preload() {
    this._scl = 0.8; // scale of the sketch
    this._lines_num = 400; // numbers of lines in the circle
    this._noise_scl = 0.001; // simplex noise scale
    this._low_quality = true; // preview mode

    console.log("Press ENTER to save a frame");
    console.log("Press Q to switch to high quality");
    console.log("Press W to switch to low quality - ON BY DEFAULT");
    console.log("Click to generate a new frame");
  }

  setup() {
    const timestamp = Date.now();

    // initialize random generators
    const rand = new XOR128(timestamp);
    const noise = new SimplexNoise();
    // create title
    this._title = `noise-${rand.shuffle_string(timestamp.toString())}`;
    // set page title
    document.title = this._title;

    const noise_scl = this._noise_scl * rand.random(1, 4); // actual noise scale is randomized
    console.log("%c Generating new background...", "color: red;");

    // initialize the lines array
    this._lines = [];
    // create the lines
    for (let i = 0; i < this._lines_num; i++) {
      // start position is randomized in the circle
      const rho = rand.random(0, this.width / 2);
      const theta = rand.random(0, Math.PI * 2);

      const x = rho * Math.cos(theta);
      const y = rho * Math.sin(theta);

      this._lines.push(new Line(x, y, this.width * 2, noise_scl, noise));
    }

    // generate the lines
    this._lines.forEach((l) => l.generate());

    console.log("%c ...done!", "color: green;");
  }

  draw() {
    console.log("%c Drawing new background...", "color: red;");
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
    if (this._low_quality) {
      for (let i = 0; i < this._lines.length; i += 5) {
        const l = this._lines[i];
        l.show(this.ctx, true);
      }
    } else {
      this._lines.forEach((l) => {
        l.show(this.ctx, false);
      });
    }

    this.ctx.restore();

    console.log("%c ...done!", "color: green;");

    // stop looping
    this.noLoop();
  }

  click() {
    this.setup();
    this.background("rgb(15, 15, 15)");
    this.draw();
  }

  keyDown(_, v) {
    switch (v) {
      case 13: // ENTER
        this.saveFrame(this._title);
        break;
      case 81: // Q
        console.log("Drawing in high quality");
        this._low_quality = false;
        this.draw();
        break;
      case 87: // W
        console.log("Drawing in low quality");
        this._low_quality = true;
        this.draw();
        break;
      default:
        break;
    }
  }
}

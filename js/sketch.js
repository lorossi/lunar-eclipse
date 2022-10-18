// Press ENTER to save a frame
// Press Q to switch to high quality
// Press W to switch to low quality (ON BY DEFAULT)

class Sketch extends Engine {
  preload() {
    this._scl = 0.8; // scale of the sketch
    this._lines_num = 400; // numbers of lines in the circle
    this._noise_scl = 0.001; // simplex noise scale
    this._preview = true; // preview mode
    this._auto = false; // keep downloading new

    console.clear();
    console.log("Press ENTER to save a frame");
    console.log("Press Q to switch to high quality");
    console.log("Press W to switch to low quality - ON BY DEFAULT");
    console.log("Click to generate a new frame");
  }

  setup() {
    if (this._preview && this._auto)
      throw new Error(
        "Cannot generate a new frame in preview mode while in auto mode"
      );

    const timestamp = Date.now();

    // initialize random generators
    const rand = new XOR128(timestamp);
    const noise = new SimplexNoise(timestamp);
    // create title
    this._title = `noise-${rand.shuffle_string(timestamp.toString())}`;
    this._theta = rand.random() * Math.PI * 2;
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
    const total_lines = this._lines.length;
    const total_nodes = this._lines.reduce((acc, l) => acc + l.nodes_num, 0);
    console.log(
      `%c ...done! Generated ${total_lines} lines with ${total_nodes} nodes`,
      "color: green;"
    );
  }

  draw() {
    const started = Date.now();
    if (this._preview)
      console.log("%c Rendering in low quality...", "color: red;");
    else
      console.log(
        "%c Rendering in high quality (this might take a while)...",
        "color: red;"
      );

    // all the coordinates are relative to the center of the canvas
    this.ctx.save();
    this.background("rgb(15, 15, 15)");
    this.ctx.translate(this.width / 2, this.height / 2);
    this.ctx.rotate(this._theta);
    this.ctx.scale(this._scl, this._scl);

    // draw a disclaimer
    if (this._preview) {
      this.ctx.save();
      this.ctx.rotate(-this._theta);
      this.ctx.fillStyle = "rgb(255, 255, 255)";
      this.ctx.font = "40px Roboto";
      this.ctx.textAlign = "left";
      this.ctx.textBaseline = "top";
      this.ctx.fillText("LOW QUALITY", -this.width / 2, -this.height / 2);
      this.ctx.fillText(
        "PRESS Q TO SWITCH TO HIGH QUALITY",
        -this.width / 2,
        -this.height / 2 + 50
      );
      this.ctx.fillText(
        "OPEN THE CONSOLE TO SEE THE PROGRESS",
        -this.width / 2,
        -this.height / 2 + 100
      );
      this.ctx.restore();
    }

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
    if (this._preview) {
      for (let i = 0; i <= this._lines.length - 1; i += 3) {
        this._lines[i].show(this.ctx, true);
      }
    } else {
      this._lines.forEach((l) => l.show(this.ctx, false));
    }

    this.ctx.restore();

    const ended = Date.now();
    const elapsed = Math.floor((ended - started) / 1000);
    console.log(`%c ...done in ${elapsed} seconds!`, "color: green;");

    if (this._auto) {
      // KEEP GOING and generate new
      this.saveFrame(this._title);
      this.setup();
    } else {
      // STOP the animation
      this.noLoop();
    }
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
        console.log("Rendering in high quality");
        this._preview = false;
        this.draw();
        break;
      case 87: // W
        console.log("Rendering in low quality");
        this._preview = true;
        this.draw();
        break;
      default:
        break;
    }
  }
}

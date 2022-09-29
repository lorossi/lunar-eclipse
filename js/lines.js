const ALPHA = 0.02;

class Line {
  constructor(x, y, max_dist, noise_scl, noise) {
    this._x = x; // starting x coordinate
    this._y = y; // starting y coordinate
    this._max_dist = max_dist; // maximum distance from the center of the canvas
    this._noise = noise; // noise object
    this._noise_scl = noise_scl; // noise scale
  }

  generate() {
    // create the nodes that compose the line
    this._nodes = [];

    const segment_len = 20; // the length of each segment
    // keep track of the current position
    let dx = 0;
    let dy = 0;

    while (this._distFromCenter(this._x + dx, this._y + dy) < this._max_dist) {
      // generate nodes until the line lies outside the circle
      const theta_x = this._noise_scl * (dx + this._x);
      const theta_y = this._noise_scl * (dy + this._y);

      // the angle is generated from the noise
      const theta = this._generateNoise(theta_x, theta_y) * Math.PI * 2;

      // update the current position
      dx += segment_len * Math.cos(theta);
      dy += segment_len * Math.sin(theta);

      // add the node to the line
      this._nodes.push(new Point(Math.floor(dx), Math.floor(dy)));
    }
  }

  show(ctx, preview = false) {
    ctx.save();
    ctx.translate(this._x, this._y);
    ctx.strokeStyle = `rgba(250, 250, 250, ${ALPHA})`;
    ctx.lineWidth = 1;

    ctx.moveTo(0, 0);

    if (preview) {
      for (let i = 0; i < this._nodes.length; i += 5) {
        const n = this._nodes[i];
        ctx.lineTo(n.x, n.y);
      }
    } else {
      this._nodes.forEach((n) => {
        ctx.lineTo(n.x, n.y);
      });
    }

    ctx.stroke();

    ctx.restore();
  }

  // returns the noise value at the given coordinates
  _generateNoise(x = 0, y = 0, z = 0, w = 0, depth = 3) {
    let n = 0;
    let a_sum = 0;

    for (let i = 0; i < depth; i++) {
      const f = Math.pow(2, i);
      const a = Math.pow(2, -i);
      a_sum += a;
      n += ((this._noise.noise(x * f, y * f, z * f, w * f) + 1) / 2) * a;
    }
    return n / a_sum;
  }

  // returns the distance from the center of the canvas
  _distFromCenter(x, y) {
    return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
  }
}

const ALPHA = 0.02;

class Line {
  constructor(x, y, max_len, noise_scl, noise) {
    this._x = x;
    this._y = y;
    this._max_len = max_len;
    this._noise = noise;
    this.noise_scl = noise_scl;
  }

  generate() {
    this._nodes = [];

    const segment_len = 20;
    let dx = 0;
    let dy = 0;

    while (this._distFromCenter(this._x + dx, this._y + dy) < this._max_len) {
      const theta_x = this.noise_scl * (dx + this._x);
      const theta_y = this.noise_scl * (dy + this._y);

      const rho = Math.random() * segment_len;

      const theta =
        this._generateNoise(theta_x, theta_y, 200, 200) * Math.PI * 2;

      dx += rho * Math.cos(theta);
      dy += rho * Math.sin(theta);

      this._nodes.push(new Point(Math.floor(dx), Math.floor(dy)));
    }
  }

  show(ctx) {
    ctx.save();
    ctx.translate(this._x, this._y);
    ctx.strokeStyle = `rgba(250, 250, 250, ${ALPHA})`;
    ctx.lineWidth = 1;

    ctx.moveTo(0, 0);
    this._nodes.forEach((n) => {
      ctx.lineTo(n.x, n.y);
    });

    ctx.stroke();

    ctx.restore();
  }

  _generateNoise(x = 0, y = 0, z = 0, w = 0, depth = 2) {
    let n = 0;
    let a_sum = 0;

    for (let i = 0; i < depth; i++) {
      const f = Math.pow(2, i);
      const a = Math.pow(2, -i);
      a_sum += a;
      n += ((this._noise.noise4D(x * f, y * f, z * f, w * f) + 1) / 2) * a;
    }
    return n / a_sum;
  }

  _distFromCenter(x, y) {
    return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
  }
}

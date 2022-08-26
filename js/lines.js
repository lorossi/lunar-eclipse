class Line {
  constructor(x, y, len, noise_scl, noise) {
    this._x = x;
    this._y = y;
    this._max_len = len;
    this._noise = noise;
    this.noise_scl = noise_scl;

    this._nodes_num = len / 10;
    this._nodes = [];
    this._alpha = 0;
    this._noise_len_scl = 4;
  }

  move(nx, ny) {
    this._nodes = [];

    const len = this._max_len / this._nodes_num;

    let dx = 0;
    let dy = 0;

    for (let i = 0; i < this._nodes_num; i++) {
      const rho_x = this._noise_len_scl * (dx + this._x);
      const rho_y = this._noise_len_scl * (dy + this._y);

      const theta_x = this.noise_scl * (dx + this._x);
      const theta_y = this.noise_scl * (dy + this._y);

      const rho = this._generateNoise(rho_x, rho_y, nx + 10, ny + 10, 1) * len;

      const theta =
        this._generateNoise(theta_x, theta_y, nx + 20, ny + 20) * Math.PI * 3;

      dx += rho * Math.cos(theta);
      dy += rho * Math.sin(theta);

      this._nodes.push(new Point(Math.floor(dx), Math.floor(dy)));
    }
  }

  show(ctx) {
    ctx.save();
    ctx.translate(this._x, this._y);
    ctx.strokeStyle = "rgba(220, 220, 220, 0.05)";
    ctx.lineWidth = 1;

    ctx.moveTo(0, 0);
    this._nodes.forEach((n) => {
      ctx.lineTo(n.x, n.y);
    });

    ctx.stroke();

    ctx.restore();
  }

  _generateNoise(x = 0, y = 0, z = 0, w = 0, depth = 4) {
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
}

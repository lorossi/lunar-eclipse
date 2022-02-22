class Line {
  constructor(x, y, max_len, noise) {
    this._x = x;
    this._y = y;

    this._max_len = max_len;
    this._noise = noise;

    this._noise_len_scl = 0.01;
    this._noise_theta_scl = 0.00125;
    this._noise_alpha_scl = 0.1;

    this._nodes_num = 20;
    this._nodes = [];
    this._alpha = 0;
  }

  move(nx, ny) {
    this._nodes = [];

    const len = this._max_len / this._nodes_num;

    let dx = 0;
    let dy = 0;

    for (let i = 0; i < this._nodes_num; i++) {
      const rho_x = this._noise_len_scl * (dx + this._x);
      const rho_y = this._noise_len_scl * (dy + this._y);

      const theta_x = this._noise_theta_scl * (dx + this._x);
      const theta_y = this._noise_theta_scl * (dy + this._y);

      const rho = this._generateNoise(rho_x, rho_y, nx + 10, ny + 10) * len;

      const theta =
        this._generateNoise(theta_x, theta_y, nx + 20, ny + 20) * Math.PI * 2;

      dx += rho * Math.cos(theta);
      dy += rho * Math.sin(theta);

      this._nodes.push(new Point(Math.floor(dx), Math.floor(dy)));
    }

    this._alpha =
      ((nx,
      ny,
      this._x * this._noise_alpha_scl,
      this._y * this._noise_alpha_scl,
      1) +
        1) /
      75;
  }

  show(ctx) {
    ctx.save();
    ctx.translate(this._x, this._y);
    ctx.strokeStyle = `rgba(240, 240, 240, ${this._alpha})`;
    ctx.lineWidth = 1;

    ctx.moveTo(0, 0);
    this._nodes.forEach((n) => ctx.lineTo(n.x, n.y));
    ctx.stroke();

    ctx.restore();
  }

  _generateNoise(x = 0, y = 0, z = 0, w = 0, depth = 3) {
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

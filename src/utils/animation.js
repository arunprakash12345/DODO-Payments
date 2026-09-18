export function lerp(a, b, t) {
  return a + (b - a) * t;
}

export function clamp(val, min, max) {
  return Math.min(Math.max(val, min), max);
}

export function distance(x1, y1, x2, y2) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  return Math.sqrt(dx * dx + dy * dy);
}

export class Spring {
  constructor(initial = 0, stiffness = 180, damping = 12) {
    this.current = initial;
    this.target = initial;
    this.velocity = 0;
    this.stiffness = stiffness;
    this.damping = damping;
  }

  setTarget(t) {
    this.target = t;
  }

  snap(val) {
    this.current = val;
    this.target = val;
    this.velocity = 0;
  }

  impulse(v) {
    this.velocity += v;
  }

  update(dt = 1 / 60) {
    const force = -this.stiffness * (this.current - this.target);
    const dampingForce = -this.damping * this.velocity;
    const acceleration = force + dampingForce;

    this.velocity += acceleration * dt;
    this.current += this.velocity * dt;

    return this.current;
  }
}

export class MicroSaccade {
  constructor() {
    this.offsetX = 0;
    this.offsetY = 0;
    this.targetX = 0;
    this.targetY = 0;
    this.nextTremorTime = 0;
  }

  update(now) {
    if (now > this.nextTremorTime) {
      const angle = Math.random() * Math.PI * 2;
      const mag = Math.random() * 0.55;
      this.targetX = Math.cos(angle) * mag;
      this.targetY = Math.sin(angle) * mag;
      this.nextTremorTime = now + 400 + Math.random() * 1200;
    }

    this.offsetX += (this.targetX - this.offsetX) * 0.18;
    this.offsetY += (this.targetY - this.offsetY) * 0.18;

    return { x: this.offsetX, y: this.offsetY };
  }
}

export function generateOrganicBodyPath(cx, cy, rx, ry, deform = {}) {
  const safeRx = Math.max(10, (typeof rx === 'number' && !isNaN(rx)) ? rx : 76);
  const safeRy = Math.max(10, (typeof ry === 'number' && !isNaN(ry)) ? ry : 82);

  const dxT = (typeof deform.topX === 'number' && !isNaN(deform.topX)) ? deform.topX : 0;
  const dyT = (typeof deform.topY === 'number' && !isNaN(deform.topY)) ? deform.topY : 0;
  const dxR = (typeof deform.rightX === 'number' && !isNaN(deform.rightX)) ? deform.rightX : 0;
  const dyR = (typeof deform.rightY === 'number' && !isNaN(deform.rightY)) ? deform.rightY : 0;
  const dxB = (typeof deform.bottomX === 'number' && !isNaN(deform.bottomX)) ? deform.bottomX : 0;
  const dyB = (typeof deform.bottomY === 'number' && !isNaN(deform.bottomY)) ? deform.bottomY : 0;
  const dxL = (typeof deform.leftX === 'number' && !isNaN(deform.leftX)) ? deform.leftX : 0;
  const dyL = (typeof deform.leftY === 'number' && !isNaN(deform.leftY)) ? deform.leftY : 0;

  const top = { x: cx + dxT, y: cy - safeRy + dyT };
  const right = { x: cx + safeRx + dxR, y: cy + dyR };
  const bottom = { x: cx + dxB, y: cy + safeRy + dyB };
  const left = { x: cx - safeRx + dxL, y: cy + dyL };

  const kX = safeRx * 0.552;
  const kY = safeRy * 0.552;

  const path = [
    `M ${top.x} ${top.y}`,
    `C ${top.x + kX} ${top.y}, ${right.x} ${right.y - kY}, ${right.x} ${right.y}`,
    `C ${right.x} ${right.y + kY}, ${bottom.x + kX} ${bottom.y}, ${bottom.x} ${bottom.y}`,
    `C ${bottom.x - kX} ${bottom.y}, ${left.x} ${left.y + kY}, ${left.x} ${left.y}`,
    `C ${left.x} ${left.y - kY}, ${top.x - kX} ${top.y}, ${top.x} ${top.y}`,
    'Z'
  ].join(' ');

  return path;
}

export function generateMouthPath(factorSmile = 0, factorCurious = 0, factorBliss = 0) {
  const neutralWidth = 14;
  const smileWidth = 19;
  const curiousWidth = 8;
  const blissWidth = 16;

  if (factorBliss > 0.01) {
    const w = lerp(neutralWidth, blissWidth, factorBliss);
    const drop = lerp(0.8, 5.5, factorBliss);
    return `M ${-w / 2} 0 Q 0 ${drop} ${w / 2} 0`;
  }

  if (factorSmile > 0.01) {
    const w = lerp(neutralWidth, smileWidth, factorSmile);
    const drop = lerp(0.8, 8.2, factorSmile);
    return `M ${-w / 2} 0 Q 0 ${drop} ${w / 2} 0`;
  }

  if (factorCurious > 0.01) {
    const w = lerp(neutralWidth, curiousWidth, factorCurious);
    const drop = lerp(0.8, 5.0, factorCurious);
    return `M ${-w / 2} 0 Q 0 ${drop} ${w / 2} 0`;
  }

  return `M ${-neutralWidth / 2} 0 Q 0 0.8 ${neutralWidth / 2} 0`;
}

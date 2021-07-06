const { uniformBezierPath } = uniformBezier;
BezierPath=uniformBezierPath;

class Point {
  static currentPoint = null;
  constructor(ctx, x, y, radius) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.ctx = ctx;
    this.mouseDownOffset = [0, 0];
  }
  draw(x = this.x, y = this.y) {
    this.ctx.beginPath();
    this.ctx.arc(x, y, this.radius, 0, 2 * Math.PI);
    this.ctx.fill();
  }
  isInPoint(px, py) {
    if (Point.currentPoint) {
      return false;
    }
    this.mouseDownOffset = [this.x - px, this.y - py];
    return (
      Math.pow(this.x - px, 2) + Math.pow(this.y - py, 2) <=
      Math.pow(this.radius, 2)
    );
  }
  dragPoint(px, py) {
    const [offsetX, offsetY] = this.mouseDownOffset;
    this.x = px + offsetX;
    this.y = py + offsetY;
  }
}

function drawLine(ctx, ...p) {
  ctx.beginPath();
  ctx.moveTo(...p[0]);
  for (let i = 1; i < p.length; i++) {
    const point = p[i];
    ctx.lineTo(...point);
  }
  ctx.stroke();
}

function drawPoints(ctx, points) {
  for (let i = 0; i < points.length; i++) {
    if (Array.isArray(points[i])) {
      const [pointX, pointY] = points[i];
      points[i] = new Point(ctx, pointX, pointY, 10);
    }
    points[i].draw();
  }
}

function drawBezier(ctx, pos) {
  const bezierStore = BezierPath(pos,10);
  let s = bezierStore.next();
  while (!s.done) {
    const { x, y } = s.value;
    ctx.beginPath();
    ctx.arc(x, y, 2, 0, 2 * Math.PI);
    ctx.fill();
    s = bezierStore.next();
  }
  // ctx.fillStyle = 'green';
  // for (let i = 0; i < 1; i += 0.5) {
  //   const [x, y] = nb(i);
  //   ctx.beginPath();
  //   ctx.arc(x, y, 2, 0, 2 * Math.PI);
  //   ctx.fill();
  // }
}
function drawCom(ctx, points) {
  drawPoints(ctx, points);
  const pos = points.map((p) => [p.x, p.y]);
  drawBezier(ctx, pos);
  drawLine(ctx, ...pos);
}
function mouseDown(event, points) {
  for (let i = 0; i < points.length; i++) {
    const point = points[i];
    if (point.isInPoint(event.offsetX, event.offsetY)) {
      Point.currentPoint = point;
    }
  }
}
function mouseMove(event, ctx, points) {
  if (!Point.currentPoint) {
    return;
  }
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  Point.currentPoint.dragPoint(event.offsetX, event.offsetY);
  store = bezierStore();
  drawCom(ctx, points);
}
function mouseUp(event) {
  Point.currentPoint = null;
}

function draw(points) {
  const canvasDom = document.querySelector("#canvas");
  canvasDom.setAttribute("width", window.innerWidth);
  canvasDom.setAttribute("height", window.innerHeight);
  const ctx = canvasDom.getContext("2d");

  drawCom(ctx, points);

  canvasDom.addEventListener("mousedown", (event) => {
    mouseDown(event, points);
  });
  canvasDom.addEventListener("mousemove", (event) => {
    mouseMove(event, ctx, points);
  });
  canvasDom.addEventListener("mouseup", (event) => {
    mouseUp(event);
  });
}



const points = [
  [50, 50],
  [50, 800],
  [10, 600],
  [800, 800],
];
draw(points);

const dom = document.querySelector(".point");

function bezierStore() {
  const pos = points.map((p) => [p.x, p.y]);
  return BezierPath(pos,1);
}
let store = bezierStore();
function move() {
  const p = store.next();
  if (p.value) {
    dom.style.top = p.value.y + "px";
    dom.style.left = p.value.x + "px";
  } else {
    store = bezierStore();
  }
  requestAnimationFrame(move);
}
requestAnimationFrame(move);

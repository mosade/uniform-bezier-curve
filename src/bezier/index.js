/**
 * 一介贝塞尔函数
 * @param {number[]} p0
 * @param {number[]} p1
 * @returns
 */
function firstOrderBezier(p0, p1) {
  return (t) => {
    //t的值从0递增至1
    const [x0, y0] = p0;
    const [x1, y1] = p1;
    return [x0 + (x1 - x0) * t, y0 + (y1 - y0) * t];
  };
}
/**
 * n阶贝塞尔函数
 * @param  {...number[]} p
 * @returns
 */
function nOrderBezier(...p) {
  const ps = p.slice();
  for (let i = 0; i < p.length - 1; i++) {
    ps[i] = (t) => {
      let p1, p2;
      typeof p[i] === "function" ? (p1 = p[i](t)) : (p1 = p[i]);
      typeof p[i + 1] === "function" ? (p2 = p[i + 1](t)) : (p2 = p[i + 1]);
      return firstOrderBezier(p1, p2)(t);
    };
  }
  if (ps.length <= 1) {
    return ps[0];
  } else {
    ps.pop();
  }
  return nOrderBezier(...ps);
}
function* uniformBezierPath(pos, speed = 1, smooth = 0.01) {
  const nb = nOrderBezier(...pos);
  let offset = 0;
  const pe = speed;

  for (let i = 0; i < 1; i += smooth) {
    const [x, y] = nb(i);
    const [nextX, nextY] = nb(i + smooth);

    const l = Math.sqrt(Math.pow(nextX - x, 2) + Math.pow(nextY - y, 2));

    let sinx = (nextX - x) / l;
    let cosx = (nextY - y) / l;

    if (pe - offset >= l) {
      offset += l;
    } else {
      for (let nl = pe - offset; nl < l; nl += pe) {
        const y2 = cosx * nl;
        const x2 = sinx * nl;
        yield { x: x + x2, y: y + y2 };
        // cb(x + x2, y + y2);
        if (nl + pe > l) {
          offset = l - nl;
        }
      }
    }
  }
}
export { firstOrderBezier, nOrderBezier, uniformBezierPath };

export function degreesToRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

export function createCircleDom(elType: string, size: number): HTMLElement {
  const el = document.createElement(elType);
  el.style.height = `${size}px`;
  el.style.width = `${size}px`;
  el.style.borderRadius = `50%`;
  el.style.zIndex = '3';
  return el;
}

export interface IPoint {
  x: number;
  y: number;
}
export function getTwoPointsDistance(p1: IPoint, p2: IPoint): number {
  const x = p1.x - p2.x;
  const y = p1.y - p2.y;
  return Math.sqrt(x * x + y * y)
}

interface IRgbcolor {
  r: number;
  g: number;
  b: number;
}
export function colorRGBtoHex(color: IRgbcolor) {
  const { r, g, b } = color;
  const hex = "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  return hex;
}


/**
 * 求一条直线和一个圆的焦点
 * 
 * @export
 * @param {number} r 圆的半径
 * @param {number} h 圆心x
 * @param {number} k 圆心y
 * @param {number} m 直线y = mx+n 中的m
 * @param {number} n 直线y = mx+n 中的n
 * @returns 因为可能有多个坐标，返回的是交点中x的集合
 */
export function findCircleLineIntersections(r: number, h: number, k: number, m: number, n: number): number[] {
  // circle: (x - h)^2 + (y - k)^2 = r^2
  // line: y = m * x + n
  // r: circle radius
  // h: x value of circle centre
  // k: y value of circle centre
  // m: slope
  // n: y-intercept

  // get a, b, c values

  // var a = 1 + sq(m);
  const a = 1 + m * m;
  // var b = -h * 2 + (m * (n - k)) * 2;
  const b = -h * 2 + (m * (n - k)) * 2;
  // var c = sq(h) + sq(n - k) - sq(r);
  const c = h * h + (n - k) * (n - k) - r * r;

  // get discriminant
  // var d = sq(b) - 4 * a * c;
  const d = b * b - 4 * a * c;
  if (d >= 0) {
    // insert into quadratic formula
    // var intersections = [
    //   (-b + sqrt(sq(b) - 4 * a * c)) / (2 * a),
    //   (-b - sqrt(sq(b) - 4 * a * c)) / (2 * a)
    // ];

    const intersections = [
      (-b + Math.sqrt(b * b - 4 * a * c)) / (2 * a),
      (-b - Math.sqrt(b * b - 4 * a * c)) / (2 * a)
    ];


    if (d == 0) {
      // only 1 intersection
      return [intersections[0]];
    }
    return intersections;
  }
  // no intersection
  return [];
}



interface ILine {
  m: number;
  n: number;
}
/**
 * 已知两点求直线
 * 
 * @export
 * @param {IPoint} p1 
 * @param {IPoint} p2 
 * @returns => { m: number, n: number} 
 * 
 * 分别为直线y = mx + n中的 m和n
 */
export function getLineEquationByTwoPoints(p1: IPoint, p2: IPoint): ILine {
  const m = (p2.y - p1.y) / (p2.x - p1.x);
  const n = p1.y - p1.x * m;
  return {
    m,
    n
  }
}


/**
 * 已知直线方程 y = mx + n, 且一个x, 求y的值
 * 
 * @export
 * @param {ILine} line 
 * @param {number} x 
 * @returns {number} 
 */
export function getLineYByXvalue(line: ILine, x: number): number {
  const y = line.m * x + line.n;
  return y;
}

import { EventEmitter } from 'fbemitter';
import { degreesToRadians, createCircleDom, getTwoPointsDistance, IPoint, colorRGBtoHex, getLineEquationByTwoPoints, findCircleLineIntersections, getLineYByXvalue } from '../utils';
import { IColorWheelConfig, IConfig } from './interface';

export default class ColorWheel extends EventEmitter {

  private dotDraggable: boolean = false;

  private dotId: string = '__COLOR_PICKER_DOT_ID__';

  private canvasId: string = '__COLOR_PICKER_CANVAS__';

  public canvas!: HTMLCanvasElement;

  public container!: HTMLElement;

  public centerMask!: HTMLElement;

  public dot!: HTMLElement;

  // 圆心
  get circleCenterCoord(): { x: number, y: number } {
    const { container, dot } = this;
    return {
      x: (container.offsetWidth - dot.offsetWidth) / 2,
      y: (container.offsetHeight - dot.offsetHeight) / 2,
    }
  }

  get bigCircleRadius(): number {
    const { container } = this;
    return container.offsetHeight / 2;
  }

  get smallCircleRadius(): number {
    const { centerMask } = this;
    return centerMask.offsetHeight / 2;
  }

  private get boundingClientRect(): DOMRect {
    return this.container.getBoundingClientRect();
  }

  private defaultConfig: IColorWheelConfig = {
    size: 500,
    centerColor: '#FFF',
    containerId: '',
    pipeCircleSize: 300,
    dotSize: 6,
    dotColor: "#333"
  }

  private config!: IColorWheelConfig;

  constructor(config: IConfig) {
    super();
    this.config = {
      ...this.defaultConfig,
      ...config
    }
    this.container = document.getElementById(config.containerId) as HTMLElement;
    this.handleContainerPosition();
    this.init();
    // @ts-ignore
    window.colorPicker = this;
  }

  private handleContainerPosition() {
    if (!this.container) throw "container id error";
    this.container.style.width = this.config.size + 'px';
    this.container.style.height = this.config.size + 'px';
    this.container.style.margin = 'auto';
    const positionType = window.getComputedStyle(this.container).position;
    if (positionType === 'static') {
      this.container.style.position = 'relative';
    }
  }

  public getData(positionX: number, positionY: number) {
    const ctx: CanvasRenderingContext2D = this.canvas.getContext('2d') as CanvasRenderingContext2D;
    let info: ImageData = ctx.getImageData(positionX, positionY, 1, 1);
    let { data } = info;
    let r = data[0], g = data[1], b = data[2];
    let hexColor = colorRGBtoHex({ r, g, b });
    return {
      rgb: {
        r: data[0],
        g: data[1],
        b: data[2],
      },
      hex: hexColor,
      dotPosition: {
        left: positionX,
        top: positionY
      }
    };
  }

  private init(): void {
    this.drawColorWheel();
    this.drawCenterMask();
    this.addDragableDot();
    this.initEvents();
  }

  private initEvents() {
    document.addEventListener("pointerdown", this.moveStart.bind(this), false);
    document.addEventListener("pointermove", this.dotMoveHandler.bind(this), false);
    document.addEventListener("pointerup", this.moveEnd.bind(this), false);
    this.setDotDefaultPosition();
  }

  private setDotDefaultPosition() {
    const { dotPositon } = this.config;
    if (dotPositon && dotPositon.left && dotPositon.top) {
      this.setDotPosition(Number(dotPositon.left), Number(dotPositon.top));
    } else {
      this.setDotPosition(410, 407);
    }
  }

  private drawColorWheel() {
    const { container } = this;
    const size = this.config.size;
    const MAX_HEX = 255;
    const MAX_ANGLE = 360;
    const CENTER_COLOR = '#FFFFFF';
    const radius = size / 2;
    const canvas = document.createElement('canvas');
    canvas.id = this.canvasId;
    this.canvas = canvas;
    canvas.width = canvas.height = size;

    const canvasClone = document.createElement('canvas');
    const ctx: CanvasRenderingContext2D = canvas.getContext('2d') as CanvasRenderingContext2D;
    canvasClone.width = canvasClone.height = size;
    const canvasCloneCtx: CanvasRenderingContext2D = canvasClone.getContext('2d') as CanvasRenderingContext2D;

    let angle = 0;
    const hexCode = [255, 0, 0];
    let pivotPointer = 0;
    const colorOffsetByDegree = 4.322;

    while (angle++ < MAX_ANGLE) {
      const pivotPointerbefore = (pivotPointer + 3 - 1) % 3;

      if (hexCode[pivotPointer] < MAX_HEX) {
        hexCode[pivotPointer] = (
          hexCode[pivotPointer] + colorOffsetByDegree > MAX_HEX ?
            MAX_HEX :
            hexCode[pivotPointer] + colorOffsetByDegree);
      } else if (hexCode[pivotPointerbefore] > 0) {
        hexCode[pivotPointerbefore] = (
          hexCode[pivotPointerbefore] > colorOffsetByDegree ?
            hexCode[pivotPointerbefore] - colorOffsetByDegree :
            0
        );
      }
      else if (hexCode[pivotPointer] >= MAX_HEX) {
        hexCode[pivotPointer] = MAX_HEX;
        pivotPointer = (pivotPointer + 1) % 3;
      }
      canvasCloneCtx.clearRect(0, 0, size, size);
      // 创建渐变色
      const grad = canvasCloneCtx.createRadialGradient(radius, radius, 0, radius, radius, radius);
      grad.addColorStop(0, CENTER_COLOR);
      grad.addColorStop(1, 'rgb(' + hexCode.map((h) => Math.floor(h)).join(',') + ')');
      canvasCloneCtx.fillStyle = grad;
      canvasCloneCtx.globalCompositeOperation = 'source-over';
      canvasCloneCtx.beginPath();
      canvasCloneCtx.arc(radius, radius, radius, 0, Math.PI * 2);
      canvasCloneCtx.closePath();
      canvasCloneCtx.fill();
      canvasCloneCtx.globalCompositeOperation = 'destination-out';
      canvasCloneCtx.beginPath();

      canvasCloneCtx.arc(radius, radius, 0, degreesToRadians(angle + 1), degreesToRadians(angle + 1));
      canvasCloneCtx.arc(radius, radius, radius + 1, degreesToRadians(angle + 1), degreesToRadians(angle + 1));
      canvasCloneCtx.arc(radius, radius, radius + 1, degreesToRadians(angle + 1), degreesToRadians(angle - 1));
      canvasCloneCtx.arc(radius, radius, 0, degreesToRadians(angle + 1), degreesToRadians(angle - 1));
      canvasCloneCtx.closePath();
      canvasCloneCtx.fill();
      ctx.drawImage(canvasClone, 0, 0);
    }

    const el = createCircleDom('div', size);
    el.style.overflow = 'hidden';
    el.style.position = "absolute";
    el.style.left = (container.offsetWidth - canvas.width) / 2 + 'px';
    el.style.top = (container.offsetHeight - canvas.height) / 2 + 'px';
    el.style.zIndex = '2';
    el.appendChild(this.canvas);
    container.appendChild(el);
  }

  /**
   * 添加中间的圆形遮罩
   * 
   * @private
   * 
   * @memberOf ColorWheel
   */
  private drawCenterMask() {
    const { container } = this;
    const { pipeCircleSize, size, centerColor } = this.config;
    if (pipeCircleSize > 0) {
      const el = createCircleDom('div', pipeCircleSize);
      el.style.background = centerColor;
      el.style.position = "absolute";
      el.style.left = (container.offsetWidth - pipeCircleSize) / 2 + 'px';
      el.style.top = (container.offsetHeight - pipeCircleSize) / 2 + 'px';
      el.style.zIndex = '3';

      this.centerMask = el;
      this.container.appendChild(el);
    }
  }

  addDragableDot() {
    const { dotSize, dotColor, size, dotClass } = this.config;
    this.dot = document.createElement("div");
    this.dot.style.position = "absolute";
    this.dot.style.height = "0";
    this.dot.style.width = "0";

    this.dot.style.left = (size / 2 - dotSize / 2) / 2 - 30 + 'px';
    this.dot.style.top = (size / 2 - dotSize / 2) / 2 - 30 + 'px';

    const el = createCircleDom('div', dotSize);
    el.id = this.dotId;
    el.style.background = 'none';
    el.style.border = `4px solid ${dotColor}`;
    el.style.position = "absolute";
    el.style.boxSizing = "content-box";
    el.style.left = `${(-(dotSize + 4)) / 2}px`;
    el.style.top = `${(- (dotSize + 4)) / 2}px`;
    el.style.zIndex = '3';

    if (dotClass) {
      const _class = el.getAttribute('class');
      el.setAttribute('class', _class ? `${_class} ${dotClass}` : dotClass);
    }
    this.dot.appendChild(el);
    this.container.appendChild(this.dot);
  }

  private moveEnd() {
    this.dotDraggable = false;
  }
  private moveStart(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (target.id === this.canvasId || target.id === this.dotId) {
      this.dotDraggable = true;
      this.setPositionByEvent(event);
    }
  }

  dotMoveHandler(event: MouseEvent) {
    if (!this.dotDraggable) { return; }
    this.setPositionByEvent(event);
  }


  setPositionByEvent(event: MouseEvent) {
    const x = event.clientX - this.boundingClientRect.left;
    const y = event.clientY - this.boundingClientRect.top;

    this.setDotPosition(x, y);

  }

  ifPointInWheel(x: number, y: number) {
    const { size } = this.config;
    const centerPoint: IPoint = { x: size / 2, y: size / 2 };
    const currentPoint: IPoint = { x, y };
    const distance = getTwoPointsDistance(centerPoint, currentPoint);

    const colorWheelRadius = size / 2;
    const centerMaskRadius = this.config.pipeCircleSize / 2;
    const { left, width, top, height } = this.boundingClientRect;
    return x <= left + width && y <= top + height && distance <= colorWheelRadius && distance >= centerMaskRadius;
  }


  public setDotPosition(x: number, y: number) {
    let _x = x - 0, _y = y - 0;

    const p1 = { x, y };
    const p2 = this.circleCenterCoord; // 圆心

    const line = getLineEquationByTwoPoints(p1, p2);
    // 直线和大圆的交点x的值
    const circleLineIntersections = findCircleLineIntersections(this.bigCircleRadius - 1, p2.x, p2.y, line.m, line.n);
    // 直线和小圆的交点x的值（中间白色的那个）
    const circleLineIntersections2 = findCircleLineIntersections(this.smallCircleRadius - 1, p2.x, p2.y, line.m, line.n);
    if (circleLineIntersections.length === 0) {
      return;
    } else if (circleLineIntersections.length === 1) { // 圆的切线

    } else {
      if (getTwoPointsDistance(p1, p2) > this.bigCircleRadius || getTwoPointsDistance(p1, p2) < this.smallCircleRadius) { //说明在大圆外头或者小圆里头
        if (getTwoPointsDistance(p1, p2) > this.bigCircleRadius) {
          _x = p1.x >= p2.x ? circleLineIntersections[0] : circleLineIntersections[1];
          _y = getLineYByXvalue(line, _x);
        } else {
          _x = p1.x >= p2.x ? circleLineIntersections2[0] : circleLineIntersections2[1];
          _y = getLineYByXvalue(line, _x);
        }
      }
    }

    this.dot.style.left = _x + 'px';
    this.dot.style.top = _y + 'px';
    const colorValue = this.getData(_x, _y);
    setTimeout(() => {
      this.emit("colorChange", colorValue);
    }, 0);
  }

  public setColor(hexColor: string): void {
    const { offsetWidth, offsetHeight } = this.canvas;
    for (let x = 0; x <= offsetWidth; x++) {
      for (let y = 0; y <= offsetHeight; y++) {
        const ctx: CanvasRenderingContext2D = this.canvas.getContext('2d') as CanvasRenderingContext2D;
        const info: ImageData = ctx.getImageData(x, y, 1, 1);
        const { data } = info;
        const r = data[0], g = data[1], b = data[2];
        const hex = colorRGBtoHex({ r, g, b });
        if (hexColor == hex) {
          this.setDotPosition(x, y);
          return;
        }
      }
    }
    console.warn(`color picker can not find the color: ${hexColor}`);
  }
}

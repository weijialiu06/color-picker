export interface IValue {
  r: number;
  g: number;
  b: number;
}

export interface IConfig {
  size?: number;
  containerId: string;
  centerColor?: string;
  pipeCircleSize?: number;
  dotSize?: number;
  dotColor?: string;
  dotClass?: string;
}

export interface IColorWheelConfig {
  size: number;
  containerId: string;
  centerColor: string;
  pipeCircleSize: number;
  dotSize: number;
  dotColor: string;
  dotClass?: string;
}

export interface IColorWheel {
  getValue(positionX: number, positionY: number): IValue;
}
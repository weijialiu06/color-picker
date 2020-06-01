export interface IValue {
  r: number;
  g: number;
  b: number;
}

export interface IPosition {
  left: number;
  top: number;
}

export interface IConfig {
  size?: number;
  containerId: string;
  centerColor?: string;
  pipeCircleSize?: number;
  dotSize?: number;
  dotColor?: string;
  dotClass?: string;
  dotPositon?: IPosition;
}

export interface IColorWheelConfig {
  size: number;
  containerId: string;
  centerColor: string;
  pipeCircleSize: number;
  dotSize: number;
  dotColor: string;
  dotClass?: string;
  dotPositon?: IPosition;
}
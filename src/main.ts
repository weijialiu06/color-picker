import ColorWheel from './lib/ColorWheel';

const WARREPER_ID = '__COLOR_PICKER_CONTAINER__'; // dom id
const CANVAS_SIZE = 535;
const colorWheel = new ColorWheel({
  size: CANVAS_SIZE,
  containerId: WARREPER_ID,
  pipeCircleSize: 300, // 中间镂空的大小
  dotClass: "dot-class"
});
const p = document.body.appendChild(document.createElement('p'));
p.style.position = "fixed";
p.style.top = "0px";
p.style.left = "0px";

// 通过监听colorChange 事件获取但前的颜色值
interface IColorValue {
  r: number;
  g: number;
  b: number;
  hex: string; // 十六进制颜色
}
colorWheel.addListener('colorChange', (data: IColorValue) => {
  document.body.style.background = `rgb(${data.r}, ${data.g}, ${data.b})`
  p.innerHTML = `RGB: ${data.r}, ${data.g}, ${data.b}<br />HEX:<span style="color: ${data.hex};font-weight:bold;"> ${data.hex}</span>`;
});

export { };

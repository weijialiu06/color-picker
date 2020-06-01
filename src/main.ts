import ColorWheel from './lib/ColorWheel';

const WARREPER_ID = '__COLOR_PICKER_CONTAINER__'; // dom id
const CANVAS_SIZE = 535;
const colorWheel = new ColorWheel({
  size: CANVAS_SIZE,
  containerId: WARREPER_ID,
  pipeCircleSize: 300, // 中间镂空的大小
  dotClass: "dot-class",
  dotPositon: {
    left: 100,
    top: 400
  }
});
const p = document.body.appendChild(document.createElement('div'));
p.style.position = "fixed";
p.style.top = "0px";
p.style.left = "0px";

// 通过监听colorChange 事件获取但前的颜色值
interface IColorValue {
  // rgb颜色
  rgb: {
    r: number,
    g: number,
    b: number,
  };
  // 十六进制颜色
  hex: string;
  // 滑块的位置信息
  dotPosition: {
    left: number,
    top: number,
  };
}
colorWheel.addListener('colorChange', (data: IColorValue) => {
  const { r, g, b } = data.rgb;
  const { left, top } = data.dotPosition;
  const { hex } = data;
  document.body.style.background = `rgb(${r}, ${g}, ${b})`
  p.innerHTML = `
  RGB: ${r}, ${g}, ${b}<br />HEX:<span style="color: ${hex};font-weight:bold;"> ${hex}</span>
  <p>当前滑块的位置是{left: ${left}, top: ${top}}</p>
  `;
});

setTimeout(() => {
  colorWheel.setColor("#3769ff");
}, 2000);
export { };

# circular-color-picker

圆环颜色选择器

## 安装

```
npm i circular-color-picker --save-dev
```

## 使用

```js
const colorWheel = new ColorWheel(config);
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
  console.log(data);
});
```

## config options

| config         | 说明                                        | 是否必须 |
| -------------- | ------------------------------------------- | -------- |
| containerId    | canvas 色环需要挂载的父元素 id              | 是       |
| size           | 颜色画板圆的直径大小                        | 否       |
| dotClass       | 滑块的 class 样式，需加上!important 覆盖    | 否       |
| pipeCircleSize | 中间镂空部分圆的直径大小                    | 否       |
| dotPosition    | {left: number, top: number } 滑块默认的位置 | 否       |

## Events

### colorChange

每次拖拽都会触发 colorChange 事件，事件的返回值是一个包含了当前位置颜色信息的对象；

```js
colorPicker.addListener('colorChange', (data: IColorValue) => {
  console.log(data);
});
```

## Events

### setDotPosition(left: number, y: number)

设置滑块的位置

## demo

**html template**

```html
<div>
  <div class="picker-container" id="color-picker"></div>
</div>
```

**js**

```js
import ColorWheel from 'circular-color-picker';

const colorWheel = new ColorWheel({
  size: 535,
  containerId: 'color-picker',
  pipeCircleSize: 100,
  dotClass: 'dot-class',
  dotPositon: {
    left: 100,
    top: 400,
  },
});

colorWheel.addListener('colorChange', (data: IColorValue) => {
  console.log(data);
});

setTimeout(() => {
  colorWheel.setDotPosition(300, 400);
}, 3000);
```

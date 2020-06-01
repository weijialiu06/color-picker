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
  r: number;
  g: number;
  b: number;
  hex: string; // 十六进制颜色
}
colorWheel.addListener('colorChange', (data: IColorValue) => {
  console.log(data);
});
```

## config options

| config         | 说明                                     | 是否必须 |
| -------------- | ---------------------------------------- | -------- |
| containerId    | canvas 色环需要挂载的父元素 id           | 是       |
| size           | 颜色画板圆的直径大小                     | 否       |
| dotClass       | 滑块的 class 样式，需加上!important 覆盖 | 否       |
| pipeCircleSize | 中间镂空部分圆的直径大小                 | 否       |

## Events

### colorChange

每次拖拽都会触发 colorChange 事件，事件的返回值是一个包含了当前位置颜色信息的对象；

```js
colorPicker.addListener('colorChange', (data: IColorValue) => {
  console.log(data);
});
```

## demo

**html template**

```html
<div>
  <div class="picker-container" id="color-picker"></div>
</div>
```

**js**

```js
@Component
export default class App extends Vue {
  mounted() {
    const colorWheel = new ColorWheel({
      size: 535,
      containerId: 'color-picker',
      pipeCircleSize: 100,
      dotClass: 'dot-class',
    });

    colorWheel.addListener('colorChange', (data: IColorValue) => {
      console.log(data);
    });
  }
}
```

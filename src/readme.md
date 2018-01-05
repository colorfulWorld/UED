## canvas API 相关介绍

### drawImage

就是把一个 image 对象或者 canvas 上（甚至是 video 对象上的的每一帧）指定位置和尺寸的图像绘制到当前的画布上。而在我们的需
求中，是要把整个图像绘制到画布中。 drawImage(image, sx, sy, swidth, sheight,dx,dy,dWidth,dHeight);

* image:iamge 或者是 canvas 对象
* sx,sy 源对象的宽高 可选
* dx,dy 画布上的 x,y 的坐标
* dWidth,dHeight 在画布上绘制的宽高 可选

### imageData

imageData 包含三个属性：

* width 、 height 是读取图像像素信息完整区域的宽度和高度
* data 是一个 Unit8ClampedArray 类型的以为数组，包含了整个图片区域里每个像素点的 RGBA 的整型数据。

### 绘制图案

```javascript
function draw() {
  //清空画布
  canvas.ctx.clearRect(0, 0, canvas.w, canvas.h)
  var len = particles.length
  var curr_particle = null
  for (var i = 0; i < len; i++) {
    curr_particle = particles[i]

    //设置填充颜色
    canvas.ctx.fillStyle = curr_particle.fillStyle

    //绘粒子到画布上
    canvas.ctx.fillRect(curr_particle.x, curr_particle.y, 1, 1)
  }
}
```

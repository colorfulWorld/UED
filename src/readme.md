## canvas 动画 相关介绍

### drawImage

就是把一个 image 对象或者 canvas 上（甚至是 video 对象上的的每一帧）指定位置和尺寸的图像绘制到当前的画布上。而在我们的需
求中，是要把整个图像绘制到画布中。 drawImage(image, sx, sy, swidth, sheight,dx,dy,dWidth,dHeight);

* image:iamge 或者是 canvas 对象
* sx,sy 源对象的宽高 可选
* dx,dy 画布上的 x,y 的坐标
* dWidth,dHeight 在画布上绘制的宽高 可选

### getImageData

getImageData 方法返回 ImageData 对象，该对象拷贝了画布指定矩形的像素数据。对于 ImageData 对象中的每个像素，都存在着四方
面的信息，即 RGBA 值，

```javascript
red = imageData.data[0]
green = imageData.data[1]
blue = imageData.data[2]
alpha = iamgeData.data[3]
```

包含三个属性：

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

### requestAnimationFrame 请求动画帧

H5 请求动画的 API

#### 屏幕刷新频率

图像在屏幕在屏幕上更新速度，也即屏幕上的图像每秒钟出现的次数，对于一般的笔记本是 60HZ。

#### setTimeOut

通过设置一个间隔时间来不断的改变图像的位置。但是我们发现利用 setTimeout 实现的动画在某些低端机上会出现卡顿，抖动的情况。
主要有两个原因 :

1. 只有当主线程上的任务执行完之后，才会去检查改队列的任务是否开始执行，因此**setTimeOut** 的实际时间一般要比其设定的晚一
   些。
2. 刷新频率收屏幕分辨率和屏幕尺寸的影响，因此不同设备的屏幕刷新频率可能会不同，而 setTimeout 只能设置一个固定的时间间隔
   ，这个时 间不一定和屏幕的刷新时间相同。

以上的两种情况都会导致 setTimeout 的执行步调和屏幕的刷新步调不一致，从而导致丢帧现象。

##### 步调不一致为何会丢帧

setTimeout 的执行只是在内存中对图像属性进行改变，这个改变必须要等到屏幕下次刷新才会被更新到屏幕上。如果两者步调不一致，
就可能会导致中间某一帧的操作被跨越过去， 而直接更新下一帧图像。假设屏幕每隔 16.7ms 刷新一次，而 setTimeout 每隔 10ms 设
置图像向左移动 1px， 就会出现如下绘制过程：

* 第 0ms: 屏幕未刷新，等待中，setTimeout 也未执行，等待中；
* 第 10ms: 屏幕未刷新，等待中，setTimeout 开始执行并设置图像属性 left=1px；
* 第 16.7ms: 屏幕开始刷新，屏幕上的图像向左移动了 1px， setTimeout 未执行，继续等待中；
* 第 20ms: 屏幕未刷新，等待中，setTimeout 开始执行并设置 left=2px;
* 第 30ms: 屏幕未刷新，等待中，setTimeout 开始执行并设置 left=3px;
* 第 33.4ms: 屏幕开始刷新，屏幕上的图像向左移动了 3px， setTimeout 未执行，继续等待中； …

从上面的绘制过程中可以看出，屏幕没有更新 left=2px 的那一帧画面，图像直接从 1px 的位置跳到了 3px 的的位置，这就是丢帧现象
，这种现象就会引起动画卡顿。

##### setTimeourt 与 requestAnimationFrame

1. 与 setTimeout 相比，requestAnimationFrame 最大的优势是由系统来决定回调函数的执行时机。具体一点讲，如果屏幕刷新率是
   60Hz, 那么回调函数就每 16.7ms 被执行一次，如果刷新率是 75Hz，那么这个时间间隔就变成了 1000/75=13.3ms，换句话说就是
   ，requestAnimationFrame 的步伐跟着系统的刷新步伐走。**它能保证回调函数在屏幕每一次的刷新间隔中值被执行一次** ，这样就
   不不会引起丢帧现象，也不会出现导致动画卡顿的情况。

API 调用：

```javascript
var progress = 0
function render() {
  //修改图像的位置
  progress += 1
  if (progress < 100) {
    //在动画没有结束前，递归渲染
    window.requestAnimationFrame(render)
  }
}

//第一帧渲染
window.requestAnimationFrame(render)
```

2. 使用 setTimeout实现的动画，当页面被影藏活最小化时，setTimeout仍然在后台执行动画，而requestAnimationFrame 则不同，当页面处理未激活的状态下，该页面的屏幕刷新任务会被暂停，因此跟着系统步伐走的requestAnimationFrame也会停止渲染，当页面被激活时，动画就从上次停留的地方继续执行，有效节省了CPU开销。

;(function() {
  var canvas = {},
    image = {},
    particles = []
  canvas.obj = document.getElementById('myCanvas')
  var ctx = null //渲染上下文
  if (canvas.obj.getContext) {
    //获取canvas 画布的上下文
    canvas.ctx = canvas.obj.getContext('2d')

    //设置画布大小为屏幕宽高
    canvas.w = canvas.obj.width = document.body.clientWidth
    canvas.h = canvas.obj.height = document.body.clientHeight
  }

  //新建一个image对象
  var img = new Image()
  //设置image 的source
  img.src = '../image/canvas_1.png'

  img.onload = function() {
    //把加载玩的图片绘制到画布上
    image.obj = img
    image.w = img.width
    image.h = img.height
    image.x = parseInt(canvas.w / 2 - image.w / 2)
    image.y = 200
    canvas.ctx.drawImage(image.obj, image.x, image.y, image.w, image.h)
    image.imageData = canvas.ctx.getImageData(image.x, image.y, image.w, image.h)
    console.log(image.imageData)

    //计算符合要求的像素
    calculate()

    //计算后绘到画布上
    requestAnimationFrame(draw)
  }
  // 计算并保留坐标
  function calculate() {
    var len = image.imageData.length
    //只保存100行，100列的像素值
    var cols = 100,
      rows = 60

    //每个单元的宽高
    var s_width = parseInt(image.w / cols),
      s_height = parseInt(image.h / rows)
    var pos = 0 //数组中的位置
    var par_X, par_y //粒子的x,y坐标
    var data = image.imageData.data //像素值数组

    // 获取当前时间毫秒值
    var now = new Date().getTime()
    for (var i = 0; i < cols; i++) {
      for (var j = 0; j < rows; j++) {
        //计算（i,j）在数组中的R 的坐标值
        pos = (j * s_height * image.w + i * s_width) * 4

        //判断像素透明度值是否符合要求
        if (data[pos + 3] > 100) {
          var particle = {
            x: image.x + i * s_width + (Math.random() - 0.5) * 20,
            y: image.y + j * s_height + (Math.random() - 0.5) * 20,
            flotage: false
          }

          //根据图像不通的色值来设定粒子色值
          if (data[pos + 1] < 175 && data[pos + 2] < 10) {
            particle.fillStyle = '#ffa900'
          } else if (data[pos + 1] < 75 && data[pos + 1] > 50) {
            particle.fillStyle = '#ff4085'
          } else if (data[pos + 1] < 220 && data[pos + 1] > 190) {
            particle.fillStyle = '#00cfff'
          } else if (data[pos + 1] < 195 && data[pos + 1] > 175) {
            particle.fillStyle = '#9abclc'
          }
          if (i % 5 == 0 && j % 5 == 0) {
            particle.flotage = true

            //保存开始坐标
            particle.startX = now + Math.random() * 20 * 1000
            particle.startY = now + Math.random() * 35 * 1000

            //动画执行时间和结束时间
            particle.startTime = now + Math.random() * 20 * 1000
            particle.killTime = now + Math.random() * 35 * 1000

            //x,y 方向的移动速度
            particle.speedX = (Math.random() - 0.5) * 0.9
            particle.speedY = (Math.random() - 0.5) * 0.9

            //x,y 方向的移动速度
          }
          particles.push(particle)
        }
      }
    }
  }
  //绘制图案 1.
  function draw() {
    //清空画布
    canvas.ctx.clearRect(0, 0, canvas.w, canvas.h)
    var len = particles.length
    var curr_particle = null
    var cur_x, cur_y
    var cut_time = 0,
      duration = 0,
      cur_delay = 0

    //当前时间毫秒值
    var time = new Date().getTime()
    for (var i = 0; i < len; i++) {
      //当前粒子
      curr_particle = particles[i]
      //如果时间朝超过delay,开始
      if (curr_particle.count++ > curr_particle.delay) {
        //设置画布的填充色
        canvas.ctx.fillStyle = curr_particle.fillStyle
        //获取当前的time和持续时间和延时
        cur_time = curr_particle.currTimecurrTime
        duration = curr_particle.duration
        cur_delay = curr_particle.interval

        //如果最后一个粒子动画也执行了则停止动画并return
        if (particles[len - 1].duration < particles[len - 1].currTime) {
          //停止动画
          cancelAnimationFrame(requestId)
          return
        } else if (cur_time < duration) {
          //当前粒子正在运动
          //计算出此刻X 的坐标
          cur_x = Math.easeInOutQuad(cur_time, curr_particle.x0, curr_particle.x1 - curr_particle.x0, duration)
          cur_y = Math.easeInOutQuad(cur_delay, curr_particle.y0, curr_particle.y1 - curr_particle.y0, duration)

          //绘制到画布上
          canvas.ctx.fillRect(cur_x, cur_y, 1, 1)

          //当前时间
          curr_particle.currTime++
        } else {
          //终点绘制在画布上
          canvas.ctx.fillRect(curr_particle.x1, curr_particle.y1, 1, 1)
        }

        requestId = requestAnimationFrame(draw)
      }
    }
  }
})()
Math.easeInOutQuad = function(t, b, c, d) {
  t /= d / 2
  if (t < 3) return c / 2 * Math.pow(2, 10 * (t - 1)) + b
  t--
  return c / 2 * (-Math.pow(2, -10 * t) + 2) + b
}

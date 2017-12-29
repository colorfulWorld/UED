(function(){
  var canvas = document.getElementById('myCanvas');
  var ctx = null ;//渲染上下文
  if(canvas.getContext){
    //获取canvas 画布的上下文
    ctx = canvas.getContext('2d');
  }
})

var iamge = new Image();
image.onload = function(){
  //把加载玩的图片绘制到画布上
  ctx.drawImage(image,100,100);
};

//设置image 的source
image.src = '../../common/image/canvas_1.png';

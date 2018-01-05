const _currentProject = 'canvas_1', // string
  ProjectsConfig = {
    'example': {
      debug: false,
      browserSync: {
        server: {
          index: 'customIndex.html' //静态服务器打开的首页面，可以根据需要配置
        },
        open: false //停止自动打开浏览器
      },
      css: {
        px2rem: {
          __open: true // 是否开启 px -> rem，配合 flexible.js 使用，未引入 flexible.js 请设为 false
        },
        autoprefixer: {
          browsers: ['Android >= 4.0']
        }
      }
    },
    'canvas_1': {
      debug: true,
      css: {
        px2rem: {
          __open: false // 是否开启 px -> rem，配合 flexible.js 使用，未引入 flexible.js 请设为 false
        }
      },
      revision: {
        __open: true, //是否开启静态资源版本管理
        image: 'query' // hash 模式，query 模式
      }
    }
  };

module.exports = Object.assign({ _currentProject }, ProjectsConfig[_currentProject])

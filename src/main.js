import Vue from 'vue';
import VueAMap from 'vue-amap';
import App from './App';
import router from './router';
import store from "./stroe";
import ElementUI from 'element-ui';
import 'babel-polyfill';
import './assets/reset.css';
import 'element-ui/lib/theme-chalk/index.css';
// import VueDirectiveImagePreviewer from 'vue-directive-image-previewer';
import VueDirectiveImagePreviewer from 'vue-directive-image-previewer';
import 'vue-directive-image-previewer/dist/assets/style.css';
import Viewer from 'v-viewer';
import 'viewerjs/dist/viewer.css';
import echarts from 'echarts';

Vue.config.productionTip = false
//echarts地图
Vue.prototype.$echarts = echarts
//element ui使用
Vue.use(ElementUI, {size: 'small'}, {zIndex: 2000})
//图片放大旋转使用
Vue.use(VueDirectiveImagePreviewer, {
  background: {     // or : background: '#000'
    color: '#000' // or rgba or rgb     // or image: 'url(xxx)'
  },
  // transition
  animate: {
    duration: 1,
    delay: 1
  },
  // loading (not supported)
  loading: {
    image: ''
  },
  // cursor(css)
  cursor: 'pointer',
  clickMethod: 'doubleClick'   // click or doubleClick(not supported)
})
Vue.use(Viewer, {
  defaultOptions: {
    zIndex: 999999002
  }
})
Viewer.setDefaults({
// 工具栏按钮的控制
  toolbar: {
    zoomIn: 0, // 放大
    zoomOut: 0, // 缩小
    oneToOne: 0, // 100%大小
    reset: 0, // 还原
    prev: 0, // 上一张
    play: 0, // 全屏显示
    next: 0, // 下一张
    rotateLeft: 1, // 逆时针旋转
    rotateRight: 1, // 顺时针旋转
    flipHorizontal: 0, // 水平翻转
    flipVertical: 0, // 垂直翻转
    title: 0  //当前图片标题
  }
})
//高德地图使用
Vue.use(VueAMap)
VueAMap.initAMapApiLoader({
  key: '34930e9667ca46b5d2e03d4a072a3b66',
  plugin: ['Geolocation', 'Geocoder', 'PlaceSearch'],
  // 默认高德 sdk 版本为 1.4.4
});
//路由
router.beforeEach((to, from, next) => { //这里是在所有路由跳转之前都会去执行以下操作
  if (to.path == '/login') { //如果要去的是登录页
    next() //那么随意，去就是了
  } else { //如果不是
    if (localStorage.getItem('isLogin')) { //判断当前浏览器的本地存储里面是不是有已经登录的信息
      // console.log(localStorage.getItem('isLogin'))
      next() //有的话，ok，去你想去的地址
    } else { //没有的话，也就是没有登录
      next({path: '/login'}) //去登录页
    }
  }
})

new Vue({
  components: {App},
  router,
  store,
  render: h => h(App)
}).$mount('#app')

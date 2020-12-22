//使用vuex创建数据仓库，并导出
import Vue from 'vue'; //导入vue
import Vuex from 'vuex'; //导入vuex
import test from './test.js'; //导入子仓库，方便管理

//vue使用vuex
Vue.use(Vuex);

//创建一个vuex仓库并导出
let store = new Vuex.Store({
  //配置整合所有子仓库，当前有几个子仓库
  modules: {test},
  //主要存放要放在vuex创库在的数据
  state: {},
  //计算属性
  getters: {},
  //方法，只有mutations中的方法才有资格修改state中的数据，只能包含同步代码，不能包含耗时的异步代码
  mutations: {},
  //方法，无法修改state中的值，可以包含耗时的异步操作
  actions: {}
});

export default store;

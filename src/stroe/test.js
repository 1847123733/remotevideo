//导入封装好的axios
import request from '@/utils/request'
//这是分类子仓库文件
export default {
  //你不加这玩意，就直接能访问。加上的话不容易产生混淆
  namespaced: true,
  //存放数据
  state: {
    list: [], //历史会见的el-table
    total: 0, //历史会见的页脚数据量
    isInit: false, //标识数据有没有被初始化过
  },
  //相当于计算属性
  getter: {},
  //actions修改此节点的数据
  //可以修改state中的数据，但不能发送异步请求
  mutations: {
    init(state, list) {
      state.list = list.data.data;
      state.total = list.data.total;
    }
  },
  //可以修改mutations中的数据，可以发送异步请求
  actions: {
    //vue页面的请求就是请求的这里的方法
    //state表示修改数据，commit表示同步，dispatch表示异步
    init({state, commit, dispatch}, params) {
      return request({
        url: '/appointment/meet/page',
        method: 'get',
        params
      }).then(list => commit('init', list));
    }
  }
}

<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
  export default {
    name: 'App',
    //退出浏览器是清空localstorage
    data() {
      return {
        _beforeUnload_time: "",
        _gap_time: "",
      };
    },
    methods: {
      beforeunloadHandler() {
        this._beforeUnload_time = new Date().getTime();
      },
      unloadHandler(e) {
        this._gap_time = new Date().getTime() - this._beforeUnload_time;
        console.log(this._gap_time);
        //判断是窗口关闭还是刷新  要发送同步请求
        if (this._gap_time <= 5) {
          //清空所有localStorage
          localStorage.clear();
        }
      },
    },
    destroyed() {
      window.removeEventListener("beforeunload", e =>
        this.beforeunloadHandler(e)
      );
      window.removeEventListener("unload", e => this.unloadHandler(e));
    },
    mounted() {
      //监听页面是否关闭
      window.addEventListener("beforeunload", e =>
        this.beforeunloadHandler(e)
      );
      window.addEventListener("unload", e => this.unloadHandler(e));
    }
  }
</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    height: 100%;
    width: 100%;
  }

  /*百度地图不显示标签*/
  .BMap_cpyCtrl {
    display: none;
  }

  .anchorBL {
    display: none;
  }
</style>

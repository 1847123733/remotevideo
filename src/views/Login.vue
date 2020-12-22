<template>
  <div class="page-wrapper">
    <div class="box">
      <div><img src="../assets/biaozhi.png" alt=""></div>
      <h2>通产智能律师远程视频会见管理系统</h2>
      <el-form class="login" :model="model" ref="form" :rules="rules" status-icon>
        <el-form-item prop="yhm">
          <el-input type="text" placeholder="请输入用户名" v-model="model.yhm"></el-input>
        </el-form-item>
        <el-form-item prop="mm">
          <el-input type="password" placeholder="请输入密码" v-model="model.mm"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="primary" class="btn-log" @click="login">登录</el-button>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import request from "@/utils/request";

  export default {
    name: "login",
    data() {
      return {
        //用户名密码
        model: {
          yhm: "",
          mm: ""
        },
        //验证规则
        rules: {
          yhm: [
            {required: true, message: "用户名不能为空..", trigger: "blur"},
            {max: 20, min: 1, message: "用户名长度1 - 20之间..", trigger: "blur"}
          ],
          mm: [
            {required: true, message: "密码不能为空..", trigger: "blur"},
            {max: 20, min: 1, message: "密码长度1 - 20之间..", trigger: "blur"}
          ]
        }
      };
    },
    methods: {
      //登录接口
      login() {
        this.$refs.form
          .validate()
          .then(flag => {
            //前台输入验证成功
            if (flag) {
              return request({
                url: "/log-in/validate",
                method: "post",
                data: this.model
              }).then(function (response) {
                if (response.data.code === 20000) {
                  localStorage.setItem('city', response.data.city) //用于地图使用
                  localStorage.setItem('isLogin', 1) //路由使用
                  localStorage.setItem('userId', response.data.data.id) //用于判断用户登没登录
                  localStorage.setItem("yhm", response.data.data.yhm); //显示用户名
                  localStorage.setItem("prison", response.data.data.prison); //显示监所
                  localStorage.setItem("id", response.data.data.id)
                  let qx = response.data.menus //权限
                  localStorage.setItem("qx", JSON.stringify(qx)); //存放权限
                  localStorage.setItem("menuRouter", "welcome"); //刚登录就是welcome
                  let yuyinid = response.data.data.role //看守所的id
                  localStorage.setItem("yuyinid", yuyinid) //只有看守所播报
                }
              });
            }
            // 验证失败
            else return new Promise(() => {
            });
          })
          .then(() => {
            this.$router.replace("/home");
          })
          .catch(() => {
            this.$message.error('账号或密码错误')
          });
      }
    },
    created() {
      // localStorage.clear()
      // 回车登录
      let that = this;
      document.onkeypress = function (e) {
        var keycode = document.all ? event.keyCode : e.which;
        if (keycode == 13) {
          that.login(); // 登录方法名
          return false;
        }
      };
    }
  };
</script>

<style scoped>
  .page-wrapper {
    width: 100%;
    height: 100%;
    margin: 0 auto;
    background: url("../assets/bg.jpg") no-repeat center center;
    background-size: 100% 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .box {
    width: 400px;
    text-align: center;
    padding: 20px;
  }

  .box > h2 {
    color: white;
    margin-bottom: 20px;
  }

  .btn-log {
    width: 400px;
    border: none;
    outline: none;
  }
</style>

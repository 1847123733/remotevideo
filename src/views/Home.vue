<template>
  <el-container class="page-wrapper">
    <el-aside v-show="hidden" width="200px">
      <div class="logo clearfix" @click='gowelcome'>
        <img src="../assets/tosunLOGO.png" alt/>
        <h3 style="cursor: pointer">通产智能</h3>
      </div>
      <el-menu ref="elMenu" :default-active="activeTabName" text-color="#fff" background-color="#02121F"
               active-text-color="#cf9236" @select="changeTab">
        <template v-for="(item, index) in qx">
          <el-submenu :index="index+''">
            <template slot="title">
              <i :class="item.icon1"></i>
              <span slot="title">{{ item.sjcd }}</span>
            </template>
            <el-menu-item v-for="(child, index) in item.children" :index="child.url" :key="index">
              <i :class="child.icon2"></i>
              <span>{{ child.menu }}</span>
              <!--实现新窗口打开组件-->
              <router-link target="_blank" :to="{path:'/index'}" v-if="child.url == 'screen'"
                           style="color: red; font-size: 12px">全屏
              </router-link>
            </el-menu-item>
          </el-submenu>
        </template>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header>
        <div @click="yincang" style="margin-left: -17px;">
          <i style="color: #fff; font-size:30px" class="el-icon-caret-left" v-if="iconshow"></i>
          <i style="color: #fff; font-size:30px" class="el-icon-caret-right" v-if="!iconshow"></i>
        </div>
        <div class="username">
          <div>
            <span>区域：</span><span v-text="prison"></span>
          </div>
          <div>
            <span>用户名：</span><span v-text="yhm"></span>
          </div>
          <el-button class="btn-logout" size="mini" type="danger" @click="updatepassword">修改密码</el-button>
          <el-button class="btn-logout" size="mini" type="danger" @click="logOut">退出</el-button>
        </div>
      </el-header>
      <el-main>
        <component :is="tabsMap[tabs].component"></component>
      </el-main>
    </el-container>
    <!--修改密码的dialog-->
    <el-dialog title="修改密码：" :visible="dialog" @close="closeDialog">
      <el-form :inline="true" :model="newform" label-position="right" label-width="180px" :rules="rules" ref="ruleForm">
        <el-form-item label="原密码：" prop="oldpassword">
          <el-input v-model="newform.oldpassword"></el-input>
        </el-form-item>
        <el-form-item label="新密码：" prop="newpassword">
          <el-input v-model="newform.newpassword"></el-input>
        </el-form-item>
        <el-form-item label="确认新密码：" prop="confirmnewpassword">
          <el-input v-model="newform.confirmnewpassword"></el-input>
        </el-form-item>
        <el-form-item style="margin-left: 80%">
          <el-button @click="updatemima">确认修改</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </el-container>
</template>

<script type="text/ecmascript-6">
  import request from "@/utils/request";
  import Welcome from './Welcome';                    //欢迎页面
  import Administration from './Administration';      //预约会见管理
  import Meetroom from './Meetroom';                  //会见室管理
  import Check from './Check';                        //律师初次审核管理
  import Register from './Register';                  //律师复审
  import Prison from './Prison';                      //监所管理
  import Meetpavilion from './Meetpavilion';          //会见亭管理
  import User from './User';                          //用户预约管理
  import History from './History';                    //历史预约管理
  import Warn from './Warn';                          //报警信息管理
  import Arraignment from './Arraignment';            //提审终端管理
  import Historyquery from './Historyquery';          //历史会见查询
  import Datastatistics from './Datastatistics';      //数据统计管理
  import Screen from './Screen';                      //监管平台管理
  import Routine from './Routine';                    //常规预约
  import Select from './Select';                      //没用到,测试
  import Speech from "speak-tts";                     //语音通知

  export default {
    data() {
      return {
        //展示隐藏
        iconshow: true,
        //监所信息展示
        prison: localStorage.getItem('prison'),
        //用户名信息展示
        yhm: localStorage.getItem('yhm'),
        //激活的tab
        activeTabName: "",
        //语音提示相关操作
        timer: '',
        dqsj: '',
        datas: '',
        speech: '',
        //菜单激活
        tabs: [""],
        //所有准备激活菜单项
        tabsMap: {
          //欢迎页面
          welcome: {
            component: Welcome
          },
          //预约会见管理
          administration: {
            component: Administration
          },
          //会见室管理
          meetroom: {
            component: Meetroom
          },
          //律师初审管理
          check: {
            component: Check
          },
          //律师注册管理
          register: {
            component: Register
          },
          //监所管理
          prison: {
            component: Prison
          },
          //会见亭管理
          meetpavilion: {
            component: Meetpavilion
          },
          //用户管理
          user: {
            component: User
          },
          //历史预约管理
          history: {
            component: History
          },
          //警告
          warn: {
            component: Warn
          },
          //提审终端页面
          arraignment: {
            component: Arraignment
          },
          //历史会见查询
          historyquery: {
            component: Historyquery
          },
          //数据统计管理
          datastatistics: {
            component: Datastatistics
          },
          //大屏
          screen: {
            component: Screen
          },
          //常规预约
          routine: {
            component: Routine
          },
          //选票
          select: {
            component: Select
          }
        },
        //用于隐藏菜单栏
        hidden: true,
        //隐藏状态栏的state
        state: 0,
        //权限管理
        qx: JSON.parse(localStorage.getItem("qx")),
        //修改密码的dialog
        dialog: false,
        //传递新密码
        newform: {
          oldpassword: '',
          newpassword: '',
          confirmnewpassword: ''
        },
        //表单验证
        rules: {
          oldpassword: [{required: true, message: '原密码不能为空', trigger: 'blur'}],
          newpassword: [{
            // 自定义验证函数 第二个参数是值，第三个是回调函数
            validator: (rule, value, callback) => {
              // 如果框里没填值，直接调用回调函数，显示一条信息
              if (value === '') callback(new Error('新密码不能为空'));
              // 如果填了值
              else {
                // 并且核实密码那里不是空，进行校验
                if (this.newform.confirmnewpassword !== '') this.$refs.ruleForm.validateField('confirmnewpassword');
                // 回调函数为空，则放行
                callback();
              }
              // 失去焦点，触发函数
            }, trigger: 'blur'
          }],
          confirmnewpassword: [{
            // 自定义验证函数 第二个参数是值，第三个是回调函数
            validator: (rule, value, callback) => {
              // 如果框里没填值，直接调用回调函数，显示一条信息
              if (value === '') callback(new Error('确认密码不能为空'));
              // 填了值，但是此值不等于新密码，直接调用回调函数，提示信息
              else if (value !== this.newform.newpassword) callback(new Error('两次密码不一致'));
              // 回调函数为空，则放行
              else callback();
            }, trigger: 'blur'
          }]
        },
      };
    },
    methods: {
      //改变激活项
      changeTab(index) {
        this.tabs.splice(this.tabs[0], 1, index)
        localStorage.setItem("menuRouter", index);
      },
      //点击标题跳回主页面
      gowelcome() {
        this.tabs.splice(this.tabs[0], 1, 'welcome')
        this.$refs.elMenu.activeIndex = null
        localStorage.setItem("menuRouter", "welcome");
      },
      //退出登录
      logOut() {
        let that = this;
        request({
          url: "/log-in/logout",
          method: "post"
        })
          .then(function (response) {
            if (response.data.code === 20000) {
              that.$router.replace("/login"); // 跳转到登录页
              localStorage.clear(); // 清空sessionStorage
              return new Promise(() => {
              }); // 返回一个永远是pending的promise对象
            }
          })
          .catch(function (error) {
            console.log(error, "报错信息");
          });
      },
      //点击打开修改密码的dislog
      updatepassword() {
        let that = this
        that.dialog = true
      },
      //点击关闭所有dialog提示框
      closeDialog() {
        let that = this
        that.dialog = false
        that.oldpassword = '';
        that.newpassword = '';
        that.confirmnewpassword = ''
      },
      //确认修改密码
      updatemima() {
        this.$refs.ruleForm.validate()
          .then(() => {
            let that = this
            request({
              url: '/user/changePwd',
              method: 'post',
              params: {
                oldPwd: that.newform.oldpassword,
                newPwd: that.newform.newpassword
              }
            })
              .then(function (response) {
                if (response.data.code === 20000) {
                  that.$message({
                    message: '修改成功',
                    type: 'success'
                  })
                  that.logOut()
                }
              })
              .catch(function (error) {
                console.log(error, '报错信息')
              })
          })
          .catch(() => {
          })
      },
      //用于隐藏侧边栏
      yincang() {
        let that = this
        that.iconshow = !that.iconshow
        if (that.state == 0) {
          that.hidden = false
          that.state = 1
        } else if (that.state == 1) {
          that.hidden = true
          that.state = 0
        }
      },
      //调用结束播报
      startInit() {
        let that = this
        that.timer = setInterval(function () {
          request({
            url: '/appointment/meets/stop',
            method: 'get',
          })
            .then(function (response) {
              if (response.data.code === 20000) {
                that.datas = response.data.data
                for (var i = 0; i < that.datas.length; i++) {
                  let room = that.datas[i].room
                  let name = that.datas[i].bzxrxm
                  that.speech = new Speech()
                  that.speech.setLanguage('zh-CN')
                  that.speech.init().then(() => {
                    that.speech.speak({
                      text: `请注意，会见室${room}的${name}会见结束!`
                    }).then(() => {
                    })
                  })
                }
              }
            })
            .catch(function (error) {
              console.log(error, '报错信息')
            })
        }, 50000)
      },
    },
    created() {
      let that = this
      let idsessionStorage = localStorage.getItem('id')
      let yuyinid = localStorage.getItem('yuyinid')
      if (idsessionStorage == null) {
        this.$router.replace('/login')
      }
      //刷新在本页面
      this.activeTabName = localStorage.getItem("menuRouter");
      this.tabs[0] = localStorage.getItem("menuRouter");
      if (yuyinid === '3') {
        that.startInit()
      }
    },
    beforeDestroy() {
      clearInterval(this.timer)
    }
  };
</script>

<style scoped>
  .el-main {
    padding: 0;
  }

  .logo {
    padding: 0 10px;
  }

  .logo > img {
    height: 40px;
    margin: 10px 0;
    float: left;
  }

  .logo > h3 {
    color: #ffffff;
    line-height: 60px;
    float: left;
    font-size: 22px;
  }

  .page-wrapper {
    height: 100%;
    width: 100%;
  }

  .el-aside {
    background-color: #02121F;
  }

  .el-menu {
    border-right: none;
  }

  .el-header {
    background-color: #02121F;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .el-header h1 {
    color: #ffd04b;
    text-shadow: 0 1px 0 #fff;
    font-size: 24px;
  }

  .el-tabs {
    height: 100%;
    width: 100%;
  }

  .el-tab-pane {
    height: 100%;
  }

  .username {
    color: #fff;
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .username > div {
    margin: 0 10px;
  }

  .btn-logout {
    margin-left: 20px;
  }

  .yincang {
    color: black;
    width: 20px;
    height: 20px;
    background-color: #FFFFFF;
    line-height: 20px;
    text-align: center;
    font-size: 20px;
  }
</style>

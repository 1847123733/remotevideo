<template>
  <div class="page-wrapper">
    <div class="top">
      <div class="button" @click="goback">返回</div>
      <img src="../assets/title.png" alt="">
      <span v-text="date" id="time"></span>
    </div>
    <div class="detail">
      <div class="box1">
        <div style="color: white;font-size: 25px">律师会见实时监控</div>
        <div class="video1">
          <div>
            <!--律师侧-->
            <div v-html="remoteStream" :class="remoteStream?'distant-stream':''"></div>
          </div>
        </div>
        <div class="table1">
          <div>
            <div style="margin-top: 20px">律师：{{list.lawyer}}</div>
            <div style="margin-top: 20px">执业证号：{{list.zyzh}}</div>
            <div style="margin-top: 20px">电话：{{list.lxdh}}</div>
            <div style="margin-top: 20px">会见亭：{{list.deviceno}}</div>
          </div>
        </div>
      </div>
      <div class="box2">
        <div style="color: white;font-size: 25px">在押人员会见实时监控</div>
        <div class="video2">
          <div>
            <!--在押人员侧-->
            <div v-html="remoteStream1" :class="remoteStream?'distant-stream':''"></div>
          </div>
        </div>
        <div class="table2">
          <div>
            <div style="margin-top: 15px">在押人员：{{list.bzxrxm}}</div>
            <div style="margin-top: 15px">在押人员身份证号：{{list.bzxrbh}}</div>
            <div style="margin-top: 15px">会见室：{{list.room}}</div>
          </div>
        </div>
      </div>
      <div class="box3">
        <div>
          <img src="../assets/biaozhi.png" width="250px" alt="">
        </div>
        <div>
          <div @click="stopvideo" style="color: white">强制停止</div>
        </div>
        <el-input placeholder="请输入强制停止原因" v-model="reason" style="width: 50%;"></el-input>
      </div>
    </div>
  </div>
</template>

<script>
  import request from '@/utils/request'
  import LibGenerateTestUserSig from '../../static/js/lib-generate-test-usersig.min'
  import TRTC from 'trtc-js-sdk'
  import Speech from "speak-tts";

  export default {
    name: "index",
    data() {
      return {
        //根据id查询
        id: '',
        //当前时间
        date: '',
        //数据
        list: [],
        userId: 'user_' + parseInt(Math.random() * 100000000), //用户id --可更改
        roomId: '', //房间号--加入相同房间才能聊
        client: '', //客户端服务
        remoteStream: '', //远方播放流
        remoteStream1: '', //远方播放流
        localStream: '', //本地流
        reason: '', //强制终止原因
        jssj2: '',
        jssj1: '',
        jssj: '',
        //退出房间
        timer1: "",//定义一个定时器的变量
        timer2: "",
        currentTime: new Date(), // 获取当前时间
        speech: null,
      }
    },
    methods: {
      //查信息
      getinfo() {
        let that = this;
        that.id = that.$route.params.id;
        request({
          url: `/appointment/videoInfo?id=${that.id}`,
          method: "get",
        })
          .then(function (response) {
            if (response.data.code === 20000) {
              that.list = response.data.data
              that.jssj2 = response.data.jssj2
              that.jssj1 = response.data.jssj1
              that.jssj = response.data.data.jssj
              that.roomId = response.data.data.roombh
              that.createClient(that.userId)
            }
          })
          .catch(function (error) {
            console.log(error, "报错信息");
          });
      },
      //查信息2
      getinfo_two() {
        let that = this;
        that.id = that.$route.params.id;
        request({
          url: `/room/videoInfo?id=${that.id}`,
          method: "get",
        })
          .then(function (response) {
            if (response.data.code === 20000) {
              that.list = response.data.data
              that.jssj2 = response.data.jssj2
              that.jssj1 = response.data.jssj1
              that.roomId = response.data.data.roombh
              that.createClient(that.userId)
            }
          })
          .catch(function (error) {
            console.log(error, "报错信息");
          });
      },
      //强制结束
      stopvideo() {
        let that = this;
        that.id = that.$route.params.id;
        if (that.reason === '') {
          that.$message.error('请输入强制停止原因！')
        } else {
          request({
            url: `/appointment/forceStop/${that.id}`,
            method: "post",
            params: {
              bz: that.reason
            }
          })
            .then(function (response) {
              if (response.data.code === 20000) {
                that.$message.success('操作成功')
                that.reason = ''
              }
            })
            .catch(function (error) {
              console.log(error, "报错信息");
            });
        }
      },
      //点击返回即可返回管理页
      goback() {
        //退房 刚加的
        this.client.leave();
        this.$router.replace('/home')
      },
      createClient(userId) {
        //获取签名
        console.log(this.roomId)
        const config = this.genTestUserSig(userId)
        const sdkAppId = config.sdkAppId
        const userSig = config.userSig
        this.client = TRTC.createClient({
          mode: 'videoCall',
          sdkAppId,
          userId,
          userSig
        });
        //注册远程监听，要放在加入房间前--这里用了发布订阅模式
        this.subscribeStream(this.client)
        //初始化后才能加入房间
        this.joinRoom(this.client, this.roomId)
      },
      //加入房间
      joinRoom(client, roomId) {
        client.join({roomId})
          .catch(error => {
            // console.error('进房失败 ' + error);
          })
          .then(() => {
            // console.log('进房成功');
            //创建本地流
            //this.createStream(this.userId)
            //播放远端流
            this.playStream(this.client)
          });
      },
      //创建本地音视频流
      createStream(userId) {
        const localStream = TRTC.createStream({userId, audio: true, video: true});
        this.localStream = localStream

        localStream
          .initialize()
          .catch(error => {
            // console.error('初始化本地流失败 ' + error);
          })
          .then(() => {
            // console.log('初始化本地流成功');
            // 创建好后才能播放 本地流播放 local_stream 是div的id
            localStream.play('local_stream');
            //创建好后才能发布
            this.publishStream(localStream, this.client)
          });
      },
      //发布本地音视频流
      publishStream(localStream, client) {
        client
          .publish(localStream)
          .catch(error => {
            // console.error('本地流发布失败 ' + error);
          })
          .then(() => {
            // console.log('本地流发布成功');
          });
      },
      //订阅远端流--加入房间之前
      subscribeStream(client) {
        client.on('stream-added', event => {
          // this.cishu++
          const remoteStream = event.stream;
          // console.log('远端流增加: ' + remoteStream.getId());
          //订阅远端流
          client.subscribe(remoteStream);
        });
      },
      //播放远端流
      playStream(client) {
        client.on('stream-subscribed', event => {
          const remoteStream = event.stream;
          //静音 不让听
          remoteStream.muteAudio()
          // console.log('远端流订阅成功：' + remoteStream.getId());
          // 创建远端流标签，因为id是动态的，所以动态创建，用了v-html
          const userid = remoteStream.userId_;
          // console.log(userid)
          // console.log(userid)
          if (userid.search('cnsl') != -1) {
            this.remoteStream = `<view id="${'remote_stream-' + remoteStream.getId()}"  ></view>`;
            //做了dom操作 需要使用$nextTick(),否则找不到创建的标签无法进行播放
            this.$nextTick(() => {
              //播放
              remoteStream.play('remote_stream-' + remoteStream.getId());
            })
          }
          if (userid.search('cnsr') != -1) {
            this.remoteStream1 = `<view id="${'remote_stream-' + remoteStream.getId()}"  ></view>`;
            //做了dom操作 需要使用$nextTick(),否则找不到创建的标签无法进行播放
            this.$nextTick(() => {
              //播放
              remoteStream.play('remote_stream-' + remoteStream.getId());
            })
          }

        });
        // setInterval(function () {
        //   client.on('peer-leave', event => {
        //     this.leaveRoom(client)
        //   })
        //   client.on('stream-removed', event => {
        //     this.leaveRoom(client)
        //   });
        // }, 10000)
      },
      appendZero(obj) {
        if (obj < 10) {
          return "0" + obj;
        } else {
          return obj;
        }
      },
      //退出音视频
      leaveRoom(client) {
        client
          .leave()
          .then(() => {
            this.remoteStream.stop()
            this.remoteStream.close()
            this.remoteStream = null

            this.remoteStream1.stop()
            this.remoteStream1.close()
            this.remoteStream1 = null
            console.log('退房成功')
            // 停止本地流，关闭本地流内部的音视频播放器
            this.localStream.stop();
            // 关闭本地流，释放摄像头和麦克风访问权限
            this.localStream.close();
            this.localStream = null;
            this.client = null
            // 退房成功，可再次调用client.join重新进房开启新的通话。
          })
          .catch(error => {
            // console.error('退房失败 ' + error);
            // 错误不可恢复，需要刷新页面。
          });
      },
      //获取用户签名--前端测试用
      genTestUserSig(userID) {
        /**
         * 腾讯云 SDKAppId，需要替换为您自己账号下的 SDKAppId。
         *
         * 进入腾讯云实时音视频[控制台](https://console.cloud.tencent.com/rav ) 创建应用，即可看到 SDKAppId，
         * 它是腾讯云用于区分客户的唯一标识。
         */
        const SDKAPPID = 1400357095;
        /**
         * 签名过期时间，建议不要设置的过短
         * <p>
         * 时间单位：秒
         * 默认时间：7 x 24 x 60 x 60 = 604800 = 7 天
         */
        const EXPIRETIME = 604800;
        /**
         * 计算签名用的加密密钥，获取步骤如下：
         *
         * step1. 进入腾讯云实时音视频[控制台](https://console.cloud.tencent.com/rav )，如果还没有应用就创建一个，
         * step2. 单击“应用配置”进入基础配置页面，并进一步找到“帐号体系集成”部分。
         * step3. 点击“查看密钥”按钮，就可以看到计算 UserSig 使用的加密的密钥了，请将其拷贝并复制到如下的变量中
         *
         * 注意：该方案仅适用于调试Demo，正式上线前请将 UserSig 计算代码和密钥迁移到您的后台服务器上，以避免加密密钥泄露导致的流量盗用。
         * 文档：https://cloud.tencent.com/document/product/647/17275#Server
         */
        const SECRETKEY = 'ffa5d01172d81cf193bbe3264ac8e0b6de0b6a739f5ced8a37ec57e275475a5c';
        // "自己在腾讯云申请的SECRETKEY";
        // a soft reminder to guide developer to configure sdkAppId/secretKey
        if (SDKAPPID === "" || SECRETKEY === "") {
          alert(
            "请先配置好您的账号信息： SDKAPPID 及 SECRETKEY " +
            "\r\n\r\nPlease configure your SDKAPPID/SECRETKEY in js/debug/GenerateTestUserSig.js"
          );
        }
        const generator = new LibGenerateTestUserSig(SDKAPPID, SECRETKEY, EXPIRETIME);
        const userSig = generator.genTestUserSig(userID);
        return {
          sdkAppId: SDKAPPID,
          userSig: userSig
        };
      },
    },
    mounted() {
      //测试用，所以直接创建了，其他需求可自行更改
      let _this = this // 声明一个变量指向Vue实例this，保证作用域一致
      this.timer = setInterval(() => {
        var a = new Date()
        var nian = a.getFullYear()
        var yue = (a.getMonth() + 1).toString().padStart(2, '0')
        var ri = a.getDate().toString().padStart(2, '0')
        var shi = a.getHours().toString().padStart(2, '0')
        var fen = a.getMinutes().toString().padStart(2, '0')
        var miao = a.getSeconds().toString().padStart(2, '0')
        _this.date = nian + '-' + yue + '-' + ri + '     ' + shi + ':' + fen + ':' + miao // 修改数据date
      }, 1000)
    },
    created() {
      this.getinfo()
      // this.getinfo_two()
      var that = this;
      //语音提示
      that.timer1 = setInterval(() => {
        var y = new Date().getFullYear();
        var m = that.appendZero(new Date().getMonth() + 1);
        var d = that.appendZero(new Date().getDate());
        var ho = that.appendZero(new Date().getHours());
        var mi = that.appendZero(new Date().getMinutes());
        //修改数据date
        that.currentTime = y + "-" + m + '-' + d + ' ' + ho + ':' + mi;
        console.log(that.currentTime)
        // console.log(that.jssj2)
        if (that.currentTime === that.jssj2) {
          clearInterval(this.timer1)
          this.speech = new Speech()
          this.speech.setLanguage('zh-CN')
          this.speech.init().then(() => {
            this.speech.speak({
              text: `会见将于10分钟后到会见结束时间，会见将于10分钟后到会见结束时间，会见将于10分钟后到会见结束时间`
            }).then(() => {

            })
          })
        }
      }, 40000);
      // 退房
      that.timer2 = setInterval(() => {
        var y = new Date().getFullYear();
        var m = that.appendZero(new Date().getMonth() + 1);
        var d = that.appendZero(new Date().getDate());
        var ho = that.appendZero(new Date().getHours());
        var mi = that.appendZero(new Date().getMinutes());
        //修改数据date
        that.currentTime = y + "-" + m + '-' + d + ' ' + ho + ':' + mi;
        // console.log(that.currentTime)
        // console.log(that.jssj2)
        if (that.currentTime === that.jssj) {
          that.goback()
          that.remoteStream.stop()
          that.remoteStream.close()
          that.remoteStream = null

          that.remoteStream1.stop()
          that.remoteStream1.close()
          that.remoteStream1 = null
          //退房
          that.client.leave();
          console.log('退房成功')
          // 停止本地流，关闭本地流内部的音视频播放器
          that.localStream.stop();
        }
      }, 40000);
    },
    beforeDestroy() {
      if (this.timer) {
        //在Vue实例销毁前，清除我们的定时器
        clearInterval(this.timer)
        this.timer = null
      }
      if (this.timer1) {
        clearInterval(this.timer1); // 在Vue实例销毁前，清除我们的定时器
      }
      if (this.timer2) {
        clearInterval(this.timer2); // 在Vue实例销毁前，清除我们的定时器
      }
    },
  }
</script>

<style scoped>
  .page-wrapper {
    width: 100%;
    height: 100%;
    background-image: url("../assets/bg.jpg");
    background-size: cover;
    position: relative;
  }

  .top {
    display: flex;
    justify-content: space-around;
    align-items: center;
    box-sizing: border-box;
  }

  .top > .button {
    width: 100px;
    height: 50px;
    text-align: center;
    line-height: 50px;
    border-radius: 10px;
    color: aquamarine;
    font-size: 20px;
    border: 1px solid aquamarine;
    cursor: pointer;
  }

  .top > img {
    height: 60px;
  }

  #time {
    color: aqua;
    font-size: 20px;
  }

  .detail {
    padding: 30px;
    box-sizing: border-box;
    margin-top: 30px;
    width: 100%;
    height: calc(100% - 90px);
    display: flex;
    box-sizing: border-box;
  }

  .box1 {
    width: 40%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }

  .box1 > .video1 {
    width: 100%;
    height: 60%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .video1 > div {
    width: 560px;
    height: 450px;
    background-size: cover;
    border: 1px solid aquamarine;
    border-radius: 5px;
  }

  .box1 > .table1 {
    font-size: 20px;
    width: 100%;
    height: 40%;
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }

  .box2 {
    margin-left: 30px;
    width: 40%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }

  .box2 > .video2 {
    width: 100%;
    height: 60%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .video2 > div {
    width: 560px;
    height: 450px;
    background-size: cover;
    border: 1px solid aquamarine;
    border-radius: 5px;
  }

  .box2 > .table2 {
    font-size: 20px;
    width: 100%;
    height: 40%;
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }

  .box3 {
    margin-left: 30px;
    width: 20%;
    display: flex;
    justify-content: space-around;
    align-items: center;
    flex-direction: column;
  }

  .box3 > div > div {
    width: 150px;
    height: 80px;
    border-radius: 5px;
    text-align: center;
    line-height: 80px;
    margin-bottom: 30px;
    background-color: #F39801;
    cursor: pointer;
    color: white;
  }

  /*本地流*/
  .local-stream {
    width: 560px;
    height: 450px;
  }

  /*远端流*/
  .distant-stream {
    width: 560px;
    height: 450px;
  }
</style>

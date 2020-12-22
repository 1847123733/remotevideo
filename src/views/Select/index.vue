<template>
  <div class="wrapper">
    <el-button @click="dialogVisible = true">按钮</el-button>
    <el-dialog
      title="占用情况"
      :visible.sync="dialogVisible"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      top="0vh">
      <div class="dialog-wrapper">
        <div class="huijianshi">
          <div class="huijianshi-wrapper">
            <div class="huijianshi-tiaojiao">
              <el-form :inline="true" :model="formInline" style="margin-top: 5px">
                <el-form-item label="时间">
                  <el-date-picker
                    v-model="formInline.shijian"
                    type="date"
                    placeholder="选择日期"
                    value-format="yyyy-MM-dd">
                  </el-date-picker>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="onSubmit">查询</el-button>
                </el-form-item>
              </el-form>
            </div>
            <div class="huijianshi-nr">
              <div style="font-size: 18px">会见室</div>
              <div class="huijianshi-nr-wrapper">
                <div class="huijianshi-nr-shijian">
                  <div>08:00</div>
                  <div>09:00</div>
                  <div>10:00</div>
                  <div>11:00</div>
                  <div>12:00</div>
                  <div>13:00</div>
                  <div>14:00</div>
                  <div>15:00</div>
                  <div>16:00</div>
                  <div>17:00</div>
                  <div>18:00</div>
                  <div>19:00</div>
                  <div>20:00</div>
                  <div>21:00</div>
                  <div>22:00</div>
                  <div>23:00</div>
                  <div>24:00</div>
                  <div>01:00</div>
                  <div>02:00</div>
                  <div>03:00</div>
                  <div>04:00</div>
                  <div>05:00</div>
                  <div>06:00</div>
                  <div>07:00</div>
                  <div>08:00</div>
                </div>
                <div class="huijianshi-nr-xshi hide-scroll-bar">
                  <div class="table-table" v-for="item in allrooms" :key="item.id">
                    <div class="wenzi">{{item.room}}</div>
                    <div class="biao">
                      <div v-for="(item,i) in 144" :key="i"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
  import request from '@/utils/request'
  import $ from 'jquery'

  export default {
    name: 'index',
    data() {
      return {
        //dialog
        dialogVisible: true,
        // 查询条件
        formInline: {
          shijian: ''
        },
        //所有会见室
        allrooms: [],
      }
    },
    methods: {
      //顶部表格
      ransetable() {
        let that = this
        request({
          url: "/room/all",
          method: "get",
          params: {
            yyrq: that.formInline.shijian
          }
        })
          .then(function (response) {
            if (response.data.code === 20000) {
              that.allrooms = response.data.data
              setTimeout(function () {
                //循环有几个监室
                for (let i = 0; i < that.allrooms.length; i++) {
                  //循环监室内meets的长度
                  for (let j = 0; j < that.allrooms[i].meets.length; j++) {
                    // 把每个监室的时间记下来
                    let color0 = that.allrooms[i].meets[j].color[0];
                    let color1 = that.allrooms[i].meets[j].color[1];
                    if (color0 + color1 > 144) {
                      for (let k = color0; k <= 144; k++) {
                        //上色
                        $(`.table-table:eq(${i})>.biao>div:eq(${k})`).css('backgroundColor', 'red')
                      }
                      for (let m = 0; m < (color0 + color1 - 144); m++) {
                        //上色
                        $(`.table-table:eq(${i})>.biao>div:eq(${m})`).css('backgroundColor', 'red')
                      }
                    } else {
                      for (let m = color0; m < color1 + color0; m++) {
                        //上色 给第color0 + m个div上色
                        $(`.table-table:eq(${i})>.biao>div:eq(${m})`).css('backgroundColor', 'red')
                      }
                    }
                  }
                }
              }, 100)
            }
          })
          .catch(function (error) {
            console.log(error, "报错信息");
          });
      },
      onSubmit() {
        $(".biao>div").css('backgroundColor', 'white')
        this.table()
      }
    },
    created() {
      this.table();
    },
    computed: {
      //当前时间，精确到天
      timeDefault() {
        var date = new Date();
        var s1 = date.getFullYear() + "-" + (date.getMonth() + 1).toString().padStart(2, '0') + "-" + (date.getDate().toString().padStart(2, '0'));
        return s1;
      }
    },
    mounted() {
      //显示日期
      this.formInline.shijian = this.timeDefault;
    }
  }
</script>

<style scoped>
  .wrapper {
    width: 100%;
    height: 100%;
  }

  .wrapper >>> .el-dialog {
    min-width: 1500px;
    height: 100%;
    margin-bottom: 0;
    display: flex;
    flex-direction: column;
  }

  .wrapper >>> .el-dialog__body {
    width: 100%;
    height: 100%;
    padding: 0
  }

  .dialog-wrapper {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .dialog-wrapper > * {
    padding: 200px;
    box-sizing: border-box;
  }

  .huijianshi {
    height: 50%;
  }

  .huijianshi-wrapper {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .huijianshi-tiaojiao {
    height: 15%;
  }

  .huijianshi-nr {
    height: 85%;
  }

  .huijianshi-nr-wrapper {
    width: 100%;
    height: 315px;
    display: flex;
    border: 5px solid black;
    flex-direction: column;
  }

  .huijianshi-nr-shijian {
    height: 40px;
    background-color: #EE7A7D;
    display: flex;
    padding-left: 70px;
    box-sizing: border-box;
  }

  .huijianshi-nr-shijian > div {
    flex-grow: 1;
    text-align: center;
    line-height: 40px
  }

  .huijianshi-nr-xshi {
    height: 270px;
    display: flex;
    flex-direction: column;
    overflow: auto;
  }

  .huijianshi-nr-xshi > div {
    height: 67px;
    display: flex;
    align-items: center
  }

  .huijianshi-nr-xshi > div > .wenzi {
    width: 70px;
    height: 67px;
    text-align: center;
    line-height: 67px
  }

  .huijianshi-nr-xshi > div > .biao {
    flex-grow: 1;
    display: flex;
    height: 67px
  }

  .huijianshi-nr-xshi > div > .biao > div {
    flex-grow: 1
  }

  .huijianting {
    height: 50%;
  }

  .hide-scroll-bar::-webkit-scrollbar {
    display: none;
  }
</style>

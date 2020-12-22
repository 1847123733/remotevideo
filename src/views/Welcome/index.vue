<template>
  <div class="wrapper">
    <div class="top">
      <div class="top-left"></div>
      <div class="timu">
        <div style="font-size: 25px">监所管理支队远程会见监管平台</div>
      </div>
      <div class="top-rigth">{{currentTime}}</div>
    </div>
    <div class="bom">
      <div class="bom-left"></div>
      <div class="bom-rgh">
        <div class="bom-rgh-1">
          <!--律师-->
          <div class="bom-rgh-1-1">
            <div class="bom-rgh-1-1-letf">
              <img src="../../assets/1.png" alt="">
            </div>
            <div class="bom-rgh-1-1-rgh">
              <div style="color: white">已注册律师</div>
              <div class="shuzi" v-text="data1[0]"></div>
            </div>
          </div>
          <!--活跃度-->
          <div class="bom-rgh-1-1">
            <div class="bom-rgh-1-1-letf">
              <img src="../../assets/2.svg" alt="">
            </div>
            <div class="bom-rgh-1-1-rgh">
              <div style="color: white">活跃度</div>
              <div class="shuzi" v-text="data1[1]"></div>
            </div>
          </div>
          <!-- 累计会见次数-->
          <div class="bom-rgh-1-1">
            <div class="bom-rgh-1-1-letf">
              <img src="../../assets/3.svg" alt="">
            </div>
            <div class="bom-rgh-1-1-rgh">
              <div style="color: white">累计会见次数</div>
              <div class="shuzi" v-text="data1[3]"></div>
            </div>
          </div>
          <!--今日预约会见-->
          <div class="bom-rgh-1-1">
            <div class="bom-rgh-1-1-letf">
              <img src="../../assets/4.svg" alt="">
            </div>
            <div class="bom-rgh-1-1-rgh">
              <div style="color: white">今日预约会见</div>
              <div class="shuzi" v-text="data1[2]"></div>
            </div>
          </div>
        </div>
        <div class="bom-rgh-2">
          <div class="biao" id="main"></div>
        </div>
        <div class="bom-rgh-3">
          <div class="bom-rgh-3-lett">
            <table border="1">
              <tr class="biaotou">
                <td style="text-align: center" colspan="2">会见准点率</td>
              </tr>
              <tr>
                <th style="width: 40%">准时</th>
                <th class="yanse">{{biao[0] + '次'}}</th>
              </tr>
              <tr>
                <th style="width: 40%">迟到</th>
                <th class="yanse">{{biao[1] + '次'}}</th>
              </tr>
            </table>
          </div>
          <div class="bom-rgh-3-com bom-rgh-3-lett">
            <table border="1">
              <tr class="biaotou">
                <td style="text-align: center" colspan="2">会见厅在线比例</td>
              </tr>
              <tr>
                <th style="width: 40%">在线</th>
                <th class="yanse">{{biao[2] + '个'}}</th>
              </tr>
              <tr>
                <th style="width: 40%">离线</th>
                <th class="yanse">{{biao[3] + '个'}}</th>
              </tr>
            </table>
          </div>
          <div class="bom-rgh-3-rgh bom-rgh-3-lett">
            <table border="1">
              <tr class="biaotou">
                <td style="text-align: center" colspan="2">今日会见信息</td>
              </tr>
              <tr>
                <th style="width: 40%">未结束会见</th>
                <th class="yanse">{{table1 + '人'}}</th>
              </tr>
              <tr>
                <th style="width: 40%">已结束会见</th>
                <th class="yanse">{{table2 + '人'}}</th>
              </tr>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  import request from "@/utils/request";

  export default {
    name: 'index',
    data() {
      return {
        //获取当前时间
        currentTime: new Date(),
        //四个数据
        data1: [],
        xAxis: [],
        //坐标轴文字
        legend: ['累计时长', '会见次数'],
        //次数
        hjcs: [],
        //时长
        hjsc: [],
        //表格一二
        biao: [],
        //表格三
        table1: '',
        table2: '',
      }
    },
    methods: {
      //图表
      tubiao() {
        let that = this
        var echarts = require('echarts');
        let myChart = echarts.init(document.getElementById('main'));
        myChart.setOption({
          dataZoom: [
            {
              type: "inside",
              start: 0,
              end: 100,
            },
            {
              start: 0,
              end: 100,
            }
          ],
          tooltip: {
            transitionDuration: 0,
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              crossStyle: {
                color: '#999'
              }
            }
          },
          toolbox: {
            feature: {
              saveAsImage: {
                show: true,
                backgroundColor: '#000'
              },
              iconStyle: {
                normal: {
                  color: 'white',//设置颜色
                }
              }
            }
          },
          xAxis: [
            {
              type: 'category',
              data: that.xAxis,
              axisLabel: {
                show: true,
                textStyle: {
                  color: '#fff'
                }
              },
              axisPointer: {
                type: 'shadow'
              }
            }
          ],
          yAxis: [
            {
              type: 'value',
              name: '时长累计/分钟',
              axisLabel: {
                formatter: '{value}',
                textStyle: {
                  color: '#fff'
                }
              },
              nameTextStyle: {
                fontSize: 16,
                color: "#fff"
              },
            },
            {
              type: 'value',
              name: '会见次数',
              // interval: 1,
              axisLabel: {
                formatter: '{value}',
                textStyle: {
                  color: '#fff'
                }
              },
              nameTextStyle: {
                fontSize: 16,
                color: "#fff"
              },
            }
          ],
          series: [
            {
              name: that.legend[0],
              type: 'bar',
              data: that.hjsc,
              itemStyle: {
                normal: {
                  //好，这里就是重头戏了，定义一个list，然后根据所以取得不同的值，这样就实现了，
                  color: '#3398db'
                }
              }
            },
            {
              name: that.legend[1],
              type: 'line',
              // areaStyle: {
              //   normal: {
              //     color: '#091e3b' //改变区域颜色
              //   }
              // },
              itemStyle: {
                normal: {
                  color: '#8cd5c2', //改变折线点的颜色
                  lineStyle: {
                    color: '#8cd5c2' //改变折线颜色
                  }
                }
              },
              yAxisIndex: 1,
              data: that.hjcs
            }
          ]
        });
        //窗口变化，统计图自适应
        window.onresize = function () {
          myChart.resize();
        }
      },
      //四个数据
      sgsjdata() {
        let that = this;
        request({
          url: "/count/active",
          method: "post",
        })
          .then(function (response) {
            if (response.data.code === 20000) {
              that.data1 = response.data.data
            }
          })
          .catch(function (error) {
            console.log(error, "报错信息");
          });
      },
      //会见时长会见次数
      zhexiantudata() {
        let that = this;
        request({
          url: "/count/meet",
          method: "post",
        })
          .then(function (response) {
            if (response.data.code === 20000) {
              that.xAxis = response.data.data.days
              that.hjcs = response.data.data.hjcs
              that.hjsc = response.data.data.hjsc
              that.tubiao()
            }
          })
          .catch(function (error) {
            console.log(error, "报错信息");
          });
      },
      //饼图
      bingzhuangtudata() {
        let that = this;
        request({
          url: "/count/ontime",
          method: "post",
        })
          .then(function (response) {
            if (response.data.code === 20000) {
              that.biao = response.data.data
            }
          })
          .catch(function (error) {
            console.log(error, "报错信息");
          });
      },
      //会见中和会见结束信息
      tabledata() {
        let that = this;
        request({
          url: "/count/ongoing",
          method: "post",
        })
          .then(function (response) {
            if (response.data.code === 20000) {
              that.table1 = response.data.table1.length
              that.table2 = response.data.table2.length
            }
          })
          .catch(function (error) {
            console.log(error, "报错信息");
          });
      }
    },
    created() {
      this.sgsjdata()
      this.zhexiantudata()
      this.bingzhuangtudata()
      this.tabledata()
    },
    mounted() {
      var _this = this; //声明一个变量指向Vue实例this，保证作用域一致
      let yy = new Date().getFullYear();
      let mm = new Date().getMonth() + 1 < 10 ? "0" + (new Date().getMonth() + 1) : new Date().getMonth() + 1;
      let dd = new Date().getDate() < 10 ? "0" + new Date().getDate() : new Date().getDate();
      //修改数据date
      _this.currentTime = yy + "-" + mm + "-" + dd;
    }
  }
</script>

<style scoped>
  .wrapper {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    background: url("../../assets/bg.jpg") no-repeat center;
    background-size: 100% 100%;
  }

  .top {
    height: 80px;
    flex-shrink: 0;
    display: flex;
    line-height: 80px;
    color: white;
    border-bottom: 1px solid #3398db;
    box-shadow: 1px 1px 5px 1px #3398db;
  }

  .top-left {
    width: 10%;
  }

  .timu {
    width: 80%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .top-rigth {
    width: 10%;
    font-size: 20px;
  }

  .bom {
    height: calc(100% - 80px);
    display: flex;
  }

  .bom-rgh {
    width: 100%;
    display: flex;
    flex-direction: column;
  }

  .bom-rgh-1 {
    height: 30%;
    padding: 50px 15px 50px 15px;
    box-sizing: border-box;
    display: flex;
    justify-content: space-around;
  }

  .bom-rgh-1 > div {
    width: 20%;
    background-color: rgba(255, 255, 255, 0.4);
    border-radius: 10px;
  }

  .bom-rgh-1-1 {
    display: flex;
    justify-content: space-around;
  }

  .bom-rgh-1-1-letf {
    width: 35%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .bom-rgh-1-1-letf > img {
    width: 100%;
  }

  .bom-rgh-1-1-rgh {
    width: 60%;
    font-size: 1.8em;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
  }

  .bom-rgh-2 {
    height: 40%;
  }

  .biao {
    width: 100%;
    height: 100%;
  }

  .bom-rgh-3 {
    height: 30%;
    display: flex;
    justify-content: space-around;
  }

  .bom-rgh-3-lett {
    width: 25%;
    color: white;
    padding: 10px;
    box-sizing: border-box;
    font-size: 1.6em;
  }

  .bom-rgh-3-lett > table {
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.1);
  }

  .bom-rgh-3-lett > table > tr:first-child {
    height: 20%;
  }

  .bom-rgh-3-com {
    width: 25%;
  }

  .bom-rgh-3-rgh {
    width: 25%;
  }

  .shuzi {
    color: sandybrown;
  }

  .yanse {
    color: sandybrown;
  }

  .biaotou {
    background-color: rgb(0, 60, 149);
  }
</style>

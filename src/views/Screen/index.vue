<template>
  <div class="page-wrapper">
    <span class="currentTime">{{currentTime}}</span>
    <div class="title">{{mapmap}}监所管理支队远程会见监管平台</div>
    <div class="main">
      <div class="left">
        <div class="zhexian">
          <h3 style="textAlign: center;">会见时长</h3>
          <div id="zhexian"></div>
        </div>
        <div class="zhuxing1">
          <h3 style="textAlign: center">会见次数</h3>
          <div id="zhuxing1"></div>
        </div>
        <div class="zhuxing2">
          <h3 style="textAlign: center;">注册律师</h3>
          <div id="zhuxing2"></div>
        </div>
      </div>
      <div class="center">
        <div class="jinan">
          <h3 style="textAlign: center;">{{mapmap}}</h3>
          <div id="jinan"></div>
        </div>
        <div class="pie">
          <div class="pie-wrapper">
            <div id="pie1"></div>
            <div id="pie2"></div>
          </div>
        </div>
      </div>
      <div class="right">
        <div class="total">
          <div class="top">
            <div>
              <div class="text">已注册律师</div>
              <div class="number" v-text="data5[0]"></div>
            </div>
            <div>
              <div class="text">活跃数</div>
              <div class="number" v-text="data5[1]"></div>
            </div>
          </div>
          <div class="bot">
            <div>
              <div class="text">今日预约会见</div>
              <div class="number" v-text="data5[2]"></div>
            </div>
            <div>
              <div class="text">累计会见次数</div>
              <div class="number" v-text="data5[3]"></div>
            </div>
          </div>
        </div>
        <div class="table1">
          <h3 style="textAlign: center; marginBottom: 10px">今日会见信息</h3>
          <div class="biaoge-data">
            <div class="tablebox" style>
              <!--表格的头部-->
              <table class="tou" cellspacing="0px" cellpadding="0px" style="width: 100%;color: white">
                <tr align="center" style="backgroundColor: #003c95">
                  <td style="width: 25%;height: 100%; padding: 8px 0">律师</td>
                  <td style="width: 25%">会见人</td>
                  <td style="width: 25%">开始时间</td>
                  <td style="width: 25%">状态</td>
                </tr>
              </table>
              <div class="biao">
                <table ref="tableform1" id="tableId1" cellspacing="0px" cellpadding="0px"
                       style="width: 100%;overflow: hidden;">
                  <tr align="center" v-for="(item,i) in table" :key="i" style="color: white">
                    <td style="width: 25%;height: 40px">{{ item.lawyer }}</td>
                    <td style="width: 25%;height: 40px">{{ item.name }}</td>
                    <td style="width: 25%;height: 40px">{{item.time }}</td>
                    <td style="width: 25%;height: 40px">{{item.state }}</td>
                  </tr>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div class="table2">
          <h3 style="textAlign: center; marginBottom: 10px">今日已结束会见</h3>
          <div class="biaoge-data">
            <div class="tablebox" style>
              <!--表格的头部-->
              <table class="tou" cellspacing="0px" cellpadding="0px" style="width: 100%;color: white">
                <tr align="center" style="backgroundColor: #003c95">
                  <td style="width: 25%;height: 100%; padding: 8px 0">律师</td>
                  <td style="width: 25%">会见完成时间</td>
                  <td style="width: 25%">会见时长</td>
                  <td style="width: 25%">状态</td>
                </tr>
              </table>
              <div class="biao">
                <table ref="tableform2" id="tableId2" cellspacing="0px" cellpadding="0px"
                       style="width: 100%;overflow: hidden;">
                  <tr align="center" v-for="(item,i) in table2" :key="i" style="color: white">
                    <td style="width: 25%;height: 40px">{{ item.lawyer }}</td>
                    <td style="width: 25%;height: 40px">{{ item.time }}</td>
                    <td style="width: 25%;height: 40px">{{item.timer }}</td>
                    <td style="width: 25%;height: 40px">{{item.state }}</td>
                  </tr>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import request from "@/utils/request";
  import echarts from 'echarts'
  import $ from "jquery";

  export default {
    name: "",
    data() {
      return {
        //是哪个地区就显示那个地区的地图
        mapmap: localStorage.getItem('city'),
        // mapmap: '山东省济南市',
        //获取当前时间
        currentTime: new Date(),
        //日期
        date: [],
        //会见时长
        data1: [],
        //会见次数
        data2: [],
        //月份数和律师审批量
        data3: [],
        //饼图数据
        data4: [],
        //右上角数据
        data5: [],
        //今日会见信息表格
        table: [],
        //今日已结束会见表格
        table2: [],
        //定时器们
        timer1: '',
        timer2: '',
        timer3: '',
        timer4: '',
        timer5: '',
        //坐标点以及提示信息
        datas: [],
        geoCoordMap: [],
        jsonOne: []
      };
    },
    methods: {
      //折线图
      drawZhexian() {
        let that = this;
        let myCharts = echarts.init(document.getElementById("zhexian"));
        myCharts.setOption({
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
          grid: {
            left: "6%",
            right: "10%",
            bottom: "13%",
            containLabel: true
          },
          xAxis: {
            name: "日期",
            type: "category",
            data: this.date,
            nameTextStyle: {
              fontSize: 16,
              color: "#fff"
            },
            axisLabel: {
              show: true,
              textStyle: {
                color: "#fff" //更改坐标轴文字颜色
              }
            }
          },
          yAxis: {
            name: "累计/分钟",
            type: "value",
            nameTextStyle: {
              fontSize: 16,
              color: "#fff"
            },
            axisLabel: {
              show: true,
              textStyle: {
                color: "#fff" //更改坐标轴文字颜色
              }
            }
          },
          series: [
            {
              data: this.data1,
              type: "line",
              smooth: true
            }
          ]
        });
        window.addEventListener("resize", function () {
          myCharts.resize();
        });
      },
      //柱状图1
      drawZhuxing1() {
        let that = this;
        let myCharts = echarts.init(document.getElementById("zhuxing1"));
        myCharts.setOption({
          color: ["#3398DB"],
          tooltip: {
            trigger: "axis",
            axisPointer: {
              // 坐标轴指示器，坐标轴触发有效
              type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
            }
          },
          dataZoom: [
            {
              type: "inside",
              start: 0,
              end: 100
            },
            {
              start: 0,
              end: 100
            }
          ],
          grid: {
            left: "6%",
            right: "10%",
            bottom: "13%",
            containLabel: true
          },
          xAxis: [
            {
              name: "日期",
              type: "category",
              data: this.date,
              axisTick: {
                alignWithLabel: true
              },
              nameTextStyle: {
                fontSize: 16,
                color: "#fff"
              },
              axisLabel: {
                show: true,
                textStyle: {
                  color: "#fff" //更改坐标轴文字颜色
                }
              }
            }
          ],
          yAxis: [
            {
              name: "会见次数",
              type: "value",
              nameTextStyle: {
                fontSize: 16,
                color: "#fff"
              },
              axisLabel: {
                show: true,
                textStyle: {
                  color: "#fff" //更改坐标轴文字颜色
                }
              }
            }
          ],
          series: [
            {
              name: "数据",
              type: "bar",
              barWidth: "60%",
              data: this.data2
            }
          ]
        });
        window.addEventListener("resize", function () {
          myCharts.resize();
        });
      },
      //柱状图2
      drawZhuxing2() {
        let that = this;
        let myCharts = echarts.init(document.getElementById("zhuxing2"));
        myCharts.setOption({
          tooltip: {
            trigger: "axis",
            axisPointer: {
              // 坐标轴指示器，坐标轴触发有效
              type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
            }
          },
          grid: {
            left: "6%",
            right: "10%",
            bottom: "3%",
            containLabel: true
          },
          legend: {
            x: "right", // 'center' | 'left' | {number},
            y: "top", // 'center' | 'bottom' | {number}
            textStyle: {
              color: "#ffffff" //字体颜色
            },
            data: ["通过", "未通过"]
          },
          xAxis: [
            {
              name: "月份",
              type: "category",
              data: that.data3.months,
              axisTick: {
                alignWithLabel: true
              },
              nameTextStyle: {
                fontSize: 16,
                color: "#fff"
              },
              axisLabel: {
                show: true,
                textStyle: {
                  color: "#fff" //更改坐标轴文字颜色
                }
              }
            }
          ],
          yAxis: [
            {
              name: "律师审批量",
              type: "value",
              nameTextStyle: {
                fontSize: 16,
                color: "#fff"
              },
              axisLabel: {
                show: true,
                textStyle: {
                  color: "#fff" //更改坐标轴文字颜色
                }
              }
            }
          ],
          series: [
            {
              name: "未通过",
              type: "bar",
              stack: "总量",
              label: {
                show: true,
                position: "inside"
              },
              data: that.data3.nopass
            },
            {
              name: "通过",
              type: "bar",
              stack: "总量",
              label: {
                show: true,
                position: "inside"
              },
              itemStyle: {
                normal: {
                  color: "#3398DB" //柱状颜色
                }
              },
              data: that.data3.pass
            }
          ]
        });
        window.addEventListener("resize", function () {
          myCharts.resize();
        });
      },
      //地图
      drawJinan() {
        let that = this;
        let myCharts = echarts.init(document.getElementById("jinan"));
        let ditus = require(`./json/${that.mapmap}.json`);
        this.$echarts.registerMap("single", ditus);
        let data = that.datas;
        let geoCoordMap = that.geoCoordMap;
        let jsonOne = that.jsonOne
        //获取数据和坐标
        var resO = [];
        var resT = [];
        var convertData = function (data) {
          for (var i = 0; i < data.length; i++) {
            if (data[i].value === 1) {
              var geoCoordO = geoCoordMap[i][data[i].name];
              if (geoCoordO) {
                resO.push({
                  name: data[i].name,
                  value: geoCoordO.concat(data[i].value),
                  obcity: geoCoordO // 自定义数据
                });
              }
            } else if (data[i].value === 2) {
              var geoCoordT = geoCoordMap[i][data[i].name];
              if (geoCoordT) {
                resT.push({
                  name: data[i].name,
                  value: geoCoordT.concat(data[i].value),
                  obcity: geoCoordT // 自定义数据
                });
              }
            }
          }
        };
        convertData(data); // 筛选数据
        let option = {
          // backgroundColor: 'blue',
          //提示框
          tooltip: {
            trigger: "item",
            borderRadius: 0,
            backgroundColor: "rgba(8,65,134,0.9)",
            formatter: function (p) {
              var a = p.name;
              // console.log(p)
              for (var i = 0; i < jsonOne.length; i++) {
                // console.log(that.jsonOne[i]);
                if (a === Object.keys(jsonOne[i])[0]) {
                  // console.log(Object.keys(that.jsonOne[i])[0]);
                  var obj = jsonOne[i][a];
                  // console.log(obj)
                  var text = `
                                <span>${obj.type === '1' ? "监所名称" : "设备编号"}</span>：<span style='color:#f0921e'> ${obj.name}</span></br>
                                地址：<span style='color:#f0921e'> ${obj.address}</span></br>`;
                  return text;
                }
              }
            }
          },
          //图例组件
          legend: {
            orient: "horizontal",
            //相等于left 、top、bottom、right
            y: "bottom",
            x: "right",
            //这里的数据名称要和series中的name名称一样，否则不显示
            data: ["规上企业"],
            textStyle: {
              color: "#fff"
            }
          },
          geo: {
            show: true,
            map: "single",
            label: {
              normal: {
                show: true,
                textStyle: {
                  color: "#ccc",
                  fontSize: "14",
                  fontFamily: "微软雅黑"
                }
              },
              emphasis: {
                show: true
              }
            },
            roam: true,
            itemStyle: {
              normal: {
                areaColor: "transparent",
                //边框颜色
                borderColor: "#3fdaff",
                borderWidth: 2,
                shadowColor: "rgba(63, 218, 255, 0.5)",
                shadowBlur: 30
              },
              emphasis: {
                //悬浮颜色
                areaColor: "#2B91B7"
              }
            },
            zoom: "1.2"
          },
          //这里数据中主要是冒泡图数据
          series: [
            {
              name: "light",
              type: "scatter",
              coordinateSystem: "geo",
              data: resO,
              symbolSize: function (val) {
                return 20;
              },
              label: {
                normal: {
                  formatter: "{b}",
                  position: "right",
                  show: false
                },
                emphasis: {
                  show: false
                }
              },
              itemStyle: {
                normal: {
                  color: "#F4E925"
                }
              }
            },
            {
              type: "map",
              map: "济南",
              geoIndex: 0,
              aspectScale: 0.75, //长宽比
              showLegendSymbol: false, // 存在legend时显示
              label: {
                normal: {
                  show: true
                },
                emphasis: {
                  show: true,
                  textStyle: {
                    color: "#fff"
                  }
                }
              },
              roam: true,
              itemStyle: {
                normal: {
                  areaColor: "#031525",
                  borderColor: "#FFFFFF"
                },
                emphasis: {
                  areaColor: "#2B91B7"
                }
              },
              animation: false,
              data: data
            },
            {
              name: "Top 5",
              type: "effectScatter",
              coordinateSystem: "geo",
              data: resO,
              symbolSize: function (val) {
                return 20;
              },
              showEffectOn: "render",
              rippleEffect: {
                brushType: "stroke"
              },
              hoverAnimation: true,
              label: {
                normal: {
                  formatter: "{b}",
                  position: "right",
                  show: true
                }
              },
              itemStyle: {
                normal: {
                  color: "#F4E925",
                  shadowBlur: 10,
                  shadowColor: "#05C3F9"
                }
              }
            },
            {
              name: "two",
              type: "effectScatter",
              coordinateSystem: "geo",
              data: resT,
              symbolSize: 15,
              showEffectOn: "render",
              rippleEffect: {
                brushType: "stroke"
              },
              hoverAnimation: true,
              itemStyle: {
                normal: {
                  color: "#e63f3f",
                  shadowBlur: 0,
                  shadowColor: "#e63f3f"
                }
              },
              zlevel: 1,
              label: {
                normal: {
                  formatter: "{b}",
                  position: "right",
                  show: true,
                  textStyle: {
                    color: "#e63f3f",
                    fontSize: "14",
                    fontFamily: "微软雅黑"
                  }
                },
                emphasis: {
                  show: true
                }
              }
            }
          ]
        };
        myCharts.setOption(option);
        window.addEventListener("resize", function () {
          myCharts.resize();
        });
      },
      //饼图1
      drawPie1() {
        let that = this;
        let myCharts = echarts.init(document.getElementById("pie1"));
        myCharts.setOption({
          title: {
            left: "center",
            text: "会见准点率",
            textStyle: {
              color: "#ccc"
            }
          },
          tooltip: {
            trigger: "item",
            formatter: "{a} <br/>{b} : {c} ({d}%)"
          },
          series: [
            {
              name: "",
              type: "pie",
              radius: "70%",
              center: ["50%", "60%"],
              data: [
                {value: that.data4[1], name: "迟到"},
                {
                  value: that.data4[0],
                  name: "准时",
                  itemStyle: {color: "#3398DB"}
                }
              ],
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: "rgba(0, 0, 0, 0.5)"
                }
              }
            }
          ]
        });
        window.addEventListener("resize", function () {
          myCharts.resize();
        });
      },
      //饼图2
      drawPie2() {
        let that = this;
        let myCharts = echarts.init(document.getElementById("pie2"));
        myCharts.setOption({
          title: {
            left: "center",
            text: "会见亭在线比例",
            textStyle: {
              color: "#ccc"
            }
          },
          tooltip: {
            trigger: "item",
            formatter: "{a} <br/>{b} : {c} ({d}%)"
          },
          series: [
            {
              name: "",
              type: "pie",
              radius: "70%",
              center: ["50%", "60%"],
              data: [
                {value: that.data4[3], name: "离线"},
                {
                  value: that.data4[2],
                  name: "在线",
                  itemStyle: {color: "#3398DB"}
                }
              ],
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: "rgba(0, 0, 0, 0.5)"
                }
              }
            }
          ]
        });
        window.addEventListener("resize", function () {
          myCharts.resize();
        });
      },
      //表格滚动1
      scroll1() {
        this.$nextTick(() => {
          let reset = 1;
          let shu = this.table.length;
          let lenter = this.$refs.tableform1;
          let tableheight = lenter.offsetHeight;
          let trheight = tableheight / shu;
          setInterval(() => {
            reset += 1;
            $("#tableId1").animate({
                marginTop: `-=${trheight}px`
              }, 3000, function () {
                if (reset > shu) {
                  reset = 1;
                  $("#tableId1").css("margin-top", "0%");
                }
              }
            );
          }, 4000);
        });
      },
      //表格滚动2
      scroll2() {
        this.$nextTick(() => {
          let reset2 = 1;
          let shu2 = this.table2.length;
          let lenter2 = this.$refs.tableform2;
          let tableheight2 = lenter2.offsetHeight;
          let trheight2 = tableheight2 / shu2;
          setInterval(() => {
            reset2 += 1;
            $("#tableId2").animate({
                marginTop: `-=${trheight2}px`
              }, 3000, function () {
                if (reset2 > shu2) {
                  reset2 = 1;
                  $("#tableId2").css("margin-top", "0%");
                }
              }
            );
          }, 4000);
        });
      },
      //会见时长会见次数
      zhexiantudata() {
        let that = this;

        function hjschjcs() {
          request({
            url: "/count/meet",
            method: "post",
          })
            .then(function (response) {
              if (response.data.code === 20000) {
                that.date = response.data.data.days
                that.data1 = response.data.data.hjsc
                that.data2 = response.data.data.hjcs
                that.drawZhexian();
                that.drawZhuxing1();
              }
            })
            .catch(function (error) {
              console.log(error, "报错信息");
            });
        }

        hjschjcs()
        that.timer1 = setInterval(hjschjcs, 60000)
      },
      //按月统计律师审核数量
      zhuzhuangtudata() {
        let that = this;

        function aytjlsshsl() {
          request({
            url: "/count/check",
            method: "post",
          })
            .then(function (response) {
              if (response.data.code === 20000) {
                that.data3 = response.data.data
                that.drawZhuxing2();
              }
            })
            .catch(function (error) {
              console.log(error, "报错信息");
            });
        }

        aytjlsshsl()
        that.timer2 = setInterval(aytjlsshsl, 60000)
      },
      //饼图
      bingzhuangtudata() {
        let that = this;

        function bt() {
          request({
            url: "/count/ontime",
            method: "post",
          })
            .then(function (response) {
              if (response.data.code === 20000) {
                that.data4 = response.data.data
                that.drawPie1();
                that.drawPie2();
              }
            })
            .catch(function (error) {
              console.log(error, "报错信息");
            });
        }

        bt()
        that.timer3 = setInterval(bt, 60000)
      },
      //四个数据
      sgsjdata() {
        let that = this;

        function sgsj() {
          request({
            url: "/count/active",
            method: "post",
          })
            .then(function (response) {
              if (response.data.code === 20000) {
                that.data5 = response.data.data
              }
            })
            .catch(function (error) {
              console.log(error, "报错信息");
            });
        }

        sgsj()
        that.timer4 = setInterval(sgsj, 60000)
      },
      //会见中和会见结束信息
      tabledata() {
        let that = this;

        function biaoge() {
          request({
            url: "/count/ongoing",
            method: "post",
          })
            .then(function (response) {
              if (response.data.code === 20000) {
                that.table = response.data.table1
                that.table2 = response.data.table2
                that.scroll1();
                that.scroll2();
              }
            })
            .catch(function (error) {
              console.log(error, "报错信息");
            });
        }

        biaoge()
        that.timer5 = setInterval(biaoge, 300000)
      },
      //地图点
      jwd() {
        let that = this;
        request({
          url: "/count/map",
          method: "post",
        })
          .then(function (response) {
            if (response.data.code === 20000) {
              that.datas = response.data.data
              that.geoCoordMap = response.data.geoCoordMap
              that.jsonOne = response.data.jsonOne
            }
          })
          .catch(function (error) {
            console.log(error, "报错信息");
          });
      }
    },
    mounted() {
      //地图调用
      setTimeout(() => {
        this.drawJinan();
      }, 100)
    },
    created() {
      //加载完页面调用这些个函数
      this.jwd()
      this.zhexiantudata()
      this.zhuzhuangtudata()
      this.bingzhuangtudata()
      this.sgsjdata()
      this.tabledata()
      //获取日期
      var _this = this; //声明一个变量指向Vue实例this，保证作用域一致
      function shijian() {
        let yy = new Date().getFullYear();
        let mm =
          new Date().getMonth() + 1 < 10
            ? "0" + (new Date().getMonth() + 1)
            : new Date().getMonth() + 1;
        let dd =
          new Date().getDate() < 10
            ? "0" + new Date().getDate()
            : new Date().getDate();
        //修改数据date
        _this.currentTime = yy + "-" + mm + "-" + dd;
      }

      shijian();
    },
    beforeDestroy() {
      //页面销毁之前，清除所有频繁请求数据的定时器
      clearInterval(this.timer1)
      clearInterval(this.timer2)
      clearInterval(this.timer3)
      clearInterval(this.timer4)
      clearInterval(this.timer5)
    }
  };
</script>

<style scoped>
  .currentTime {
    position: absolute;
    top: 18px;
    right: 30px;
    font-size: 22px;
    font-weight: bold;
  }

  .page-wrapper {
    height: 100%;
    width: 100%;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    background: url("../../assets/bg.jpg") center center no-repeat;
    background-size: 100% 100%;
    color: #fff;
    position: relative;
  }

  .title {
    height: 60px;
    width: 100%;
    flex-shrink: 0;
    line-height: 60px;
    text-align: center;
    font-size: 32px;
    border-bottom: 1px solid #3398db;
    box-shadow: 1px 1px 5px 1px #3398db;
  }

  .main {
    flex-grow: 1;
    display: flex;
    flex-direction: row;
  }

  .left {
    width: 27%;
    height: 100%;
  }

  .left > div {
    width: 100%;
    height: calc(100% / 3);
  }

  .left h3 {
    position: relative;
    top: 20px;
  }

  .zhuxing1 {
    width: 100%;
    height: 100%;
  }

  #zhuxing1 {
    width: 100%;
    height: 90%;
  }

  .zhexian {
    width: 100%;
    height: 100%;
  }

  #zhexian {
    width: 100%;
    height: 90%;
  }

  .zhuxing2 {
    width: 100%;
    height: 100%;
  }

  #zhuxing2 {
    width: 100%;
    height: 90%;
  }

  .center {
    width: 46%;
    height: 100%;
  }

  .center h3 {
    position: relative;
    top: 10px;
  }

  .jinan {
    height: 70%;
    width: 100%;
  }

  #jinan {
    height: 90%;
    width: 100%;
  }

  .pie {
    height: 30%;
    width: 100%;
  }

  .pie-wrapper {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: row;
  }

  .pie-wrapper > div {
    height: 90%;
    width: calc(100% / 2);
  }

  #pie1 {
    width: 100%;
    height: 90%;
  }

  #pie2 {
    width: 100%;
    height: 90%;
  }

  .right {
    width: 27%;
    height: 100%;
  }

  .right > div {
    width: 100%;
    height: calc(100% / 3);
  }

  .total {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .total > div {
    height: 30%;
    width: 100%;
    margin-top: 10%;
  }

  .top, .bot {
    display: flex;
    flex-direction: row;
  }

  .top > div, .bot > div {
    height: 100%;
    width: 50%;
    text-align: center;
  }

  .total .text {
    font-size: 18px;
  }

  .total .number {
    font-size: 30px;
    color: yellow;
  }

  .tou {
    height: 10%;
  }

  .biao {
    width: 100%;
    height: 90%;
    overflow: hidden;
  }

  .biaoge-data {
    width: 80%;
    height: 240px;
    margin: 0 auto;
    padding: 10px 0px 0px 0px;
    box-sizing: border-box;
    overflow: hidden;
  }

  .tablebox {
    overflow: hidden;
    width: 100%;
    height: 100%;
  }

  .tablebox > div > table > tr > td {
    border: 1px solid rgb(0, 0, 0);
  }
</style>

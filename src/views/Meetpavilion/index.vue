<template>
  <div class="page-wrapper">
    <!--查询form-->
    <el-form :model="find" :inline="true" class="form" style="white-space:nowrap;">
      <el-form-item label="设备号：">
        <el-input v-model="find.deviceno" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="dosearch">查询</el-button>
        <el-button type="primary" icon="el-icon-circle-plus-outline" @click="appeardialog">新增</el-button>
      </el-form-item>
    </el-form>
    <!--table表格-->
    <el-table :data="list" style="width: 100%" border :header-cell-style="{background:'#a0cfff',color:'#409EFF'}">
      <el-table-column prop="deviceno" label="设备号" align="center" width="100"></el-table-column>
      <el-table-column prop="name" label="设备名称" align="center" width="150"></el-table-column>
      <el-table-column prop="address" label="设备地址" align="center" width="220"></el-table-column>
      <el-table-column prop="area" label="所属区域" align="center"></el-table-column>
      <el-table-column prop="longitude" label="经度" align="center" width="90"></el-table-column>
      <el-table-column prop="latitude" label="纬度" align="center" width="90"></el-table-column>
      <el-table-column prop="sfzx" label="是否在线" align="center" width="70">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.sfzx === 0" type="warning">否</el-tag>
          <el-tag v-else-if="scope.row.sfzx === 1" type="success">是</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="sfhj" label="是否会见" align="center" width="70">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.sfhj === 0" type="warning">否</el-tag>
          <el-tag v-else-if="scope.row.sfhj === 1" type="success">是</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="sfzc" label="是否正常" align="center" width="70">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.sfzc === 0" type="warning">否</el-tag>
          <el-tag v-else-if="scope.row.sfzc === 1" type="success">是</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="sfkj" label="是否开机" align="center" width="70">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.sfkj === 0" type="warning">关机</el-tag>
          <el-tag v-else-if="scope.row.sfkj === 1" type="success">开机</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="zrdw" label="责任单位" align="center" width="180"></el-table-column>
      <el-table-column prop="zrr" label="责任人" align="center" width="80"></el-table-column>
      <el-table-column prop="lxr" label="联系人" align="center" width="80"></el-table-column>
      <el-table-column prop="lxdh" label="联系电话" align="center" width="150"></el-table-column>
      <el-table-column label="操作" align="center" width="200">
        <template slot-scope="scope">
          <el-button @click="appearupdatedialog(scope.row)" type="primary">编辑</el-button>
          <el-button @click="open(scope.row)" type="primary">远程开门</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--页脚-->
    <el-pagination
      background
      @size-change="sizechange"
      @current-change="currentchange"
      :current-page="currentPage"
      :page-sizes="[10,15,50,100,400]"
      :page-size="pagesize"
      :total="counts"
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
    <!--新增dialog-->
    <el-dialog title="新增会见亭" :visible="dialog" @close="closeDialog" top="0">
      <el-form :inline="true" :model="newform" label-position="right" label-width="180px" :rules="rules" ref="ruleForm">
        <el-form-item label="设备号" prop="deviceno">
          <el-input v-model="newform.deviceno"></el-input>
        </el-form-item>
        <el-form-item label="设备名称" prop="name">
          <el-input v-model="newform.name"></el-input>
        </el-form-item>
        <el-form-item label="设备地址" prop="address">
          <el-input v-model="newform.address"></el-input>
        </el-form-item>
        <el-form-item label="经度" prop="longitude">
          <el-input v-model="newform.longitude" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="经度" prop="latitude">
          <el-input v-model="newform.latitude" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="省份" prop="sfdm">
          <el-select v-model="newform.sfdm" @change="getjgdw" filterable clearable placeholder="请选择所属省份">
            <el-option v-for="item in sflist" :key="item.dm" :label="item.name" :value="item.dm"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属监管单位" prop="jgdwid">
          <el-select v-model="newform.jgdwid" @change="getarea" filterable clearable placeholder="请选择所属监管单位">
            <el-option v-for="item in jgdwlist" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属区域" prop="area">
          <el-select v-model="newform.area" @change="scarea">
            <el-option v-for="item in selects" :key="item.id" :label="item.area" :value="item.area"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="责任单位" prop="zrdw">
          <el-input v-model="newform.zrdw"></el-input>
        </el-form-item>
        <el-form-item label="责任人" prop="zrr">
          <el-input v-model="newform.zrr"></el-input>
        </el-form-item>
        <el-form-item label="联系人" prop="lxr">
          <el-input v-model="newform.lxr"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="lxdh">
          <el-input v-model="newform.lxdh"></el-input>
        </el-form-item>
        <el-form-item label="mac地址">
          <div id="demo">
            <form action="">
              <input v-model="inputList[0].val" type="text" maxlength="2" class="border-input" @keyup="limit">-
              <input v-model="inputList[1].val" type="text" maxlength="2" class="border-input">-
              <input v-model="inputList[2].val" type="text" maxlength="2" class="border-input">-
              <input v-model="inputList[3].val" type="text" maxlength="2" class="border-input">-
              <input v-model="inputList[4].val" type="text" maxlength="2" class="border-input">-
              <input v-model="inputList[5].val" type="text" maxlength="2" class="border-input">
            </form>
          </div>
        </el-form-item>
        <el-form-item label="专网卡号" prop="cardnum">
          <el-input v-model="newform.cardnum"></el-input>
        </el-form-item>
        <el-form-item style="margin-left: 80%">
          <el-button @click="add">确认新增</el-button>
        </el-form-item>
      </el-form>
      <!--高德地图-->
      <div class="amap-page-container">
        <el-amap-search-box class="search-box" :search-option="searchOption"
                            :on-search-result="onSearchResult"></el-amap-search-box>
        <el-amap vid="amapDemo" :center="center" :zoom="zoom" class="amap-demo" :events="events">
          <el-amap-marker v-for="(marker, i) in markers" :position="marker" :events="marker.events"
                          :key="i"></el-amap-marker>
        </el-amap>
      </div>
    </el-dialog>
    <!--修改用户的dialog-->
    <el-dialog title="修改会见亭" :visible="updatedialog" @close="closeDialog" top="0px">
      <el-form :inline="true" :model="newform" label-position="right" label-width="180px" :rules="rules" ref="ruleForm">
        <el-form-item label="设备号" prop="deviceno">
          <el-input v-model="newform.deviceno" disabled></el-input>
        </el-form-item>
        <el-form-item label="设备名称" prop="name">
          <el-input v-model="newform.name"></el-input>
        </el-form-item>
        <el-form-item label="设备地址" prop="address">
          <el-input v-model="newform.address"></el-input>
        </el-form-item>
        <el-form-item label="经度" prop="longitude">
          <el-input v-model="newform.longitude" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="纬度" prop="latitude">
          <el-input v-model="newform.latitude" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="责任单位" prop="zrdw">
          <el-input v-model="newform.zrdw"></el-input>
        </el-form-item>
        <el-form-item label="责任人" prop="zrr">
          <el-input v-model="newform.zrr"></el-input>
        </el-form-item>
        <el-form-item label="联系人" prop="lxr">
          <el-input v-model="newform.lxr"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="lxdh">
          <el-input v-model="newform.lxdh"></el-input>
        </el-form-item>
        <el-form-item label="省份" prop="sfdm">
          <el-select v-model="newform.sfdm" @change="getjgdw" filterable clearable placeholder="请选择所属省份">
            <el-option v-for="item in sflist" :key="item.dm" :label="item.name" :value="item.dm"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属监管单位" prop="jgdwid">
          <el-select v-model="newform.jgdwid" @change="getarea" filterable clearable placeholder="请选择所属监管单位">
            <el-option v-for="item in jgdwlist" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属区域" prop="area">
          <el-select v-model="newform.area" @change="scarea">
            <el-option v-for="item in selects" :key="item.id" :label="item.area" :value="item.area"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="mac地址">
          <div>
            <form action="">
              <input v-model="inputList[0].val" type="text" maxlength="2" class="border-input" @keyup="limit">-
              <input v-model="inputList[1].val" type="text" maxlength="2" class="border-input">-
              <input v-model="inputList[2].val" type="text" maxlength="2" class="border-input">-
              <input v-model="inputList[3].val" type="text" maxlength="2" class="border-input">-
              <input v-model="inputList[4].val" type="text" maxlength="2" class="border-input">-
              <input v-model="inputList[5].val" type="text" maxlength="2" class="border-input">
            </form>
          </div>
        </el-form-item>
        <el-form-item label="专网卡号" prop="cardnum">
          <el-input v-model="newform.cardnum"></el-input>
        </el-form-item>
        <el-form-item style="margin-left: 70%">
          <el-button @click="update">确认修改</el-button>
        </el-form-item>
      </el-form>
      <!--百度地图-->
      <div class="amap-page-container">
        <el-amap-search-box class="search-box" :search-option="searchOption"
                            :on-search-result="onSearchResult"></el-amap-search-box>
        <el-amap vid="amapDemo" :center="center" :zoom="zoom" class="amap-demo" :events="events">
          <el-amap-marker v-for="(marker, i) in markers" :position="marker" :events="marker.events"
                          :key="i"></el-amap-marker>
        </el-amap>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import request from '@/utils/request'
  import {BmlMarkerClusterer} from 'vue-baidu-map' //引入的百度地图,不用了,用谷歌
  import $ from 'jquery'

  export default {
    name: 'index',
    components: {
      BmlMarkerClusterer
    },
    data() {
      let self = this;
      return {
        //返回数据存储在数组中
        list: [],
        //省份数组数据
        sflist: [],
        //监管单位数组数据
        jgdwlist: [],
        //设备号名字
        find: {
          deviceno: '',
        },
        //新增和修改数据
        newform: {
          area_id: '',
          id: '',
          deviceno: '',
          address: '',
          area: '',
          longitude: '',
          latitude: '',
          zrdw: '',
          zrr: '',
          lxr: '',
          lxdh: '',
          mac: '',
          cardnum: '',
          sfzx: '',
          sfhj: '',
          sfzc: '',
          sfkj: '',
          xtsj: '',
          ysd: '',
          sfdm: '',
          jgdwmc: '',
          name: '',
          sf: '',
          dwlb: 1,
          jgdwid: ''
        },
        //验证规则
        rules: {
          deviceno: [{required: true, message: '设备号不能为空', trigger: 'blur'}],
          address: [{required: true, message: '设备地址不能为空', trigger: 'blur'}],
          area: [{required: true, message: '所属区域不能为空', trigger: 'blur'}],
          longitude: [{required: true, message: '经度不能为空', trigger: 'blur'}],
          latitude: [{required: true, message: '纬度不能为空', trigger: 'blur'}],
          zrdw: [{required: true, message: '责任单位不能为空', trigger: 'blur'}],
          zrr: [{required: true, message: '责任人不能为空', trigger: 'blur'}],
          lxr: [{required: true, message: '联系人不能为空', trigger: 'blur'}],
          lxdh: [{required: true, message: '联系电话不能为空', trigger: 'blur'}],
          cardnum: [{required: true, message: '专网卡号不能为空', trigger: 'blur'}],
          sfdm: [{required: true, message: '省份不能为空', trigger: 'blur'}],
          id: [{required: true, message: '监管单位不能为空', trigger: 'blur'}],
          jgdwid: [{required: true, message: '监管单位不能为空', trigger: 'blur'}],
          name: [{required: true, message: '设备名称不能为空', trigger: 'blur'}],
        },
        //新增的dialog
        dialog: false,
        //修改用户的dialog
        updatedialog: false,
        //查看位置的dialog,不用了
        locationdialog: false,
        locationhidden: false,
        //当前页数
        currentPage: 1,
        //每页显示多少条数据
        pagesize: 10,
        //数据的总条数
        counts: 0,
        //下拉
        selects: [],
        //mac地址
        inputList: [{val: ""}, {val: ""}, {val: ""}, {val: ""}, {val: ""}, {val: ""}],
        arr: [],
        //高德地图(自此往下的数据都是高德地图数据)
        zoom: 4,
        center: [106.68523, 34.267523],
        address: '',
        //限制地方条件
        searchOption: {
          city: '上海',
          citylimit: false
        },
        markers: [],
        events: {
          click(e) {
            let {lng, lat} = e.lnglat;
            self.newform.longitude = lng;
            self.newform.latitude = lat;
            self.markers.splice(0, 1, [lng, lat]);
          }
        },
        lng: 0,
        lat: 0,
        marker: [
          {
            events: {
              click: () => {
                alert('click marker');
              }
            }
          }
        ]
      }
    },
    methods: {
      //获取数据
      getinfo() {
        let that = this
        request({
          url: '/device/page',
          method: 'get',
          params: {
            deviceno: that.find.deviceno,
            rows: that.pagesize,
            page: that.currentPage,
            date: Date.parse(new Date())
          }
        })
          .then(function (response) {
            if (response.data.code === 20000) {
              //数据传递给data
              that.list = response.data.data
              //数据的总条数
              that.counts = response.data.total
            }
          })
          .catch(function (error) {
            console.log(error, '报错信息')
          })
      },
      //获取省份数据
      getsf() {
        let that = this;
        request({
          url: "/prison/provinces",
          method: "get",
          params: {}
        })
          .then(function (response) {
            if (response.data.code === 20000) {
              response.data.data.forEach(element => {
                element.dm = element.dm.toString();
              });
              that.sflist = response.data.data
            }
          })
          .catch(function (error) {
            console.log(error, "报错信息");
          });
      },
      //获取监管单位数据
      getjgdw(vid) {
        let that = this;
        request({
          url: "/prison/jgdw",
          method: "get",
          params: {
            sfdm: that.newform.sfdm
          }
        })
          .then(function (response) {
            if (response.data.code === 20000) {
              that.jgdwlist = response.data.data
            }
          })
          .catch(function (error) {
            console.log(error, "报错信息");
          });
        for (var i = 0; i < that.sflist.length; i++) {
          if (that.sflist[i].dm == vid) {
            that.newform.sf = that.sflist[i].name
          }
        }
      },
      //所属区域
      getarea(vid) {
        let that = this;
        that.newform.area = ''
        request({
          url: "/device/getArea",
          method: "get",
          params: {
            id: vid
          }
        })
          .then(function (response) {
            if (response.data.code === 20000) {
              that.selects = response.data.data
            }
          })
          .catch(function (error) {
            console.log(error, "报错信息");
          });
        for (var i = 0; i < that.jgdwlist.length; i++) {
          if (that.jgdwlist[i].id == vid) {
            that.newform.jgdwmc = that.jgdwlist[i].name
          }
        }
      },
      scarea(vid) {
        let that = this;
        // console.log(vid)
        for (var i = 0; i < that.selects.length; i++) {
          if (that.selects[i].area == vid) {
            that.newform.area_id = that.selects[i].id;
          }
        }
      },
      //条件查询点击事件
      dosearch: function () {
        this.currentPage = 1
        this.getinfo()
      },
      //每页显示条数改变事件
      sizechange: function (val) {
        this.pagesize = val
        this.getinfo()
      },
      //当前页改变事件
      currentchange: function (val) {
        this.currentPage = val
        this.getinfo()
      },
      //点击新增出现dialog
      appeardialog() {
        let that = this
        that.dialog = true
        that.locationhidden = true
      },
      //点击修改出现dialog
      appearupdatedialog(row) {
        let that = this
        that.getarea(row.jgdwid)
        that.locationhidden = true
        that.newform.longitude = row.longitude
        that.newform.latitude = row.latitude
        that.markers.splice(0, 1, [row.longitude, row.latitude]);
        that.updatedialog = true
        that.newform = JSON.parse(JSON.stringify(row));
        request({
          url: "/prison/jgdw",
          method: "get",
          params: {
            sfdm: that.newform.sfdm
          }
        })
          .then(function (response) {
            if (response.data.code === 20000) {
              that.jgdwlist = response.data.data
            }
          })
          .catch(function (error) {
            console.log(error, "报错信息");
          });
        for (let i = 0; i < row.mac.split('-').length; i++) {
          that.arr.push(row.mac.split('-')[i])
        }
        that.inputList[0].val = that.arr[0]
        that.inputList[1].val = that.arr[1]
        that.inputList[2].val = that.arr[2]
        that.inputList[3].val = that.arr[3]
        that.inputList[4].val = that.arr[4]
        that.inputList[5].val = that.arr[5]
      },
      //远程开门
      open(row) {
        let that = this
        request({
          url: `/device/openDoor/${row.deviceno}`,
          method: 'post',
        })
          .then(function (response) {
            if (response.data.code === 20000) {
              that.$message({
                message: '远程开门成功',
                type: 'success'
              })
            }
          })
          .catch(function (error) {
            console.log(error, '报错信息')
          })
      },
      //新增数据
      add() {
        let reg = /^(?!_)(?!.*?_$)[A-Z0-9-]+$/;
        this.newform.mac = this.inputList[0].val + '-' + this.inputList[1].val + '-' + this.inputList[2].val + '-' + this.inputList[3].val + '-' + this.inputList[4].val + '-' + this.inputList[5].val
        if (this.newform.mac === '') {
          this.$message.error('mac不可为空')
        } else if (this.newform.mac.length != 17) {
          this.$message.error('mac必须是12位')
        } else if (!reg.test(this.newform.mac)) {
          this.$message.error('mac必须是数字加大写字母')
        } else {
          this.$refs.ruleForm.validate()
            .then(() => {
              let that = this
              request({
                url: '/device/save',
                method: 'post',
                data: that.newform
              })
                .then(function (response) {
                  if (response.data.code === 20000) {
                    that.dialog = false
                    that.$message({
                      message: '新增成功',
                      type: 'success'
                    })
                    that.getinfo()
                    that.newform.id = ''
                    that.newform.deviceno = ''
                    that.newform.area = ''
                    that.newform.address = ''
                    that.newform.longitude = ''
                    that.newform.latitude = ''
                    that.newform.zrdw = ''
                    that.newform.zrr = ''
                    that.newform.lxr = ''
                    that.newform.lxdh = ''
                    that.newform.sfdm = ''
                    that.inputList[0].val = ''
                    that.inputList[1].val = ''
                    that.inputList[2].val = ''
                    that.inputList[3].val = ''
                    that.inputList[4].val = ''
                    that.inputList[5].val = ''
                    that.newform.mac = ''
                    that.newform.cardnum = ''
                    that.newform.sfzx = ''
                    that.newform.sfhj = ''
                    that.newform.sfzc = ''
                    that.newform.sfkj = ''
                    that.newform.xtsj = ''
                    that.newform.ysd = ''
                    that.newform.jgdwmc = ''
                  }
                })
                .catch(function (error) {
                  console.log(error, '报错信息')
                })
            })
            .catch(() => {
            })
        }
      },
      //点击修改
      update() {
        let reg = /^(?!_)(?!.*?_$)[A-Z0-9-]+$/;
        this.newform.mac = this.inputList[0].val + '-' + this.inputList[1].val + '-' + this.inputList[2].val + '-' + this.inputList[3].val + '-' + this.inputList[4].val + '-' + this.inputList[5].val
        if (this.newform.mac === '') {
          this.$message.error('mac不可为空')
        } else if (this.newform.mac.length != 17) {
          this.$message.error('mac必须是12位')
        } else if (!reg.test(this.newform.mac)) {
          this.$message.error('mac必须是数字加大写字母')
        } else {
          let that = this
          this.$refs.ruleForm.validate()
            .then(() => {
              request({
                url: '/device/update',
                method: 'post',
                data: that.newform
              })
                .then(function (response) {
                  if (response.data.code === 20000) {
                    that.updatedialog = false
                    that.$message({
                      message: '修改成功',
                      type: 'success'
                    })
                    that.getinfo()
                    that.newform.id = ''
                    that.newform.deviceno = ''
                    that.newform.area = ''
                    that.newform.address = ''
                    that.newform.longitude = ''
                    that.newform.latitude = ''
                    that.newform.zrdw = ''
                    that.newform.zrr = ''
                    that.newform.lxr = ''
                    that.newform.lxdh = ''
                    that.inputList[0].val = ''
                    that.inputList[1].val = ''
                    that.inputList[2].val = ''
                    that.inputList[3].val = ''
                    that.inputList[4].val = ''
                    that.inputList[5].val = ''
                    that.newform.mac = ''
                    that.newform.cardnum = ''
                    that.newform.sfzx = ''
                    that.newform.sfhj = ''
                    that.newform.sfzc = ''
                    that.newform.sfkj = ''
                    that.newform.xtsj = ''
                    that.newform.ysd = ''
                    that.newform.jgdwmc = ''
                  }
                })
                .catch(function (error) {
                  console.log(error, '报错信息')
                })
            })
            .catch(() => {
            })
        }
      },
      //点击出现查看位置的dialog,没用到
      looklocation(row) {
        let that = this
        that.locationhidden = true
        that.locationdialog = true
        that.jwd[0].longitude = row.longitude
        that.jwd[0].latitude = row.latitude
        that.jwd[0].name = row.address
      },
      //点击关闭所有dialog提示框
      closeDialog() {
        let that = this
        that.dialog = false
        that.updatedialog = false
        that.locationdialog = false
        that.newform.id = ''
        that.newform.deviceno = ''
        that.newform.area = ''
        that.newform.address = ''
        that.newform.longitude = ''
        that.newform.latitude = ''
        that.newform.zrdw = ''
        that.newform.zrr = ''
        that.newform.lxr = ''
        that.newform.lxdh = ''
        that.newform.sfdm = ''
        that.newform.name = ''
        that.newform.jgdwid = ''
        that.inputList[0].val = ''
        that.inputList[1].val = ''
        that.inputList[2].val = ''
        that.inputList[3].val = ''
        that.inputList[4].val = ''
        that.inputList[5].val = ''
        that.newform.mac = ''
        that.newform.cardnum = ''
        that.newform.sfzx = ''
        that.newform.sfhj = ''
        that.newform.sfzc = ''
        that.newform.sfkj = ''
        that.newform.xtsj = ''
        that.newform.ysd = ''
        that.arr = []
        that.markers = []
        that.locationhidden = false
      },
      //mac地址
      limit() {
        var input = $('.border-input');
        var iNow = 0;
        var type = !-[1,] ? 'onpropertychange' : 'oninput',
          limit = 2; //满足自动切换焦点的字符数
        for (var i = 0; i < input.length - 1; i++) {
          input[i].index = i;
          input[i][type] = function () {
            iNow = this.index;
            var that = this;
            setTimeout(function () {
              that.value.length > limit - 1 && input[iNow + 1].focus();
            }, 0)
          }
        }
      },
      //高德地图方法
      addMarker: function () {
        let lng = 121.5 + Math.round(Math.random() * 1000) / 10000;
        let lat = 31.197646 + Math.round(Math.random() * 500) / 10000;
        // this.markers.push([lng, lat]);
      },
      //高德地图方法
      onSearchResult(pois) {
        let latSum = 0;
        let lngSum = 0;
        if (pois.length > 0) {
          pois.forEach(poi => {
            let {lng, lat} = poi;
            lngSum += lng;
            latSum += lat;
            // this.markers.push([poi.lng, poi.lat]);
          });
          let center = {
            lng: lngSum / pois.length,
            lat: latSum / pois.length
          };
          this.center = [center.lng, center.lat];
          this.newform.longitude = center.lng;
          this.newform.latitude = center.lat;
        }
      },
    },
    created() {
      this.getinfo()
      this.getsf()
    },
  }
</script>

<style scoped>
  .form {
    margin-top: 1%;
    padding-left: 2%;
    box-sizing: border-box;
  }

  .page-wrapper {
    display: flex;
    flex-direction: column;
  }

  .page-wrapper > .el-form {
    height: 60px;
    flex-shrink: 0;
  }

  .page-wrapper > .el-table {
    flex-grow: 1;
    overflow: auto;
  }

  .page-wrapper > .el-pagination {
    text-align: center;
    /*margin-top: 20px;*/
    height: 50px;
    flex-shrink: 0;
  }

  .el-table--group::after, .el-table::before {
    background-color: white;
  }

  .border-input-wrapper {
    display: flex;
  }

  .border-input {
    width: 30px;
  }

  .bm-view {
    width: 800px;
    height: 800px;
  }

  .amap-demo {
    height: 500px;
  }

  .search-box {
    position: absolute;
    top: 25px;
    left: 20px;
  }

  .amap-page-container {
    position: relative;
  }
</style>

<template>
  <div class="page-wrapper">
    <!--已预约状态为条件的form表单-->
    <el-form :inline="true" class="demo-form-inline">
      <div style="display: flex;">
        <div class="classify">
          <el-button :style="{backgroundColor: color0}" class="classify0" @click="find(0)">申请中</el-button>
          <el-button :style="{backgroundColor: color1}" class="classify0" @click="find(1)">审核通过</el-button>
          <el-button :style="{backgroundColor: color2}" class="classify0" @click="find(2)">审核不通过</el-button>
          <el-button :style="{backgroundColor: color3}" class="classify0" @click="find(3)">取消</el-button>
        </div>
        <div style="display: flex; margin-left: 55%;">
          <div>今日预约人数：<span v-text="today"></span>人</div>
          <div style="margin-left: 30px;">本月预约人数：<span v-text="month"></span>人</div>
        </div>
      </div>
    </el-form>
    <!--内容表格-->
    <el-table :data="list" border :header-cell-style="{background:'#a0cfff',color:'#409EFF'}">
      <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
      <el-table-column prop="lawyer" label="姓名" width="70" align="center"></el-table-column>
      <el-table-column prop="zyzh" label="执业证号" align="center"></el-table-column>
      <el-table-column prop="zyjg" label="执业机构" align="center"></el-table-column>
      <el-table-column prop="prison" label="监所" align="center"></el-table-column>
      <el-table-column prop="bzxrxm" label="在押人员姓名" align="center"></el-table-column>
      <el-table-column prop="yyrq" label="预约日期" align="center"></el-table-column>
      <el-table-column prop="area" label="所在区域" min-width="120" align="center"></el-table-column>
      <el-table-column label="操作" align="center" width="150">
        <template slot-scope="scope">
          <el-button class="el-icon-search" size="mini" type="primary" @click="photo(scope.row)">查看照片</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--查看照片的dialog-->
    <el-dialog title="资料照片" :visible.sync="outerVisible">
      <div style="display: flex;justify-content: space-around">
        <div @click="showlargeimg($event)">
          <img :src="imgUrl+ '/'+zpList.wts+ '?' + Math.random()" alt="" width="100px" height="100px"
               v-if="zpList.wts!='' || zpList.wts!=null">
          <img src="../../assets/zw.jpg" alt="" width="100px" height="100px"
               v-if="zpList.wts===null||zpList.wts===''">
          <div class="zpTitle">委托书</div>
        </div>
        <div @click="showlargeimg($event)">
          <img :src="imgUrl+ '/'+zpList.jsx+ '?' + Math.random()" alt="" width="100px" height="100px"
               v-if="zpList.jsx!=''||zpList.jsx!=null">
          <img src="../../assets/zw.jpg" alt="" width="100px" height="100px"
               v-if="zpList.jsx===null||zpList.jsx===''">
          <div class="zpTitle">介绍信</div>
        </div>
        <div @click="showlargeimg($event)">
          <img :src="imgUrl+ '/'+zpList.photo+ '?' + Math.random()" alt="" width="100px" height="100px"
               v-if="zpList.photo!=''||zpList.photo!=null">
          <img src="../../assets/zw.jpg" alt="" width="100px" height="100px"
               v-if="zpList.photo===null||zpList.photo===''">
          <div class="zpTitle">律师证</div>
        </div>
        <div @click="showlargeimg($event)">
          <img :src="zpList.jcsmphoto+ '?' + Math.random()" alt="" width="100px" height="100px"
               v-if="zpList.jcsmphoto!=''||zpList.jcsmphoto!=null">
          <img src="../../assets/zw.jpg" alt="" width="100px" height="100px"
               v-if="zpList.jcsmphoto===null||zpList.jcsmphoto===''">
          <div class="zpTitle">解除手续</div>
        </div>
      </div>
      <div style="display: flex;justify-content: space-around;margin-top: 30px">
        <div @click="showlargeimg($event)">
          <img :src="imgUrl+ '/'+zpList.wts2+ '?' + Math.random()" alt="" width="100px" height="100px"
               v-if="zpList.wts2!=''||zpList.wts2!=null">
          <img src="../../assets/zw.jpg" alt="" width="100px" height="100px"
               v-if="zpList.wts2===null||zpList.wts2===''">
          <div class="zpTitle">助理委托书</div>
        </div>
        <div @click="showlargeimg($event)">
          <img :src="imgUrl+ '/'+zpList.jsx2+ '?' + Math.random()" alt="" width="100px" height="100px"
               v-if="zpList.jsx2!=''||zpList.jsx2!=null">
          <img src="../../assets/zw.jpg" alt="" width="100px" height="100px"
               v-if="zpList.jsx2===null||zpList.jsx2===''">
          <div class="zpTitle">助理介绍信</div>
        </div>
        <div @click="showlargeimg($event)">
          <img :src="imgUrl+ '/'+zpList.photo2+ '?' + Math.random()" alt="" width="100px" height="100px"
               v-if="zpList.photo2!=''||zpList.photo2!=null">
          <img src="../../assets/zw.jpg" alt="" width="100px" height="100px"
               v-if="zpList.photo2===null||zpList.photo2===''">
          <div class="zpTitle">辅律师证</div>
        </div>
        <div @click="showlargeimg($event)">
          <img :src="zpList.zplswtphoto+ '?' + Math.random()" alt="" width="100px" height="100px"
               v-if="zpList.zplswtphoto!=''||zpList.zplswtphoto!=null">
          <img src="../../assets/zw.jpg" alt="" width="100px" height="100px"
               v-if="zpList.zplswtphoto===null||zpList.zplswtphoto===''">
          <div class="zpTitle">指派手续</div>
        </div>
      </div>
      <el-dialog fullscreen="fullscreen" title="" :visible.sync="innerVisible" append-to-body top="0px"
                 @close="closeDialog">
        <div style="margin-bottom: 100px">
          <el-button @click="addClass(index,$event)" type="primary" class="el-icon-refresh-right">旋转图片</el-button>
          <el-button @click="chongzhi" type="primary" class="el-icon-refresh">重置图片</el-button>
          <el-button @click="gunabi" type="danger" class="el-icon-circle-close">关闭</el-button>
        </div>
        <div style="width: 100%;text-align: center">
          <img :src="bigPhoto+ '?' + Math.random()" alt="" height="600px"
               :class="{rotate90:rotate90,rotate180:rotate180,rotate270:rotate270,rotate360:rotate360,}">+
        </div>
      </el-dialog>
      <div slot="footer" class="dialog-footer">
        <el-button @click="outerVisible = false">取 消</el-button>
      </div>
    </el-dialog>
    <!--分页-->
    <el-pagination
      @size-change="sizeChangeHandler"
      @current-change="currentChangeHandler"
      :current-page="pagination.pageNo"
      :page-sizes="[8, 10, 20, 30, 40]"
      :page-size="pagination.length"
      layout="total, sizes, prev, pager, next, jumper"
      :total="pagination.total"
    ></el-pagination>
  </div>
</template>

<script type="text/ecmascript-6">
  import request from "@/utils/request";
  import picSrc from "@/utils/globalConfig";

  export default {
    name: "index",
    data() {
      return {
        //颜色
        color0: "#EE7A7D",
        color1: "#409EFF",
        color2: "#409EFF",
        color3: "#409EFF",
        //本月预约人数
        month: '',
        //今日预约人数
        today: '',
        //展示图片
        imgUrl: picSrc,
        //table数据
        list: [],
        cxzt: 0,
        //查询
        searchForm: {
          yhm: ""
        },
        //查询
        querySubmitForm: {
          yhm: ""
        },
        //状态
        zt: '',
        //分页控件
        pagination: {
          total: 0, //总条数
          pageNo: 1, // 页数
          length: 8 // 每页的条数
        },
        //dialog
        editDialog: {
          jsx: "",
          wts: "",
          isShow: false,
          sfzmhm: '',
          bzxrbh: '',
          reason: '',
          yysj: '',
          room: '',
          kssj: '',
          jssj: '',
          bhyy: '',
          deviceno: '',
          zt: ''
        },
        //外层的dialog
        outerVisible: false,
        //内层的dialog
        innerVisible: false,
        //显示出律师证件所有照片
        zpList: {
          photo: '', //律师证
          photo2: '', //辅助律师证
          wts: '', //委托书
          wts2: '', //助理委托书
          jsx: '', //介绍信
          jsx2: '', //助理介绍信
          jcsmphoto: '', //解除手续
          zplswtphoto: '', //指派手续
        },
        //放大的图片
        bigPhoto: '',
        //图片旋转
        index: 1,
        rotate90: false,
        rotate180: false,
        rotate270: false,
        rotate360: false,
      };
    },
    methods: {
      //获取数据
      getData(pageNo = 1) {
        let that = this;
        request({
          url: "/appointment/page",
          method: "get",
          params: {
            zt: that.cxzt,
            ...that.querySubmitForm,
            rows: that.pagination.length,
            page: that.pagination.pageNo,
            date: Date.parse(new Date())
          }
        })
          .then(function (response) {
            if (response.data.code === 20000) {
              that.list = response.data.data;
              that.pagination.total = response.data.total;
              that.month = response.data.month;
              that.today = response.data.today;
            }
          })
          .catch(function (error) {
            console.log(error, "报错信息");
          });
      },
      //查询
      find(e) {
        this.cxzt = e;
        this.getData((this.pagination.pageNo = 1));
        if (e == 0) {
          this.color0 = '#EE7A7D'
          this.color1 = '#409EFF'
          this.color2 = '#409EFF'
          this.color3 = '#409EFF'
        } else if (e == 1) {
          this.color0 = '#409EFF'
          this.color1 = '#EE7A7D'
          this.color2 = '#409EFF'
          this.color3 = '#409EFF'
        } else if (e == 2) {
          this.color0 = '#409EFF'
          this.color1 = '#409EFF'
          this.color2 = '#EE7A7D'
          this.color3 = '#409EFF'
        } else {
          this.color0 = '#409EFF'
          this.color1 = '#409EFF'
          this.color2 = '#409EFF'
          this.color3 = '#EE7A7D'
        }
      },
      //查询
      querySubmit() {
        this.querySubmitForm = Object.assign({}, this.searchForm);
        this.getData((this.pagination.pageNo = 1));
      },
      //查看照片
      photo(row) {
        let that = this
        that.outerVisible = true
        that.zpList.wts = row.wts
        that.zpList.wts2 = row.wts2
        that.zpList.jsx = row.jsx
        that.zpList.jsx2 = row.jsx2
        //没有照片的就用暂无
        if (row.jcsm == '' || row.jcsm == null) {
          that.zpList.jcsmphoto = require("../../assets/zw.jpg")
        } else {
          that.zpList.jcsmphoto = that.imgUrl + '/' + row.jcsm
        }
        if (row.zplswt == '' || row.zplswt == null) {
          that.zpList.zplswtphoto = require("../../assets/zw.jpg")
        } else {
          that.zpList.zplswtphoto = that.imgUrl + '/' + row.zplswt
        }
        //获取律师图片
        request({
          url: "/lawyer/zyz",
          method: "get",
          params: {
            zyzh: row.zyzh,
          }
        })
          .then(function (response) {
            if (response.data.code === 20000) {
              that.zpList.photo = response.data.photo
            }
          })
          .catch(function (error) {
            console.log(error, "报错信息");
          });
        //获取辅助律师律师图片，首先判断有没有辅助律师
        if (row.zyzh2 === "" || row.zyzh2 === null) {
          that.zpList.photo2 = ''
        } else {
          request({
            url: "/lawyer/zyz",
            method: "get",
            params: {
              zyzh: row.zyzh2,
            }
          })
            .then(function (response) {
              if (response.data.code === 20000) {
                that.zpList.photo2 = response.data.photo
              }
            })
            .catch(function (error) {
              console.log(error, "报错信息");
            });
        }
      },
      //点击每张照片
      showlargeimg(event) {
        let that = this
        that.innerVisible = true
        console.log(event)
        that.bigPhoto = event.path[0].currentSrc
      },
      //动态添加class
      addClass(index, event) {
        let that = this
        if (index === 5) {
          that.index = 1
          that.$message.success("请再次点击旋转！")
        } else {
          that.index = index + 1
          if (index === 1) {
            that.rotate90 = true
            that.rotate180 = false
            that.rotate270 = false
            that.rotate360 = false
          } else if (index === 2) {
            that.rotate90 = false
            that.rotate180 = true
            that.rotate270 = false
            that.rotate360 = false
          } else if (index === 3) {
            that.rotate90 = false
            that.rotate180 = false
            that.rotate270 = true
            that.rotate360 = false
          } else if (index === 4) {
            that.rotate90 = false
            that.rotate180 = false
            that.rotate270 = false
            that.rotate360 = true
          }
        }
      },
      //重置条件
      chongzhi() {
        let that = this
        that.rotate90 = false
        that.rotate180 = false
        that.rotate270 = false
        that.rotate360 = false
        that.index = 1
      },
      //关闭
      gunabi() {
        let that = this
        that.innerVisible = false
        that.rotate90 = false
        that.rotate180 = false
        that.rotate270 = false
        that.rotate360 = false
        that.index = 1
      },
      //关闭dialog
      closeDialog() {
        let that = this
        that.rotate90 = false
        that.rotate180 = false
        that.rotate270 = false
        that.rotate360 = false
        that.index = 1
      },
      //换每页条数
      sizeChangeHandler(length) {
        this.pagination.length = length;
        this.getData();
      },
      //换页
      currentChangeHandler(pageNo) {
        this.pagination.pageNo = pageNo;
        this.getData();
      }
    },
    watch: {
      "editDialog.isShow"(newValue) {
        if (!newValue) {
          // 关闭dialog时清空表单
          this.editDialog.jsx = '';
          this.editDialog.wts = '';
        }
      }
    },
    created() {
      this.getData();
    }
  };
</script>

<style scoped>
  .classify {
    color: white;
    display: flex;
  }

  .classify0 {
    background-color: #409EFF;
    color: white;
    text-align: center;
    cursor: pointer;
  }

  .page-wrapper {
    height: 100%;
    padding: 20px;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
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

    height: 100px;
    flex-shrink: 0;
  }

  .el-table--group::after, .el-table::before {
    background-color: white;
  }

  .el-icon-edit-outline {
    background-color: #409eff;
    color: #ffffff;
    font-size: 24px;
  }

  .el-icon-delete {
    background-color: #f56c6c;
    color: #ffffff;
    font-size: 24px;
  }

  .el-tooltip {
    border-radius: 50%;
    padding: 5px;
    margin: 0 10px;
  }

  .demo-form-inline {
    white-space: nowrap;
    width: 100%;
  }

  .form-item-btn {
    width: calc((96% - 285px) / 2);
  }

  .form-item-btn.one {
    text-align: left;
  }

  .form-item-btn.two {
    text-align: right;
  }

  .text {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
  }

  .classify {
    color: white;
    display: flex;
  }

  .look > div {
    line-height: 35px;
    font-size: 16px;
  }

  .look > div > span:first-child {
    width: 150px;
    display: inline-block;
    text-align: right;
    margin-right: 20px;
  }

  .zpTitle {
    width: 100px;
    text-align: center;
  }

  .rotate90 {
    transform: rotate(90deg);
  }

  .rotate180 {
    transform: rotate(180deg);
  }

  .rotate270 {
    transform: rotate(270deg);
  }

  .rotate360 {
    transform: rotate(360deg);
  }
</style>

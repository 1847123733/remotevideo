<template>
  <div class="page-wrapper">
    <!--查询form-->
    <el-form :inline="true" class="demo-form-inline form">
      <el-form-item label="时间段">
        <el-date-picker
          format="yyyy-MM-dd HH:mm"
          value-format="yyyy-MM-dd HH:mm"
          v-model="sjvalue"
          :clearable="false"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="chongzhi">重置查询</el-button>
        <el-button type="primary" icon="el-icon-search" @click="dosearch">查询数据</el-button>
        <el-button type="primary" icon="el-icon-download" @click="xiazai">下载报表</el-button>
      </el-form-item>
      <el-form-item>
        <div class="datatitle">律师初审通过次数：{{cs}}次</div>
      </el-form-item>
      <el-form-item>
        <div class="datatitle">律师复审通过次数：{{fs}}次</div>
      </el-form-item>
      <el-form-item>
        <div class="datatitle">律师预约通过次数：{{pass}}次</div>
      </el-form-item>
    </el-form>
    <!--内容表格-->
    <el-table :data="list" border style="width: 100%" :header-cell-style="{background:'#a0cfff',color:'#409EFF'}">
      <el-table-column type="index" label="序号" align="center" width="100"></el-table-column>
      <el-table-column prop="xm" label="律师姓名" align="center"></el-table-column>
      <el-table-column prop="zcsj" label="律师注册时间" align="center"></el-table-column>
      <el-table-column prop="cssj" label="律师初审通过时间" align="center"></el-table-column>
      <el-table-column prop="fssj" label="律师复审通过时间" align="center"></el-table-column>
      <el-table-column prop="yysj" label="律师预约时间" align="center"></el-table-column>
      <el-table-column prop="pbsj" label="看守所排版时间" align="center"></el-table-column>
      <el-table-column prop="hjsj" label="具体会见时间" align="center"></el-table-column>
    </el-table>
    <!--分页控件-->
    <el-pagination
      @size-change="sizechange"
      @current-change="currentchange"
      :current-page="pagination.pageNo"
      :page-sizes="[10, 20, 30]"
      :page-size="pagination.length"
      layout="total, sizes, prev, pager, next, jumper"
      :total="pagination.total">
    </el-pagination>
    <!--下载报表-->
    <el-dialog title="请选择日期" :visible.sync="delsure" width="450px" top="30vh">
      <div class="block">
        <span class="demonstration">请选择日期时间</span>
        <el-date-picker
          format="yyyy-MM-dd HH:mm"
          value-format="yyyy-MM-dd HH:mm"
          v-model="valuetime"
          :clearable="false"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="medium" @click="delsure = false">取 消</el-button>
        <el-button type="primary" size="medium" @click="deltrue">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import request from "@/utils/request";

  export default {
    name: "index",
    data() {
      return {
        //列表数据
        list: [],
        //初审数据
        cs: '',
        //复审数据
        fs: '',
        //预约数据
        pass: '',
        //时间段查询数组
        sjvalue: [],
        //分页控件
        pagination: {
          total: 0, //总条数
          pageNo: 1, // 页数
          length: 10 // 每页的条数
        },
        //下载的dialog
        delsure: false,
        //下载的两个日期点
        valuetime: [],
      }
    },
    methods: {
      //获取数据
      getinfo() {
        let that = this
        request({
          url: '/count/lawyer/yy',
          method: 'post',
          params: {
            kssj: that.sjvalue[0] || '',
            jssj: that.sjvalue[1] || '',
            rows: that.pagination.length,
            page: that.pagination.pageNo,
          }
        })
          .then(function (response) {
            if (response.data.code === 20000) {
              //数据传递给data
              that.list = response.data.data;
              that.cs = response.data.cs;
              that.fs = response.data.fs;
              that.pass = response.data.pass;
              //数据的总条数
              that.pagination.total = response.data.total;
            }
          })
          .catch(function (error) {
            console.log(error, '报错信息')
          })
      },
      //下载报表
      xiazai() {
        let that = this
        that.delsure = true
      },
      //下载确定,打包不要忘记修改地址
      deltrue() {
        if (this.valuetime.length < 2) {
          this.$message.error('请选好日期！')
        } else {
          //谷家提本地下载
          // window.open(`http://192.168.8.92:8099/count/lawyer/yy/download?kssj=${this.valuetime[0]}&jssj=${this.valuetime[1]}`)
          //呼和浩特下载
          // window.open(`https://www.vlawyer.net/server/count/lawyer/yy/download?kssj=${this.valuetime[0]}&jssj=${this.valuetime[1]}`)
          //济南下载
          window.open(`http://49.4.68.8:80/count/lawyer/yy/download?kssj=${this.valuetime[0]}&jssj=${this.valuetime[1]}`)
          this.delsure = false;
          this.valuetime = []
        }
      },
      //重置查询
      chongzhi: function () {
        this.sjvalue = []
        this.getinfo()
        this.morenshijian()
      },
      //条件查询点击事件
      dosearch: function () {
        this.pagination.pageNo = 1;
        this.getinfo()
      },
      //每页显示条数改变事件
      sizechange: function (val) {
        this.pagination.length = val
        this.sjvalue = ''
        this.getinfo()
      },
      //当前页改变事件
      currentchange: function (val) {
        this.pagination.pageNo = val
        this.sjvalue = ''
        this.getinfo()
      },
      //时间
      morenshijian() {
        let that = this
        let a = new Date()
        let nian = a.getFullYear()
        let yue = (a.getMonth() + 1).toString().padStart(2, '0')
        let ri = a.getDate().toString().padStart(2, '0')
        that.sjvalue[0] = nian + "-" + yue + "-" + ri + " " + "00:00"
        that.sjvalue[1] = nian + "-" + yue + "-" + ri + " " + "23:59"
      }
    },
    created() {
      this.getinfo()
      this.morenshijian()
    },
  }
</script>

<style scoped>
  .page-wrapper {
    display: flex;
    flex-direction: column;
  }

  .demo-form-inline {
    white-space: nowrap;
    width: 100%;
  }

  .page-wrapper > .el-form {
    height: 60px;
    flex-shrink: 0;
    margin-top: 1%;
    padding-left: 2%;
    box-sizing: border-box;
  }

  .page-wrapper > .el-table {
    flex-grow: 1;
    overflow: auto;
  }

  .page-wrapper > .el-pagination {
    text-align: center;
    height: 50px;
    flex-shrink: 0;
  }

  .el-table--group::after, .el-table::before {
    background-color: white;
  }

  .datatitle {
    color: red;
    font-size: 15px;
  }
</style>

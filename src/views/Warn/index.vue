<template>
  <div class="page-wrapper">
    <div style="display: flex;justify-content: space-between;">
      <!--form查询-->
      <div>
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item class="form-item-select" label="会见亭编号">
            <el-input clearable v-model="searchForm.deviceno" clearable></el-input>
          </el-form-item>
          <el-form-item class="form-item-btn one">
            <el-button icon="el-icon-search" class="btn-query" type="primary" @click="querySubmit">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div style="margin-right: 10%;">
        <div>今日报警人数：<span v-text="today"></span>人</div>
      </div>
    </div>
    <!-- 内容表格 -->
    <el-table :data="list" border :header-cell-style="{background:'#a0cfff',color:'#409EFF'}">
      <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
      <el-table-column prop="room" label="会见室" align="center"></el-table-column>
      <el-table-column prop="deviceno" label="会见亭" min-width="100" align="center"></el-table-column>
      <el-table-column prop="bzxrxm" label="在押人员姓名" align="center"></el-table-column>
      <el-table-column prop="prison" label="监所名称" align="center"></el-table-column>
      <el-table-column prop="lawyer" label="律师" align="center"></el-table-column>
      <el-table-column prop="zyzh" label="执业证号" align="center"></el-table-column>
      <el-table-column prop="bjsj" label="报警时间" align="center"></el-table-column>
      <el-table-column prop="info" label="报警内容" :show-overflow-tooltip="true" min-width="140"
                       align="center"></el-table-column>
      <el-table-column label="操作" align="center" width="150">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="beginUpdate(scope.row)">查看图片</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--编辑对话框-->
    <el-dialog
      class="dialog-edit"
      :show-close="false"
      :close-on-click-model="false"
      :close-on-press-escape="false"
      :visible="editDialog.isShow"
      title="查看照片"
      width="600px">
      <div class="text">
        <template>
          <el-popover placement="right" trigger="hover">
            <img :src="imgUrl +'/' + editDialog.zp+ '?' + Math.random()" style="width:100px"/>
            <img slot="reference" :src="imgUrl +'/' + editDialog.zp+ '?' + Math.random()" style="max-height: 100px"/>
          </el-popover>
        </template>
      </div>
      <div slot="footer">
        <el-button type="primary" @click="editDialog.isShow = false">关闭</el-button>
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
  import picSrc from '@/utils/globalConfig';

  export default {
    name: "index",
    data() {
      return {
        //报警总人数
        today: '',
        //图片地址
        imgUrl: picSrc,
        //table数据
        list: [],
        //form
        searchForm: {
          deviceno: ""
        },
        querySubmitForm: {
          deviceno: ""
        },
        //分页控件
        pagination: {
          total: 0, //总条数
          pageNo: 1, //页数
          length: 8 //每页的条数
        },
        //dialog
        editDialog: {
          zp: "",
          isShow: false
        }
      };
    },
    methods: {
      //获取数据
      getData(pageNo = 1) {
        let that = this;
        request({
          url: "/warnInfo/page",
          method: "get",
          params: {
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
              that.today = response.data.today;
            }
          })
          .catch(function (error) {
            console.log(error, "报错信息");
          });
      },
      //查询
      querySubmit() {
        this.querySubmitForm = Object.assign({}, this.searchForm);
        this.getData((this.pagination.pageNo = 1));
      },
      //查看照片
      beginUpdate(row) {
        this.editDialog.zp = row.zp;
        this.editDialog.mode = false;
        this.editDialog.isShow = true;
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
      },
    },
    watch: {
      "editDialog.isShow"(newValue) {
        if (!newValue) {
          // 关闭dialog时清空表单
          this.editDialog.zp = '';
        }
      }
    },
    created() {
      this.getData();
    }
  };
</script>

<style scoped>
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
    justify-content: center;
    align-items: center;
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
</style>

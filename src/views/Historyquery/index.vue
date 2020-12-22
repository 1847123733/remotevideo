<template>
  <div class="page-wrapper">
    <!--查询form-->
    <el-form :inline="true" class="demo-form-inline form">
      <el-form-item label="被执行人姓名">
        <el-input v-model="searchForm.bzxrxm" clearable></el-input>
      </el-form-item>
      <el-form-item label="会见时间段">
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
        <el-button icon="el-icon-search" type="primary" @click="dosearch">查询</el-button>
      </el-form-item>
    </el-form>
    <!--内容表格-->
    <!--这里的lists调用的计算属性中的方法-->
    <el-table :data="lists" border style="width: 100%" :header-cell-style="{background:'#a0cfff',color:'#409EFF'}">
      <el-table-column type="index" label="序号" align="center" width="60"></el-table-column>
      <el-table-column prop="bzxrxm" label="被执行人姓名" align="center" width="100"></el-table-column>
      <el-table-column prop="lawyer" label="律师姓名" align="center" width="100"></el-table-column>
      <el-table-column prop="sfzmhm" label="律师身份证号" align="center" width="180"></el-table-column>
      <el-table-column prop="zyzh" label="执业证号" align="center" width="180"></el-table-column>
      <el-table-column prop="zyjg" label="执业机构" align="center" width="120"></el-table-column>
      <el-table-column prop="deviceno" label="会见亭编号" align="center"></el-table-column>
      <el-table-column prop="room" label="会见室" align="center"></el-table-column>
      <el-table-column prop="kssj" label="开始时间" align="center" width="150"></el-table-column>
      <el-table-column prop="jssj" label="结束时间" align="center" width="150"></el-table-column>
      <el-table-column prop="lawyer2" label="辅助律师姓名" align="center" width="100"></el-table-column>
      <el-table-column prop="sfzmhm2" label="辅助律师身份证明号码" align="center" width="100"></el-table-column>
      <el-table-column prop="zyzh2" label="辅助律师执业证号" align="center" width="100"></el-table-column>
      <el-table-column label="会见状态" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.bj === 0" type="info">未开始</el-tag>
          <el-tag v-else-if="scope.row.bj === 1" type="success">会见中</el-tag>
          <el-tag v-else-if="scope.row.bj === 2" type="info">会见结束</el-tag>
          <el-tag v-else-if="scope.row.bj === 3" type="warning">报警</el-tag>
        </template>
      </el-table-column>
    </el-table>
    <!--分页控件-->
    <el-pagination
      @size-change="sizechange"
      @current-change="currentchange"
      :current-page="pagination.pageNo"
      :page-sizes="[10, 20, 30]"
      :page-size="pagination.length"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalInfo">
      <!--上面这个:total调用的也是计算属性中的方法-->
    </el-pagination>
  </div>
</template>

<script>
  import request from "@/utils/request";
  //如果要映射总仓库
  //import {mapState} from 'vuex';
  //如果要映射的是子仓库
  import {createNamespacedHelpers} from 'vuex';
  //拿出映射子仓库的用到的两个节点
  let {mapState, mapActions} = createNamespacedHelpers('test');

  export default {
    name: "index",
    data() {
      return {
        //el-table数据，用了仓库的话，就不用这里了
        // list: [],
        //查询条件
        searchForm: {
          bzxrxm: ''
        },
        //时间数组
        sjvalue: [],
        //分页控件
        pagination: {
          total: 0, //总条数
          pageNo: 1, // 页数
          length: 10 // 每页的条数
        },
      }
    },
    computed: {
      //映射仓库中state中的数据
      ...mapState(['list', 'total']),
      //随便定义一个方法，用来return仓库中的state
      lists() {
        return this.list
      },
      //随便定义一个方法，用来return仓库中的state
      totalInfo() {
        return this.total
      }
    },
    methods: {
      //映射仓库中actions中的数据
      ...mapActions(['init']),
      //获取数据
      getinfo() {
        let that = this
        //直接调用映射的子仓库中的数据
        that.init({
          kssj: that.sjvalue[0],
          jssj: that.sjvalue[1],
          bzxrxm: that.searchForm.bzxrxm,
          rows: that.pagination.length,
          page: that.pagination.pageNo,
        })
      },
      //重置查询
      chongzhi: function () {
        this.sjvalue = []
        this.searchForm.bzxrxm = ''
        this.pagination.pageNo = 1
        this.getinfo()
      },
      //条件查询点击事件
      dosearch: function () {
        this.pagination.pageNo = 1
        this.getinfo()
      },
      //每页显示条数改变事件
      sizechange: function (val) {
        this.pagination.length = val
        this.getinfo()
      },
      //当前页改变事件
      currentchange: function (val) {
        this.pagination.pageNo = val
        this.getinfo()
      },
      //getinfo原来的请求，暂时不用
      annotation() {
        // request({
        //   url: '/appointment/meet/page',
        //   method: 'get',
        //   params: {
        //     kssj: that.sjvalue[0],
        //     jssj: that.sjvalue[1],
        //     bzxrxm: that.searchForm.bzxrxm,
        //     rows: that.pagination.length,
        //     page: that.pagination.pageNo,
        //   }
        // })
        //   .then(function (response) {
        //     if (response.data.code === 20000) {
        //       //数据传递给data
        //       that.list = response.data.data;
        //       //数据的总条数
        //       that.pagination.total = response.data.total;
        //     }
        //   })
        //   .catch(function (error) {
        //     console.log(error, '报错信息')
        //   })
      }
    },
    created() {
      this.getinfo()
    }
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
</style>

<template>
  <div class="page-wrapper">
    <!--form查询-->
    <el-form :model="find" :inline="true" class="form" style="white-space:nowrap;">
      <el-form-item label="监所名称：">
        <el-input v-model="find.name"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" type="primary" @click="dosearch">查询</el-button>
        <el-button icon="el-icon-circle-plus-outline" type="primary" @click="appeardialog">新增</el-button>
      </el-form-item>
    </el-form>
    <!--table表格-->
    <el-table :data="list" style="width: 100%" border :header-cell-style="{background:'#a0cfff',color:'#409EFF'}">
      <el-table-column type="index" align="center" width="50" label="序号"></el-table-column>
      <el-table-column prop="name" label="监所名称" align="center" width="250"></el-table-column>
      <el-table-column prop="address" label="监所地址" align="center" width="300"></el-table-column>
      <el-table-column prop="fzr" label="负责人" align="center" width="200"></el-table-column>
      <el-table-column prop="lxdh" label="联系电话" align="center" width="250"></el-table-column>
      <el-table-column prop="cjsj" label="创建时间" align="center"></el-table-column>
      <el-table-column prop="gxsj" label="更新时间" align="center"></el-table-column>
      <el-table-column label="操作" align="center" width="200">
        <template slot-scope="scope">
          <el-button @click="appearupdatedialog(scope.row)" type="primary">编辑</el-button>
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
    <el-dialog title="新增监所" :visible="dialog" @close="closeDialog">
      <el-form :inline="true" :model="newform" label-position="right" label-width="180px" :rules="rules" ref="ruleForm">
        <el-form-item label="监所名称" prop="name">
          <el-input v-model="newform.name"></el-input>
        </el-form-item>
        <el-form-item label="监所地址" prop="address">
          <el-input v-model="newform.address"></el-input>
        </el-form-item>
        <el-form-item label="负责人" prop="fzr">
          <el-input v-model="newform.fzr"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="lxdh">
          <el-input v-model="newform.lxdh"></el-input>
        </el-form-item>
        <el-form-item label="省份" prop="sfdm">
          <el-select v-model="newform.sf" @change="getjgdw" filterable clearable placeholder="请选择所属省份">
            <el-option v-for="item in sflist" :key="item.dm" :label="item.name" :value="item.dm"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属监管单位" prop="jgdwmc">
          <el-select v-model="newform.jgdwmc" @change="jgdwmc" filterable clearable placeholder="请选择所属监管单位">
            <el-option v-for="item in jgdwlist" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="律师复审权限：">
          <el-radio v-model="newform.lsfs" label="0">不允许</el-radio>
          <el-radio v-model="newform.lsfs" label="1">允许</el-radio>
        </el-form-item>
        <el-form-item style="margin-left: 80%">
          <el-button @click="add">确认新增</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!--修改用户的dialog-->
    <el-dialog title="修改监所" :visible="updatedialog" @close="closeDialog">
      <el-form :inline="true" :model="newform" label-position="right" label-width="180px" :rules="rules" ref="ruleForm">
        <el-form-item label="监所名称" prop="name">
          <el-input v-model="newform.name"></el-input>
        </el-form-item>
        <el-form-item label="监所地址" prop="address">
          <el-input v-model="newform.address"></el-input>
        </el-form-item>
        <el-form-item label="负责人" prop="fzr">
          <el-input v-model="newform.fzr"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="lxdh">
          <el-input v-model="newform.lxdh"></el-input>
        </el-form-item>
        <el-form-item label="省份" prop="sfdm">
          <el-select v-model="newform.sf" @change="getjgdw" filterable clearable placeholder="请选择所属省份">
            <el-option v-for="item in sflist" :key="item.dm" :label="item.name" :value="item.dm"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属监管单位" prop="jgdwmc">
          <el-select v-model="newform.jgdwmc" @change="jgdwmc" filterable clearable placeholder="请选择所属监管单位">
            <el-option v-for="item in jgdwlist" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="律师复审权限：">
          <el-radio v-model="newform.lsfs" label="0">不允许</el-radio>
          <el-radio v-model="newform.lsfs" label="1">允许</el-radio>
        </el-form-item>
        <el-form-item style="margin-left: 80%">
          <el-button @click="update">确认修改</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  import request from '@/utils/request'

  export default {
    name: 'index',
    data() {
      return {
        sflist: [],
        jgdwlist: [],
        //返回数据存储在数组中
        list: [],
        //监所名字
        find: {
          name: '',
        },
        //新增
        newform: {
          id: '',
          name: '',
          address: '',
          fzr: '',
          lxdh: '',
          cjsj: '',
          jgdwmc: '',
          jgdwid: '',
          sf: '',
          sfdm: '',
          dwlb: 1,
          lsfs: '0'
        },
        //验证规则
        rules: {
          name: [{required: true, message: '监所名称不能为空', trigger: 'blur'}],
          address: [{required: true, message: '监所地址不能为空', trigger: 'blur'}],
          fzr: [{required: true, message: '负责人不能为空', trigger: 'blur'}],
          lxdh: [{required: true, message: '联系电话不能为空', trigger: 'blur'}],
          sfdm: [{required: true, message: '省份不能为空', trigger: 'blur'}],
          jgdwmc: [{required: true, message: '监管单位不能为空', trigger: 'blur'}],
        },
        //新增的dialog
        dialog: false,
        //修改用户的dialog
        updatedialog: false,
        //当前页数
        currentPage: 1,
        //每页显示多少条数据
        pagesize: 10,
        //数据的总条数
        counts: 0,
      }
    },
    methods: {
      //获取数据
      getinfo() {
        let that = this
        request({
          url: '/prison/page',
          method: 'get',
          params: {
            name: that.find.name,
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
      //条件查询点击事件
      dosearch: function () {
        this.currentPage = 1
        this.getinfo()
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
        that.newform.jgdwmc = ''
        that.newform.sfdm = vid
        request({
          url: "/prison/jgdw",
          method: "get",
          params: {
            sfdm: vid
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
      //传监管单位名称
      jgdwmc(vid) {
        let that = this;
        for (var i = 0; i < that.jgdwlist.length; i++) {
          if (that.jgdwlist[i].id == vid) {
            that.newform.jgdwmc = that.jgdwlist[i].name
            that.newform.jgdwid = that.jgdwlist[i].id
          }
        }
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
        that.newform.lsfs = '0'
      },
      //点击修改出现dialog
      appearupdatedialog(row) {
        let that = this
        console.log(that.sflist)
        that.getjgdw(row.sfdm)
        that.updatedialog = true
        that.newform.id = row.id
        that.newform.name = row.name
        that.newform.address = row.address
        that.newform.fzr = row.fzr
        that.newform.lxdh = row.lxdh
        that.newform.sf = row.sf
        that.newform.sfdm = row.sfdm
        that.newform.jgdwid = row.jgdwid
        that.newform.jgdwmc = row.jgdwmc
        that.newform.cjsj = row.cjsj
        that.newform.lsfs = row.lsfs
      },
      //新增数据
      add() {
        this.$refs.ruleForm.validate()
          .then(() => {
              let that = this
              request({
                url: '/prison/save',
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
                    that.newform.id = '';
                    that.newform.name = '';
                    that.newform.address = '';
                    that.newform.fzr = '';
                    that.newform.lxdh = '';
                    that.newform.cjsj = '';
                    that.newform.jgdwmc = '';
                    that.newform.jgdwid = '';
                    that.newform.sf = '';
                    that.newform.sfdm = ''
                  }
                })
                .catch(function (error) {
                  console.log(error, '报错信息')
                })
            }
          )
          .catch(() => {
          })
      },
      //点击修改
      update() {
        let that = this
        this.$refs.ruleForm.validate()
          .then(() => {
            request({
              url: '/prison/update',
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
                  that.newform.id = '';
                  that.newform.name = '';
                  that.newform.address = '';
                  that.newform.fzr = '';
                  that.newform.lxdh = '';
                  that.newform.jgdwmc = '';
                  that.newform.jgdwid = '';
                  that.newform.sf = '';
                  that.newform.sfdm = '';
                }
              })
              .catch(function (error) {
                console.log(error, '报错信息')
              })
          })
          .catch(() => {

          })
      },
      //点击关闭所有dialog提示框
      closeDialog() {
        let that = this
        that.dialog = false
        that.updatedialog = false
        that.newform.name = ''
        that.newform.address = ''
        that.newform.fzr = ''
        that.newform.lxdh = ''
        that.newform.sf = ''
        that.newform.jgdwid = ''
        that.newform.sfdm = ''
      },
    },
    created() {
      this.getinfo();
      this.getsf();
    }
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
    height: 50px;
    flex-shrink: 0;
  }

  .el-table--group::after,
  .el-table::before {
    background-color: white;
  }
</style>

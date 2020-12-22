<template>
  <div class="page-wrapper">
    <!--顶部用于查询输入的表单-->
    <el-form :model="find" :inline="true" class="form" style="white-space:nowrap;">
      <el-form-item label="提审终端号：">
        <el-input v-model="find.zdbh" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" type="primary" @click="dosearch">查询</el-button>
        <el-button icon="el-icon-circle-plus-outline" type="primary" @click="appeardialog">新增</el-button>
      </el-form-item>
    </el-form>
    <!--table展示信息-->
    <el-table :data="list" style="width: 100%" border :header-cell-style="{background:'#a0cfff',color:'#409EFF'}">
      <el-table-column type="index" align="center" width="50" label="序号"></el-table-column>
      <el-table-column prop="prison" label="所属监所名称" align="center" width="250"></el-table-column>
      <el-table-column prop="bz" label="说明" align="center"></el-table-column>
      <el-table-column prop="sfzx" label="是否在线" align="center" width="150">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.sfzx === 0" type="warning">离线</el-tag>
          <el-tag v-else-if="scope.row.sfzx === 1" type="success">在线</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="sfhj" label="是否会见中" align="center" width="150">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.sfhj === 0" type="warning">空闲</el-tag>
          <el-tag v-else-if="scope.row.sfhj === 1" type="success">会见中</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="sfzc" label="是否正常" align="center" width="150">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.sfzc === 0" type="warning">故障</el-tag>
          <el-tag v-else-if="scope.row.sfzc === 1" type="success">正常</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="zdbh" label="终端编号" align="center"></el-table-column>
      <el-table-column prop="room" label="所属会见室" align="center" width="300"></el-table-column>
      <el-table-column label="操作" align="center" width="150">
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
    <!--新增的dialog-->
    <el-dialog title="新增提审终端" :visible="dialog" @close="closeDialog">
      <el-form :inline="true" :model="newform" label-position="right" label-width="180px" :rules="rules" ref="ruleForm">
        <el-form-item label="提审终端编号" prop="zdbh">
          <el-input v-model="newform.zdbh"></el-input>
        </el-form-item>
        <el-form-item label="所属监所名称" prop="prison">
          <el-select v-model="newform.prison" @change="handleChange">
            <el-option v-for="(item, i) in prisonList" :key="i" :label="item.name" :value="item.name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属监所id" prop="prisonid">
          <el-select v-model="newform.prisonid" disabled>
            <el-option v-for="(item, i) in prisonList" :key="i" :label="item.id" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="说明" prop="bz">
          <el-input v-model="newform.bz"></el-input>
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
    </el-dialog>
    <!--修改的dialog-->
    <el-dialog title="修改提审终端" :visible="updatedialog" @close="closeDialog">
      <el-form :inline="true" :model="newform" label-position="right" label-width="180px" :rules="rules" ref="ruleForm">
        <el-form-item label="提审终端编号" prop="zdbh">
          <el-input v-model="newform.zdbh" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="所属监所名称" prop="prison">
          <el-select v-model="newform.prison" @change="handleChange">
            <el-option v-for="(item, i) in prisonList" :key="i" :label="item.name" :value="item.name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属监所id" prop="prisonid">
          <el-select v-model="newform.prisonid" disabled>
            <el-option v-for="(item, i) in prisonList" :key="i" :label="item.id" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="说明" prop="bz">
          <el-input v-model="newform.bz"></el-input>
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
        <el-form-item style="margin-left: 80%">
          <el-button @click="update">确认修改</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  import request from '@/utils/request'
  import $ from "jquery";

  export default {
    name: "index",
    data() {
      return {
        //table的list
        list: [],
        //下拉数据
        prisonList: [],
        //新增和修改用的newform
        newform: {
          id: '',
          zdbh: '',
          prison: '',
          prisonid: '',
          bz: '',
          mac: '',
          cardnum: ''
        },
        //提审终端号
        find: {
          zdbh: ''
        },
        //新增的dialog
        dialog: false,
        //修改的dialog
        updatedialog: false,
        //当前页数
        currentPage: 1,
        //每页显示多少条数据
        pagesize: 10,
        //数据的总条数
        counts: 0,
        //验证规则
        rules: {
          zdbh: [{required: true, message: '提审终端编号不能为空', trigger: 'blur'}],
          prison: [{required: true, message: '所属监狱名称不能为空', trigger: 'blur'}],
          prisonid: [{required: true, message: '所属监狱id不能为空', trigger: 'blur'}],
          bz: [{required: true, message: '说明不能为空', trigger: 'blur'}],
          cardnum: [{required: true, message: '专网卡号不能为空', trigger: 'blur'}],
        },
        //mac地址
        inputList: [{val: ""}, {val: ""}, {val: ""}, {val: ""}, {val: ""}, {val: ""}],
        arr: []
      }
    },
    methods: {
      //获取table数据
      getinfo() {
        let that = this
        request({
          url: '/arraignment/page',
          method: 'get',
          params: {
            zdbh: that.find.zdbh,
            rows: that.pagesize,
            page: that.currentPage,
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
      //获取下拉数据
      getDataList() {
        let that = this;
        request({
          url: "/prison/all",
          method: "get",
        })
          .then(function (response) {
            if (response.data.code === 20000) {
              that.prisonList = response.data.data
            }
          })
          .catch(function (error) {
            console.log(error, "报错信息");
          });
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
      //监所名称下拉框联动id
      handleChange(val) {
        let that = this
        let obj = {}
        obj = that.prisonList.find((item) => {
          return item.name === val
        })
        that.newform.prisonid = obj.id
      },
      //点击新增出现dialog
      appeardialog() {
        let that = this
        that.dialog = true
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
                url: '/arraignment/save',
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
                    that.newform.zdbh = ''
                    that.newform.prison = ''
                    that.newform.prisonid = ''
                    that.newform.bz = ''
                    that.newform.cardnum = ''
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
      //点击修改出现dialog
      appearupdatedialog(row) {
        let that = this
        that.updatedialog = true
        that.newform.id = row.id
        that.newform.zdbh = row.zdbh
        that.newform.prison = row.prison
        that.newform.prisonid = row.prisonid
        that.newform.bz = row.bz
        that.newform.cardnum = row.cardnum
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
      //点击修改
      update() {
        //正则表达式
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
                url: '/arraignment/update',
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
                    that.newform.zdbh = ''
                    that.newform.prison = ''
                    that.newform.prisonid = ''
                    that.newform.bz = ''
                    that.newform.cardnum = ''
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
      //点击关闭所有dialog提示框,并清空数据
      closeDialog() {
        let that = this
        that.dialog = false
        that.updatedialog = false
        that.newform.id = ''
        that.newform.zdbh = ''
        that.newform.prison = ''
        that.newform.prisonid = ''
        that.newform.bz = ''
        that.inputList[0].val = ''
        that.inputList[1].val = ''
        that.inputList[2].val = ''
        that.inputList[3].val = ''
        that.inputList[4].val = ''
        that.inputList[5].val = ''
        that.newform.mac = ''
        that.newform.cardnum = ''
        that.arr = []
      },
      //输完两位数，跳到下一个框
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
      }
    },
    created() {
      //调用函数
      this.getinfo()
      this.getDataList()
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

  .el-table--group::after, .el-table::before {
    background-color: white;
  }

  .border-input-wrapper {
    display: flex;
  }

  .border-input {
    width: 30px;
  }
</style>

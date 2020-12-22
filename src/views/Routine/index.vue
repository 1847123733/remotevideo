<template>
  <div class="page-wrapper">
    <!--form表单-->
    <el-form :inline="true" class="demo-form-inline form">
      <el-form-item label="操作：">
        <el-button type="primary" icon="el-icon-circle-plus-outline" @click="xinzeng">新增常规预约时间段</el-button>
        <el-button type="primary" icon="el-icon-date" @click="sb">节假日管理</el-button>
      </el-form-item>
    </el-form>
    <!--内容表格-->
    <el-table :data="list" border style="width: 100%" :header-cell-style="{background:'#a0cfff',color:'#409EFF'}">
      <el-table-column type="index" label="序号" align="center" width="60"></el-table-column>
      <el-table-column prop="prison" label="看守所名称" align="center"></el-table-column>
      <el-table-column prop="kssj" label="开始时间" align="center"></el-table-column>
      <el-table-column prop="jssj" label="结束时间" align="center"></el-table-column>
      <el-table-column label="预约时间段" align="center" width="170">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.type === 1" type="warning">上午</el-tag>
          <el-tag v-else-if="scope.row.type === 2" type="success">下午</el-tag>
          <el-tag v-else-if="scope.row.type === 3" type="info">晚上</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="primary" @click="xiugai(scope.row)">修改</el-button>
          <el-button type="danger" @click="shanchu(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--新增dialog-->
    <el-dialog title="新增" :visible="dialog" @close="closeDialog">
      <el-form :inline="true" :model="newform" label-position="right" label-width="120px" :rules="rules" ref="ruleForm">
        <el-form-item label="开始时间" prop="kssj">
          <el-time-picker
            format="HH:mm"
            value-format="HH:mm"
            v-model="newform.kssj"
            placeholder="任意时间点"
            clearable
            :picker-options="{selectableRange:`00:00:00-${newform.jssj ? newform.jssj+':00' : '23:59:59'}`}">
          </el-time-picker>
        </el-form-item>
        <el-form-item label="结束时间" prop="jssj">
          <el-time-picker
            format="HH:mm"
            value-format="HH:mm"
            v-model="newform.jssj"
            placeholder="任意时间点"
            clearable
            :picker-options="{selectableRange:`${newform.kssj ? newform.kssj+':00' : '00:00:00'}-23:59:59`}">
          </el-time-picker>
        </el-form-item>
        <el-form-item label="预约时间段" prop="type">
          <el-select v-model="newform.type">
            <el-option v-for="item in shabi" :key="item.index" :label="item.name" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="add">确定添加</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!--修改dialog-->
    <el-dialog title="修改" :visible="updatedialog" @close="closeDialog">
      <el-form :inline="true" :model="newform" label-position="right" label-width="120px" :rules="rules" ref="ruleForm">
        <el-form-item label="开始时间" prop="kssj">
          <el-time-picker
            format="HH:mm"
            value-format="HH:mm"
            v-model="newform.kssj"
            placeholder="任意时间点"
            :picker-options="{selectableRange:`00:00:00-${newform.jssj ? newform.jssj+':00' : '23:59:59'}`}">
          </el-time-picker>
        </el-form-item>
        <el-form-item label="结束时间" prop="jssj">
          <el-time-picker
            format="HH:mm"
            value-format="HH:mm"
            v-model="newform.jssj"
            placeholder="任意时间点"
            :picker-options="{selectableRange:`${newform.kssj ? newform.kssj+':00' : '00:00:00'}-23:59:59`}">
          </el-time-picker>
        </el-form-item>
        <el-form-item label="预约时间段" prop="type">
          <el-select v-model="newform.type">
            <el-option v-for="item in shabi" :key="item.index" :label="item.name" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="update">确定修改</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!--日历-->
    <el-dialog title="❌表示当天节假日或周末日（法定节假日系统已默认添加，不需要手动配置）" :visible="sbdialog" @close="closeDialog" top="20px">
      <el-calendar v-model="value">
        <template slot="dateCell" slot-scope="{date, data}">
          <div style="width: 100%;height: 100%" @click="datePush(data)">
            <p>
              {{ data.day.split('-').slice(1).join('-') }} {{ occupyDate.includes(data.day) ? '❌' : ''}}<br/>
              <span style="color: red">{{dealMyDate(data.day)}}</span>
            </p>
          </div>
        </template>
      </el-calendar>
      <div style="padding-left: 20px">
        <el-form :inline="true">
          <div>
            <!--<el-form-item label="每日定时预约次数限制（0代表无次数限制）：">-->
            <!--<el-input v-model="xianzhi"></el-input>-->
            <!--</el-form-item>-->
            <!--<el-form-item label="允许定时预约：">-->
            <!--<el-radio v-model="radio" label="0">否</el-radio>-->
            <!--<el-radio v-model="radio" label="1">是</el-radio>-->
            <!--</el-form-item>-->
            <!--<br>-->
          </div>
          <el-form-item>
            <el-button @click="reset" type="danger">重置所有</el-button>
          </el-form-item>
          <el-form-item>
            <el-button @click="tianjai" type="success">确定设置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import request from "@/utils/request";

  export default {
    name: "index",
    data() {
      return {
        //存放数据数组
        list: [],
        //新增的dialog
        dialog: false,
        //修改的dialog
        updatedialog: false,
        //设置节假日的dialog
        sbdialog: false,
        //传递时间
        value1: '',
        //开始时间和结束时间
        newform: {
          kssj: "",
          jssj: "",
          type: "",
          id: ""
        },
        //显示节假日的字样，没用到
        resDate: [],
        //显示节假日的
        occupyDate: [],
        radio: '0',
        xianzhi: '0',
        id: '',
        value: new Date(),
        //验证规则
        rules: {
          kssj: [{required: true, message: '开始时间不能为空', trigger: 'blur'}],
          jssj: [{required: true, message: '结束时间不能为空', trigger: 'blur'}],
          type: [{required: true, message: '预约时间段不能为空', trigger: 'blur'}],
        },
        //判断时间段
        shabi: [
          {index: 1, name: '上午', value: 1},
          {index: 2, name: '下午', value: 2},
          {index: 3, name: '晚上', value: 3},
        ]
      }
    },
    methods: {
      //发送ajax获取数据
      getinfo() {
        let that = this
        request({
          url: '/prison/alternatives',
          method: 'get',
        })
          .then(function (response) {
            if (response.data.code === 20000) {
              that.list = response.data.data
            }
          })
          .catch(function (error) {
            console.log(error, '报错信息')
          })
      },
      //点击打开新增dialog
      xinzeng() {
        let that = this
        that.dialog = true
      },
      //新增数据
      add() {
        this.$refs.ruleForm.validate()
          .then(() => {
            let that = this
            request({
              url: '/prison/alternative/add',
              method: 'post',
              data: {
                kssj: that.newform.kssj,
                jssj: that.newform.jssj,
                type: that.newform.type
              }
            })
              .then(function (response) {
                if (response.data.code === 20000) {
                  that.$message({message: '新增成功', type: 'success'})
                  that.getinfo()
                  that.dialog = false
                  that.newform.kssj = ''
                  that.newform.jssj = ''
                  that.newform.type = ''
                }
              })
              .catch(function (error) {
                console.log(error, '报错信息')
              })
          })
          .catch(() => {
          })
      },
      //点击打开修改dialog
      xiugai(row) {
        let that = this
        that.updatedialog = true
        that.newform.kssj = row.kssj
        that.newform.jssj = row.jssj
        that.newform.type = row.type
        that.newform.id = row.id
      },
      //修改数据
      update() {
        this.$refs.ruleForm.validate()
          .then(() => {
            let that = this
            request({
              url: '/prison/alternative/edit',
              method: 'post',
              data: {
                kssj: that.newform.kssj,
                jssj: that.newform.jssj,
                type: that.newform.type,
                id: that.newform.id
              }
            })
              .then(function (response) {
                if (response.data.code === 20000) {
                  that.$message({message: '修改成功', type: 'success'})
                  that.getinfo()
                  that.updatedialog = false
                  that.newform.kssj = ''
                  that.newform.jssj = ''
                  that.newform.type = ''
                  that.newform.id = ''
                }
              })
              .catch(function (error) {
                console.log(error, '报错信息')
              })
          })
          .catch(() => {
          })
      },
      //删除
      shanchu(id) {
        this.$confirm("确定要删除此条记录？", "提示", {
          showClose: false,
          type: "warning"
        })
          .then(() => {
            let that = this
            request({
              url: '/prison/alternative/remove',
              method: 'delete',
              params: {
                id: id
              }
            })
              .then(function (response) {
                if (response.data.code === 20000) {
                  that.$message({message: '删除成功', type: 'success'})
                  that.getinfo()
                }
              })
              .catch(function (error) {
                console.log(error, '报错信息')
              })
          })

      },
      //点击关闭所有dialog提示框
      closeDialog() {
        let that = this
        that.dialog = false
        that.updatedialog = false
        that.sbdialog = false
        that.occupyDate = []
        that.newform.kssj = ''
        that.newform.jssj = ''
        that.newform.type = ''
        that.newform.id = ''
      },
      //打开节假日dialog
      sb() {
        let that = this
        that.sbdialog = true
        that.chaxun()
        that.$nextTick(() => {
          that.qian()
          that.xia()
          that.jin()
        })
      },
      //显示节假日字样
      dealMyDate(v) {
        let len = this.resDate.length
        let res = ""
        for (let i = 0; i < len; i++) {
          if (this.resDate[i].date == v) {
            res = this.resDate[i].content
            break
          }
        }
        return res
      },
      //把选择的push到一个数组中
      datePush(date) {
        let day = date.day
        if (this.occupyDate.indexOf(day) == '-1') {
          this.occupyDate.push(day)
        } else {
          let arr1 = this.occupyDate.indexOf(day)
          this.occupyDate.splice(arr1, 1)
        }
      },
      //重置已选择
      reset() {
        let that = this
        that.occupyDate = []
      },
      //点击上个月按钮，不用了不删以后有用
      qian() {
        let prevBtn = document.querySelector(".el-calendar__button-group>.el-button-group>button:nth-child(1)");
        prevBtn.addEventListener("click", () => {
        })
        // console.log(this.value.getFullYear() + '-' + ((this.value.getMonth() + 1).toString().padStart(2, '0')));
      },
      //点击下个月按钮
      xia() {
        let nextBtn = document.querySelector(".el-calendar__button-group>.el-button-group>button:nth-child(3)");
        nextBtn.addEventListener("click", () => {
        });
      },
      //点击本月按钮本月
      jin() {
        let todayBtn = document.querySelector(".el-calendar__button-group>.el-button-group>button:nth-child(2)");
        todayBtn.addEventListener("click", () => {
        });
      },
      //谷家提查询节假日接口
      chaxun() {
        let that = this
        request({
          url: '/prison/info',
          method: 'get',
        })
          .then(function (response) {
            if (response.data.code === 20000) {
              that.occupyDate = response.data.holiday
              that.id = response.data.id
            }
          })
          .catch(function (error) {
            console.log(error, '报错信息')
          })
      },
      //谷家提添加节假日接口
      tianjai() {
        let that = this
        request({
          url: '/prison/config',
          method: 'post',
          data: {
            holiday: that.occupyDate.toString(),
            limit: that.xianzhi,
            noregular: that.radio,
            id: that.id
          }
        })
          .then(function (response) {
            if (response.data.code === 20000) {
              that.$message({message: '修改成功', type: 'success'})
              that.sbdialog = false
              that.occupyDate = []
            }
          })
          .catch(function (error) {
            console.log(error, '报错信息')
          })
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

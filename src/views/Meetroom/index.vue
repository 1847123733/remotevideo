<template>
  <div class="page-wrapper">
    <!--改变查询条件的表单-->
    <el-form :inline="true" class="demo-form-inline form">
      <el-form-item class="form-item-select" label="房间名称">
        <el-input v-model="searchForm.room" clearable></el-input>
      </el-form-item>
      <el-form-item class="form-item-btn one">
        <el-button type="primary" class="btn-query" icon="el-icon-search" @click="querySubmit">查询</el-button>
        <el-button type="primary" class="btn-query" icon="el-icon-circle-plus-outline" @click="beginAdd">新增</el-button>
      </el-form-item>
    </el-form>
    <!-- 内容表格 -->
    <el-table :data="list" border :header-cell-style="{background:'#a0cfff',color:'#409EFF'}">
      <el-table-column type="index" label="序号" align="center" width="100"></el-table-column>
      <el-table-column prop="room" label="房间名称" align="center" width="300"></el-table-column>
      <el-table-column prop="prison" label="所属监所名称" align="center" width="300"></el-table-column>
      <el-table-column prop="bz" label="说明" align="center"></el-table-column>
      <el-table-column prop="zdbh" label="终端编号" align="center" width="100"></el-table-column>
      <el-table-column label="状态" align="center" width="180">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.state === 1" type="success">正常</el-tag>
          <el-tag v-else-if="scope.row.state === 2" type="info">停用</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="300">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="beginUpdate(scope.row)">编辑</el-button>
          <el-button :disabled="scope.row.zdbh != ''&&scope.row.zdbh != null" size="mini" type="primary"
                     @click="bind(scope.row)">绑定
          </el-button>
          <el-button :disabled="scope.row.zdbh == ''&&scope.row.zdbh == null" size="mini" type="danger"
                     @click="unBind(scope.row)">解绑
          </el-button>
          <!--<el-button size="mini"  type="primary"  @click="video(scope.row)"  style="margin: 0"  >查看视频-->
          <!--</el-button>-->
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
      :title="`会见室 - ${ editDialog.mode ? '新增' : '修改' }`"
      width="600px">
      <!--用mode判断新增或修改，true表示新增，false表示修改-->
      <!--编辑对话框表单-->
      <el-form
        :model="editDialog.model"
        :rules="editDialog.rules"
        label-width="120px"
        ref="form">
        <el-form-item label="房间名称" prop="room">
          <el-input v-model="editDialog.model.room" placeholder="请输入房间名称"></el-input>
        </el-form-item>
        <el-form-item label="所属监所名称" prop="prison">
          <el-select @change="handleChange" v-model="editDialog.model.prison" placeholder="请选择监所名称">
            <el-option
              v-for="(item, i) in prisonList"
              :key="i"
              :label="item.name"
              :value="item.name"
            ></el-option>
          </el-select>
          <!-- <el-input v-model="editDialog.model.prison" placeholder="请输入摄像机用户名"></el-input> -->
        </el-form-item>
        <el-form-item label="所属监所id" prop="prisonid">
          <el-select disabled v-model="editDialog.model.prisonid" placeholder="请选择监所id">
            <el-option v-for="(item, i) in prisonList" :key="i" :label="item.id" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="说明" prop="bz">
          <el-input v-model="editDialog.model.bz" placeholder="请输入说明"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="state">
          <template>
            <el-radio v-model="editDialog.model.state" :value="1" label="1">正常</el-radio>
            <el-radio v-model="editDialog.model.state" :value="2" label="2">停用</el-radio>
          </template>
        </el-form-item>
      </el-form>
      <!--编辑对话框底部按钮-->
      <div slot="footer">
        <el-button type="primary" @click="save">保存</el-button>
        <el-button @click="editDialog.isShow = false">取消</el-button>
      </div>
    </el-dialog>
    <!-- 分页控件 -->
    <el-pagination
      @size-change="sizeChangeHandler"
      @current-change="currentChangeHandler"
      :current-page="pagination.pageNo"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="pagination.length"
      layout="total, sizes, prev, pager, next, jumper"
      :total="pagination.total"
      v-if="pagination.total"
    ></el-pagination>
    <!--绑定的dialog-->
    <el-dialog title="绑定" :visible="binddialog" @close="closeDialog">
      <el-form :inline="true" :model="bindform" label-position="right" label-width="180px" :rules="editDialog.rules"
               ref="ruleForm">
        <el-form-item label="会见室" prop="roomId">
          <el-input v-model="roomname" disabled></el-input>
        </el-form-item>
        <el-form-item label="提审终端" prop="arraignmentId">
          <el-select v-model="bindform.arraignmentId">
            <el-option
              v-for="item in bindList"
              :key="item.id"
              :label="item.zdbh"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="margin-left: 80%">
          <el-button @click="bindsave">确认绑定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
  import request from "@/utils/request";

  export default {
    name: "meetroom",
    data() {
      return {
        //下拉框
        prisonList: [],
        nameList: [],
        idList: [],
        // 表格数组
        list: [],
        // 点击查询按钮改变
        querySubmitForm: {
          room: ""
        },
        // 选择改变model
        searchForm: {
          room: ""
        },
        //video编号
        videobh: '',
        //dialog
        editDialog: {
          isShow: false,
          mode: true,
          id: 0,
          roombh: "",
          model: {
            room: "",
            prisonid: "",
            prison: "",
            bz: "",
            state: "1",
            zdbh: ''
          },
          // 表单验证
          rules: {
            room: [{required: true, message: "房间名称不能为空", trigger: "blur"}],
            prisonid: [{required: true, message: "所属监所id不能为空", trigger: "blur"}],
            prison: [{required: true, message: "所属监所名称不能为空", trigger: "blur"}],
            arraignmentId: [{required: true, message: "提审终端不能为空", trigger: "blur"}]
          }
        },
        //分页控件
        pagination: {
          total: 0, //总条数
          pageNo: 1, // 页数
          length: 10 // 每页的条数
        },
        //解绑绑定下拉框
        bindList: [],
        //绑定dialog
        binddialog: false,
        //绑定信息
        bindform: {
          roomId: '',
          arraignmentId: ''
        },
        //房间名
        roomname: ''
      };
    },
    methods: {
      //获取数据
      getData(pageNo = 1) {
        let that = this;
        request({
          url: "/room/page",
          method: "get",
          params: {
            ...that.querySubmitForm,
            rows: that.pagination.length,
            page: that.pagination.pageNo,
          }
        })
          .then(function (response) {
            if (response.data.code === 20000) {
              that.list = response.data.data;
              that.pagination.total = response.data.total;
            }
          })
          .catch(function (error) {
            console.log(error, "报错信息");
          });
      },
      //获取数据
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
      //监所名称下拉框联动id
      handleChange(val) {
        let that = this
        let obj = {}
        obj = that.prisonList.find((item) => {
          return item.name === val
        })
        that.editDialog.model.prisonid = obj.id
      },
      //查询
      querySubmit() {
        this.querySubmitForm = Object.assign({}, this.searchForm);
        this.getData((this.pagination.pageNo = 1));
      },
      //添加
      beginAdd() {
        this.editDialog.mode = true;
        this.editDialog.isShow = true;
        this.getDataList();
      },
      //编辑
      beginUpdate(row) {
        this.editDialog.roombh = row.roombh;
        this.editDialog.model.room = row.room;
        this.editDialog.model.prisonid = row.prisonid;
        this.editDialog.model.prison = row.prison;
        this.editDialog.model.bz = row.bz;
        this.editDialog.model.state = row.state + "";
        this.editDialog.model.zdbh = row.zdbh
        this.editDialog.mode = false;
        this.editDialog.isShow = true;
        this.getDataList();
      },
      //保存
      save() {
        this.$refs.form
          .validate()
          .then(() => {
            if (this.editDialog.mode) {
              // 新增
              let that = this;
              request({
                url: "/room/save",
                method: "post",
                data: {
                  ...that.editDialog.model
                }
              })
                .then(function (response) {
                  if (response.data.code === 20000) {
                    that.editDialog.isShow = false;
                    that.$message({
                      type: "success",
                      message: "新增成功"
                    });
                    that.getData();
                  }
                })
                .catch(function (error) {
                  console.log(error, "报错信息");
                });
            } else {
              // 修改
              let that = this;
              request({
                url: "/room/update",
                method: "post",
                data: {
                  roombh: that.editDialog.roombh,
                  ...that.editDialog.model
                }
              })
                .then(function (response) {
                  if (response.data.code === 20000) {
                    that.editDialog.isShow = false;
                    that.$message({
                      type: "success",
                      message: "修改成功"
                    });
                    that.getData();
                  }
                })
                .catch(function (error) {
                  console.log(error, "报错信息");
                });
            }
          })
          .catch(() => {
          });
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
      //绑定
      bind(row) {
        let that = this
        that.findBind(row)
        that.binddialog = true
        that.bindform.roomId = row.roombh
        that.roomname = row.room
      },
      //保存绑定
      bindsave() {
        let that = this
        request({
          url: '/room/bind',
          method: 'post',
          params: {
            roomId: that.bindform.roomId,
            arraignmentId: that.bindform.arraignmentId,
          }
        })
          .then(function (response) {
            if (response.data.code === 20000) {
              that.binddialog = false
              that.$message({
                message: '绑定成功',
                type: 'success'
              })
              that.getData();
              that.bindform.roomId = ''
              that.bindform.arraignmentId = ''
              that.roomname = ''
            }
          })
          .catch(function (error) {
            console.log(error, '报错信息')
          })
      },
      //解绑
      unBind(row) {
        let that = this
        request({
          url: '/room/unBind',
          method: 'post',
          params: {
            roomId: row.roombh,
          }
        })
          .then(function (response) {
            if (response.data.code === 20000) {
              that.$message({
                message: '解绑成功',
                type: 'success'
              })
              that.getData();
            }
          })
          .catch(function (error) {
            console.log(error, '报错信息')
          })
      },
      //查询绑定解绑
      findBind(row) {
        let that = this
        request({
          url: '/room/arraignment/free',
          method: 'post',
          params: {
            roomId: row.roombh,
          }
        })
          .then(function (response) {
            if (response.data.code === 20000) {
              that.bindList = response.data.data
            }
          })
          .catch(function (error) {
            console.log(error, '报错信息')
          })
      },
      //查看监控
      video(row) {
        if (row.zt != 1) {
          this.$message.error('未审核通过，无法查看监控')
        } else {
          if (row.bj === 1) {
            this.$router.push(`/video/${row.id}`);
          } else {
            this.$message.error('未在会见，无监控')
          }
        }
      },
      //关闭所有dialog
      closeDialog() {
        let that = this
        that.binddialog = false
        that.bindform.roomId = ''
        that.bindform.arraignmentId = ''
        that.roomname = ''
      },
    },
    watch: {
      "editDialog.isShow"(newValue) {
        if (!newValue) {
          // 关闭dialog时清空表单
          this.$refs.form.resetFields();
          this.editDialog.model.room = "";
          this.editDialog.model.prisonid = "";
          this.editDialog.model.prison = "";
          this.editDialog.model.bz = "";
          this.editDialog.model.state = "1";
        }
      }
    },
    created() {
      this.getData();
    }
  };
</script>

<style scoped>
  .demo-form-inline {
    white-space: nowrap;
    width: 100%;
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

  .form-item-btn {
    width: calc((96% - 285px) / 2);
  }

  .form-item-btn.one {
    text-align: left;
  }

  .form-item-btn.two {
    text-align: right;
  }

  .form {
    margin-top: 1%;
    padding-left: 2%;
    box-sizing: border-box;
  }
</style>

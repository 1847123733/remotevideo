<template>
  <div class="page-wrapper">
    <!--form查询-->
    <el-form :inline="true" class="demo-form-inline form">
      <el-form-item class="form-item-select" label="用户名">
        <el-input clearable v-model="searchForm.yhm"></el-input>
      </el-form-item>
      <el-form-item class="form-item-btn one">
        <el-button class="btn-query" type="primary" icon="el-icon-search" @click="querySubmit">查询</el-button>
      </el-form-item>
      <el-form-item class="form-item-btn two">
        <el-button class="btn-add" type="primary" icon="el-icon-circle-plus-outline" @click="beginAdd">新增</el-button>
      </el-form-item>
    </el-form>
    <!--内容表格-->
    <el-table :data="list" border :header-cell-style="{background:'#a0cfff',color:'#409EFF'}">
      <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
      <el-table-column prop="yhm" label="用户名" min-width="80" align="center"></el-table-column>
      <el-table-column prop="xm" label="姓名" align="center"></el-table-column>
      <el-table-column prop="zjhm" label="证件号码" min-width="120" align="center"></el-table-column>
      <el-table-column prop="lxdh" label="联系电话" align="center"></el-table-column>
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.sfqy === '1'" type="success">启用</el-tag>
          <el-tag v-else-if=" scope.row.sfqy === '2'" type="info">停用</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="prison" label="监所名称" min-width="150" align="center"></el-table-column>
      <el-table-column label="角色" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.role === 1">管理员</span>
          <span v-else-if="scope.row.role === 2">律师审核</span>
          <span v-else-if="scope.row.role === 3">监所人员</span>
        </template>
      </el-table-column>
      <el-table-column prop="inserttime" label="插入时间" min-width="120" align="center"></el-table-column>
      <el-table-column prop="updatetime" label="更新时间" min-width="120" align="center"></el-table-column>
      <el-table-column label="操作" align="center" width="200">
        <template slot-scope="scope">
          <el-button :disabled="scope.row.role == 1" size="mini" type="primary" @click="beginUpdate(scope.row)">编辑
          </el-button>
          <el-button :disabled="scope.row.role == 1" size="mini" type="danger" @click="beginRemove(scope.row.id)">删除
          </el-button>
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
      :title="`用户 - ${ editDialog.mode ? '新增' : '修改' }`"
      width="600px">
      <!--用mode判断新增或修改，true表示新增，false表示修改-->
      <!--编辑对话框表单-->
      <el-form :model="editDialog.model" :rules="editDialog.rules" label-width="100px" ref="form">
        <el-form-item label="用户名：" prop="yhm">
          <el-input v-model="editDialog.model.yhm" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="姓名：" prop="xm">
          <el-input v-model="editDialog.model.xm" placeholder="请输入用户姓名"></el-input>
        </el-form-item>
        <el-form-item label="证件号码：" prop="zjhm">
          <el-input v-model="editDialog.model.zjhm" placeholder="请输入证件号码"></el-input>
        </el-form-item>
        <el-form-item label="联系电话：" prop="lxdh">
          <el-input v-model="editDialog.model.lxdh" placeholder="请输入联系电话"></el-input>
        </el-form-item>
        <el-form-item label="是否启用：" prop="sfqy">
          <template>
            <el-radio v-model="editDialog.model.sfqy" value="1" label="1">启用</el-radio>
            <el-radio v-model="editDialog.model.sfqy" value="2" label="2">停用</el-radio>
          </template>
        </el-form-item>
        <el-form-item label="所属监所名称" prop="prison">
          <el-select @change="handleChange" v-model="editDialog.model.prison" placeholder="请选择监所名称">
            <el-option v-for="(item, i) in prisonList" :key="i" :label="item.name" :value="item.name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属监所id" prop="prisonid">
          <el-select disabled v-model="editDialog.model.prisonid" placeholder="请选择监所id">
            <el-option v-for="(item, i) in prisonList" :key="i" :label="item.id" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="角色：" prop="role">
          <template>
            <el-radio v-model="editDialog.model.role" :value="2" label="2">律师审核</el-radio>
            <el-radio v-model="editDialog.model.role" :value="3" label="3">监所人员</el-radio>
          </template>
        </el-form-item>
      </el-form>
      <!--编辑对话框底部按钮-->
      <div slot="footer">
        <el-button type="primary" @click="save">保存</el-button>
        <el-button @click="editDialog.isShow = false">取消</el-button>
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

  export default {
    name: "users",
    data() {
      return {
        //下拉框
        prisonList: [],
        //table数据
        list: [],
        //form数据
        searchForm: {
          yhm: ""
        },
        querySubmitForm: {
          yhm: ""
        },
        //分页控件
        pagination: {
          total: 0, //总条数
          pageNo: 1, // 页数
          length: 8 // 每页的条数
        },
        //dialog
        editDialog: {
          isShow: false,
          mode: true,
          id: 0,
          model: {
            yhm: "",
            xm: "",
            zjhm: "",
            lxdh: "",
            sfqy: "1",
            prison: "",
            prisonid: "",
            role: ""
          },
          rules: {
            //表单验证
            yhm: [{required: true, message: "账号不能为空", trigger: "blur"}],
            xm: [{required: true, message: "姓名不能为空", trigger: "blur"}],
            zjhm: [{
              validator: (rule, value, callback) => {
                if (value === "")
                  callback(new Error("身份证号不能为空"));
                else if (
                  !/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(
                    value
                  )
                )
                  callback(new Error("请输入正确的身份证号"));
                else callback();
              },
              trigger: "change"
            }],
            lxdh: [
              {
                validator: (rule, value, callback) => {
                  if (value === "")
                    callback(new Error("联系电话不能为空"));
                  else if (!/^1[3456789]\d{9}$/.test(value))
                    callback(new Error("请输入正确的手机号码"));
                  else callback();
                },
                trigger: "change"
              }
            ]
          }
        }
      };
    },
    methods: {
      //获取数据
      getData(pageNo = 1) {
        let that = this;
        request({
          url: "/user/page",
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
            }
          })
          .catch(function (error) {
            console.log(error, "报错信息");
          });
      },
      //获取下拉列表
      getDataList() {
        let that = this;
        request({
          url: "/prison/all",
          method: "get",
          params: {
            date: Date.parse(new Date())
          }
        })
          .then(function (response) {
            if (response.data.code === 20000) {
              console.log(response.data.data);
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
      //新增
      beginAdd() {
        this.getDataList();
        this.editDialog.mode = true;
        this.editDialog.isShow = true;
      },
      //修改
      beginUpdate(row) {
        this.getDataList();
        this.editDialog.id = row.id;
        this.editDialog.model.yhm = row.yhm;
        this.editDialog.model.xm = row.xm;
        this.editDialog.model.zjhm = row.zjhm;
        this.editDialog.model.lxdh = row.lxdh;
        this.editDialog.model.sfqy = row.sfqy + "";
        this.editDialog.model.prison = row.prison;
        this.editDialog.model.prisonid = row.prisonid;
        this.editDialog.model.role = row.role + "";
        this.editDialog.mode = false;
        this.editDialog.isShow = true;
      },
      //保存
      save() {
        this.$refs.form
          .validate()
          .then(() => {
            if (this.editDialog.mode) {
              //新增
              let that = this;
              request({
                url: "/user/save",
                method: "post",
                data: {
                  ...that.editDialog.model,
                  date: Date.parse(new Date())
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
              //修改
              let that = this;
              request({
                url: "/user/update",
                method: "post",
                data: {
                  id: that.editDialog.id,
                  ...that.editDialog.model,
                  date: Date.parse(new Date())
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
      //删除
      beginRemove(id) {
        this.$confirm("确定要删除此条记录？", "提示", {
          showClose: false,
          type: "warning"
        })
          .then(() => {
            let that = this;
            request({
              url: "/user/delete",
              method: "post",
              params: {
                id: id,
                date: Date.parse(new Date())
              }
            })
              .then(function (response) {
                if (response.data.code === 20000) {
                  that.$message({
                    type: "success",
                    message: "删除成功"
                  });
                  that.getData();
                }
              })
              .catch(function (error) {
                console.log(error, "报错信息");
              });
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
    },
    watch: {
      "editDialog.isShow"(newValue) {
        if (!newValue) {
          // 关闭dialog时清空表单
          this.$refs.form.resetFields();
          this.editDialog.id = 0;
          this.editDialog.model.yhm = '';
          this.editDialog.model.xm = '';
          this.editDialog.model.zjhm = '';
          this.editDialog.model.lxdh = '';
          this.editDialog.model.sfqy = '1';
          this.editDialog.model.prison = '';
          this.editDialog.model.prisonid = '';
          this.editDialog.model.role = '';
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
    height: 50px;
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

  .form {
    margin-top: 1%;
    padding-left: 2%;
    box-sizing: border-box;
  }
</style>

<template>
  <div class="page-wrapper">
    <!--查询form-->
    <el-form :inline="true" class="demo-form-inline form">
      <el-form-item class="form-item-select" label="姓名">
        <el-input v-model="searchForm.xm" clearable style="width: 100px"></el-input>
      </el-form-item>
      <el-form-item class="form-item-select" label="执业证号">
        <el-input v-model="searchForm.zyzh" clearable style="width: 130px"></el-input>
      </el-form-item>
      <el-form-item class="form-item-select" label="身份证号">
        <el-input v-model="searchForm.sfzmhm" clearable style="width: 150px"></el-input>
      </el-form-item>
      <el-form-item label="初审日期">
        <el-date-picker
          style="width: 140px"
          v-model="searchForm.cssj"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="审核状态">
        <el-select v-model="searchForm.cszt" clearable style="width: 100px">
          <el-option label="通过" value="1"></el-option>
          <el-option label="不通过" value="2"></el-option>
          <el-option label="未审核" value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item class="form-item-btn one">
        <el-button icon="el-icon-search" class="btn-query" type="primary" @click="querySubmit">查询</el-button>
        <!--<el-button type="primary" @click="shuaxin">强制刷新</el-button>-->
      </el-form-item>
    </el-form>
    <!-- 内容表格 -->
    <el-table :data="list" border style="width: 100%" :header-cell-style="{background:'#a0cfff',color:'#409EFF'}">
      <el-table-column type="index" label="序号" align="center" width="50"></el-table-column>
      <el-table-column prop="sfzmhm" label="身份证号" align="center" width="100"></el-table-column>
      <el-table-column prop="xm" label="姓名" align="center" width="80"></el-table-column>
      <el-table-column prop="lxdh" label="联系电话" align="center" width="100"></el-table-column>
      <el-table-column prop="zyzh" label="执业证号" align="center" width="100"></el-table-column>
      <el-table-column prop="zyjg" label="执业机构" align="center"></el-table-column>
      <el-table-column prop="cssj" label="初审日期" align="center" width="150"></el-table-column>
      <el-table-column prop="yxqx" label="有效期限" align="center" width="100"></el-table-column>
      <el-table-column label="执业证书" align="center" width="120">
        <template slot-scope="scope">
          <viewer>
            <img :src="imgUrl+ '/'+scope.row.zyz + '?' + Math.random()" style="width:100px">
          </viewer>
        </template>
      </el-table-column>
      <el-table-column label="初审状态" align="center" width="70">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.cszt === 0" type="warning">申请</el-tag>
          <el-tag v-else-if="scope.row.cszt === 1" type="success">通过</el-tag>
          <el-tag v-else-if="scope.row.cszt === 2" type="danger">不通过</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="复审状态" align="center" width="100">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.zt === 0" type="warning">审核中</el-tag>
          <el-tag v-else-if="scope.row.zt === 1" type="success">通过</el-tag>
          <el-tag v-else-if="scope.row.zt === 2" type="danger">不通过</el-tag>
          <el-tag v-else-if="scope.row.zt === 3" type="info">已失效</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="zcsj" label="注册时间" align="center" width="85"></el-table-column>
      <el-table-column prop="bz" label="不通过说明" align="center"></el-table-column>
      <el-table-column prop="memo" label="备注" align="center"></el-table-column>
      <el-table-column prop="position" label="律师身份" align="center" width="120">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.position === '0'" type="success">正式律师</el-tag>
          <el-tag v-if="scope.row.position === '1'" type="info">实习律师</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="290">
        <template slot-scope="scope">
          <el-button :disabled="scope.row.cszt !== 0" type="primary" @click="beginUpdate(scope.row)">审核</el-button>
          <el-button :disabled="!(scope.row.cszt === 1 && scope.row.zt === 1&&scope.row.ztbj==='0')"
                     @click="stop(scope.row)">暂停
          </el-button>
          <el-button :disabled="!(scope.row.ztbj==='1')" @click="huifu(scope.row)">恢复</el-button>
          <el-button type="danger" @click="deletedata(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--编辑dialog-->
    <el-dialog
      class="dialog-edit"
      :show-close="false"
      :close-on-click-model="false"
      :close-on-press-escape="false"
      :visible="editDialog.isShow"
      title="审核"
      width="600px">
      <!--用mode判断新增或修改，true表示新增，false表示修改-->
      <!--编辑对话框表单-->
      <el-form :model="editDialog.model" :rules="editDialog.rules" label-width="120px" ref="form">
        <div class="look">
          <div><span>ID：</span><span>{{ editDialog.model.id }}</span></div>
          <div><span> 姓名：</span><span> {{ editDialog.model.xm }}</span></div>
          <div><span>执业证号：</span><span>{{ editDialog.zyzh }}</span></div>
          <div><span>执业机构：</span><span>{{ editDialog.zyjg }}</span></div>
          <div class="text">
            <span>{{positon==='0'?'执业证书：':'实习律师证书：'}}</span>
            <template>
              <el-popover placement="right" trigger="hover">
                <img :src="imgUrl+ '/'+editDialog.zyz+ '?' + Math.random()" style="width:100px"/>
                <img slot="reference" :src="imgUrl+ '/'+editDialog.zyz+ '?' + Math.random()" style="max-height: 50px"/>
              </el-popover>
            </template>
          </div>
          <div class="text radio">
            <span>状态：</span>
            <template>
              <el-radio v-model="editDialog.model.cszt" :value="1" label="1">审核通过</el-radio>
              <el-radio v-model="editDialog.model.cszt" :value="2" label="2">审核未通过</el-radio>
            </template>
          </div>
          <div class="text">
            <span>不通过原因：</span>
            <el-input v-model="editDialog.model.bz" name id cols="30" rows="2" style="width: 250px"
                      @keyup.native="btKeyUp"></el-input>
          </div>
          <div class="text">
            <span>备注：</span>
            <textarea v-model="editDialog.model.memo" name id cols="30" rows="5"></textarea>
          </div>
        </div>
      </el-form>
      <!--编辑对话框底部按钮-->
      <div slot="footer">
        <el-button type="primary" @click="save">保存</el-button>
        <el-button @click="editDialog.isShow = false">取消</el-button>
      </div>
    </el-dialog>
    <!--有效期选择-->
    <el-dialog title="选择有效期" width="400px" :visible="dialog" @close="closeDialog">
      <el-form :inline="true" :model="form" :rules="rules" ref="ruleForm">
        <el-form-item label="有效日期" prop="yxqx">
          <el-date-picker
            style="width: 140px"
            v-model="form.yxqx"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item style="margin-left: 80%">
          <el-button @click="recover">确认恢复</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!--分页控件-->
    <el-pagination
      @size-change="sizeChangeHandler"
      @current-change="currentChangeHandler"
      :current-page="pagination.pageNo"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="pagination.length"
      layout="total, sizes, prev, pager, next, jumper"
      :total="pagination.total">
    </el-pagination>
  </div>
</template>

<script type="text/ecmascript-6">
  import request from "@/utils/request";
  import picSrc from "@/utils/globalConfig";

  export default {
    name: "index",
    data() {
      return {
        //图片地址
        imgUrl: picSrc,
        //表格数组
        list: [],
        //点击查询按钮改变
        querySubmitForm: {
          name: ""
        },
        //查询
        searchForm: {
          xm: "",
          cszt: "",
          zyzh: "",
          sfzmhm: "",
          cssj: ""
        },
        //dialog框
        editDialog: {
          isShow: false,
          zyzh: "",
          zyjg: "",
          zyz: "",
          model: {
            id: "",
            xm: "",
            cszt: "",
            bz: "",
            memo: "",
          },
          // 表单验证
          rules: {}
        },
        //判断执业证书的标志
        positon: '',
        //分页控件
        pagination: {
          total: 0, //总条数
          pageNo: 1, // 页数
          length: 10 // 每页的条数
        },
        //dialog状态
        dialog: false,
        //提交form
        form: {
          yxqx: '',
        },
        //id
        id: '',
        //验证规则
        rules: {
          yxqx: [{required: true, message: "有效期限不能为空", trigger: "blur"}],
        }
      };
    },
    methods: {
      //获取数据
      getData(pageNo = 1) {
        let that = this;
        request({
          url: "/lawyer/page",
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
      //查询
      querySubmit() {
        this.querySubmitForm = Object.assign({}, this.searchForm);
        this.getData((this.pagination.pageNo = 1));
      },
      //审核
      beginUpdate(row) {
        this.editDialog.zyzh = row.zyzh;
        this.editDialog.zyjg = row.zyjg;
        this.editDialog.zyz = row.zyz;
        this.editDialog.model.id = row.id;
        this.editDialog.model.xm = row.xm;
        this.editDialog.model.cszt = row.cszt + '';
        this.editDialog.model.bz = row.bz;
        this.positon = row.position;
        this.editDialog.isShow = true;
      },
      //暂停
      stop(row) {
        let that = this;
        request({
          url: "/lawyer/check/pause",
          method: "post",
          params: {
            id: row.id
          }
        })
          .then(function (response) {
            if (response.data.code === 20000) {
              that.$message.success('暂停成功')
              that.getData();
            }
          })
          .catch(function (error) {
            console.log(error, "报错信息");
          });
      },
      //打开恢复日期的dialog
      huifu(row) {
        let that = this
        that.dialog = !that.dialog
        that.id = row.id
        that.form.yxqx = row.yxqx
      },
      //恢复
      recover() {
        let that = this;
        that.$refs.ruleForm
          .validate()
          .then(() => {
            request({
              url: "/lawyer/check/recovery",
              method: "post",
              params: {
                id: that.id,
                yxqx: that.form.yxqx
              }
            })
              .then(function (response) {
                if (response.data.code === 20000) {
                  that.dialog = false
                  that.id = ''
                  that.form.yxqx = ''
                  that.$message.success('恢复成功')
                  that.getData();
                }
              })
              .catch(function (error) {
                console.log(error, "报错信息");
              });
          })
      },
      //保存
      save() {
        let that = this;
        request({
          url: "/lawyer/check/cs",
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
                message: "审核成功"
              });
              that.getData();
            }
          })
          .catch(function (error) {
            console.log(error, "报错信息");
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
      //点击删除
      deletedata(row) {
        let that = this
        that.$confirm(`确认删除${row.xm}？`, '提示', {showClose: false, type: 'warning'}).then(() => {
          let that = this;
          request({
            url: "/lawyer/delete/cs",
            method: "delete",
            params: {
              id: row.id
            }
          })
            .then(function (response) {
              if (response.data.code === 20000) {
                that.$message.success('删除成功')
                that.getData();
              }
            })
            .catch(function (error) {
              console.log(error, "报错信息");
            });
        }).catch(() => {
        })
      },
      //关闭dialog
      closeDialog() {
        let that = this
        that.dialog = false
        that.id = ''
        that.form.yxqx = ''
      },
      //限制输入特殊字符
      btKeyUp(e) {
        e.target.value = e.target.value.replace(/[。.{}￥★^_^&√※【】]/g, "");
      },
      //强制刷新
      shuaxin() {
        window.location.reload(true)
      }
    },
    watch: {
      "editDialog.isShow"(newValue) {
        if (!newValue) {
          // 关闭dialog时清空表单
          this.$refs.form.resetFields();
          this.editDialog.model.id = "";
          this.editDialog.model.xm = "";
          this.editDialog.model.cszt = "";
          this.editDialog.model.bz = "";
          this.editDialog.model.memo = "";
          this.editDialog.zyzh = "";
          this.editDialog.zyjg = "";
          this.editDialog.zyz = "";
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

  .text {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
  }

  .radio {
    height: 80px;
  }

  .form {
    margin-top: 1%;
    padding-left: 2%;
    box-sizing: border-box;
  }
</style>

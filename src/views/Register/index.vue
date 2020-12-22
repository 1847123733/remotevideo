<template>
  <div class="page-wrapper">
    <!--查询form-->
    <el-form :inline="true" class="demo-form-inline form">
      <el-form-item class="form-item-select" label="姓名">
        <el-input v-model="searchForm.xm" clearable style="width: 100px"></el-input>
      </el-form-item>
      <el-form-item class="form-item-select" label="执业证号">
        <el-input v-model="searchForm.zyzh" clearable style="width: 150px"></el-input>
      </el-form-item>
      <el-form-item class="form-item-select" label="身份证号">
        <el-input v-model="searchForm.sfzmhm" clearable style="width: 150px"></el-input>
      </el-form-item>
      <el-form-item label="审核状态">
        <el-select v-model="searchForm.zt" clearable style="width: 100px">
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
      <el-table-column prop="yxqx" label="有效期限" align="center" width="100"></el-table-column>
      <el-table-column label="执业证书" align="center" width="120">
        <template slot-scope="scope">
          <viewer>
            <img :src="imgUrl+ '/'+scope.row.zyz+ '?' + Math.random()" style="width:100px">
          </viewer>
        </template>
      </el-table-column>
      <el-table-column label="复审状态" align="center" width="100">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.zt === 0" type="warning">审核中</el-tag>
          <el-tag v-else-if="scope.row.zt === 1" type="success">审核通过</el-tag>
          <el-tag v-else-if="scope.row.zt === 2" type="danger">审核未通过</el-tag>
          <el-tag v-else-if="scope.row.zt === 3" type="info">已失效</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="zcsj" label="注册时间" align="center" width="85"></el-table-column>
      <el-table-column prop="bz" label="不通过说明" align="center"></el-table-column>
      <el-table-column prop="position" label="律师身份" align="center" width="120">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.position === '0'" type="success">正式律师</el-tag>
          <el-tag v-if="scope.row.position === '1'" type="info">实习律师</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="100">
        <template slot-scope="scope">
          <el-button :disabled="scope.row.zt !== 0" type="primary" @click="beginUpdate(scope.row)">审核</el-button>
          <!--<el-button type="danger" @click="deletedata(scope.row)">删除</el-button>-->
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
              <el-radio v-model="editDialog.model.zt" :value="1" label="1">审核通过</el-radio>
              <el-radio v-model="editDialog.model.zt" :value="2" label="2">审核未通过</el-radio>
            </template>
          </div>
          <div class="text">
            <span>不通过原因：</span>
            <el-input v-model="editDialog.model.bz" name id cols="30" rows="2" style="width: 250px"
                      @keyup.native="btKeyUp"></el-input>
          </div>
        </div>
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
      :total="pagination.total">
    </el-pagination>
  </div>
</template>

<script type="text/ecmascript-6">
  import request from "@/utils/request";
  import picSrc from "@/utils/globalConfig";

  export default {
    name: "register",
    data() {
      return {
        //图片路径
        imgUrl: picSrc,
        //表格数组
        list: [],
        //点击查询按钮改变
        querySubmitForm: {
          name: ""
        },
        //选择改变model
        searchForm: {
          xm: "",
          zt: "",
          zyzh: "",
          sfzmhm: ""
        },
        //dialog
        editDialog: {
          isShow: false,
          zyzh: "",
          zyjg: "",
          zyz: "",
          model: {
            id: "",
            xm: "",
            zt: "",
            bz: ""
          },
          // 表单验证
          rules: {}
        },
        //判断实习律师和正式律师的标志
        positon: '',
        // 分页控件
        pagination: {
          total: 0, //总条数
          pageNo: 1, // 页数
          length: 10 // 每页的条数
        }
      };
    },
    methods: {
      //获取数据
      getData(pageNo = 1) {
        let that = this;
        request({
          url: "/lawyer/pageFs",
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
        this.editDialog.model.zt = row.zt + '';
        this.editDialog.model.bz = row.bz;
        this.positon = row.position;
        this.editDialog.isShow = true;
      },
      //保存
      save() {
        //修改
        console.log(1);
        let that = this;
        request({
          url: "/lawyer/check/fs",
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
        }).catch(() => {
        })
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
          this.editDialog.model.zt = "";
          this.editDialog.model.bz = "";
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

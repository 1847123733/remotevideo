<template>
  <!--最外层的包裹-->
  <div class="page-wrapper">
    <!--主体-->
    <div class="detail">
      <!--左侧排版-->
      <div class="right">
        <!--排期表格-->
        <div class="right-top">
          <div style="display: flex;justify-content: space-around;align-items: center;height: 15%">
            <!--标题-->
            <!--<div class="right-top-title">会见列表</div>-->
            <!--日期和三个按钮移动到这来了-->
            <div>
              <el-date-picker v-model="date" :clearable="false" value-format="yyyy-MM-dd" type="date" @change="change"
                              placeholder="选择日期" style="width: 150px"></el-date-picker>
              <!--下载会见信息报表-->
              <el-button type="info" @click="download" size="mini">下载报表</el-button>
              <!--查看详细会见亭按钮-->
              <el-button type="info" @click="xspbdz" size="mini">{{wenzi}}</el-button>
              <!--点击查看各会见室占用状态-->
              <el-button type="info" @click="zhanyong" size="mini">占用状态</el-button>
            </div>
            <!--标志颜色和警告信息-->
            <div class="sign">
              <!--会见中-->
              <div>
                <div class="sign1">会见中</div>
              </div>
              <!--已预约-->
              <div>
                <div class="sign2">已预约</div>
              </div>
              <!--已结束-->
              <div>
                <div class="sign6">已结束</div>
              </div>
              <!--警告-->
              <div>
                <div class="sign4">警告</div>
              </div>
              <!--警告信息滚动-->
              <div>
                <div class="sign5">
                  <div class="warning">
                    <div v-for="item in warnlist">
                      <span>{{item.lawyer}}{{item.info}}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!--会见室表格-->
          <div class="table">
            <!--日期显示-->
            <div class="table-title">
              <!--表头-->
              <div class="table-title2">
                <!--展示不同日期的信息,这里又改了-->
              </div>
            </div>
            <!--展示所有会见室-->
            <div class="room hide-scroll-bar">
              <!--循环出所有会见室-->
              <div class="rooms hide-scroll-bar" v-for="item in alls" :key="item.id">
                <div style="display: flex;">
                  <!--显示会见室名字-->
                  <div style="width: 70%;text-align: center;cursor: pointer" @click="videos(item)">{{item.room}}</div>
                  <!--查看视频的按钮-->
                  <div
                    style="width: 25%;text-align: center;cursor: pointer;background-color: #dd6161;border-radius: 5px;font-size: 12px"
                    @click="videos(item)">查看视频
                  </div>
                </div>
                <!--这里显示会见室内详细会见信息，包括文字颜色-->
                <div v-for="item1 in item.meets" v-if="item1.state === 0" style="color: #F4A460">
                  {{item1.time[0]}} — {{item1.time[1]}} {{item1.lawyer}}
                  <span v-if="item1.state === 0" style="color: #F4A460">已预约</span>
                  <span v-if="item1.state === 1" style="color: aqua">会见中</span>
                  <span v-if="item1.state === 2" style="color: blue">已结束</span>
                  <span v-if="item1.state === 3" style="color: red">警告</span>
                  <div v-if="pbdz">{{item1.device[0]}}：{{item1.device[1]}}</div>
                </div>
                <div v-for="item1 in item.meets" v-if="item1.state === 1" style="color: aqua">
                  {{item1.time[0]}} — {{item1.time[1]}} {{item1.lawyer}}
                  <span v-if="item1.state === 0" style="color: #F4A460">已预约</span>
                  <span v-if="item1.state === 1" style="color: aqua">会见中</span>
                  <span v-if="item1.state === 2" style="color: blue">已结束</span>
                  <span v-if="item1.state === 3" style="color: red">警告</span>
                  <div v-if="pbdz">{{item1.device[0]}} {{item1.device[1]}}</div>
                </div>
                <div v-for="item1 in item.meets" v-if="item1.state === 2" style="color: blue">
                  {{item1.time[0]}} — {{item1.time[1]}} {{item1.lawyer}}
                  <span v-if="item1.state === 0" style="color: #F4A460">已预约</span>
                  <span v-if="item1.state === 1" style="color: aqua">会见中</span>
                  <span v-if="item1.state === 2" style="color: blue">已结束</span>
                  <span v-if="item1.state === 3" style="color: red">警告</span>
                  <div v-if="pbdz">{{item1.device[0]}} {{item1.device[1]}}</div>
                </div>
                <div v-for="item1 in item.meets" v-if="item1.state === 3" style="color: red">
                  {{item1.time[0]}} — {{item1.time[1]}} {{item1.lawyer}}
                  <span v-if="item1.state === 0" style="color: #F4A460">已预约</span>
                  <span v-if="item1.state === 1" style="color: aqua">会见中</span>
                  <span v-if="item1.state === 2" style="color: blue">已结束</span>
                  <span v-if="item1.state === 3" style="color: red">警告</span>
                  <div v-if="pbdz">{{item1.device[0]}} {{item1.device[1]}}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!--预约表格-->
        <div class="right-bottom">
          <!--表头-->
          <div class="right-bottom-title">
            <span>预约列表</span>
            <!--用来查询信息的-->
            <el-form inline="inline">
              <el-form-item label="会见亭" v-show="chaxunhidden">
                <el-select v-model="allmeetsname" style="width: 100px" clearable filterable>
                  <el-option v-for="item in allmeets" :key="item.id" :label="item.deviceno" :value="item.deviceno">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="律师姓名" v-show="chaxunhidden">
                <el-input style="width: 100px" clearable v-model="ls" placeholder="请输入"></el-input>
              </el-form-item>
              <el-form-item label="在押人员姓名" v-show="chaxunhidden">
                <el-input style="width: 100px" clearable v-model="fr" placeholder="请输入"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button icon="el-icon-search" @click="chaxun" type="primary" v-show="chaxunhidden" size="mini">查询
                </el-button>
              </el-form-item>
              <!--表格控制按钮-->
              <div style="display: inline-block">
                <div class="classify">
                  <!--申请中-->
                  <div>
                    <div class="classify1" @click="apply">申请中</div>
                  </div>
                  <!--已通过-->
                  <div>
                    <div class="classify2" @click="pass">已通过</div>
                  </div>
                  <!--未开始-->
                  <div>
                    <div class="classify3" @click="passnostart">未开始</div>
                  </div>
                  <!--已结束-->
                  <div>
                    <div class="classify4" @click="passend">已结束</div>
                  </div>
                  <!--已驳回-->
                  <div>
                    <div class="classify5" @click="reject">已驳回</div>
                  </div>
                  <!--取消预约-->
                  <div>
                    <div class="classify6" @click="cancel">取消预约</div>
                  </div>
                </div>
              </div>
            </el-form>
          </div>
          <!--table表格，用v-show控制显示不同状态-->
          <!--申请中显示-->
          <el-table v-show="show1" style="width: 100%;background-color: #C0C8D5;" height="80%" :data="list"
                    :header-cell-style="{background:'#43516C',color:'white'}" @row-click="clickRow"
                    :row-style="{background:'#C0C8D5',color:'black'}">
            <el-table-column prop="lawyer" label="律师姓名" align="center" width="68"></el-table-column>
            <el-table-column prop="lxdh" label="联系电话" align="center" width="95"></el-table-column>
            <el-table-column :formatter="stateFormat" label="辅助律师" align="center" width="68"></el-table-column>
            <el-table-column prop="zyjg" label="执业机构" align="center"></el-table-column>
            <el-table-column prop="prison" label="监所" align="center"></el-table-column>
            <el-table-column prop="bzxrxm" label="在押人员姓名" align="center" width="68"></el-table-column>
            <el-table-column prop="sqsj" label="申请时间" align="center" min-width="140"></el-table-column>
            <el-table-column prop="yyrq" label="预约日期" align="center" min-width="82"></el-table-column>
            <el-table-column prop="yysj" label="预约时间" align="center" min-width="68">
              <template slot-scope="scope" v-if="zt==0">
                <span v-if="scope.row.yysj === '1'">上午</span>
                <span v-if="scope.row.yysj === '2'">下午</span>
              </template>
            </el-table-column>
            <el-table-column prop="area" label="预约地点" align="center" width="100"></el-table-column>
            <el-table-column prop="yysc" label="会见时长(分钟)" align="center" width="75"></el-table-column>
            <el-table-column prop="regular" label="预约类型" align="center" width="100">
              <template slot-scope="scope">
                <el-tag v-if="scope.row.regular === 0" type="warning">定时预约</el-tag>
                <el-tag v-else-if="scope.row.regular === 1" type="success">常规预约</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="150">
              <template slot-scope="scope">
                <div style="display: flex;">
                  <el-button @click.stop="video(scope.row)" type="primary" style="margin: 1px;">视频</el-button>
                  <el-button :disabled="scope.row.zt != 1" @click.stop="open(scope.row)" type="primary" plain
                             style="margin: 0">开门
                  </el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <!--已通过显示-->
          <el-table v-show="show2" style="width: 100%;background-color: #C0C8D5;" height="80%" :data="list"
                    :header-cell-style="{background:'#43516C',color:'white'}" @row-click="clickRow"
                    :row-style="{background:'#C0C8D5',color:'black'}">
            <el-table-column prop="lawyer" label="律师姓名" align="center" width="68"></el-table-column>
            <el-table-column prop="lxdh" label="联系电话" align="center" width="95"></el-table-column>
            <el-table-column :formatter="stateFormat" label="辅助律师" align="center" width="68"></el-table-column>
            <el-table-column prop="zyjg" label="执业机构" align="center"></el-table-column>
            <el-table-column prop="prison" label="监所" align="center"></el-table-column>
            <el-table-column prop="bzxrxm" label="在押人员姓名" align="center" width="68"></el-table-column>
            <el-table-column prop="sqsj" label="申请时间" align="center" width="160"></el-table-column>
            <el-table-column prop="kssj" label="开始时间" align="center" width="140"></el-table-column>
            <el-table-column prop="jssj" label="结束时间" align="center" width="140"></el-table-column>
            <el-table-column prop="deviceno" label="会见亭" align="center" min-width="70"></el-table-column>
            <el-table-column prop="area" label="预约地点" align="center" width="100"></el-table-column>
            <el-table-column prop="yysc" label="会见时长(分钟)" align="center" width="75"></el-table-column>
            <el-table-column prop="regular" label="预约类型" align="center" width="100">
              <template slot-scope="scope">
                <el-tag v-if="scope.row.regular === 0" type="warning">定时预约</el-tag>
                <el-tag v-else-if="scope.row.regular === 1" type="success">常规预约</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="120">
              <template slot-scope="scope">
                <div style="display: flex;">
                  <el-button @click.stop="video(scope.row)" type="primary" style="margin: 1px;">视频</el-button>
                  <el-button :disabled="scope.row.zt != 1" @click.stop="open(scope.row)" type="primary" plain
                             style="margin: 0">开门
                  </el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <!--未开始显示-->
          <el-table v-show="show3" style="width: 100%;background-color: #C0C8D5;" height="80%" :data="list"
                    :header-cell-style="{background:'#43516C',color:'white'}" @row-click="clickRow"
                    :row-style="{background:'#C0C8D5',color:'black'}">
            <el-table-column prop="lawyer" label="律师姓名" align="center" width="68"></el-table-column>
            <el-table-column prop="lxdh" label="联系电话" align="center" width="70"></el-table-column>
            <el-table-column :formatter="stateFormat" label="辅助律师" align="center" width="68"></el-table-column>
            <el-table-column prop="zyjg" label="执业机构" align="center"></el-table-column>
            <el-table-column prop="prison" label="监所" align="center"></el-table-column>
            <el-table-column prop="bzxrxm" label="在押人员姓名" align="center" width="68"></el-table-column>
            <el-table-column prop="sqsj" label="申请时间" align="center" width="160"></el-table-column>
            <el-table-column prop="kssj" label="开始时间" align="center" width="140"></el-table-column>
            <el-table-column prop="jssj" label="结束时间" align="center" width="140"></el-table-column>
            <el-table-column prop="deviceno" label="会见亭" align="center" min-width="70"></el-table-column>
            <el-table-column prop="area" label="预约地点" align="center" width="100"></el-table-column>
            <el-table-column prop="yysc" label="会见时长(分钟)" align="center" width="75"></el-table-column>
            <el-table-column prop="regular" label="预约类型" align="center" width="90">
              <template slot-scope="scope">
                <el-tag v-if="scope.row.regular === 0" type="warning">定时预约</el-tag>
                <el-tag v-else-if="scope.row.regular === 1" type="success">常规预约</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="150">
              <template slot-scope="scope">
                <div style="display: flex;">
                  <el-button @click.stop="video(scope.row)" type="primary" style="margin: 1px;">视频</el-button>
                  <el-button :disabled="scope.row.zt != 1" @click.stop="open(scope.row)" type="primary" plain
                             style="margin: 0">开门
                  </el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <!--已结束显示-->
          <el-table v-show="show4" style="width: 100%;background-color: #C0C8D5;" height="80%" :data="list"
                    :header-cell-style="{background:'#43516C',color:'white'}" @row-click="clickRow"
                    :row-style="{background:'#C0C8D5',color:'black'}">
            <el-table-column prop="lawyer" label="律师姓名" align="center" width="68"></el-table-column>
            <el-table-column prop="lxdh" label="联系电话" align="center" width="70"></el-table-column>
            <el-table-column :formatter="stateFormat" label="辅助律师" align="center" width="68"></el-table-column>
            <el-table-column prop="zyjg" label="执业机构" align="center"></el-table-column>
            <el-table-column prop="prison" label="监所" align="center"></el-table-column>
            <el-table-column prop="bzxrxm" label="在押人员姓名" align="center" width="68"></el-table-column>
            <el-table-column prop="sqsj" label="申请时间" align="center" width="160"></el-table-column>
            <el-table-column prop="kssj" label="开始时间" align="center" width="140"></el-table-column>
            <el-table-column prop="jssj" label="结束时间" align="center" width="140"></el-table-column>
            <el-table-column prop="deviceno" label="会见亭" align="center" min-width="70"></el-table-column>
            <el-table-column prop="area" label="预约地点" align="center" width="100"></el-table-column>
            <el-table-column prop="yysc" label="会见时长(分钟)" align="center" width="75"></el-table-column>
            <el-table-column prop="regular" label="预约类型" align="center" width="90">
              <template slot-scope="scope">
                <el-tag v-if="scope.row.regular === 0" type="warning">定时预约</el-tag>
                <el-tag v-else-if="scope.row.regular === 1" type="success">常规预约</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="150">
              <template slot-scope="scope">
                <div style="display: flex;">
                  <el-button @click.stop="video(scope.row)" type="primary" style="margin: 1px;">视频</el-button>
                  <el-button :disabled="scope.row.zt != 1" @click.stop="open(scope.row)" type="primary" plain
                             style="margin: 0">开门
                  </el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <!--已驳回显示-->
          <el-table v-show="show5" style="width: 100%;background-color: #C0C8D5;" height="80%" :data="list"
                    :header-cell-style="{background:'#43516C',color:'white'}"
                    :row-style="{background:'#C0C8D5',color:'black'}">
            <el-table-column prop="lawyer" label="律师姓名" align="center" width="68"></el-table-column>
            <el-table-column prop="lxdh" label="联系电话" align="center" width="95"></el-table-column>
            <el-table-column :formatter="stateFormat" label="辅助律师" align="center" width="68"></el-table-column>
            <el-table-column prop="zyjg" label="执业机构" align="center"></el-table-column>
            <el-table-column prop="prison" label="监所" align="center"></el-table-column>
            <el-table-column prop="bzxrxm" label="在押人员姓名" align="center" width="100"></el-table-column>
            <el-table-column prop="sqsj" label="申请时间" align="center" min-width="90"></el-table-column>
            <el-table-column prop="regular" label="预约类型" align="center" width="100">
              <template slot-scope="scope">
                <el-tag v-if="scope.row.regular === 0" type="warning">定时预约</el-tag>
                <el-tag v-else-if="scope.row.regular === 1" type="success">常规预约</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="bhyy" label="驳回原因" align="center"></el-table-column>
            <el-table-column label="操作" align="center" width="150">
              <template slot-scope="scope">
                <div style="display: flex;">
                  <el-button @click.stop="video(scope.row)" type="primary" style="margin: 1px;">视频</el-button>
                  <el-button :disabled="scope.row.zt != 1" @click.stop="open(scope.row)" type="primary" plain
                             style="margin: 0">开门
                  </el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <!--取消预约显示-->
          <el-table v-show="show6" style="width: 100%;background-color: #C0C8D5;" height="90%" :data="list"
                    :header-cell-style="{background:'#43516C',color:'white'}"
                    :row-style="{background:'#C0C8D5',color:'black'}">
            <el-table-column prop="lawyer" label="律师姓名" align="center" width="80"></el-table-column>
            <el-table-column prop="lxdh" label="联系电话" align="center" width="120"></el-table-column>
            <el-table-column :formatter="stateFormat" label="辅助律师" align="center" width="68"></el-table-column>
            <el-table-column prop="zyjg" label="执业机构" align="center" width="100"></el-table-column>
            <el-table-column prop="qxsj" label="取消时间" align="center" width="150"></el-table-column>
            <el-table-column prop="qxyy" label="取消原因" align="center"></el-table-column>
            <el-table-column prop="bzxrxm" label="在押人员姓名" align="center" width="100"></el-table-column>
            <el-table-column prop="kssj" label="开始时间" align="center" width="120"></el-table-column>
            <el-table-column prop="jssj" label="结束时间" align="center" width="120"></el-table-column>
            <el-table-column prop="room" label="会见室" align="center" width="100"></el-table-column>
            <el-table-column prop="deviceno" label="会见亭" align="center" width="100"></el-table-column>
            <el-table-column prop="area" label="预约地点" align="center" width="100"></el-table-column>
            <el-table-column prop="regular" label="预约类型" align="center" width="100">
              <template slot-scope="scope">
                <el-tag v-if="scope.row.regular === 0" type="warning">定时预约</el-tag>
                <el-tag v-else-if="scope.row.regular === 1" type="success">常规预约</el-tag>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <!--右侧信息-->
      <div class="left hide-scroll-bar">
        <!--排版前查看信息-->
        <div class="content">
          <div>
            <div>姓名：</div>
            <div>{{detailList.bzxrxm}}</div>
          </div>
          <div>
            <div>人员编号：</div>
            <div>{{detailList.bzxrbh}}</div>
          </div>
          <div>
            <div>看守所：</div>
            <div>{{detailList.prison}}</div>
          </div>
          <div>
            <div>律师姓名：</div>
            <div>{{detailList.lawyer}}</div>
          </div>
          <div>
            <div>律师身份证：</div>
            <div>{{detailList.sfzmhm}}</div>
          </div>
          <div>
            <div>联系电话：</div>
            <div>{{detailList.lxdh}}</div>
          </div>
          <div>
            <div>律师执业证号：</div>
            <div>{{detailList.zyzh}}</div>
          </div>
          <div>
            <div>律师执业机构：</div>
            <div>{{detailList.zyjg}}</div>
          </div>
          <div>
            <div>辅助律师姓名:</div>
            <div>{{detailList.lawyer2}}</div>
          </div>
          <div>
            <div>律师有效期限:</div>
            <div>{{detailList.yxqx}}</div>
          </div>
          <div>
            <div>申请原因:</div>
            <div>{{detailList.reason}}</div>
          </div>
          <!--看守所直接点击批准或不予批准-->
          <div v-show="buzixuanhidden" style="display: flex;flex-direction: column">
            <div>预约时间段：</div>
            <el-date-picker :disabled="true" v-model="yydate" :clearable="false" value-format="yyyy-MM-dd" type="date"
                            style="width: 245px" placeholder="选择日期">
            </el-date-picker>
            <el-form :inline="true">
              <el-form-item>
                <el-time-select :disabled="detailList.regular===1" style="width: 120px" placeholder="起始时间"
                                v-model="value1"
                                :picker-options="{start: '00:00',step: '00:10',end: '24:00'}">
                </el-time-select>
                <el-time-select :disabled="detailList.regular===1" style="width: 120px" placeholder="结束时间"
                                @change="minute" v-model="value2"
                                :picker-options="{start: '00:00',step: '00:10',end: '24:00',minTime: value1}">
                </el-time-select>
              </el-form-item>
            </el-form>
            <div>
              <div>预约时长：</div>
              <div>{{value3}}分钟</div>
            </div>
            <div>会见室：</div>
            <el-form>
              <el-form-item>
                <el-select :disabled="detailList.regular===1" v-model="hjs" style="width: 240px" @change="handleChange"
                           filterable clearable>
                  <el-option v-for="item in kxhjs" :key="item.id" :label="item[0]" :value="item[1]">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-form>
            <div>会见亭：</div>
            <el-form>
              <el-form-item>
                <el-select :disabled="detailList.regular===1" v-model="hjt" style="width: 240px" filterable clearable
                           @change="handleChange1">
                  <el-option v-for="item in kxhjt" :key="item.id" :label="item[2]" :value="item[0]">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-form>
            <div>{{dizhi}}</div>
          </div>
        </div>
        <!--看守所自己选择会见时间-->
        <div v-show="zixuanhidden"
             style="width: 350px;display: flex;align-items: center;justify-content: center;flex-wrap: wrap;margin-top: 20px;flex-direction: column">
          <div>{{yydate}}</div>
          <div
            style="width: 350px;display: flex;align-items: center;justify-content: center;flex-wrap: wrap;margin-top: 20px">
            <div v-for="(item, i) in prisonList" :key="i" @click="chuanTime(i,item)"
                 style="margin-bottom: 10px;width: 120px;height:20px;line-height:20px;text-align: center;border: 1px solid #43516C;border-radius: 5px;margin-right: 5px">
              <!--加red类名,根据free,会见室是否空闲-->
              <div :class="item.free===0?'red':''">
                <!--加active类名,根据激活哪一项判断-->
                <div :class="currentIndex===i?'active':''"
                     style="color: #43516C;cursor: pointer;font-size: 15px;border-radius: 5px">
                  {{item.kssj}}-{{item.jssj}}
                </div>
              </div>
            </div>
          </div>
        </div>
        <!--正式律师证件图片展示-->
        <div class="img">
          <!--委托书展示-->
          <div>
            <viewer>
              <img :src="imgUrl+ '/'+detailList.wts+ '?' + Math.random()" alt="" width="50px" height="50px"
                   v-if="detailList.wts!=''">
              <img src="../../assets/zw.jpg" alt="" width="50px" height="50px"
                   v-else>
            </viewer>
            委托书
            <!--base64展示图片-->
            <!--<img v-if="detailList.wts!=''" :src="`data:image/png;base64,${detailList.wts}`" alt="" width="80px"-->
            <!--height="80px" v-image-preview>委托书-->
          </div>
          <!--介绍信展示-->
          <div>
            <viewer>
              <img :src="imgUrl+ '/'+detailList.jsx+ '?' + Math.random()" alt="" width="50px" height="50px"
                   v-if="detailList.jsx!=''">
              <img src="../../assets/zw.jpg" alt="" width="50px" height="50px"
                   v-else>
            </viewer>
            介绍信
          </div>
          <!--律师证展示-->
          <div>
            <viewer>
              <img :src="imgUrl+ '/'+detailList.photo+ '?' + Math.random()" alt="" width="50px" height="50px"
                   v-if="detailList.photo!=''">
              <img src="../../assets/zw.jpg" alt="" width="50px" height="50px"
                   v-else>
            </viewer>
            律师证
          </div>
          <!--解除手续展示-->
          <div>
            <viewer>
              <img :src="jcsmphoto+ '?' + Math.random()" alt="" width="50px" height="50px"
                   v-if="jcsmphoto!=''">
              <img src="../../assets/zw.jpg" alt="" width="50px" height="50px"
                   v-else>
            </viewer>
            解除手续
          </div>
        </div>
        <!--辅助律师证件图片展示-->
        <div class="img">
          <!--助理委托书-->
          <div>
            <viewer>
              <img :src="imgUrl+ '/'+detailList.wts2+ '?' + Math.random()" alt="" width="50px" height="50px"
                   v-if="detailList.wts2!=''">
              <img src="../../assets/zw.jpg" alt="" width="50px" height="50px"
                   v-else>
            </viewer>
            助理委托书
          </div>
          <!--助理介绍信-->
          <div>
            <viewer>
              <img :src="imgUrl+ '/'+detailList.jsx2+ '?' + Math.random()" alt="" width="50px" height="50px"
                   v-if="detailList.jsx2!=''">
              <img src="../../assets/zw.jpg" alt="" width="50px" height="50px"
                   v-else>
            </viewer>
            助理介绍信
          </div>
          <!--辅律师证-->
          <div>
            <viewer>
              <img :src="imgUrl+ '/'+detailList.photo2+ '?' + Math.random()" alt="" width="50px" height="50px"
                   v-if="detailList.photo2!=''">
              <img src="../../assets/zw.jpg" alt="" width="50px" height="50px"
                   v-else>
            </viewer>
            辅律师证
          </div>
          <!--指派手续-->
          <div>
            <viewer>
              <img :src="zplswtphoto+ '?' + Math.random()" alt="" width="50px" height="50px"
                   v-if="zplswtphoto!=''">
              <img src="../../assets/zw.jpg" alt="" width="50px" height="50px"
                   v-else>
            </viewer>
            指派手续
          </div>
        </div>
        <!--批准和不予批准的按钮-->
        <div class="btn">
          <!--批准按钮-->
          <div class="btn-btn btn-btn-pizhun" @click="ratify">批准</div>
          <!--不予批准按钮-->
          <div class="btn-btn btn-btn-bupizhun" @click="inputhidden">不予批准</div>
          <!--不予批准理由-->
          <div v-if="inputHidden">
            <el-form>
              <el-form-item>
                <el-input v-model="reason" placeholder="不予批准理由(限40字)" @keyup.native="btKeyUp"></el-input>
                <el-button type="primary" style="width: 100%" @click="queding">确定</el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
        <!--今日需审核信息展示-->
        <div class="info">
          今日您需要审核{{lssl}}位律师
        </div>
      </div>
    </div>
    <!--选择下载报表日期-->
    <el-dialog title="请选择日期" :visible.sync="delsure" width="400px" top="30vh">
      <!--选择开始日期和结束日期-->
      <div class="block">
        <span class="demonstration">请选择日期时间</span>
        <el-date-picker v-model="valuetime" type="daterange" range-separator="至" start-placeholder="开始日期"
                        end-placeholder="结束日期" value-format="yyyy-MM-dd">
        </el-date-picker>
      </div>
      <!--页脚展示按钮-->
      <span slot="footer" class="dialog-footer">
        <el-button size="medium" @click="delsure = false">取 消</el-button>
        <el-button type="primary" size="medium" @click="deltrue">确 定</el-button>
      </span>
    </el-dialog>
    <!--查看空闲会见室-->
    <el-dialog width="1200px" title="占用情况(红色表示已占用)" :visible="dialogVisible" @close="closeDialog" top="0px">
      <div class="dialog-wrapper">
        <div class="huijianshi">
          <div class="huijianshi-wrapper">
            <div class="huijianshi-tiaojiao">
              <el-form :inline="true" :model="formInline" style="margin-top: 5px">
                <el-form-item label="时间">
                  <el-date-picker
                    v-model="formInline.shijian"
                    type="date"
                    placeholder="选择日期"
                    value-format="yyyy-MM-dd"
                    :disabled="true">
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="占用时间：" style="margin-left: 60px" v-show="huahuo">
                  <div class="huaguo-xianshi">
                    {{hjianshixx}}{{sjian[0]}}-{{sjian[1]}}
                  </div>
                </el-form-item>
              </el-form>
            </div>
            <div class="huijianshi-nr">
              <div class="huijianshi-nr-wrapper">
                <div class="huijianshi-nr-shijian">
                  <div>08:00</div>
                  <div>09:00</div>
                  <div>10:00</div>
                  <div>11:00</div>
                  <div>12:00</div>
                  <div>13:00</div>
                  <div>14:00</div>
                  <div>15:00</div>
                  <div>16:00</div>
                  <div>17:00</div>
                  <div>18:00</div>
                  <div>19:00</div>
                  <div>20:00</div>
                  <div>21:00</div>
                  <div>22:00</div>
                  <div>23:00</div>
                  <div>24:00</div>
                  <div>01:00</div>
                  <div>02:00</div>
                  <div>03:00</div>
                  <div>04:00</div>
                  <div>05:00</div>
                  <div>06:00</div>
                  <div>07:00</div>
                </div>
                <div class="huijianshi-nr-xshi hide-scroll-bar">
                  <div class="table-table table-table1" v-for="item in allrooms1" :key="item.id">
                    <div class="wenzi">{{item.room}}</div>
                    <div class="biao">
                      <div v-for="(item,i) in 144" :key="i" @mouseover="chooseCoat($event,i)"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="dialog-wrapper">
        <div class="huijianshi">
          <div class="huijianshi-wrapper">
            <div class="huijianshi-tiaojiao">
              <el-form :inline="true" :model="formInline" style="margin-top: 5px">
                <el-form-item label="时间">
                  <el-date-picker
                    v-model="formInline.shijian2"
                    type="date"
                    placeholder="选择日期"
                    value-format="yyyy-MM-dd"
                    :disabled="true">
                  </el-date-picker>
                </el-form-item>
                <!-- 点击显示 -->
                <el-form-item label="占用时间：" style="margin-left: 60px" v-show="huahuo2">
                  <div class="huaguo-xianshi">
                    {{hjianshixx2}}{{sjian2[0]}}-{{sjian2[1]}}
                  </div>
                </el-form-item>
              </el-form>
            </div>
            <div class="huijianshi-nr">
              <div class="huijianshi-nr-wrapper">
                <div class="huijianshi-nr-shijian">
                  <div>08:00</div>
                  <div>09:00</div>
                  <div>10:00</div>
                  <div>11:00</div>
                  <div>12:00</div>
                  <div>13:00</div>
                  <div>14:00</div>
                  <div>15:00</div>
                  <div>16:00</div>
                  <div>17:00</div>
                  <div>18:00</div>
                  <div>19:00</div>
                  <div>20:00</div>
                  <div>21:00</div>
                  <div>22:00</div>
                  <div>23:00</div>
                  <div>24:00</div>
                  <div>01:00</div>
                  <div>02:00</div>
                  <div>03:00</div>
                  <div>04:00</div>
                  <div>05:00</div>
                  <div>06:00</div>
                  <div>07:00</div>
                </div>
                <div class="huijianshi-nr-xshi hide-scroll-bar">
                  <div class="table-table table-table2" v-for="item in allrooms2" :key="item.id">
                    <div class="wenzi">{{item.room}}</div>
                    <div class="biao">
                      <div v-for="(item,i) in 144" :key="i" @mouseover="chooseCoat2($event,i)"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="dialog-wrapper">
        <div class="huijianshi">
          <div class="huijianshi-wrapper">
            <div class="huijianshi-tiaojiao">
              <el-form :inline="true" :model="formInline" style="margin-top: 5px">
                <el-form-item label="时间">
                  <el-date-picker
                    v-model="formInline.shijian3"
                    type="date"
                    placeholder="选择日期"
                    value-format="yyyy-MM-dd"
                    :disabled="true">
                  </el-date-picker>
                </el-form-item>
                <!-- 点击显示 -->
                <el-form-item label="占用时间：" style="margin-left: 60px" v-show="huahuo3">
                  <div class="huaguo-xianshi">
                    {{hjianshixx3}}{{sjian3[0]}}-{{sjian3[1]}}
                  </div>
                </el-form-item>
              </el-form>
            </div>
            <div class="huijianshi-nr">
              <div class="huijianshi-nr-wrapper">
                <div class="huijianshi-nr-shijian">
                  <div>08:00</div>
                  <div>09:00</div>
                  <div>10:00</div>
                  <div>11:00</div>
                  <div>12:00</div>
                  <div>13:00</div>
                  <div>14:00</div>
                  <div>15:00</div>
                  <div>16:00</div>
                  <div>17:00</div>
                  <div>18:00</div>
                  <div>19:00</div>
                  <div>20:00</div>
                  <div>21:00</div>
                  <div>22:00</div>
                  <div>23:00</div>
                  <div>24:00</div>
                  <div>01:00</div>
                  <div>02:00</div>
                  <div>03:00</div>
                  <div>04:00</div>
                  <div>05:00</div>
                  <div>06:00</div>
                  <div>07:00</div>
                </div>
                <div class="huijianshi-nr-xshi hide-scroll-bar">
                  <div class="table-table table-table3" v-for="item in allrooms3" :key="item.id">
                    <div class="wenzi">{{item.room}}</div>
                    <div class="biao">
                      <div v-for="(item,i) in 144" :key="i" @mouseover="chooseCoat3($event,i)"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="dialog-wrapper">
        <div class="huijianshi">
          <div class="huijianshi-wrapper">
            <div class="huijianshi-tiaojiao">
              <el-form :inline="true" :model="formInline" style="margin-top: 5px">
                <el-form-item label="时间">
                  <el-date-picker
                    v-model="formInline.shijian4"
                    type="date"
                    placeholder="选择日期"
                    value-format="yyyy-MM-dd"
                    :disabled="true">
                  </el-date-picker>
                </el-form-item>
                <!-- 点击显示 -->
                <el-form-item label="占用时间：" style="margin-left: 60px" v-show="huahuo4">
                  <div class="huaguo-xianshi">
                    {{hjianshixx4}}{{sjian4[0]}}-{{sjian4[1]}}
                  </div>
                </el-form-item>
              </el-form>
            </div>
            <div class="huijianshi-nr">
              <div class="huijianshi-nr-wrapper">
                <div class="huijianshi-nr-shijian">
                  <div>08:00</div>
                  <div>09:00</div>
                  <div>10:00</div>
                  <div>11:00</div>
                  <div>12:00</div>
                  <div>13:00</div>
                  <div>14:00</div>
                  <div>15:00</div>
                  <div>16:00</div>
                  <div>17:00</div>
                  <div>18:00</div>
                  <div>19:00</div>
                  <div>20:00</div>
                  <div>21:00</div>
                  <div>22:00</div>
                  <div>23:00</div>
                  <div>24:00</div>
                  <div>01:00</div>
                  <div>02:00</div>
                  <div>03:00</div>
                  <div>04:00</div>
                  <div>05:00</div>
                  <div>06:00</div>
                  <div>07:00</div>
                </div>
                <div class="huijianshi-nr-xshi hide-scroll-bar">
                  <div class="table-table table-table4" v-for="item in allrooms4" :key="item.id">
                    <div class="wenzi">{{item.room}}</div>
                    <div class="biao">
                      <div v-for="(item,i) in 144" :key="i" @mouseover="chooseCoat4($event,i)"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="dialog-wrapper">
        <div class="huijianshi">
          <div class="huijianshi-wrapper">
            <div class="huijianshi-tiaojiao">
              <el-form :inline="true" :model="formInline" style="margin-top: 5px">
                <el-form-item label="时间">
                  <el-date-picker
                    v-model="formInline.shijian5"
                    type="date"
                    placeholder="选择日期"
                    value-format="yyyy-MM-dd"
                    :disabled="true">
                  </el-date-picker>
                </el-form-item>
                <!-- 点击显示 -->
                <el-form-item label="占用时间：" style="margin-left: 60px" v-show="huahuo5">
                  <div class="huaguo-xianshi">
                    {{hjianshixx5}}{{sjian5[0]}}-{{sjian5[1]}}
                  </div>
                </el-form-item>
              </el-form>
            </div>
            <div class="huijianshi-nr">
              <div class="huijianshi-nr-wrapper">
                <div class="huijianshi-nr-shijian">
                  <div>08:00</div>
                  <div>09:00</div>
                  <div>10:00</div>
                  <div>11:00</div>
                  <div>12:00</div>
                  <div>13:00</div>
                  <div>14:00</div>
                  <div>15:00</div>
                  <div>16:00</div>
                  <div>17:00</div>
                  <div>18:00</div>
                  <div>19:00</div>
                  <div>20:00</div>
                  <div>21:00</div>
                  <div>22:00</div>
                  <div>23:00</div>
                  <div>24:00</div>
                  <div>01:00</div>
                  <div>02:00</div>
                  <div>03:00</div>
                  <div>04:00</div>
                  <div>05:00</div>
                  <div>06:00</div>
                  <div>07:00</div>
                </div>
                <div class="huijianshi-nr-xshi hide-scroll-bar">
                  <div class="table-table table-table5" v-for="item in allrooms5" :key="item.id">
                    <div class="wenzi">{{item.room}}</div>
                    <div class="biao">
                      <div v-for="(item,i) in 144" :key="i" @mouseover="chooseCoat5($event,i)"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="dialog-wrapper">
        <div class="huijianshi">
          <div class="huijianshi-wrapper">
            <div class="huijianshi-tiaojiao">
              <el-form :inline="true" :model="formInline" style="margin-top: 5px">
                <el-form-item label="时间">
                  <el-date-picker
                    v-model="formInline.shijian6"
                    type="date"
                    placeholder="选择日期"
                    value-format="yyyy-MM-dd"
                    :disabled="true">
                  </el-date-picker>
                </el-form-item>
                <!-- 点击显示 -->
                <el-form-item label="占用时间：" style="margin-left: 60px" v-show="huahuo6">
                  <div class="huaguo-xianshi">
                    {{hjianshixx6}}{{sjian6[0]}}-{{sjian6[1]}}
                  </div>
                </el-form-item>
              </el-form>
            </div>
            <div class="huijianshi-nr">
              <div class="huijianshi-nr-wrapper">
                <div class="huijianshi-nr-shijian">
                  <div>08:00</div>
                  <div>09:00</div>
                  <div>10:00</div>
                  <div>11:00</div>
                  <div>12:00</div>
                  <div>13:00</div>
                  <div>14:00</div>
                  <div>15:00</div>
                  <div>16:00</div>
                  <div>17:00</div>
                  <div>18:00</div>
                  <div>19:00</div>
                  <div>20:00</div>
                  <div>21:00</div>
                  <div>22:00</div>
                  <div>23:00</div>
                  <div>24:00</div>
                  <div>01:00</div>
                  <div>02:00</div>
                  <div>03:00</div>
                  <div>04:00</div>
                  <div>05:00</div>
                  <div>06:00</div>
                  <div>07:00</div>
                </div>
                <div class="huijianshi-nr-xshi hide-scroll-bar">
                  <div class="table-table table-table6" v-for="item in allrooms6" :key="item.id">
                    <div class="wenzi">{{item.room}}</div>
                    <div class="biao">
                      <div v-for="(item,i) in 144" :key="i" @mouseover="chooseCoat6($event,i)"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="dialog-wrapper">
        <div class="huijianshi">
          <div class="huijianshi-wrapper">
            <div class="huijianshi-tiaojiao">
              <el-form :inline="true" :model="formInline" style="margin-top: 5px">
                <el-form-item label="时间">
                  <el-date-picker
                    v-model="formInline.shijian7"
                    type="date"
                    placeholder="选择日期"
                    value-format="yyyy-MM-dd"
                    :disabled="true">
                  </el-date-picker>
                </el-form-item>
                <!-- 点击显示 -->
                <el-form-item label="占用时间：" style="margin-left: 60px" v-show="huahuo7">
                  <div class="huaguo-xianshi">
                    {{hjianshixx7}}{{sjian7[0]}}-{{sjian7[1]}}
                  </div>
                </el-form-item>
              </el-form>
            </div>
            <div class="huijianshi-nr">
              <div class="huijianshi-nr-wrapper">
                <div class="huijianshi-nr-shijian">
                  <div>08:00</div>
                  <div>09:00</div>
                  <div>10:00</div>
                  <div>11:00</div>
                  <div>12:00</div>
                  <div>13:00</div>
                  <div>14:00</div>
                  <div>15:00</div>
                  <div>16:00</div>
                  <div>17:00</div>
                  <div>18:00</div>
                  <div>19:00</div>
                  <div>20:00</div>
                  <div>21:00</div>
                  <div>22:00</div>
                  <div>23:00</div>
                  <div>24:00</div>
                  <div>01:00</div>
                  <div>02:00</div>
                  <div>03:00</div>
                  <div>04:00</div>
                  <div>05:00</div>
                  <div>06:00</div>
                  <div>07:00</div>
                </div>
                <div class="huijianshi-nr-xshi hide-scroll-bar">
                  <div class="table-table table-table7" v-for="item in allrooms7" :key="item.id">
                    <div class="wenzi">{{item.room}}</div>
                    <div class="biao">
                      <div v-for="(item,i) in 144" :key="i" @mouseover="chooseCoat7($event,i)"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import request from '@/utils/request'
  import picSrc from "@/utils/globalConfig";
  import $ from "jquery";

  export default {
    name: "index",
    data() {
      return {
        //五个el-table展示与隐藏状态数据
        show1: true,
        show2: false,
        show3: false,
        show4: false,
        show5: false,
        show6: false,
        //查询隐藏会见亭
        chaxunhidden: true,
        //语音喊话的speech
        speech: null,
        //下载报表的dialog
        delsure: false,
        //查看隐藏会见亭文字显示
        wenzi: '查看会见亭',
        //查看隐藏会见亭状态
        wenzistate: true,
        //下载报表的两个日期点
        valuetime: [],
        //展示图片路径和照片
        imgUrl: picSrc,
        jcsmphoto: '',
        zplswtphoto: '',
        //预约时间段
        value1: '',
        value2: '',
        //预约时常
        value3: '',
        //video编号
        videobh: '',
        //驳回理由
        reason: '',
        //排班日期
        date: '',
        //预约日期
        yydate: '',
        //第二个时间段是否禁用
        datedisbale: true,
        //会见室编号
        hjs: '',
        //会见室名称
        hjsmc: '',
        //会见亭
        hjt: '',
        //拒绝时的input
        inputHidden: false,
        //右侧展示信息
        detailList: {
          bzxrxm: '', //被执行人姓名
          bzxrbh: '', //被执行人编号
          prison: '', //看守所
          lawyer: '', //律师姓名
          sfzmhm: '', //律师身份证号码
          lxdh: '', //联系电话
          zyzh: '', //执业证号
          zyjg: '', //执业机构
          jsx: '', //介绍信
          wts: '', //委托书
          jsx2: '', //助理介绍信
          wts2: '', //助理委托书
          photo: '', //律师证
          photo2: '', //辅助律师证
          jcsm: '', //律师解除说明
          zplswt: '', //法律援助指派律师委托说明
          area: '', //区域名称
          areaid: '', //区域id
          id: '', //此条信息id
          zt: '', //状态
          yxqx: '', //有效期限
          reason: '', //申请原因
          jgdwmc: '', //监管单位名称
          jgdwid: '', //监管单位id
          sf: '', //省份
          sfdm: '', //省份代码
          dwlb: 1, //貌似没用到
          lawyer2: '', //辅助律师姓名
          regular: '', //预约类型
        },
        //预约视频会见列表
        list: [],
        //当前页数
        currentPage: 1,
        //每页显示多少条数据
        pagesize: 5,
        //数据的总条数
        counts: 0,
        //状态
        zt: 0,
        bj: '',
        //空闲会见室下拉
        kxhjs: [],
        //空闲会见亭下拉
        kxhjt: [],
        //总会见室个数
        alls: [],
        //组件销毁时的定时器
        timer: '',
        timer1: '',
        timer3: '',
        timer4: '',
        //警告列表
        warnlist: [],
        warns: null,
        dialog: false,
        //律师数量
        lssl: null,
        //所有会见厅的名字
        allmeets: [],
        //用于查询会见厅的名字
        allmeetsname: '',
        //用于预约表格律师查询
        ls: '',
        //用于预约表格被执行人姓名查询
        fr: '',
        //用于喊话的当前时间
        dqsj: '',
        //判断结束时间的数据
        datas: '',
        //会见亭明文地址
        dizhi: '',
        //排版地址
        pbdz: false,
        //空闲会见室
        dialogVisible: false,
        //查询条件
        formInline: {
          shijian: '',
          shijian2: '',
          shijian3: '',
          shijian4: '',
          shijian5: '',
          shijian6: '',
          shijian7: '',
        },
        //被占用的七天会见室
        allrooms1: [],
        allrooms2: [],
        allrooms3: [],
        allrooms4: [],
        allrooms5: [],
        allrooms6: [],
        allrooms7: [],
        // 滑过信息展示
        huahuo: false,
        huahuo2: false,
        huahuo3: false,
        huahuo4: false,
        huahuo5: false,
        huahuo6: false,
        huahuo7: false,
        // 会见室的信息
        hjianshixx: '',
        hjianshixx2: '',
        hjianshixx3: '',
        hjianshixx4: '',
        hjianshixx5: '',
        hjianshixx6: '',
        hjianshixx7: '',
        // 会见的时间
        sjian: [],
        sjian2: [],
        sjian3: [],
        sjian4: [],
        sjian5: [],
        sjian6: [],
        sjian7: [],
        //拿到监所id，获取空间时间所用
        prisonid: '',
        //区域id
        areaid: '',
        //预约日期
        yyrq: '',
        //存放所有监所空间时间
        prisonList: [],
        //自选时间的隐藏配置
        zixuanhidden: false,
        //不自选时间的隐藏配置
        buzixuanhidden: true,
        //用来切换时间变色
        currentIndex: null,
        //定时预约开始时间
        dsyykssj: '',
        //定时预约结束时间
        dsyyjssj: ''
      }
    },
    methods: {
      //视频会见列表数据
      table() {
        let that = this
        request({
          url: "/room/all",
          method: "get",
          params: {
            yyrq: that.date
          }
        })
          .then(function (response) {
            if (response.data.code === 20000) {
              that.alls = response.data.data
            }
          })
          .catch(function (error) {
            console.log(error, "报错信息");
          });
        //循环调用拿到实时数据
        that.timer = setInterval(function () {
          request({
            url: "/room/all",
            method: "get",
            params: {
              yyrq: that.date
            }
          })
            .then(function (response) {
              if (response.data.code === 20000) {
                that.alls = response.data.data
              }
            })
            .catch(function (error) {
              console.log(error, "报错信息");
            });
        }, 60000)
      },
      //改变排版日期显示改变的日期的视频会见列表数据
      change() {
        let that = this
        clearInterval(that.timer)
        that.alls = []
        that.table()
      },
      //预约视频会见列表
      getinfo() {
        let that = this;
        request({
          url: "/appointment/zt",
          method: "get",
          params: {
            lawyer: that.ls,
            bzxrxm: that.fr,
            deviceno: that.allmeetsname,
            zt: that.zt,
            bj: that.bj,
            rows: '',
            page: '',
            date: Date.parse(new Date())
          }
        })
          .then(function (response) {
            if (response.data.code === 20000) {
              that.counts = response.data.total
              that.list = response.data.data
            }
          })
          .catch(function (error) {
            console.log(error, "报错信息");
          });
      },
      //主动取消预约的数据
      cancelyuyue() {
        let that = this;
        request({
          url: "/appointment/meets/cancel",
          method: "post",
        })
          .then(function (response) {
            if (response.data.code === 20000) {
              that.list = response.data.data
            }
          })
          .catch(function (error) {
            console.log(error, "报错信息");
          });
      },
      //查询按钮显示对于会见亭、律师姓名等的数据
      chaxun() {
        let that = this
        that.getinfo()
      },
      //先选起始时间，再选结束时间，没用到
      nextdata() {
        let that = this
        that.datedisbale = !that.datedisbale
      },
      //用户选择预约时间段时触发，第一个目的是计算出会见时长，第二个目的是发送请求，查询出当前时间段的空闲会见室会见亭
      minute() {
        let that = this
        let aDate2 = that.value2.split(":") //结束时间
        let aDate1 = that.value1.split(":") //开始时间
        //如果先选择了第二个时间，那就不计算预约时长
        if (that.value1 === '') {
          //value1为空，啥也不执行
        } else {
          //如果先选择第一个时间，在选择第二个时间，就计算出预约时长
          that.value3 = (parseInt(aDate2[0] - aDate1[0])) * 60 + (parseInt(aDate2[1] - aDate1[1]))
        }
        //查询空闲会见室
        request({
          url: "/room/freedom",
          method: "get",
          params: {
            yyrq: that.yydate,
            start: that.value1,
            end: that.value2,
          }
        })
          .then(function (response) {
            if (response.data.code === 20000) {
              that.kxhjs = response.data.data
            }
          })
          .catch(function (error) {
            console.log(error, "报错信息");
          });
        //查询空闲会见亭
        request({
          url: "/device/freedom",
          method: "get",
          params: {
            yyrq: that.yydate,
            start: that.value1,
            end: that.value2,
            area: that.detailList.area,
            areaid: that.detailList.areaid,
          }
        })
          .then(function (response) {
            if (response.data.code === 20000) {
              that.kxhjt = response.data.data
            }
          })
          .catch(function (error) {
            console.log(error, "报错信息");
          });
      },
      //点击预约会见列表一行执行
      clickRow(val) {
        let that = this
        that.currentIndex = null
        that.detailList.regular = val.regular
        //判断预约类型，分常规预约和定时预约，0是定时预约，1是常规预约。区别在于传不传时间
        if (val.regular === 0) {
          that.buzixuanhidden = false
          that.zixuanhidden = true
          that.dialog = true
          that.prisonid = val.prisonid
          that.areaid = val.areaid
          that.yyrq = val.yyrq
          that.hjs = ''
          that.hjt = ''
          that.dizhi = ''
          that.detailList.bzxrxm = val.bzxrxm
          that.detailList.bzxrbh = val.bzxrbh
          that.detailList.prison = val.prison
          that.detailList.lawyer = val.lawyer
          that.detailList.lawyer2 = val.lawyer2
          that.detailList.sfzmhm = val.sfzmhm
          that.detailList.lxdh = val.lxdh
          that.detailList.zyzh = val.zyzh
          that.detailList.zyjg = val.zyjg
          that.detailList.yxqx = val.yxqx
          that.detailList.reason = val.reason
          that.value3 = val.yysc
          that.detailList.jsx = val.jsx
          that.detailList.wts = val.wts
          that.detailList.jsx2 = val.jsx2
          that.detailList.wts2 = val.wts2
          //没有照片的就用暂无
          if (val.jcsm == '' || val.jcsm == null) {
            that.jcsmphoto = require("../../assets/zw.jpg")
          } else {
            that.jcsmphoto = that.imgUrl + '/' + val.jcsm
          }
          if (val.zplswt == '' || val.zplswt == null) {
            that.zplswtphoto = require("../../assets/zw.jpg")
          } else {
            that.zplswtphoto = that.imgUrl + '/' + val.zplswt
          }
          that.detailList.area = val.area
          that.detailList.areaid = val.areaid
          that.detailList.id = val.id
          that.detailList.zt = val.zt
          that.yydate = val.yyrq
          that.value1 = ''
          that.value2 = ''
          that.date = val.yyrq
          clearInterval(that.timer)
          that.alls = []
          that.table()
          that.alternatives()
          //获取律师图片
          request({
            url: "/lawyer/zyz",
            method: "get",
            params: {
              zyzh: val.zyzh,
              date: Date.parse(new Date())
            }
          })
            .then(function (response) {
              if (response.data.code === 20000) {
                that.detailList.photo = response.data.photo
              }
            })
            .catch(function (error) {
              console.log(error, "报错信息");
            });
          //获取辅助律师律师图片，首先判断有没有辅助律师
          if (val.zyzh2 === "" || val.zyzh2 === null) {
            that.detailList.photo2 = ''
          } else {
            request({
              url: "/lawyer/zyz",
              method: "get",
              params: {
                zyzh: val.zyzh2,
                date: Date.parse(new Date())
              }
            })
              .then(function (response) {
                if (response.data.code === 20000) {
                  that.detailList.photo2 = response.data.photo
                }
              })
              .catch(function (error) {
                console.log(error, "报错信息");
              });
          }
        } else if (val.regular === 1) {
          that.buzixuanhidden = true
          that.zixuanhidden = false
          that.dialog = true
          that.prisonid = val.prisonid
          that.areaid = val.areaid
          that.yyrq = val.yyrq
          that.hjs = val.room
          that.hjt = val.devicename
          that.hjsmc = val.room
          that.dizhi = val.address
          that.detailList.bzxrxm = val.bzxrxm
          that.detailList.bzxrbh = val.bzxrbh
          that.detailList.prison = val.prison
          that.detailList.lawyer = val.lawyer
          that.detailList.lawyer2 = val.lawyer2
          that.detailList.sfzmhm = val.sfzmhm
          that.detailList.lxdh = val.lxdh
          that.detailList.zyzh = val.zyzh
          that.detailList.zyjg = val.zyjg
          that.detailList.yxqx = val.yxqx
          that.detailList.reason = val.reason
          that.value3 = val.yysc
          that.detailList.jsx = val.jsx
          that.detailList.wts = val.wts
          that.detailList.jsx2 = val.jsx2
          that.detailList.wts2 = val.wts2
          //没有照片的就用暂无
          if (val.jcsm == '' || val.jcsm == null) {
            that.jcsmphoto = require("../../assets/zw.jpg")
          } else {
            that.jcsmphoto = that.imgUrl + '/' + val.jcsm
          }
          if (val.zplswt == '' || val.zplswt == null) {
            that.zplswtphoto = require("../../assets/zw.jpg")
          } else {
            that.zplswtphoto = that.imgUrl + '/' + val.zplswt
          }
          that.detailList.area = val.area
          that.detailList.areaid = val.areaid
          that.detailList.id = val.id
          that.detailList.zt = val.zt
          that.yydate = val.yyrq
          that.value1 = val.kssj.split(' ')[1]
          that.value2 = val.jssj.split(' ')[1]
          that.date = val.yyrq
          clearInterval(that.timer)
          that.alls = []
          that.table()
          //获取律师图片，首先判断有没有辅助律师
          request({
            url: "/lawyer/zyz",
            method: "get",
            params: {
              zyzh: val.zyzh,
              date: Date.parse(new Date())
            }
          })
            .then(function (response) {
              if (response.data.code === 20000) {
                that.detailList.photo = response.data.photo
              }
            })
            .catch(function (error) {
              console.log(error, "报错信息");
            });
          //获取辅助律师律师图片
          if (val.zyzh2 === "" || val.zyzh2 === null) {
            that.detailList.photo2 = ''
          } else {
            request({
              url: "/lawyer/zyz",
              method: "get",
              params: {
                zyzh: val.zyzh2,
                date: Date.parse(new Date())
              }
            })
              .then(function (response) {
                if (response.data.code === 20000) {
                  that.detailList.photo2 = response.data.photo
                }
              })
              .catch(function (error) {
                console.log(error, "报错信息");
              });
          }
        }
      },
      //点击批准
      ratify() {
        let that = this
        if (that.detailList.bzxrxm === '') {
          that.$message.error('请先选择予以批准的会见项！')
        } else if (that.value1 === '' || that.value2 === '') {
          that.$message.error('请选择预约时间段！')
        } else {
          //判断他的预约类型
          if (that.detailList.regular === 0) {
            request({
              url: "/appointment/check",
              method: "post",
              params: {
                jssj: that.value2,
                kssj: that.value1,
                step: that.value3,
                videoBh: that.videobh,
                json: {
                  bzxrxm: that.detailList.bzxrxm,
                  sfzmhm: that.detailList.sfzmhm,
                  zt: 1,
                  bhyy: '',
                  lxdh: that.detailList.lxdh,
                  id: that.detailList.id,
                  // deviceno: that.hjt,
                  // room: that.hjsmc,
                  // roombh: that.hjs
                }
              }
            })
              .then(function (response) {
                if (response.data.code === 20000) {
                  that.$message.success('批准成功')
                  that.alls = []
                  clearInterval(that.timer)
                  that.table()
                  that.getinfo()
                  that.detailList.bzxrxm = ''
                  that.detailList.bzxrbh = ''
                  that.detailList.prison = ''
                  that.detailList.lawyer = ''
                  that.detailList.sfzmhm = ''
                  that.detailList.lxdh = ''
                  that.detailList.zyzh = ''
                  that.detailList.zyjg = ''
                  that.detailList.yxqx = ''
                  that.detailList.reason = ''
                  that.value3 = ''
                  that.detailList.jsx = ''
                  that.detailList.wts = ''
                  that.detailList.jsx2 = ''
                  that.detailList.wts2 = ''
                  that.detailList.jcsm = ''
                  that.detailList.zplswt = ''
                  that.detailList.area = ''
                  that.detailList.areaid = ''
                  that.detailList.id = ''
                  that.detailList.zt = ''
                  that.yydate = ''
                  that.value1 = ''
                  that.value2 = ''
                  that.videobh = ''
                  that.hjt = ''
                  that.hjs = ''
                  that.jcsmphoto = ''
                  that.zplswtphoto = ''
                  that.detailList.photo = ''
                  that.detailList.photo2 = ''
                  that.kxhjs = []
                  that.kxhjt = []
                  that.dizhi = ''
                  that.prisonid = ''
                  that.areaid = ''
                  that.yyrq = ''
                  that.currentIndex = null
                  that.dialog = false
                }
              })
              .catch(function (error) {
                console.log(error, "报错信息");
              });
          } else if (that.detailList.regular === 1) {
            request({
              url: "/appointment/check/regular",
              method: "post",
              params: {
                json: {
                  id: that.detailList.id,
                  zt: 1,
                  bhyy: ''
                }
              }
            })
              .then(function (response) {
                if (response.data.code === 20000) {
                  that.$message.success('批准成功')
                  that.alls = []
                  clearInterval(that.timer)
                  that.table()
                  that.getinfo()
                  that.detailList.bzxrxm = ''
                  that.detailList.bzxrbh = ''
                  that.detailList.prison = ''
                  that.detailList.lawyer = ''
                  that.detailList.sfzmhm = ''
                  that.detailList.lxdh = ''
                  that.detailList.zyzh = ''
                  that.detailList.zyjg = ''
                  that.detailList.yxqx = ''
                  that.detailList.reason = ''
                  that.value3 = ''
                  that.detailList.jsx = ''
                  that.detailList.wts = ''
                  that.detailList.jsx2 = ''
                  that.detailList.wts2 = ''
                  that.detailList.jcsm = ''
                  that.detailList.zplswt = ''
                  that.detailList.area = ''
                  that.detailList.areaid = ''
                  that.detailList.id = ''
                  that.detailList.zt = ''
                  that.yydate = ''
                  that.value1 = ''
                  that.value2 = ''
                  that.videobh = ''
                  that.hjt = ''
                  that.hjs = ''
                  that.jcsmphoto = ''
                  that.zplswtphoto = ''
                  that.detailList.photo = ''
                  that.detailList.photo2 = ''
                  that.kxhjs = []
                  that.kxhjt = []
                  that.dizhi = ''
                  that.prisonid = ''
                  that.areaid = ''
                  that.yyrq = ''
                  that.dialog = false
                }
              })
              .catch(function (error) {
                console.log(error, "报错信息");
              });
          }
        }
      },
      //点击不予批准时触发
      inputhidden() {
        let that = this
        if (that.detailList.bzxrxm === '') {
          that.$message.error('请先选择不予批准的会见项')
        } else {
          that.reason = ''
          that.inputHidden = true
        }
      },
      //确定不予批准
      queding() {
        let that = this
        if (that.reason === '') {
          that.$message.error('请填写不予批准理由')
        } else if (that.detailList.zt === 2) {
          that.$message.error('此会见已驳回')
        } else if (that.reason.length > 40) {
          that.$message.error('理由不能超过40个字')
        } else {
          //判断预约类型
          if (that.detailList.regular === 0) {
            request({
              url: "/appointment/check",
              method: "post",
              params: {
                jssj: that.value2,
                kssj: that.value1,
                step: that.value3,
                videoBh: that.videobh,
                json: {
                  bzxrxm: that.detailList.bzxrxm,
                  sfzmhm: that.detailList.sfzmhm,
                  zt: 2,
                  bhyy: that.reason,
                  lxdh: that.detailList.lxdh,
                  id: that.detailList.id,
                  deviceno: that.hjt,
                  room: that.hjsmc,
                  roombh: that.hjs
                }
              }
            })
              .then(function (response) {
                if (response.data.code === 20000) {
                  that.$message.success('不予批准')
                  that.alls = []
                  clearInterval(that.timer)
                  that.table()
                  that.getinfo()
                  that.detailList.bzxrxm = ''
                  that.detailList.bzxrbh = ''
                  that.detailList.prison = ''
                  that.detailList.lawyer = ''
                  that.detailList.sfzmhm = ''
                  that.detailList.lxdh = ''
                  that.detailList.zyzh = ''
                  that.detailList.zyjg = ''
                  that.detailList.yxqx = ''
                  that.detailList.reason = ''
                  that.value3 = ''
                  that.detailList.jsx = ''
                  that.detailList.wts = ''
                  that.detailList.jsx2 = ''
                  that.detailList.wts2 = ''
                  that.detailList.jcsm = ''
                  that.detailList.zplswt = ''
                  that.detailList.area = ''
                  that.detailList.areaid = ''
                  that.detailList.id = ''
                  that.detailList.zt = ''
                  that.yydate = ''
                  that.value1 = ''
                  that.value2 = ''
                  that.videobh = ''
                  that.hjt = ''
                  that.hjs = ''
                  that.detailList.photo = ''
                  that.detailList.photo2 = ''
                  that.jcsmphoto = ''
                  that.zplswtphoto = ''
                  that.reason = ''
                  that.kxhjs = []
                  that.kxhjt = []
                  that.dizhi = ''
                  that.prisonid = ''
                  that.areaid = ''
                  that.yyrq = ''
                  that.dialog = false
                  that.inputHidden = !that.inputHidden
                }
              })
              .catch(function (error) {
                console.log(error, "报错信息");
              });
          } else if (that.detailList.regular === 1) {
            request({
              url: "/appointment/check/regular",
              method: "post",
              params: {
                json: {
                  id: that.detailList.id,
                  zt: 2,
                  bhyy: that.reason
                }
              }
            })
              .then(function (response) {
                if (response.data.code === 20000) {
                  that.$message.success('不予批准')
                  that.alls = []
                  clearInterval(that.timer)
                  that.table()
                  that.getinfo()
                  that.detailList.bzxrxm = ''
                  that.detailList.bzxrbh = ''
                  that.detailList.prison = ''
                  that.detailList.lawyer = ''
                  that.detailList.sfzmhm = ''
                  that.detailList.lxdh = ''
                  that.detailList.zyzh = ''
                  that.detailList.zyjg = ''
                  that.detailList.yxqx = ''
                  that.detailList.reason = ''
                  that.value3 = ''
                  that.detailList.jsx = ''
                  that.detailList.wts = ''
                  that.detailList.jsx2 = ''
                  that.detailList.wts2 = ''
                  that.detailList.jcsm = ''
                  that.detailList.zplswt = ''
                  that.detailList.area = ''
                  that.detailList.areaid = ''
                  that.detailList.id = ''
                  that.detailList.zt = ''
                  that.yydate = ''
                  that.value1 = ''
                  that.value2 = ''
                  that.videobh = ''
                  that.hjt = ''
                  that.hjs = ''
                  that.detailList.photo = ''
                  that.detailList.photo2 = ''
                  that.jcsmphoto = ''
                  that.zplswtphoto = ''
                  that.reason = ''
                  that.kxhjs = []
                  that.kxhjt = []
                  that.dizhi = ''
                  that.prisonid = ''
                  that.areaid = ''
                  that.yyrq = ''
                  that.dialog = false
                  that.inputHidden = !that.inputHidden
                }
              })
              .catch(function (error) {
                console.log(error, "报错信息");
              });
          }
        }
      },
      //全部预约，没有用到
      all() {
        $('.classify1').css('backgroundColor', '#EE7A7D')
        $('.classify2').css('backgroundColor', '#409EFF')
        $('.classify3').css('backgroundColor', '#409EFF')
        $('.classify4').css('backgroundColor', '#409EFF')
        $('.classify5').css('backgroundColor', '#409EFF')
        $('.classify6').css('backgroundColor', '#409EFF')
        $('.classify7').css('backgroundColor', '#409EFF')
        let that = this
        that.currentPage = 1
        that.zt = ''
        that.bj = ''
        that.getinfo()
      },
      //申请中
      apply() {
        $('.classify1').css('backgroundColor', '#EE7A7D')
        $('.classify2').css('backgroundColor', '#409EFF')
        $('.classify3').css('backgroundColor', '#409EFF')
        $('.classify4').css('backgroundColor', '#409EFF')
        $('.classify5').css('backgroundColor', '#409EFF')
        $('.classify6').css('backgroundColor', '#409EFF')
        let that = this
        that.currentPage = 1
        that.zt = 0
        that.bj = ''
        that.list = []
        that.show1 = true
        that.show2 = false
        that.show3 = false
        that.show4 = false
        that.show5 = false
        that.show6 = false
        that.chaxunhidden = true
        that.getinfo()
      },
      //已通过
      pass() {
        $('.classify1').css('backgroundColor', '#409EFF')
        $('.classify2').css('backgroundColor', '#EE7A7D')
        $('.classify3').css('backgroundColor', '#409EFF')
        $('.classify4').css('backgroundColor', '#409EFF')
        $('.classify5').css('backgroundColor', '#409EFF')
        $('.classify6').css('backgroundColor', '#409EFF')
        let that = this
        that.currentPage = 1
        that.zt = 1
        that.bj = ''
        that.list = []
        that.show1 = false
        that.show2 = true
        that.show3 = false
        that.show4 = false
        that.show5 = false
        that.show6 = false
        that.chaxunhidden = true
        that.getinfo()
      },
      //未开始
      passnostart() {
        $('.classify1').css('backgroundColor', '#409EFF')
        $('.classify2').css('backgroundColor', '#409EFF')
        $('.classify3').css('backgroundColor', '#EE7A7D')
        $('.classify4').css('backgroundColor', '#409EFF')
        $('.classify5').css('backgroundColor', '#409EFF')
        $('.classify6').css('backgroundColor', '#409EFF')
        let that = this
        that.currentPage = 1
        that.zt = 1
        that.bj = 0
        that.list = []
        that.show1 = false
        that.show2 = false
        that.show3 = true
        that.show4 = false
        that.show5 = false
        that.show6 = false
        that.chaxunhidden = true
        that.getinfo()
      },
      //已结束
      passend() {
        $('.classify1').css('backgroundColor', '#409EFF')
        $('.classify2').css('backgroundColor', '#409EFF')
        $('.classify3').css('backgroundColor', '#409EFF')
        $('.classify4').css('backgroundColor', '#EE7A7D')
        $('.classify5').css('backgroundColor', '#409EFF')
        $('.classify6').css('backgroundColor', '#409EFF')
        let that = this
        that.currentPage = 1
        that.zt = 1
        that.bj = 2
        that.list = []
        that.show1 = false
        that.show2 = false
        that.show3 = false
        that.show4 = true
        that.show5 = false
        that.show6 = false
        that.chaxunhidden = true
        that.getinfo()
      },
      //已驳回
      reject() {
        $('.classify1').css('backgroundColor', '#409EFF')
        $('.classify2').css('backgroundColor', '#409EFF')
        $('.classify3').css('backgroundColor', '#409EFF')
        $('.classify4').css('backgroundColor', '#409EFF')
        $('.classify5').css('backgroundColor', '#EE7A7D')
        $('.classify6').css('backgroundColor', '#409EFF')
        let that = this
        that.currentPage = 1
        that.zt = 2
        that.bj = ''
        that.list = []
        that.show1 = false
        that.show2 = false
        that.show3 = false
        that.show4 = false
        that.show5 = true
        that.show6 = false
        that.chaxunhidden = true
        that.getinfo()
      },
      //取消预约
      cancel() {
        $('.classify1').css('backgroundColor', '#409EFF')
        $('.classify2').css('backgroundColor', '#409EFF')
        $('.classify3').css('backgroundColor', '#409EFF')
        $('.classify4').css('backgroundColor', '#409EFF')
        $('.classify5').css('backgroundColor', '#409EFF')
        $('.classify6').css('backgroundColor', '#EE7A7D')
        let that = this
        that.list = []
        that.show1 = false
        that.show2 = false
        that.show3 = false
        that.show4 = false
        that.show5 = false
        that.show6 = true
        that.chaxunhidden = false
        that.cancelyuyue()
      },
      //获取会见室名称
      handleChange(val) {
        let that = this
        let obj = {} //先创建一个空对象，用来保存数据
        obj = that.kxhjs.find((item) => { //这里的数据就是上面遍历的数据源
          return item[1] === val //筛选出匹配数据，放到obj中
        })
        //用什么取什么
        that.hjsmc = obj[0]
        that.videobh = obj[2]
      },
      //传递律师和犯人状态，没用到
      prepare(row) {
        let that = this;
        request({
          url: `/appointment/arrive/${row.id}`,
          method: "post",
        })
          .then(function (response) {
            if (response.data.code === 20000) {
              that.$message.success('已通知准备会见！')
            }
          })
          .catch(function (error) {
            console.log(error, "报错信息");
          });
      },
      //表格中查看监控事件
      video(row) {
        if (row.zt != 1) {
          this.$message.error('未审核通过，无法查看监控')
        } else {
          if (row.bj === 1) {
            this.$router.push(`/video/${row.id}`);
          } else if (row.bj === 3) {
            this.$router.push(`/video/${row.id}`);
          } else {
            this.$message.error('未在会见，无监控')
          }
        }
      },
      //会见室中查看监控事件
      videos(item) {
        for (let i = 0; i < item.meets.length; i++) {
          if (item.meets[i].state === 1 || item.meets[i].state === 3) {
            this.$router.push(`/video/${item.meets[i].id}`);
            console.log(item.meets[i].id)
          }
        }
      },
      //警告信息获取
      warn() {
        let that = this;
        that.timer3 = setInterval(function () {
          request({
            url: "/appointment/warninfo",
            method: "post",
            data: {
              date: Date.parse(new Date())
            }
          })
            .then(function (response) {
              if (response.data.code === 20000) {
                that.warnlist = response.data.data
                that.warns = response.data.rows
              }
            })
            .catch(function (error) {
              console.log(error, "报错信息");
            });
        }, 120000)
      },
      //警告信息滚动
      scroll() {
        var that = this
        this.$nextTick(() => {
          let reset = 1
          that.timer1 = setInterval(() => {
            if (that.warns >= 2) {
              reset += 1
              $('.sign5').animate({
                marginTop: '-=30px'
              }, 3000, function () {
                if (reset > parseInt(that.warns)) {
                  reset = 1
                  $('.sign5').css('margin-top', '0%')
                }
              })
            }
          }, 4000)
        })
      },
      //律师未审核数量
      lawyernumber() {
        let that = this
        //获取律师数据
        request({
          url: "/lawyer/pageFs",
          method: "get",
          params: {}
        })
          .then(function (response) {
            if (response.data.code === 20000) {
              that.lssl = response.data.wait
            }
          })
          .catch(function (error) {
            console.log(error, "报错信息");
          });
        //定时器实时获取数据
        that.timer4 = setInterval(function () {
          request({
            url: "/lawyer/pageFs",
            method: "get",
            params: {}
          })
            .then(function (response) {
              if (response.data.code === 20000) {
                that.lssl = response.data.wait
              }
            })
            .catch(function (error) {
              console.log(error, "报错信息");
            });
        }, 300000)
      },
      //下载报表弹出dialog
      download() {
        var that = this;
        that.delsure = true;
      },
      //下载确定,打包别忘记改地址
      deltrue() {
        if (this.valuetime.length < 2) {
          this.$message.error('请选好日期！')
        } else {
          //谷家提本地下载
          // window.open(`http://192.168.8.92:8099/appointment/download/plan?date1=${this.valuetime[0]}&date2=${this.valuetime[1]}`)
          //呼和浩特下载
          // window.open(`https://www.vlawyer.net/server/appointment/download/plan?date1=${this.valuetime[0]}&date2=${this.valuetime[1]}`)
          //济南下载
          window.open(`http://49.4.68.8:80/appointment/download/plan?date1=${this.valuetime[0]}&date2=${this.valuetime[1]}`)
          this.delsure = false;
          this.valuetime = []
        }
      },
      //关闭弹框
      closeDialog() {
        let that = this
        that.dialog = false
        that.alls = []
        clearInterval(that.timer)
        that.table()
        that.getinfo()
        that.dialogVisible = false
      },
      //远程开门
      open(row) {
        let that = this
        request({
          url: `/device/openDoor/${row.deviceno}`,
          method: 'post',
        })
          .then(function (response) {
            if (response.data.code === 20000) {
              that.$message({
                message: '远程开门成功',
                type: 'success'
              })
            }
          })
          .catch(function (error) {
            console.log(error, '报错信息')
          })
      },
      //查询所有会见厅
      allroom() {
        let that = this
        request({
          url: '/appointment/device/all',
          method: 'get',
        })
          .then(function (response) {
            if (response.data.code === 20000) {
              that.allmeets = response.data.data
            }
          })
          .catch(function (error) {
            console.log(error, '报错信息')
          })
      },
      //显示明文会见亭地址
      handleChange1(val) {
        let that = this
        let obj = {} //创建一个空对象,用来保存数据
        obj = that.kxhjt.find((item) => { //这里的List就是上面遍历的数据源
          for (let i = 0; i < that.kxhjt.length; i++) {
            // console.log(item[i])
            return item[i] === val //筛选出匹配数据
          }
        })
        //用谁拿谁
        that.dizhi = obj[1]
      },
      //显示隐藏排版地址
      xspbdz() {
        let that = this
        if (that.wenzistate) {
          that.pbdz = !that.pbdz
          that.wenzistate = false
          that.wenzi = "隐藏会见亭"
        } else if (!that.wenzistate) {
          that.pbdz = !that.pbdz
          that.wenzistate = true
          that.wenzi = "显示会见亭"
        }
      },
      //没有数据显示无,el-table的
      stateFormat(row, column) {
        if (row.lawyer2 === null) {
          return '无'
        } else {
          return row.lawyer2
        }
      },
      //限制输入特殊字符
      btKeyUp(e) {
        e.target.value = e.target.value.replace(/[。.{}￥★^_^&√※【】]/g, "");
      },
      //空闲会见室需求,点击查询占用会见室
      zhanyong() {
        let that = this
        that.dialogVisible = true
        that.ransetable()
      },
      //染色
      ransetable(index) {
        let that = this
        request({
          url: "/room/all",
          method: "get",
          params: {
            yyrq: that.formInline.shijian
          }
        })
          .then(function (response) {
            if (response.data.code === 20000) {
              that.allrooms1 = response.data.data
              setTimeout(function () {
                //循环有几个监室
                for (let i = 0; i < that.allrooms1.length; i++) {
                  //循环监室内meets的长度
                  for (let j = 0; j < that.allrooms1[i].meets.length; j++) {
                    // 把每个监室的时间记下来
                    let color0 = that.allrooms1[i].meets[j].color[0];
                    let color1 = that.allrooms1[i].meets[j].color[1];
                    if (color0 + color1 > 144) {
                      for (let k = color0; k <= 144; k++) {
                        //上色
                        $(`.table-table1:eq(${i})>.biao>div:eq(${k})`).css('backgroundColor', 'red')
                        // $(`.table-table:eq(${i})>.biao>div:eq(${k})`).addClass('cur')
                      }
                      for (let m = 0; m < (color0 + color1 - 144); m++) {
                        //上色
                        $(`.table-table1:eq(${i})>.biao>div:eq(${m})`).css('backgroundColor', 'red')
                        // $(`.table-table:eq(${i})>.biao>div:eq(${k})`).addClass('cur')
                      }
                    } else {
                      for (let m = color0; m < color1 + color0; m++) {
                        //上色 给第color0 + m个div上色
                        $(`.table-table1:eq(${i})>.biao>div:eq(${m})`).css('backgroundColor', 'red')
                        // $(`.table-table:eq(${i})>.biao>div:eq(${k})`).addClass('cur')
                      }
                    }
                  }
                }
              }, 100)
            }
          })
          .catch(function (error) {
            console.log(error, "报错信息");
          });
        request({
          url: "/room/all",
          method: "get",
          params: {
            yyrq: that.formInline.shijian2
          }
        })
          .then(function (response) {
            if (response.data.code === 20000) {
              that.allrooms2 = response.data.data
              setTimeout(function () {
                //循环有几个监室
                for (let i = 0; i < that.allrooms2.length; i++) {
                  //循环监室内meets的长度
                  for (let j = 0; j < that.allrooms2[i].meets.length; j++) {
                    // 把每个监室的时间记下来
                    let color0 = that.allrooms2[i].meets[j].color[0];
                    let color1 = that.allrooms2[i].meets[j].color[1];
                    if (color0 + color1 > 144) {
                      for (let k = color0; k <= 144; k++) {
                        //上色
                        $(`.table-table2:eq(${i})>.biao>div:eq(${k})`).css('backgroundColor', 'red')
                        // $(`.table-table:eq(${i})>.biao>div:eq(${k})`).addClass('cur')
                      }
                      for (let m = 0; m < (color0 + color1 - 144); m++) {
                        //上色
                        $(`.table-table2:eq(${i})>.biao>div:eq(${m})`).css('backgroundColor', 'red')
                        // $(`.table-table:eq(${i})>.biao>div:eq(${k})`).addClass('cur')
                      }
                    } else {
                      for (let m = color0; m < color1 + color0; m++) {
                        //上色 给第color0 + m个div上色
                        $(`.table-table2:eq(${i})>.biao>div:eq(${m})`).css('backgroundColor', 'red')
                        // $(`.table-table:eq(${i})>.biao>div:eq(${k})`).addClass('cur')
                      }
                    }
                  }
                }
              }, 100)
            }
          })
          .catch(function (error) {
            console.log(error, "报错信息");
          });
        request({
          url: "/room/all",
          method: "get",
          params: {
            yyrq: that.formInline.shijian3
          }
        })
          .then(function (response) {
            if (response.data.code === 20000) {
              that.allrooms3 = response.data.data
              setTimeout(function () {
                //循环有几个监室
                for (let i = 0; i < that.allrooms3.length; i++) {
                  //循环监室内meets的长度
                  for (let j = 0; j < that.allrooms3[i].meets.length; j++) {
                    // 把每个监室的时间记下来
                    let color0 = that.allrooms3[i].meets[j].color[0];
                    let color1 = that.allrooms3[i].meets[j].color[1];
                    if (color0 + color1 > 144) {
                      for (let k = color0; k <= 144; k++) {
                        //上色
                        $(`.table-table3:eq(${i})>.biao>div:eq(${k})`).css('backgroundColor', 'red')
                        // $(`.table-table:eq(${i})>.biao>div:eq(${k})`).addClass('cur')
                      }
                      for (let m = 0; m < (color0 + color1 - 144); m++) {
                        //上色
                        $(`.table-table3:eq(${i})>.biao>div:eq(${m})`).css('backgroundColor', 'red')
                        // $(`.table-table:eq(${i})>.biao>div:eq(${k})`).addClass('cur')
                      }
                    } else {
                      for (let m = color0; m < color1 + color0; m++) {
                        //上色 给第color0 + m个div上色
                        $(`.table-table3:eq(${i})>.biao>div:eq(${m})`).css('backgroundColor', 'red')
                        // $(`.table-table:eq(${i})>.biao>div:eq(${k})`).addClass('cur')
                      }
                    }
                  }
                }
              }, 100)
            }
          })
          .catch(function (error) {
            console.log(error, "报错信息");
          });
        request({
          url: "/room/all",
          method: "get",
          params: {
            yyrq: that.formInline.shijian4
          }
        })
          .then(function (response) {
            if (response.data.code === 20000) {
              that.allrooms4 = response.data.data
              setTimeout(function () {
                //循环有几个监室
                for (let i = 0; i < that.allrooms4.length; i++) {
                  //循环监室内meets的长度
                  for (let j = 0; j < that.allrooms4[i].meets.length; j++) {
                    // 把每个监室的时间记下来
                    let color0 = that.allrooms4[i].meets[j].color[0];
                    let color1 = that.allrooms4[i].meets[j].color[1];
                    if (color0 + color1 > 144) {
                      for (let k = color0; k <= 144; k++) {
                        //上色
                        $(`.table-table4:eq(${i})>.biao>div:eq(${k})`).css('backgroundColor', 'red')
                        // $(`.table-table:eq(${i})>.biao>div:eq(${k})`).addClass('cur')
                      }
                      for (let m = 0; m < (color0 + color1 - 144); m++) {
                        //上色
                        $(`.table-table4:eq(${i})>.biao>div:eq(${m})`).css('backgroundColor', 'red')
                        // $(`.table-table:eq(${i})>.biao>div:eq(${k})`).addClass('cur')
                      }
                    } else {
                      for (let m = color0; m < color1 + color0; m++) {
                        //上色 给第color0 + m个div上色
                        $(`.table-table4:eq(${i})>.biao>div:eq(${m})`).css('backgroundColor', 'red')
                        // $(`.table-table:eq(${i})>.biao>div:eq(${k})`).addClass('cur')
                      }
                    }
                  }
                }
              }, 100)
            }
          })
          .catch(function (error) {
            console.log(error, "报错信息");
          });
        request({
          url: "/room/all",
          method: "get",
          params: {
            yyrq: that.formInline.shijian5
          }
        })
          .then(function (response) {
            if (response.data.code === 20000) {
              that.allrooms5 = response.data.data
              setTimeout(function () {
                //循环有几个监室
                for (let i = 0; i < that.allrooms5.length; i++) {
                  //循环监室内meets的长度
                  for (let j = 0; j < that.allrooms5[i].meets.length; j++) {
                    // 把每个监室的时间记下来
                    let color0 = that.allrooms5[i].meets[j].color[0];
                    let color1 = that.allrooms5[i].meets[j].color[1];
                    if (color0 + color1 > 144) {
                      for (let k = color0; k <= 144; k++) {
                        //上色
                        $(`.table-table5:eq(${i})>.biao>div:eq(${k})`).css('backgroundColor', 'red')
                        // $(`.table-table:eq(${i})>.biao>div:eq(${k})`).addClass('cur')
                      }
                      for (let m = 0; m < (color0 + color1 - 144); m++) {
                        //上色
                        $(`.table-table5:eq(${i})>.biao>div:eq(${m})`).css('backgroundColor', 'red')
                        // $(`.table-table:eq(${i})>.biao>div:eq(${k})`).addClass('cur')
                      }
                    } else {
                      for (let m = color0; m < color1 + color0; m++) {
                        //上色 给第color0 + m个div上色
                        $(`.table-table5:eq(${i})>.biao>div:eq(${m})`).css('backgroundColor', 'red')
                        // $(`.table-table:eq(${i})>.biao>div:eq(${k})`).addClass('cur')
                      }
                    }
                  }
                }
              }, 100)
            }
          })
          .catch(function (error) {
            console.log(error, "报错信息");
          });
        request({
          url: "/room/all",
          method: "get",
          params: {
            yyrq: that.formInline.shijian6
          }
        })
          .then(function (response) {
            if (response.data.code === 20000) {
              that.allrooms6 = response.data.data
              setTimeout(function () {
                //循环有几个监室
                for (let i = 0; i < that.allrooms6.length; i++) {
                  //循环监室内meets的长度
                  for (let j = 0; j < that.allrooms6[i].meets.length; j++) {
                    // 把每个监室的时间记下来
                    let color0 = that.allrooms6[i].meets[j].color[0];
                    let color1 = that.allrooms6[i].meets[j].color[1];
                    if (color0 + color1 > 144) {
                      for (let k = color0; k <= 144; k++) {
                        //上色
                        $(`.table-table6:eq(${i})>.biao>div:eq(${k})`).css('backgroundColor', 'red')
                        // $(`.table-table:eq(${i})>.biao>div:eq(${k})`).addClass('cur')
                      }
                      for (let m = 0; m < (color0 + color1 - 144); m++) {
                        //上色
                        $(`.table-table6:eq(${i})>.biao>div:eq(${m})`).css('backgroundColor', 'red')
                        // $(`.table-table:eq(${i})>.biao>div:eq(${k})`).addClass('cur')
                      }
                    } else {
                      for (let m = color0; m < color1 + color0; m++) {
                        //上色 给第color0 + m个div上色
                        $(`.table-table6:eq(${i})>.biao>div:eq(${m})`).css('backgroundColor', 'red')
                        // $(`.table-table:eq(${i})>.biao>div:eq(${k})`).addClass('cur')
                      }
                    }
                  }
                }
              }, 100)
            }
          })
          .catch(function (error) {
            console.log(error, "报错信息");
          });
        request({
          url: "/room/all",
          method: "get",
          params: {
            yyrq: that.formInline.shijian7
          }
        })
          .then(function (response) {
            if (response.data.code === 20000) {
              that.allrooms7 = response.data.data
              setTimeout(function () {
                //循环有几个监室
                for (let i = 0; i < that.allrooms7.length; i++) {
                  //循环监室内meets的长度
                  for (let j = 0; j < that.allrooms7[i].meets.length; j++) {
                    // 把每个监室的时间记下来
                    let color0 = that.allrooms7[i].meets[j].color[0];
                    let color1 = that.allrooms7[i].meets[j].color[1];
                    if (color0 + color1 > 144) {
                      for (let k = color0; k <= 144; k++) {
                        //上色
                        $(`.table-table7:eq(${i})>.biao>div:eq(${k})`).css('backgroundColor', 'red')
                        // $(`.table-table:eq(${i})>.biao>div:eq(${k})`).addClass('cur')
                      }
                      for (let m = 0; m < (color0 + color1 - 144); m++) {
                        //上色
                        $(`.table-table7:eq(${i})>.biao>div:eq(${m})`).css('backgroundColor', 'red')
                        // $(`.table-table:eq(${i})>.biao>div:eq(${k})`).addClass('cur')
                      }
                    } else {
                      for (let m = color0; m < color1 + color0; m++) {
                        //上色 给第color0 + m个div上色
                        $(`.table-table7:eq(${i})>.biao>div:eq(${m})`).css('backgroundColor', 'red')
                        // $(`.table-table:eq(${i})>.biao>div:eq(${k})`).addClass('cur')
                      }
                    }
                  }
                }
              }, 100)
            }
          })
          .catch(function (error) {
            console.log(error, "报错信息");
          });
      },
      //按日期染色查询
      onSubmit() {
        $(".biao>div").css('backgroundColor', 'white')
        this.ransetable()
        this.huahuo = false
      },
      //空闲会见室划过事件,别看了,难受
      chooseCoat(e, index) {
        let that = this;
        that.huahuo = true;
        that.hjianshixx = '';
        that.sjian = ''
        that.hjianshixx = e.path[2].innerText
        for (let i = 0; i < that.allrooms1.length; i++) {
          let hjs = that.allrooms1[i].room;
          if (that.hjianshixx == hjs) {
            let dyu = that.allrooms1[i].meets
            for (let a = 0; a < dyu.length; a++) {
              let color0 = that.allrooms1[i].meets[a].color[0];
              let color1 = that.allrooms1[i].meets[a].color[1];
              if (color0 + color1 <= 144) {
                let color2 = color0 + color1;
                for (let j = color0; j < color2; j++) {
                  if (index == j) {
                    that.sjian = that.allrooms1[i].meets[a].time;
                  }
                }
              } else if (color0 + color1 > 144) {
                let color3 = 144 - color0
                let color4 = color0 + color1 - 144
                for (let m = color0; m < color0 + color3; m++) {
                  if (index == m) {
                    that.sjian = that.allrooms1[i].meets[a].time;
                  }
                }
                for (let n = 0; n < color4; n++) {
                  if (index == n) {
                    that.sjian = that.allrooms1[i].meets[a].time;
                  }
                }
              }
            }
          }
        }
      },
      chooseCoat2(e, index) {
        let that = this;
        that.huahuo2 = true;
        that.hjianshixx2 = '';
        that.sjian2 = ''
        that.hjianshixx2 = e.path[2].innerText
        for (let i = 0; i < that.allrooms2.length; i++) {
          let hjs = that.allrooms2[i].room;
          if (that.hjianshixx2 == hjs) {
            let dyu = that.allrooms2[i].meets
            for (let a = 0; a < dyu.length; a++) {
              let color0 = that.allrooms2[i].meets[a].color[0];
              let color1 = that.allrooms2[i].meets[a].color[1];
              if (color0 + color1 <= 144) {
                let color2 = color0 + color1;
                for (let j = color0; j < color2; j++) {
                  if (index == j) {
                    that.sjian2 = that.allrooms2[i].meets[a].time;
                  }
                }
              } else if (color0 + color1 > 144) {
                let color3 = 144 - color0
                let color4 = color0 + color1 - 144
                for (let m = color0; m < color0 + color3; m++) {
                  if (index == m) {
                    that.sjian2 = that.allrooms2[i].meets[a].time;
                  }
                }
                for (let n = 0; n < color4; n++) {
                  if (index == n) {
                    that.sjian2 = that.allrooms2[i].meets[a].time;
                  }
                }
              }
            }
          }
        }
      },
      chooseCoat3(e, index) {
        let that = this;
        that.huahuo3 = true;
        that.hjianshixx3 = '';
        that.sjian3 = ''
        that.hjianshixx3 = e.path[2].innerText
        for (let i = 0; i < that.allrooms3.length; i++) {
          let hjs = that.allrooms3[i].room;
          if (that.hjianshixx3 == hjs) {
            let dyu = that.allrooms3[i].meets
            for (let a = 0; a < dyu.length; a++) {
              let color0 = that.allrooms3[i].meets[a].color[0];
              let color1 = that.allrooms3[i].meets[a].color[1];
              if (color0 + color1 <= 144) {
                let color2 = color0 + color1;
                for (let j = color0; j < color2; j++) {
                  if (index == j) {
                    that.sjian3 = that.allrooms3[i].meets[a].time;
                  }
                }
              } else if (color0 + color1 > 144) {
                let color3 = 144 - color0
                let color4 = color0 + color1 - 144
                for (let m = color0; m < color0 + color3; m++) {
                  if (index == m) {
                    that.sjian3 = that.allrooms3[i].meets[a].time;
                  }
                }
                for (let n = 0; n < color4; n++) {
                  if (index == n) {
                    that.sjian3 = that.allrooms3[i].meets[a].time;
                  }
                }
              }
            }
          }
        }
      },
      chooseCoat4(e, index) {
        let that = this;
        that.huahuo4 = true;
        that.hjianshixx4 = '';
        that.sjian4 = ''
        that.hjianshixx4 = e.path[2].innerText
        for (let i = 0; i < that.allrooms4.length; i++) {
          let hjs = that.allrooms4[i].room;
          if (that.hjianshixx4 == hjs) {
            let dyu = that.allrooms4[i].meets
            for (let a = 0; a < dyu.length; a++) {
              let color0 = that.allrooms4[i].meets[a].color[0];
              let color1 = that.allrooms4[i].meets[a].color[1];
              if (color0 + color1 <= 144) {
                let color2 = color0 + color1;
                for (let j = color0; j < color2; j++) {
                  if (index == j) {
                    that.sjian4 = that.allrooms4[i].meets[a].time;
                  }
                }
              } else if (color0 + color1 > 144) {
                let color3 = 144 - color0
                let color4 = color0 + color1 - 144
                for (let m = color0; m < color0 + color3; m++) {
                  if (index == m) {
                    that.sjian4 = that.allrooms4[i].meets[a].time;
                  }
                }
                for (let n = 0; n < color4; n++) {
                  if (index == n) {
                    that.sjian4 = that.allrooms4[i].meets[a].time;
                  }
                }
              }
            }
          }
        }
      },
      chooseCoat5(e, index) {
        let that = this;
        that.huahuo5 = true;
        that.hjianshixx5 = '';
        that.sjian5 = ''
        that.hjianshixx5 = e.path[2].innerText
        for (let i = 0; i < that.allrooms5.length; i++) {
          let hjs = that.allrooms5[i].room;
          if (that.hjianshixx5 == hjs) {
            let dyu = that.allrooms5[i].meets
            for (let a = 0; a < dyu.length; a++) {
              let color0 = that.allrooms5[i].meets[a].color[0];
              let color1 = that.allrooms5[i].meets[a].color[1];
              if (color0 + color1 <= 144) {
                let color2 = color0 + color1;
                for (let j = color0; j < color2; j++) {
                  if (index == j) {
                    that.sjian5 = that.allrooms5[i].meets[a].time;
                  }
                }
              } else if (color0 + color1 > 144) {
                let color3 = 144 - color0
                let color4 = color0 + color1 - 144
                for (let m = color0; m < color0 + color3; m++) {
                  if (index == m) {
                    that.sjian5 = that.allrooms5[i].meets[a].time;
                  }
                }
                for (let n = 0; n < color4; n++) {
                  if (index == n) {
                    that.sjian5 = that.allrooms5[i].meets[a].time;
                  }
                }
              }
            }
          }
        }
      },
      chooseCoat6(e, index) {
        let that = this;
        that.huahuo6 = true;
        that.hjianshixx6 = '';
        that.sjian6 = ''
        that.hjianshixx6 = e.path[2].innerText
        for (let i = 0; i < that.allrooms6.length; i++) {
          let hjs = that.allrooms6[i].room;
          if (that.hjianshixx6 == hjs) {
            let dyu = that.allrooms6[i].meets
            for (let a = 0; a < dyu.length; a++) {
              let color0 = that.allrooms6[i].meets[a].color[0];
              let color1 = that.allrooms6[i].meets[a].color[1];
              if (color0 + color1 <= 144) {
                let color2 = color0 + color1;
                for (let j = color0; j < color2; j++) {
                  if (index == j) {
                    that.sjian6 = that.allrooms6[i].meets[a].time;
                  }
                }
              } else if (color0 + color1 > 144) {
                let color3 = 144 - color0
                let color4 = color0 + color1 - 144
                for (let m = color0; m < color0 + color3; m++) {
                  if (index == m) {
                    that.sjian6 = that.allrooms6[i].meets[a].time;
                  }
                }
                for (let n = 0; n < color4; n++) {
                  if (index == n) {
                    that.sjian6 = that.allrooms6[i].meets[a].time;
                  }
                }
              }
            }
          }
        }
      },
      chooseCoat7(e, index) {
        let that = this;
        that.huahuo7 = true;
        that.hjianshixx7 = '';
        that.sjian7 = ''
        that.hjianshixx7 = e.path[2].innerText
        for (let i = 0; i < that.allrooms7.length; i++) {
          let hjs = that.allrooms7[i].room;
          if (that.hjianshixx7 == hjs) {
            let dyu = that.allrooms7[i].meets
            for (let a = 0; a < dyu.length; a++) {
              let color0 = that.allrooms7[i].meets[a].color[0];
              let color1 = that.allrooms7[i].meets[a].color[1];
              if (color0 + color1 <= 144) {
                let color2 = color0 + color1;
                for (let j = color0; j < color2; j++) {
                  if (index == j) {
                    that.sjian7 = that.allrooms7[i].meets[a].time;
                  }
                }
              } else if (color0 + color1 > 144) {
                let color3 = 144 - color0
                let color4 = color0 + color1 - 144
                for (let m = color0; m < color0 + color3; m++) {
                  if (index == m) {
                    that.sjian7 = that.allrooms7[i].meets[a].time;
                  }
                }
                for (let n = 0; n < color4; n++) {
                  if (index == n) {
                    that.sjian7 = that.allrooms7[i].meets[a].time;
                  }
                }
              }
            }
          }
        }
      },
      //我服了,展示所有空闲时间段
      alternatives() {
        let that = this
        request({
          url: "/appointment/alternatives",
          method: "get",
          params: {
            prisonid: that.prisonid,
            areaid: that.areaid,
            yyrq: that.yyrq
          }
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
      //看守所选择时间
      chuanTime(i, item) {
        let that = this
        if (item.free === 0) {
          that.$message.error("此时间段无空闲会见亭！")
        } else if (item.free === 1) {
          that.currentIndex = i
          that.value1 = item.kssj
          that.value2 = item.jssj
          let aDate2 = that.value2.split(":") //结束时间
          let aDate1 = that.value1.split(":") //开始时间
          that.value3 = (parseInt(aDate2[0] - aDate1[0])) * 60 + (parseInt(aDate2[1] - aDate1[1]))
        }
      }
    },
    created() {
      //调用函数
      this.getinfo()
      this.table()
      this.lawyernumber()
      this.warn()
      this.scroll()
      this.allroom()
    },
    computed: {
      //当前时间，精确到天
      timeDefault() {
        var date = new Date();
        var s1 = date.getFullYear() + "-" + (date.getMonth() + 1).toString().padStart(2, '0') + "-" + (date.getDate().toString().padStart(2, '0'));
        return s1;
      },
      timeDefault2() {
        var date = new Date();
        var s1 = date.getFullYear() + "-" + (date.getMonth() + 1).toString().padStart(2, '0') + "-" + ((date.getDate() + 1).toString().padStart(2, '0'));
        return s1;
      },
      timeDefault3() {
        var date = new Date();
        var s1 = date.getFullYear() + "-" + (date.getMonth() + 1).toString().padStart(2, '0') + "-" + ((date.getDate() + 2).toString().padStart(2, '0'));
        return s1;
      },
      timeDefault4() {
        var date = new Date();
        var s1 = date.getFullYear() + "-" + (date.getMonth() + 1).toString().padStart(2, '0') + "-" + ((date.getDate() + 3).toString().padStart(2, '0'));
        return s1;
      },
      timeDefault5() {
        var date = new Date();
        var s1 = date.getFullYear() + "-" + (date.getMonth() + 1).toString().padStart(2, '0') + "-" + ((date.getDate() + 4).toString().padStart(2, '0'));
        return s1;
      },
      timeDefault6() {
        var date = new Date();
        var s1 = date.getFullYear() + "-" + (date.getMonth() + 1).toString().padStart(2, '0') + "-" + ((date.getDate() + 5).toString().padStart(2, '0'));
        return s1;
      },
      timeDefault7() {
        var date = new Date();
        var s1 = date.getFullYear() + "-" + (date.getMonth() + 1).toString().padStart(2, '0') + "-" + ((date.getDate() + 6).toString().padStart(2, '0'));
        return s1;
      },
    },
    watch: {
      dialogVisible(newVal, oldVal) {
        if (!newVal) {
          this.huahuo = false;
          this.hjianshixx = '';
          this.sjian = [];
        }
      }
    },
    updated() {
      // 重新布局
      // this.$refs.table.doLayout()
    },
    beforeDestroy() {
      //页面销毁前，清除定时器
      clearInterval(this.timer)
      clearInterval(this.timer1)
      clearInterval(this.timer3)
      clearInterval(this.timer4)
    },
    mounted() {
      //显示日期
      this.date = this.timeDefault;
      this.formInline.shijian = this.timeDefault;
      this.formInline.shijian2 = this.timeDefault2;
      this.formInline.shijian3 = this.timeDefault3;
      this.formInline.shijian4 = this.timeDefault4;
      this.formInline.shijian5 = this.timeDefault5;
      this.formInline.shijian6 = this.timeDefault6;
      this.formInline.shijian7 = this.timeDefault7;
    }
  }
</script>

<style scoped>
  .page-wrapper {
    width: 100%;
    height: 100%;
    background-color: #C0C8D5;
  }

  .detail {
    width: 100%;
    height: 100%;
    display: flex;
  }

  .left {
    border: 1px solid white;
    box-sizing: border-box;
    width: 350px;
    overflow-y: scroll;
    padding-top: 10px;
  }

  .left > .logo-wrapper {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .logo-wrapper > img {
    width: 100px;
  }

  .content {
    width: 90%;
    font-size: 12px;
    padding-left: 15%;
    box-sizing: border-box;
  }

  .content > div {
    display: flex;
    color: black;
    font-size: 13px;
  }

  .img {
    margin-top: 10px;
    box-sizing: border-box;
    width: 100%;
    display: flex;
    justify-content: space-around;
    align-items: center;
  }

  .img > div {
    width: 20%;
    height: 60%;
    opacity: 0.5;
    display: flex;
    align-items: center;
    flex-direction: column;
    color: red;
    font-size: 12px;
  }

  .btn {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
    margin-top: 10px;
  }

  .btn > .btn-btn {
    width: 40%;
    height: 40px;
    text-align: center;
    line-height: 40px;
    margin-bottom: 10px;
    cursor: pointer;
    border-radius: 5px;
  }

  .btn-btn-pizhun {
    background-color: #66B1FF;
    color: white;
  }

  .btn-btn-bupizhun {
    background-color: #EE7A7D;
    color: white;
  }

  .info {
    width: 100%;
    display: flex;
    justify-content: center;
    color: red;
    font-size: 20px;
  }

  .right {
    border: 1px solid white;
    box-sizing: border-box;
    height: 100%;
    width: calc(100% - 350px)
  }

  .right-top {
    width: 100%;
    height: 45%;
  }

  .right-top-title {
    font-size: 15px;
    color: #3E80BA;
  }

  .sign {
    display: flex;
    overflow-y: hidden;
  }

  .sign > div {
    margin-right: 20px
  }

  .sign1 {
    width: 60px;
    height: 30px;
    background-color: aqua;
    color: white;
    text-align: center;
    line-height: 30px;
    opacity: 0.8;
  }

  .sign2 {
    width: 60px;
    height: 30px;
    background-color: sandybrown;
    color: white;
    text-align: center;
    line-height: 30px;
    opacity: 0.8;
  }

  .sign3 {
    width: 60px;
    height: 30px;
    background-color: #3E80BA;
    color: white;
    text-align: center;
    line-height: 30px;
    opacity: 0.8;
  }

  .sign6 {
    width: 60px;
    height: 30px;
    background-color: blue;
    color: white;
    text-align: center;
    line-height: 30px;
    opacity: 0.8;
  }

  .sign4 {
    width: 60px;
    height: 30px;
    background-color: red;
    color: white;
    text-align: center;
    line-height: 30px;
    opacity: 0.8;
  }

  .sign5 {
    width: 250px;
    color: white;
    height: 30px;
    box-sizing: border-box;
    text-align: center;
    line-height: 30px;
    font-size: 20px;
  }

  .sign5 > .warning {
    background-color: red;
  }

  .table {
    width: 100%;
    background-color: white;
    overflow: hidden;
  }

  .table-title {
    width: 100%;
    height: 10%;
    display: flex;
    background-color: #43516C;
    color: white;
    border: 1px solid white;
    box-sizing: border-box;
  }

  .room {
    width: 100%;
    height: 300px;
    background-color: #C0C8D5;
    border-bottom: 1px solid white;
    overflow-y: auto;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    color: #FFFFFF;
  }

  .rooms {
    margin-top: 5px;
    width: 21%;
    height: 40%;
    background-color: #3E80BA;
    padding-left: 15px;
    box-sizing: border-box;
    overflow-y: auto;
    border-radius: 10px;
  }

  .table-title1 {
    width: 10%;
    height: 100%;
    text-align: center;
    box-sizing: border-box;
  }

  .table-title2 {
    width: 100%;
    height: 100%;
    text-align: center;
    box-sizing: border-box;
  }

  .table-date2 > div {
    flex-grow: 1;
    text-align: center;
  }

  .data > div {
    flex-grow: 1;
    writing-mode: vertical-lr;
    color: white;
  }

  .right-bottom {
    width: 100%;
    height: 50%;
  }

  .right-bottom-title {
    font-size: 15px;
    color: #3E80BA;
  }

  .classify {
    color: white;
    display: flex;
  }

  .classify > div {
    margin-right: 20px;
  }

  .classify > div > div {
    border-radius: 3px;
  }

  .classify1 {
    width: 60px;
    height: 30px;
    background-color: #EE7A7D;
    color: white;
    text-align: center;
    line-height: 30px;
    cursor: pointer;
  }

  .classify2 {
    width: 60px;
    height: 30px;
    background-color: #409EFF;
    color: white;
    text-align: center;
    line-height: 30px;
    cursor: pointer;
  }

  .classify3 {
    width: 60px;
    height: 30px;
    background-color: #409EFF;
    color: white;
    text-align: center;
    line-height: 30px;
    cursor: pointer;
  }

  .classify4 {
    width: 60px;
    height: 30px;
    background-color: #409EFF;
    color: white;
    text-align: center;
    line-height: 30px;
    cursor: pointer;
  }

  .classify5 {
    width: 60px;
    height: 30px;
    background-color: #409EFF;
    color: white;
    text-align: center;
    line-height: 30px;
    cursor: pointer;
  }

  .classify6 {
    width: 80px;
    height: 30px;
    background-color: #409EFF;
    color: white;
    text-align: center;
    line-height: 30px;
    cursor: pointer;
  }

  .el-pagination.is-background {
    color: #FFF;
    height: 30px;
  }

  .hide-scroll-bar::-webkit-scrollbar {
    display: none;
  }

  /* shabi */
  .demo-form-inline {
    white-space: nowrap;
    width: 100%;
  }

  .page-wrapper1 {
    display: flex;
    flex-direction: column;
  }

  .page-wrapper1 > .el-form {
    height: 60px;
    flex-shrink: 0;
  }

  .page-wrapper1 > .el-table {
    flex-grow: 1;
    overflow: auto;
  }

  .page-wrapper1 > .el-pagination {
    text-align: center;
    height: 50px;
    flex-shrink: 0;
  }

  .el-table--group::after, .el-table::before {
    /*background-color: white;*/
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

  .wrapper >>> .el-dialog__body {
    width: 100%;
    height: 100%;
    padding: 0
  }

  .dialog-wrapper {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .dialog-wrapper > * {
    padding: 20px;
    box-sizing: border-box;
  }

  .huijianshi {
    height: 50%;
  }

  .huijianshi-wrapper {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .huijianshi-tiaojiao {
    height: 15%;
  }

  .huijianshi-nr {
    height: 85%;
  }

  .huijianshi-nr-wrapper {
    width: 100%;
    height: 200px;
    display: flex;
    border: 1px solid black;
    flex-direction: column;
  }

  .huijianshi-nr-shijian {
    height: 40px;
    background-color: #EE7A7D;
    display: flex;
    padding-left: 170px;
    box-sizing: border-box;
  }

  .huijianshi-nr-shijian > div {
    flex-grow: 1;
    text-align: center;
    line-height: 40px;
    border-left: 1px solid black;
    border-bottom: 1px solid black;
    box-sizing: border-box;
  }

  .huijianshi-nr-xshi {
    height: 270px;
    display: flex;
    flex-direction: column;
    overflow: auto;
  }

  .huijianshi-nr-xshi > div {
    height: 30px;
    display: flex;
    margin-bottom: 5px;
    align-items: center
  }

  .huijianshi-nr-xshi > div > .wenzi {
    width: 170px;
    height: 30px;
    text-align: center;
    line-height: 30px;
    border-bottom: 1px solid black;
    border-top: 1px solid black;
    box-sizing: border-box;
  }

  .huijianshi-nr-xshi > div > .biao {
    flex-grow: 1;
    display: flex;
    height: 30px;
    border: 1px solid black;
    box-sizing: border-box;
    border: 1px solid black;
  }

  .huijianshi-nr-xshi > div > .biao > div {
    flex-grow: 1
  }

  .huijianting {
    height: 50%;
  }

  .hide-scroll-bar::-webkit-scrollbar {
    display: none;
  }

  .huaguo-xianshi {
    width: 250px;
    height: 32px;
    background-color: #EE7A7D;
    text-align: center;
    line-height: 32px;
    border-radius: 5px;
    color: white;
  }

  .cur {
    cursor: pointer;
  }

  .active {
    background-color: #23FF39;
  }

  .red {
    background-color: #dd6161;
  }

  .page-wrapper >>> tbody tr td {
    cursor: pointer;
  }
</style>

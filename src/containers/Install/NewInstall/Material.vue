<template>
  <div>
    <div class="main">
      <h2 class="title">
        {{title}}
      </h2>
      <datatable class="datatable"
        v-if="hasRelation"
        :label="label"
        :toolbar = "toolbar"
        :labelName="labelName"
        :resource="resource"
        :relation="relation"
        :columnsObject="columns"
        :customOperation="customOperation"
        :tableInitList="tableInitList"
        :tableFullList="tableFullList"
        :filterByInit="filterByInit"
        @customOperationEvent="customOperationEvent"
      >
      </datatable>
    </div>
  </div>
</template>
<script>
import { fetchList } from '../../../utils/api'
import Datatable from '../../../components/Datatable'
import { getMenus } from '../../../auth'
import { getLodop } from '../../../utils/LodopFuncs'

export default {
  name: 'material',
  components: {
    Datatable
  },
  data () {
    const menu = getMenus().find(item => item.menuurl === '/install/newInstall/material')
    return {
      flowDefineId: menu.flowid,
      resource: 'installorder',
      title: '材料计划及工程预算',
      label: '材料计划及工程预算',
      // title: '填写材料计划',
      // label: '填写材料计划',
      labelName: 'name',
      relation: true,
      toolbar: {
        export: true
      },
      hasRelation: false,
      customOperation: [{
        name: 'task',
        label: '工单详情',
        icon: 'id-card-o'
      }],
      tableInitList: ['orderCode', 'createTime', 'clientName', 'clientAddress', 'meterDiameter', 'clientContact'],
      tableFullList: ['orderCode', 'createTime', 'clientName', 'clientAddress', 'meterDiameter', 'clientContact', 'cardType', 'cardNo', 'clientType', 'userCount'],
      columns: {
        orderCode: {
          label: '流水编号',
          sort: true,
          filter: {
            type: 'input',
            like: true
          }
        },
        flowInstanceId: {
          label: '工单号',
          sort: true,
          filter: {
            type: 'input',
            like: true
          }
        },
        meterDiameter: {
          label: '水表口径',
          type: 'select',
          filter: {
            type: 'select',
            like: true
          }
        },
        orderStatus: {
          label: '归档状态',
          type: 'select'
        },
        createTime: {
          label: '办理时间',
          type: 'time',
          filter: {
            type: 'dateRange'
          },
          sort: true
        },
        applyTime: {
          label: '受理日期',
          type: 'time'
        },
        updateTime: {
          label: '操作时间',
          type: 'time'
        },
        clientName: {
          label: '客户名称',
          filter: {
            type: 'input',
            like: true
          }
        },
        clientNo: {
          label: '户号',
          filter: {
            type: 'input'
          }
        },
        cardType: {
          label: '证件名称',
          type: 'select',
          filter: {
            type: 'select'
          }
        },
        cardNo: {
          label: '证件号码',
          filter: {
            type: 'input'
          }
        },
        clientPhone: {
          label: '客户固话',
          filter: {
            type: 'input',
            like: true
          }
        },
        clientContact: {
          label: '客户手机',
          filter: {
            type: 'input',
            like: true
          }
        },
        agentContact: {
          label: '客户手机',
          filter: {
            type: 'input',
            like: true
          }
        },
        clientAddress: {
          label: '用水地址',
          width: '200px',
          filter: {
            type: 'input',
            like: true
          }
        },
        clientType: {
          label: '用水性质',
          type: 'select',
          filter: {
            type: 'select',
            like: true
          }
        },
        serviceType: {
          label: '服务项目',
          type: 'select'
        },
        clientOldName: {
          label: '改名过户原用户名称'
        },
        agentName: {
          label: '申办人'
        },
        applyIdcard: {
          label: '申办人身份证号码'
        },
        applyPhone: {
          label: '申办人联系电话固话'
        },
        applyMobile: {
          label: '申办人手机号码'
        },
        buildDate: {
          label: '安装日期',
          type: 'time'
        },
        meterOuterNum: {
          label: '水表外码'
        },
        meterType: {
          label: '水表表型'
        },
        cfmVerifyRemark: {
          label: '审核施工完成备注'
        },
        builder: {
          label: '施工员'
        },
        meterNearNo: {
          label: '近表号'
        },
        stepDefineId: {
          label: '流程定义'
        },
        userCount: {
          label: '用水人数',
          filter: {
            type: 'input',
            like: true
          }
        }
      },
      filterByInit: []
    }
  },
  created () {
    this.getRelation()
  },
  methods: {
    customOperationEvent (name, data) {
      if (name === 'task') {
        this.$router.push('/base/task/' + data.flowInstanceId)
      } else if (name === 'print') {
        this.CreatePage(data)
      }
    },
    getRelation () {
      fetchList({
        resource: this.resource + '/relation'
      })
      .then((data) => {
        Object.keys(data).map(key => {
          if (this.columns[key]) {
            this.columns[key].options = data[key]
          }
        })
        this.filterByInit = [{
          name: 'stepDefineId',
          type: 'equalto',
          value: data.stepDefineId.find(item => item.flowDefineId === this.flowDefineId && item.label === '材料计划及工程预算').id
        }]
        this.hasRelation = true
      })
    },
    CreatePage (data) {
      fetchList({
        resource: 'installProductPlan/' + data.flowInstanceId
      }).then((data) => {
        console.log(data)
      })
      const css = `<style>
        .table-row{
            border-bottom: 1px solid black;height: 20px;
        }
        .table-col{
            float: left;height: 100%;
            -webkit-align-items: center;
            -ms-flex-align: center;
            align-items: center;
            display: -webkit-flex;
            display: flex;
            text-align: center;
            margin: 0 auto;
        }
        .table-col div{
            margin: 0 auto
        }
        .table-border{
            border-right: 1px solid black;
        }
        .signature{
            font-size: 20px;
        }
        .div-width-10{
            width:10%;
        }
        .div-width-7{
            width:7%;
        }
        .div-width-8{
            width:8%;
        }
      </style>`
      const html = `<div>
        <div style="margin: 0 auto;width: 80%;">
            <h1 style="text-align: center">澄海区自来水公司安装工程材料计划表</h1>
            <div>
                <div style="float:left;width:50%">
                    用户名称：
                </div>
                <div style="float:left;width:50%">
                    日期
                </div>
            </div>
        </div>
        <div style="clear:both;margin: 30px auto 0 0;">
            <div style="border:2px solid black; ">
                <div class="table-row">
                    <div class="table-col table-border div-width-10"><div>货号</div></div>
                    <div class="table-col table-border div-width-10"><div>材料名称</div></div>
                    <div class="table-col table-border div-width-10"><div>规格</div></div>
                    <div class="table-col table-border div-width-7"><div>单位</div></div>
                    <div class="table-col table-border div-width-10"><div>预计数量</div></div>
                    <div class="table-col table-border div-width-8"><div>单价</div></div>
                    <div class="table-col table-border div-width-8"><div>总价</div></div>
                    <div class="table-col table-border div-width-10"><div>退回数量</div></div>
                    <div class="table-col table-border div-width-10"><div>实用数量</div></div>
                    <div class="table-col table-border div-width-8"><div>增加数</div></div>
                    <div style="float: left;height: 100%;" class="table-col div-width-7"><div>备注</div></div>
                </div>

                <div class="table-row">
                    <div class="table-col table-border div-width-10"><div>1-2</div></div>
                    <div class="table-col table-border div-width-10"><div>镀锌钢管</div></div>
                    <div class="table-col table-border div-width-10"><div>3/4"</div></div>
                    <div class="table-col table-border div-width-7"><div>米</div></div>
                    <div class="table-col table-border div-width-10"><div></div></div>
                    <div class="table-col table-border div-width-8"><div>24.31</div></div>
                    <div class="table-col table-border div-width-8"><div></div></div>
                    <div class="table-col table-border div-width-10"><div></div></div>
                    <div class="table-col table-border div-width-10"><div></div></div>
                    <div class="table-col table-border div-width-8"><div></div></div>
                    <div style="float: left;height: 100%;" class="table-col  div-width-7"><div></div></div>
                </div>
                <div class="table-row">
                    <div class="table-col table-border div-width-10"><div>A2</div></div>
                    <div class="table-col table-border div-width-10"><div>PVC管</div></div>
                    <div class="table-col table-border div-width-10"><div>φ25</div></div>
                    <div class="table-col table-border div-width-7"><div>米</div></div>
                    <div class="table-col table-border div-width-10"><div></div></div>
                    <div class="table-col table-border div-width-8"><div>6.35</div></div>
                    <div class="table-col table-border div-width-8"><div></div></div>
                    <div class="table-col table-border div-width-10"><div></div></div>
                    <div class="table-col table-border div-width-10"><div></div></div>
                    <div class="table-col table-border div-width-8"><div></div></div>
                    <div style="float: left;height: 100%;" class="table-col div-width-7"><div></div></div>
                </div>

                <div class="table-row">
                    <div class="table-col table-border div-width-10"><div>3-11-2</div></div>
                    <div class="table-col table-border div-width-10"><div>水表</div></div>
                    <div class="table-col table-border div-width-10"><div>1/2"</div></div>
                    <div class="table-col table-border div-width-7"><div>个</div></div>
                    <div class="table-col table-border div-width-10"><div></div></div>
                    <div class="table-col table-border div-width-8"><div>68.44</div></div>
                    <div class="table-col table-border div-width-8"><div></div></div>
                    <div  class="table-col table-border div-width-10"><div></div></div>
                    <div  class="table-col table-border div-width-10"><div></div></div>
                    <div  class="table-col table-border div-width-8"><div></div></div>
                    <div style="float: left;height: 100%;" class="table-col div-width-7"><div></div></div>
                </div>

                <div class="table-row">
                    <div  class="table-col table-border div-width-10"><div>2-171</div></div>
                    <div class="table-col table-border div-width-10"><div>阀门</div></div>
                    <div  class="table-col table-border div-width-10"><div>3/4"</div></div>
                    <div  class="table-col table-border div-width-7"><div>个</div></div>
                    <div  class="table-col table-border div-width-10"><div></div></div>
                    <div  class="table-col table-border div-width-8"><div>40.48</div></div>
                    <div  class="table-col table-border div-width-8"><div></div></div>
                    <div  class="table-col table-border div-width-10"><div></div></div>
                    <div class="table-col table-border div-width-10"><div></div></div>
                    <div  class="table-col table-border div-width-8"><div></div></div>
                    <div style="float: left;height: 100%;" class="table-col div-width-7"><div></div></div>
                </div>

                <div class="table-row">
                    <div class="table-col table-border div-width-10"><div>2-169-1</div></div>
                    <div class="table-col table-border div-width-10"><div>铜闸阀</div></div>
                    <div class="table-col table-border div-width-10"><div>3/4"</div></div>
                    <div class="table-col table-border div-width-7"><div>个</div></div>
                    <div class="table-col table-border div-width-10"><div></div></div>
                    <div class="table-col table-border div-width-8"><div>45.54</div></div>
                    <div class="table-col table-border div-width-8"><div></div></div>
                    <div  class="table-col table-border div-width-10"><div></div></div>
                    <div class="table-col table-border div-width-10"><div></div></div>
                    <div class="table-col table-border div-width-8"><div></div></div>
                    <div style=";float: left;height: 100%;" class="table-col div-width-7"><div></div></div>
                </div>

                <div class="table-row">
                    <div class="table-col table-border div-width-10"><div>2-112</div></div>
                    <div class="table-col table-border div-width-10"><div>止回阀</div></div>
                    <div  class="table-col table-border div-width-10"><div>3/4"</div></div>
                    <div  class="table-col table-border div-width-7"><div>个</div></div>
                    <div  class="table-col table-border div-width-10"><div></div></div>
                    <div class="table-col table-border div-width-8"><div>46.55</div></div>
                    <div  class="table-col table-border div-width-8"><div></div></div>
                    <div  class="table-col table-border div-width-10"><div></div></div>
                    <div  class="table-col table-border div-width-10"><div></div></div>
                    <div  class="table-col table-border div-width-8"><div></div></div>
                    <div style="float: left;height: 100%;" class="table-col div-width-7"><div></div></div>
                </div>

                <div class="table-row">
                    <div  class="table-col table-border div-width-10"><div>2-190</div></div>
                    <div  class="table-col table-border div-width-10"><div>龙头</div></div>
                    <div  class="table-col table-border div-width-10"><div>1/2"</div></div>
                    <div  class="table-col table-border div-width-7"><div>个</div></div>
                    <div  class="table-col table-border div-width-10"><div></div></div>
                    <div  class="table-col table-border div-width-8"><div>26.19</div></div>
                    <div  class="table-col table-border div-width-8"><div></div></div>
                    <div  class="table-col table-border div-width-10"><div></div></div>
                    <div  class="table-col table-border div-width-10"><div></div></div>
                    <div  class="table-col table-border div-width-8"><div></div></div>
                    <div style="float: left;height: 100%;" class="table-col div-width-7"><div></div></div>
                </div>

                <div class="table-row">
                    <div  class="table-col table-border div-width-10"><div>2-136</div></div>
                    <div  class="table-col table-border div-width-10"><div>异三通</div></div>
                    <div  class="table-col table-border div-width-10"><div>2"*3/4"</div></div>
                    <div  class="table-col table-border div-width-7"><div>个</div></div>
                    <div  class="table-col table-border div-width-10"><div></div></div>
                    <div  class="table-col table-border div-width-8"><div>23.52</div></div>
                    <div  class="table-col table-border div-width-8"><div></div></div>
                    <div  class="table-col table-border div-width-10"><div></div></div>
                    <div  class="table-col table-border div-width-10"><div></div></div>
                    <div  class="table-col table-border div-width-8"><div></div></div>
                    <div style="float: left;height: 100%;" class="table-col div-width-7"><div></div></div>
                </div>

                <div class="table-row">
                    <div  class="table-col table-border div-width-10"><div>2-155</div></div>
                    <div  class="table-col table-border div-width-10"><div>通心</div></div>
                    <div  class="table-col table-border div-width-10"><div>2"</div></div>
                    <div  class="table-col table-border div-width-7"><div>个</div></div>
                    <div  class="table-col table-border div-width-10"><div></div></div>
                    <div  class="table-col table-border div-width-8"><div>12.22</div></div>
                    <div  class="table-col table-border div-width-8"><div></div></div>
                    <div  class="table-col table-border div-width-10"><div></div></div>
                    <div  class="table-col table-border div-width-10"><div></div></div>
                    <div  class="table-col table-border div-width-8"><div></div></div>
                    <div style="float: left;height: 100%;" class="table-col div-width-7"><div></div></div>
                </div>

                <div class="table-row">
                    <div  class="table-col table-border div-width-10"><div>2-165</div></div>
                    <div  class="table-col table-border div-width-10"><div>塞只</div></div>
                    <div  class="table-col table-border div-width-10"><div>2"</div></div>
                    <div  class="table-col table-border div-width-7"><div>个</div></div>
                    <div  class="table-col table-border div-width-10"><div></div></div>
                    <div  class="table-col table-border div-width-8"><div>9.94</div></div>
                    <div  class="table-col table-border div-width-8"><div></div></div>
                    <div  class="table-col table-border div-width-10"><div></div></div>
                    <div  class="table-col table-border div-width-10"><div></div></div>
                    <div class="table-col table-border div-width-8"><div></div></div>
                    <div style="float: left;height: 100%;" class="table-col div-width-7"><div></div></div>
                </div>

                <div class="table-row">
                    <div  class="table-col table-border div-width-10"><div>B2</div></div>
                    <div  class="table-col table-border div-width-10"><div>外牙直接</div></div>
                    <div  class="table-col table-border div-width-10"><div>φ25</div></div>
                    <div  class="table-col table-border div-width-7"><div>个</div></div>
                    <div  class="table-col table-border div-width-10"><div></div></div>
                    <div class="table-col table-border div-width-8"><div>1.82</div></div>
                    <div  class="table-col table-border div-width-8"><div></div></div>
                    <div  class="table-col table-border div-width-10"><div></div></div>
                    <div  class="table-col table-border div-width-10"><div></div></div>
                    <div  class="table-col table-border div-width-8"><div></div></div>
                    <div style="float: left;height: 100%;" class="table-col div-width-7"><div></div></div>
                </div>

                <div class="table-row">
                    <div  class="table-col table-border div-width-10"><div>B68</div></div>
                    <div  class="table-col table-border div-width-10"><div>弯头</div></div>
                    <div  class="table-col table-border div-width-10"><div>φ25</div></div>
                    <div  class="table-col table-border div-width-7"><div>个</div></div>
                    <div  class="table-col table-border div-width-10"><div></div></div>
                    <div  class="table-col table-border div-width-8"><div>1.94</div></div>
                    <div  class="table-col table-border div-width-8"><div></div></div>
                    <div  class="table-col table-border div-width-10"><div></div></div>
                    <div  class="table-col table-border div-width-10"><div></div></div>
                    <div  class="table-col table-border div-width-8"><div></div></div>
                    <div style="float: left;height: 100%;" class="table-col div-width-7"><div></div></div>
                </div>

                <div class="table-row">
                    <div  class="table-col table-border div-width-10"><div>B68</div></div>
                    <div  class="table-col table-border div-width-10"><div>弯头</div></div>
                    <div  class="table-col table-border div-width-10"><div>3/4"</div></div>
                    <div  class="table-col table-border div-width-7"><div>个</div></div>
                    <div  class="table-col table-border div-width-10"><div></div></div>
                    <div  class="table-col table-border div-width-8"><div>3.38</div></div>
                    <div  class="table-col table-border div-width-8"><div></div></div>
                    <div  class="table-col table-border div-width-10"><div></div></div>
                    <div  class="table-col table-border div-width-10"><div></div></div>
                    <div  class="table-col table-border div-width-8"><div></div></div>
                    <div style="float: left;height: 100%;" class="table-col div-width-7"><div></div></div>
                </div>

                <div class="table-row">
                    <div  class="table-col table-border div-width-10"><div>2-85</div></div>
                    <div  class="table-col table-border div-width-10"><div>异径弯头</div></div>
                    <div  class="table-col table-border div-width-10"><div>3/4"*1/2"</div></div>
                    <div  class="table-col table-border div-width-7"><div>个</div></div>
                    <div  class="table-col table-border div-width-10"><div></div></div>
                    <div  class="table-col table-border div-width-8"><div>3.40</div></div>
                    <div  class="table-col table-border div-width-8"><div></div></div>
                    <div  class="table-col table-border div-width-10"><div></div></div>
                    <div  class="table-col table-border div-width-10"><div></div></div>
                    <div  class="table-col table-border div-width-8"><div></div></div>
                    <div style="float: left;height: 100%;" class="table-col div-width-7"><div></div></div>
                </div>

                <div class="table-row">
                    <div  class="table-col table-border div-width-10"><div>2-40</div></div>
                    <div  class="table-col table-border div-width-10"><div>内外接头</div></div>
                    <div  class="table-col table-border div-width-10"><div>3/4"*1/2"</div></div>
                    <div  class="table-col table-border div-width-7"><div>个</div></div>
                    <div  class="table-col table-border div-width-10"><div></div></div>
                    <div  class="table-col table-border div-width-8"><div>2.52</div></div>
                    <div  class="table-col table-border div-width-8"><div></div></div>
                    <div  class="table-col table-border div-width-10"><div></div></div>
                    <div  class="table-col table-border div-width-10"><div></div></div>
                    <div  class="table-col table-border div-width-8"><div></div></div>
                    <div style="float: left;height: 100%;" class="table-col div-width-7"><div></div></div>
                </div>

                <div class="table-row">
                    <div  class="table-col table-border div-width-10"><div>2-151</div></div>
                    <div  class="table-col table-border div-width-10"><div>通心</div></div>
                    <div  class="table-col table-border div-width-10"><div>3/4"</div></div>
                    <div  class="table-col table-border div-width-7"><div>个</div></div>
                    <div  class="table-col table-border div-width-10"><div></div></div>
                    <div  class="table-col table-border div-width-8"><div>3.05</div></div>
                    <div  class="table-col table-border div-width-8"><div></div></div>
                    <div  class="table-col table-border div-width-10"><div></div></div>
                    <div  class="table-col table-border div-width-10"><div></div></div>
                    <div  class="table-col table-border div-width-8"><div></div></div>
                    <div style="float: left;height: 100%;" class="table-col div-width-7"><div></div></div>
                </div>

                <div class="table-row">
                    <div  class="table-col table-border div-width-10"><div>2-200</div></div>
                    <div  class="table-col table-border div-width-10"><div>喉钩</div></div>
                    <div  class="table-col table-border div-width-10"><div>3/4"</div></div>
                    <div  class="table-col table-border div-width-7"><div>个</div></div>
                    <div  class="table-col table-border div-width-10"><div></div></div>
                    <div  class="table-col table-border div-width-8"><div>0.68</div></div>
                    <div  class="table-col table-border div-width-8"><div></div></div>
                    <div  class="table-col table-border div-width-10"><div></div></div>
                    <div  class="table-col table-border div-width-10"><div></div></div>
                    <div  class="table-col table-border div-width-8"><div></div></div>
                    <div style="float: left;height: 100%;" class="table-col div-width-7"><div></div></div>
                </div>

                <div class="table-row">
                    <div  class="table-col table-border div-width-10"><div>B233</div></div>
                    <div  class="table-col table-border div-width-10"><div>胶水</div></div>
                    <div  class="table-col table-border div-width-10"><div>0.2kg</div></div>
                    <div  class="table-col table-border div-width-7"><div>个</div></div>
                    <div  class="table-col table-border div-width-10"><div></div></div>
                    <div  class="table-col table-border div-width-8"><div>14.32</div></div>
                    <div  class="table-col table-border div-width-8"><div></div></div>
                    <div  class="table-col table-border div-width-10"><div></div></div>
                    <div  class="table-col table-border div-width-10"><div></div></div>
                    <div  class="table-col table-border div-width-8"><div></div></div>
                    <div style="float: left;height: 100%;" class="table-col div-width-7"><div></div></div>
                </div>

                <div class="table-row">
                    <div  class="table-col table-border  div-width-10"><div>2-503</div></div>
                    <div  class="table-col table-border div-width-10"><div>生料带</div></div>
                    <div  class="table-col table-border div-width-10"><div></div></div>
                    <div  class="table-col table-border div-width-7"><div>粒</div></div>
                    <div  class="table-col table-border div-width-10"><div></div></div>
                    <div  class="table-col table-border div-width-8"><div>2.00</div></div>
                    <div  class="table-col table-border div-width-8"><div></div></div>
                    <div  class="table-col table-border div-width-10"><div></div></div>
                    <div  class="table-col table-border div-width-10"><div></div></div>
                    <div  class="table-col table-border div-width-8"><div></div></div>
                    <div style="float: left;height: 100%;" class="table-col div-width-7"><div></div></div>
                </div>

                <div class="table-row">
                    <div  class="table-col table-border div-width-10"><div></div></div>
                    <div  class="table-col table-border div-width-10"><div></div></div>
                    <div  class="table-col table-border div-width-10"><div></div></div>
                    <div  class="table-col table-border div-width-7"><div></div></div>
                    <div  class="table-col table-border div-width-10"><div></div></div>
                    <div  class="table-col table-border div-width-8"><div></div></div>
                    <div  class="table-col table-border div-width-8"><div></div></div>
                    <div  class="table-col table-border div-width-10"><div></div></div>
                    <div  class="table-col table-border div-width-10"><div></div></div>
                    <div  class="table-col table-border div-width-8"><div></div></div>
                    <div style="float: left;height: 100%;" class="table-col div-width-7"><div></div></div>
                </div>

                <div class="table-row">
                    <div class="table-col table-border div-width-10"><div>水表费</div></div>
                    <div class="table-col table-border div-width-10"><div></div></div>
                    <div class="table-col table-border div-width-10"><div>管材费</div></div>
                    <div class="table-col table-border div-width-7"><div></div></div>
                    <div class="table-col table-border div-width-10"><div>配件费</div></div>
                    <div class="table-col table-border div-width-8"><div></div></div>
                    <div class="table-col table-border div-width-8"><div></div></div>
                    <div class="table-col table-border div-width-10"><div>综合工资</div></div>
                    <div class="table-col table-border div-width-10"><div></div></div>
                    <div class="table-col table-border div-width-8"><div></div></div>
                    <div style="float: left;height: 100%;" class="table-col div-width-7"><div></div></div>
                </div>
            </div>
        </div>

        <div style="margin: 20px auto;width: 80%;">
            <div>
                <div style="float:left;width:50%">
                    <p class="signature">发料人：____________________</p>
                </div>
                <div style="float:left;width:50%">
                    <p class="signature">领料人：____________________</p>
                </div>
            </div>
        </div>
    </div>`
      let LODOP = getLodop()
      LODOP.ADD_PRINT_HTM(20, 40, 700, 900, css + html)
      LODOP.PREVIEW()
    }
  }
}
</script>

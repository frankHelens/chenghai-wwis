<template>
  <div>
    <div class="main">
      <h2 class="title">
        {{title}}
      </h2>
      <datatable class="datatable"
        v-if="hasRelation"
        :label="label"
        :labelName="labelName"
        :toolbar = "toolbar"
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
import { getMenus } from '../../../auth'
import { fetchList, fetch } from '../../../utils/api'
import Datatable from '../../../components/Datatable'
import { getLodop } from '../../../utils/LodopFuncs'
import moment from 'moment'

export default {
  name: 'budget',
  components: {
    Datatable
  },
  data () {
    const menu = getMenus().find(item => item.menuurl === '/install/newInstall/budget')
    return {
      flowDefineId: menu.flowid,
      resource: 'installorder',
      title: '工程预算',
      label: '工程预算',
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
        fetch({
          method: 'get',
          url: '/installCost/' + data.flowInstanceId
        }).then(result => {
          this.CreatePage(result, data)
        })
      }
    },
    getRelation () {
      console.log(this.flowDefineId)
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
          value: data.stepDefineId.find(item => item.flowDefineId === this.flowDefineId && item.label === '填写工程预算').id
        }]
        this.hasRelation = true
      })
    },
    CreatePage (data, result) {
      const css = `<style>
        html,body{font-size:18px;font-family:"微软雅黑";}
        h1{
          text-align: center;
          font-size: 32px;
          margin-bottom: 30px;
        }
        .text-left{
            float:left;
            font-size: 18px;
        }
        .text-right{
            float:right;
            width:50%;
            text-align: right;
            font-size: 18px;
        }
        .div-table{
            border-bottom: 1px solid black;
            height: 50px
        }
        .table-center {
            -webkit-align-items: center;
            -ms-flex-align: center;
            align-items: center;
            display: -webkit-flex;
            display: flex;
            text-align: center;
            margin: 0 auto;
            float: left;
            height: 100%;
        }
        .table-border{
            border-right:1px solid black;
        }
        div-center,.table-center div{
            margin: 0 auto
        }
        .tl{
          text-align: left;
        }
      </style>`
      const html = `<div style="margin-top: 80px">
        <div style="margin: 0 auto;width: 70%;">
            <h1>澄海区自来水公司工程预算书</h1>
            <div>
                <div class="text-left">
                    用户名称：
                </div>
                <div class="text-left tl">${result.clientName}</div>
                <div class="text-right">
                    ${moment(result.updateTime).format('YYYY-MM-DD')}
                </div>
            </div>
            <div style="margin-top: 80px;overflow: hidden;">
                <div class="text-left">
                    安装地址：
                </div>
                <div class="text-left">${result.clientAddress}</div>
            </div>
        </div>
        <div style="clear:both;margin: 10px auto 0;width: 80%;">
            <div style="border:2px solid black; ">
                <div class="div-table" style="position:relative">
                    <div style="width:7%;" class="table-center table-border"><div>序号</div></div>
                    <div style="width:15%;" class="table-center table-border"><div>项目名称</div></div>
                    <div style="width:20%;"  class="table-center table-border"><div>金额</div></div>
                    <div style="width:50%; " class="table-center"><div>计算依据说明</div></div>
                </div>

                <div class="div-table">
                    <div style="width:7%;" class="table-center table-border"><div>1</div></div>
                    <div style="width:15%;" class="table-center table-border"><div>综合工资</div></div>
                    <div style="width:20%;"  class="table-center table-border"><div>${data.costWage}</div></div>
                    <div style="width:50%;" class="table-center"><div></div></div>
                </div>
                <div class="div-table">
                    <div style="width:7%;" class="table-center table-border"><div>2</div></div>
                    <div style="width:15%;" class="table-center table-border"><div>管材费</div></div>
                    <div style="width:20%;"  class="table-center table-border"><div>${data.costPipe}</div></div>
                    <div style="width:50%; " class="table-center"><div></div></div>
                </div>
                <div class="div-table">
                    <div style="width:7%;" class="table-center table-border"><div>3</div></div>
                    <div style="width:15%;" class="table-center table-border"><div>配件费</div></div>
                    <div style="width:20%;"  class="table-center table-border"><div>${data.costPart}</div></div>
                    <div style="width:50%;" class="table-center"><div></div></div>
                </div>
                <div class="div-table">
                    <div style="width:7%;" class="table-center table-border"><div>4</div></div>
                    <div style="width:15%;" class="table-center table-border"><div>水表费</div></div>
                    <div style="width:20%;"  class="table-center table-border"><div>${data.costMeter}</div></div>
                    <div style="width:50%; " class="table-center"><div></div></div>
                </div>
                <div class="div-table">
                    <div style="width:7%;" class="table-center table-border"><div>5</div></div>
                    <div style="width:15%;" class="table-center table-border"><div>附属工程费</div></div>
                    <div style="width:20%;"  class="table-center table-border"><div>${data.costAttach}</div></div>
                    <div style="width:50%;" class="table-center"><div></div></div>
                </div>
                <div class="div-table">
                    <div style="width:7%;" class="table-center table-border"><div>6</div></div>
                    <div style="width:15%;" class="table-center table-border"><div>水表检测费</div></div>
                    <div style="width:20%;"  class="table-center table-border"><div>${data.costMeterTest}</div></div>
                    <div style="width:50%; " class="table-center"><div></div></div>
                </div>
                <div class="div-table">
                    <div style="width:7%;" class="table-center table-border"><div>7</div></div>
                    <div style="width:15%;" class="table-center table-border"><div>不可预见费</div></div>
                    <div style="width:20%;"  class="table-center table-border"><div>${data.costUnpredict}</div></div>
                    <div style="width:50%;" class="table-center"><div></div></div>
                </div>
                <div class="div-table">
                    <div style="width:7%;" class="table-center table-border"><div>8</div></div>
                    <div style="width:15%;" class="table-center table-border"><div>设计费</div></div>
                    <div style="width:20%;"  class="table-center table-border"><div>${data.costDesign}</div></div>
                    <div style="width:50%;" class="table-center"><div></div></div>
                </div>
            </div>
        </div>
        <div style="margin: 20px auto;width: 70%;">
            <div>
                <div class="text-left">
                    预算员：
                </div>
                <div class="text-right">
                    复核：
                </div>
            </div>
        </div>
      </div>`
      let LODOP = getLodop()
      LODOP.ADD_PRINT_HTM(120, 40, 700, 900, css + html)
      LODOP.PREVIEW()
    }
  }
}
</script>

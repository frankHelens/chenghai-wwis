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
import { fetchList } from '../../../utils/api'
import Datatable from '../../../components/Datatable'
import { getLodop } from '../../../utils/LodopFuncs'
import moment from 'moment'

export default {
  name: 'agreement',
  components: {
    Datatable
  },
  data () {
    const menu = getMenus().find(item => item.menuurl === '/install/stopInstall/agreement')
    return {
      flowDefineId: menu.flowid,
      resource: 'installorder',
      title: '打印报停派工单',
      label: '打印报停派工单',
      labelName: 'name',
      relation: true,
      hasRelation: false,
      customOperation: [{
        name: 'task',
        label: '工单详情',
        icon: 'id-card-o'
      }, {
        name: 'print',
        label: '打印',
        icon: 'print'
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
        let nowDay = (moment(data.applyTime).format('YYYY-MM-DD')).split('-')
        let buildDate = (moment(data.buildDate).format('YYYY-MM-DD')).split('-')
        const css = `<style type="text/css">
          html,body{font-size:14px;font-family:"微软雅黑";}
          body{padding-top:55px;padding-left:45px;box-sizing:border-box;font-size:14px;}
          table{width:100%;margin:0 auto;text-align:center;padding-right:25px;box-sizing:border-box;font-size:14px;font-family:"微软雅黑";}
          td{border: 0px solid #000;height:38px;width:50px;vertical-align:middle;}
          .h15{height:15px;}.w40{width:40px;display:inline-block;}
          i{display:inline-block;width:75px;text-aling:left;visibility:hidden;}i:nth-of-type(${data.clientType}){visibility:visible;}.ml10{margin-left:10px;}
          em{display:inline-block;width:47px;text-aling:left;visibility:hidden;}em:nth-of-type(${data.serviceType}){visibility:visible;}w0{width:0px;}
          .tl{text-align:left;}.ml15{margin-left:15px;}.ml25{margin-left:25px;}.w45{width:45px;}
          .pl5{padding-left:5px;}.pl10{padding-left:10px;}.pl15{padding-left:15px;}
          .box-sizing{box-sizing:border-box;}.pr5{padding-right:5px;}.pr10{padding-right:10px;}
          .pb10{padding-bottom:10px;}.pr20{padding-right:20px;}.pr30{padding-right:30px;}
        </style>`
        const html = `<table border="0" cellpadding="0" cellspacing="0">
          <tr><td colspan="5"></td><td></td><td class="h15 tl" style="box-sizing:border-box;padding-left:40px;padding-top:22px;" colspan="3"><span class="w40 ml15">${nowDay[0]}</span><span class="w40 w50 ml15">${nowDay[1]}</span><span class="w40">${nowDay[2]}</span></td></tr>
          <tr><td colspan="5"></td><td></td><td colspan="3" class="h15">${data.pactNo || ''}</td></tr>
          <tr><td></td><td colspan="3" id="name" style="padding-left:15px;" class="box-sizing tl">${data.clientName || ''}</td><td></td><td>${data.meterDiameter || ''}</td><td></td><td colspan="2">${data.clientNo || ''}</td></tr>
          <tr><td></td><td class="pl10 box-sizing pl15">${data.cardType || ''}</td><td></td><td colspan="3">${data.cardNo || ''}</td><td></td><td colspan="2" class="pr30 box-sizing">${data.clientPhone || data.clientMobile || ''}</td></tr>
          <tr><td></td><td colspan="8" style="padding:0px 30px" class="box-sizing tl" id="address">${data.clientAddress || ''}</td></tr><tr><td></td><td colspan="8" class="tl"><i class="ml25">√</i><i>√</i><i>√</i><i class="w45">√</i><i>√</i><i class="w45">√</i><i class="w45">√</i><i class="w45">√</i><i>√</i></td></tr><tr><td rowspan="2"></td><td colspan="8" class="tl"><em class="ml25">√</em><em>√</em><em>√</em><em style="margin-left:208px;">√</em></td></tr>
          <tr><td colspan="8" class="tl"><em class="w0"></em><em class="w0"></em><em class="w0"></em><em class="w0"></em><em class="ml25">√</em><em>√</em><em>√</em><em style="margin-left:208px;">√</em></td></tr>
          <tr><td></td><td></td><td colspan="3">${data.clientOldName || ''}</td><td></td><td colspan="3"><b></b></td></tr>
          <tr><td></td><td colspan="2">${data.agentName || ''}</td><td></td><td colspan="2" class="box-sizing">${data.applyIdcard || ''}</td><td></td><td colspan="2" class="pr10 box-sizing">${data.applyPhone || data.applyMobile || ''}</td></tr>
          <tr><td></td><td colspan="2" class="box-sizing pb10"><span class="w40 w50">${buildDate[0]}</span><span class="w40 w50 box-sizing pl10">${buildDate[1]}</span><span class="w40 w50 box-sizing pl10">${buildDate[2]}</span></td><td></td><td class="pl10 box-sizing pb10">${data.meterOuterNum || ''}</td><td></td><td class="pr30 box-sizing pb10">${data.meterType || ''}</td><td></td><td class="pr30 box-sizing pb10"><b></b></td></tr>
          <tr><td rowspan="7"></td><td colspan="8" rowspan="7"><b></b></td</tr>
        </table>`
        var p = getLodop()
        p.PRINT_INIT('')
        p.SET_PRINT_PAGESIZE(1)
        p.ADD_PRINT_HTM(30, 0, '100%', '100%', css + html)
        p.PREVIEW()
      }
    },
    getRelation () {
      fetchList({
        resource: this.resource + '/relation'
      })
      .then((data) => {
        Object.keys(data).map(key => {
          this.columns[key].options = data[key]
        })
        this.filterByInit = [{
          name: 'stepDefineId',
          type: 'equalto',
          value: data.stepDefineId.find(item => item.flowDefineId === this.flowDefineId && item.label === '打印派工单').id
        }]
        this.hasRelation = true
      })
    }
  }
}
</script>

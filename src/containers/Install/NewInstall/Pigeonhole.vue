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
        :toolbar = "toolbar"
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
  name: 'pigeonhole',
  components: {
    Datatable
  },
  data () {
    const menu = getMenus().find(item => item.menuurl === '/install/newInstall/pigeonhole')
    return {
      flowDefineId: menu.flowid,
      resource: 'installorder',
      title: '报装归档',
      label: '报装归档',
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
          value: data.stepDefineId.find(item => item.flowDefineId === this.flowDefineId && item.label === '报装归档').id
        }]
        this.hasRelation = true
      })
    },
    CreatePage (data) {
      let LODOP = getLodop()
      LODOP.PRINT_INITA(0, 0, 800, 1000, '')
      LODOP.ADD_PRINT_TEXT(45, 100, 195, 20, data.clientName)
      LODOP.ADD_PRINT_TEXT(45, 359, 52, 20, data.pactNo)
      LODOP.ADD_PRINT_TEXT(45, 505, 61, 20, data.clientType)
      LODOP.ADD_PRINT_TEXT(45, 598, 119, 20, data.clientNo)
      LODOP.ADD_PRINT_TEXT(65, 96, 203, 19, data.clientOldAddress)
      LODOP.ADD_PRINT_TEXT(65, 358, 203, 20, data.clientAddress)
      LODOP.ADD_PRINT_TEXT(65, 622, 96, 20, '')
      LODOP.ADD_PRINT_TEXT(88, 132, 49, 18, '')
      LODOP.ADD_PRINT_TEXT(87, 261, 71, 19, data.agentName)
      LODOP.ADD_PRINT_TEXT(86, 372, 92, 20, data.applyPhone || data.applyMobile)
      LODOP.ADD_PRINT_TEXT(89, 504, 63, 20, '')
      // LODOP.ADD_PRINT_TEXT(90, 650, 55, 20, '√')
      LODOP.ADD_PRINT_TEXT(134, 80, 79, 20, moment(data.buildDate).format('YYYY-MM-DD'))
      LODOP.ADD_PRINT_TEXT(136, 174, 55, 20, data.meterDiameter)
      LODOP.ADD_PRINT_TEXT(181, 84, 69, 20, data.builder)
      LODOP.ADD_PRINT_TEXT(182, 172, 55, 20, data.meterType)
      LODOP.ADD_PRINT_SETUP_BKIMG("<img src='http://test2.gddxit.com/neidangka.jpg' />")
      LODOP.SET_SHOW_MODE('BKIMG_IN_PREVIEW', 1)
      LODOP.SET_SHOW_MODE('BKIMG_LEFT', 0)
      LODOP.SET_SHOW_MODE('BKIMG_TOP', 0)
      LODOP.SET_SHOW_MODE('BKIMG_WIDTH', '700px')
      // LODOP.SET_SHOW_MODE('BKIMG_HEIGHT', '1000px')
      // LODOP.PRINT_DESIGN()
      LODOP.PREVIEW()
    }
  }
}
</script>

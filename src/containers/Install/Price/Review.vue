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
        :toolbar="toolbar"
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

export default {
  name: 'review',
  components: {
    Datatable
  },
  data () {
    const menu = getMenus().find(item => item.menuurl === '/install/price/review')
    return {
      flowDefineId: menu.flowid,
      resource: 'installorder',
      title: '复核调价',
      label: '复核调价',
      labelName: 'name',
      relation: true,
      hasRelation: false,
      toolbar: {
        export: true
      },
      customOperation: [{
        name: 'task',
        label: '工单详情',
        icon: 'id-card-o'
      }],
      tableInitList: ['orderCode', 'clientNo', 'priceOldBase', 'priceBase', 'clientOldType', 'clientType', 'clientName', 'clientAddress'],
      tableFullList: ['orderCode', 'clientNo', 'priceOldBase', 'priceBase', 'clientOldType', 'clientType', 'clientName', 'clientAddress', 'meterDiameter', 'clientContact', 'cardType', 'cardNo', 'userCount', 'createTime'],
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
          filter: {
            type: 'input',
            like: true
          },
          width: '200px'
        },
        clientType: {
          label: '用水性质',
          type: 'select',
          filter: {
            type: 'select',
            like: true
          },
          width: '120px'
        },
        clientOldType: {
          label: '原用水性质',
          type: 'select',
          filter: {
            type: 'select',
            like: true
          },
          width: '120px'
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
        },
        priceOldBase: {
          label: '原水价',
          filter: {
            type: 'input',
            like: true
          }
        },
        priceBase: {
          label: '现水价',
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
        // console.log(this.flowDefineId)
        this.filterByInit = [{
          name: 'stepDefineId',
          type: 'equalto',
          value: data.stepDefineId.find(item => item.flowDefineId === this.flowDefineId && item.label === '复核调价').id
        }]
        this.hasRelation = true
      })
    }
  }
}
</script>

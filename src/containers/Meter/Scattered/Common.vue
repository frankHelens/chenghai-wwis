<template>
  <div>
    <div class="main">
      <h2 class="title">
        {{title}}
      </h2>
      <datatable
        class="datatable"
        :label="label"
        :labelName="labelName"
        :resource="resource"
        :relation="relation"
        :columnsObject="columns"
        :customOperation="customOperation"
        :tableInitList="tableInitList"
        :tableFullList="tableFullList"
        :filterByInit="filterByInit"
        :orderByInit="orderByInit"
        @customOperationEvent="customOperationEvent"
      >
      </datatable>
    </div>
  </div>
</template>

<script>
import { getMenus } from '../../../auth'
import Datatable from '../../../components/Datatable'

export default {
  name: 'batch-install-order',
  components: {
    Datatable
  },
  watch: {
    $route (to, form) {
      if (to.path !== form.path) {
        const menu = getMenus().find(item => item.menuurl === to.path)
        this.title = menu.menulabel
        this.label = menu.menulabel
        this.filterByInit = [{
          name: 'stepDefineId',
          type: 'equalto',
          value: menu.stepid
        }]
      }
    }
  },
  data () {
    const menu = getMenus().find(item => item.menuurl === this.$route.path)
    return {
      resource: 'meterorder',
      title: menu.menulabel,
      label: menu.menulabel,
      filterByInit: [{
        name: 'stepDefineId',
        type: 'equalto',
        value: menu.stepid
      }],
      labelName: 'clientName',
      relation: true,
      customOperation: [{
        name: 'task',
        label: '工单详情',
        icon: 'id-card-o'
      }],
      tableInitList: ['orderCode', 'createTime', 'clientName', 'clientAddress', 'meterDiameter', 'clientContact', 'agentContact', 'agentName'],
      tableFullList: ['orderCode', 'createTime', 'clientName', 'clientAddress', 'meterDiameter', 'clientContact', 'agentContact', 'agentName', 'cardType', 'cardNo', 'clientType'],
      columns: {
        orderCode: {
          label: '合同号',
          sort: true,
          filter: {
            type: 'input',
            like: true
          }
        },
        orderStatus: {
          label: '归档状态'
        },
        flowInstanceId: {
          label: '工单号',
          sort: true,
          filter: {
            type: 'input',
            like: true
          }
        },
        stepDefineId: {
          label: '流程定义步骤'
        },
        isBigUser: {
          label: '是否大用户',
          sort: true,
          filter: {
            type: 'input'
          }
        },
        applyTime: {
          label: '受理日期',
          type: 'time'
        },
        updateTime: {
          label: '操作时间',
          type: 'time'
        },
        createTime: {
          label: '办理时间',
          type: 'time',
          sort: true,
          filter: {
            type: 'dateRange'
          }
        },
        pactNo: {
          label: '合同号'
        },
        clientName: {
          label: '客户名称',
          filter: {
            type: 'input',
            like: true
          }
        },
        clientType: {
          label: '用户类型',
          type: 'select',
          filter: {
            type: 'select',
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
        clientContact: {
          label: '客户联系方式',
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
        serviceType: {
          label: '服务项目',
          filter: {
            type: 'input',
            like: true
          }
        },
        clientOldName: {
          label: '改名过户原用户名称',
          filter: {
            type: 'input',
            like: true
          }
        },
        agentName: {
          label: '申办人',
          filter: {
            type: 'input',
            like: true
          }
        },
        applyIdcard: {
          label: '申办人身份证号码',
          filter: {
            type: 'input',
            like: true
          }
        },
        applyPhone: {
          label: '申办人联系电话固话',
          filter: {
            type: 'input',
            like: true
          }
        },
        applyMobile: {
          label: '申办人手机号码',
          filter: {
            type: 'input',
            like: true
          }
        },
        buildDate: {
          label: '安装日期',
          type: 'time',
          filter: {
            type: 'dateRange'
          }
        },
        meterOuterNum: {
          label: '水表外码',
          filter: {
            type: 'input',
            like: true
          }
        },
        meterType: {
          label: '水表表型',
          filter: {
            type: 'input',
            like: true
          }
        },
        cfmVerifyRemark: {
          label: '审核施工完成备注',
          filter: {
            type: 'input',
            like: true
          }
        },
        builder: {
          label: '施工员',
          filter: {
            type: 'input',
            like: true
          }
        },
        meterNearNo: {
          label: '近表号',
          filter: {
            type: 'input',
            like: true
          }
        }
      },
      orderByInit: [{
        name: 'updateTime',
        sort: 'desc'
      }]
    }
  },
  methods: {
    customOperationEvent (name, data) {
      if (name === 'task') {
        this.$router.push('/base/task/' + data.flowInstanceId)
      }
    }
  }
}
</script>

<template>
  <div>
    <div class="main">
      <el-tabs class="main-tabs" v-model="tabContent">
        <el-tab-pane class="main-tabs-pane" label="待办工单" name="all">
          <datatable class="datatable"
            :label="label"
            :labelName="labelName"
            :resource="allResource"
            :dialogSize="dialogSize"
            :relation="relation"
            :relationResource="relationResource"
            :customOperation="customOperation"
            :columnsObject="columns"
            :tableInitList="tableInitList"
            :tableFullList="tableFullList"
            :filterByInit="allFilterByInit"
            :orderByInit="orderByInit"
            @customOperationEvent="customOperationEvent"
          >
          </datatable>
        </el-tab-pane>
        <el-tab-pane class="main-tabs-pane" label="已办工单" name="done">
          <datatable class="datatable"
            :label="label"
            :labelName="labelName"
            :resource="doneResource"
            :dialogSize="dialogSize"
            :relation="relation"
            :relationResource="relationResource"
            :customOperation="customOperation"
            :columnsObject="columns"
            :tableInitList="tableInitList"
            :tableFullList="tableFullList"
            :orderByInit="orderByInit"
            @customOperationEvent="customOperationEvent"
          >
          </datatable>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import Datatable from '../../components/Datatable'

export default {
  name: 'task-list',
  components: {
    Datatable
  },
  watch: {
    tabContent (to) {
      this.$router.push({path: '/base/task', query: { state: to }})
    }
  },
  data () {
    return {
      tabContent: this.$route.query.state || 'all',
      allResource: 'flow/getUserAllTask',
      doneResource: 'flow/getUserDoneTask',
      allFilterByInit: [{
        name: 'currentStepStatus',
        type: 'equalto',
        value: 'INITIAL'
      }],
      title: '我的工单',
      label: '工单',
      labelName: 'name',
      dialogSize: 'tiny',
      operation: {},
      relation: true,
      relationResource: 'flowInstance',
      customOperation: [{
        name: 'detail',
        label: '工单详情',
        icon: 'id-card-o'
      }],
      tableInitList: ['orderCode', 'clientName', 'clientContact', 'userCount', 'cardNo', 'createTime', 'currentStepDefineId'],
      tableFullList: ['orderCode', 'clientType', 'clientName', 'clientContact', 'userCount', 'cardNo', 'createTime', 'currentStepDefineId', 'clientAddress'],
      columns: {
        orderCode: {
          label: '报装编号',
          sort: true,
          filter: {
            type: 'input',
            like: true
          }
        },
        orderStatus: {
          label: '归档状态',
          type: 'select'
        },
        flowInstanceId: {
          label: '工单号',
          sort: true,
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
        stepDefineId: {
          label: '流程定义步骤'
        },
        serviceType: {
          label: '服务类型',
          type: 'select',
          filter: {
            type: 'select',
            like: true
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
        meterDiameter: {
          label: '水表口径',
          type: 'select',
          filter: {
            type: 'select',
            like: true
          }
        },
        createTime: {
          label: '办理时间',
          type: 'time',
          filter: {
            type: 'dateRange'
          }
        },
        clientNo: {
          label: '户号',
          filter: {
            type: 'input',
            like: true
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
            type: 'input',
            like: true
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
        clientAddress: {
          label: '用水地址',
          width: '200px',
          filter: {
            type: 'input',
            like: true
          }
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
        userCount: {
          label: '用水人数',
          filter: {
            type: 'input',
            like: true
          }
        },
        updateTime: {
          label: '申请时间',
          type: 'time'
        },
        currentStepDefineId: {
          label: '当前步骤',
          type: 'select',
          filter: {
            type: 'select'
          }
        }
      },
      orderByInit: [{
        name: 'orderCode',
        sort: 'desc'
      }]
    }
  },
  methods: {
    customOperationEvent (name, data) {
      if (name === 'detail') {
        this.$router.push('task/' + data.id)
      }
    }
  }
}
</script>
<template>
  <div>
    <div class="main">
      <h2 class="title">
        {{title}}
      </h2>
      <datatable class="datatable"
        :label="label"
        :labelName="labelName"
        :resource="resource"
        :relation="relation"
        :customOperation="customOperation"
        :columnsObject="columns"
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
import { fetchCreate } from '../../../utils/api'
import Datatable from '../../../components/Datatable'

export default {
  name: 'apply',
  components: {
    Datatable
  },
  data () {
    const menu = getMenus().find(item => item.menuurl === '/install/stopInstall/apply')
    return {
      flowDefineId: menu.flowid,
      resource: 'installorder/getWaterUsers',
      title: '报停申请',
      label: '报停申请',
      labelName: 'name',
      relation: false,
      customOperation: [{
        name: 'apply',
        label: '报停申请',
        icon: 'plus'
      }],
      tableInitList: ['clientNo', 'clientName', 'clientPhone', 'clientContact', 'clientAddress', 'userCount', 'cardNo'],
      tableFullList: ['clientNo', 'clientName', 'clientPhone', 'clientContact', 'clientAddress', 'userCount', 'cardNo', 'meterDiameter', 'cardType', 'clientType'],
      columns: {
        orderCode: {
          label: '报装编号',
          sort: true,
          filter: {
            type: 'input',
            like: true
          }
        },
        clientType: {
          label: '用水性质',
          type: 'select'
        },
        serviceType: {
          label: '服务类型'
        },
        orderStatus: {
          label: '归档状态'
        },
        flowInstanceId: {
          label: '报装流程实例',
          sort: true,
          filter: {
            type: 'input',
            like: true
          }
        },
        stepDefineId: {
          label: '流程定义步骤'
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
          },
          sort: true
        },
        updateTime: {
          label: '申请时间',
          type: 'time'
        }
      },
      filterByInit: []
    }
  },
  created () {
    // this.getRelation()
  },
  methods: {
    customOperationEvent (name, data) {
      if (name === 'task') {
        this.$router.push('/base/task/' + data.flowInstanceId)
      } else if (name === 'apply') {
        this.serveiceEvent(data, '8')
      }
    },
    serveiceEvent (data, type) { // serveice自定义按钮事件
      data.serviceType = type
      fetchCreate({
        resource: 'flow/start?flowDefineId=' + this.flowDefineId,
        data: data
      })
      .then(data => {
        // this.$router.push('/base/task/' + data)
        if (String(data) === 'undefined') {
          return false
        } else {
          this.$router.push('/base/task/' + data)
        }
      })
    }
  }
}
</script>

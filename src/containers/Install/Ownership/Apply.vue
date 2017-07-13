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
        :toolbar="toolbar"
        :relation="relation"
        :customOperation="customOperation"
        :columnsObject="columns"
        :tableInitList="tableInitList"
        :tableFullList="tableFullList"
        :filterByInit="filterByInit"
        :relationResource="relationResource"
        @customOperationEvent="customOperationEvent"
      >
      </datatable>
      <v-dialog
        :dialogVisible="dialogVisible"
        :dialogContent="dialogContent"
        @dialogEvent="dialogEvent"
        @onDialogChange="onDialogChange">
        <h3 class="dialog-title">您是否发起【{{dialogContent.label}}】业务?</h3>
      </v-dialog>
    </div>
  </div>
</template>

<script>
import { getMenus } from '../../../auth'
import { fetchList, fetchCreate } from '../../../utils/api'
import Datatable from '../../../components/Datatable'
import VDialog from '../../../components/VDialog'

export default {
  name: 'apply',
  components: {
    Datatable,
    VDialog
  },
  data () {
    const menu = getMenus().find(item => item.menuurl === '/install/ownership/apply')
    return {
      dialogVisible: false,
      dialogContent: {},
      flowDefineId: menu.flowid,
      resource: 'installorder/getWaterUsers',
      relationResource: 'installorder',
      title: '过户申请',
      label: '登记过户信息',
      labelName: 'name',
      relation: true,
      toolbar: {
        export: true
      },
      customOperation: [{
        name: 'transfer',
        label: '过户申请',
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
        clientType: {
          label: '用水性质',
          type: 'select'
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
        serviceType: {
          label: '服务类型'
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
    customOperationEvent (name, data, label) {
      this.dialogVisible = true
      this.dialogContent = {
        name: name,
        data: data,
        label: label,
        showMsg: true
      }
    },
    customToolbarEvent (name, data) {
      fetchCreate({
        resource: 'flow/start?flowDefineId=' + this.flowDefineId
      })
      .then(data => {
        // this.$router.push('/base/task/' + data)
        if (String(data) === 'undefined') {
          return false
        } else {
          this.$router.push('/base/task/' + data)
        }
      })
    },
    dialogEvent (name, diaData, bol) {
      this.dialogVisible = false
      if (name === 'transfer') {
        if (bol) {
          this.serveiceEvent(diaData, '3')
        }
      }
    },
    onDialogChange (val) {
      this.dialogVisible = val
    },
    getRelation () {
      fetchList({
        resource: this.resource + '/relation'
      })
      .then((data) => {
        console.log(data)
        Object.keys(data).map(key => {
          this.columns[key].options = data[key]
        })
        this.filterByInit = [{
          name: 'stepDefineId',
          type: 'equalto',
          value: data.stepDefineId.find(item => item.flowDefineId === this.flowDefineId && item.label === '过户申请').id
        }]
      })
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

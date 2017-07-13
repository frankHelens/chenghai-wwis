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
        :customToolbar="customToolbar"
        :columnsObject="columns"
        :customOperation="customOperation"
        :tableInitList="tableInitList"
        :tableFullList="tableFullList"
        :filterByInit="filterByInit"
        @customToolbarEvent="customToolbarEvent"
        @customOperationEvent="customOperationEvent"
      >
      </datatable>
    </div>
  </div>
</template>

<script>
import { fetchCreate, fetchList } from '../../../utils/api'
import Datatable from '../../../components/Datatable'
import { getMenus } from '../../../auth'

export default {
  name: 'audit',
  components: {
    Datatable
  },
  data () {
    const menu = getMenus().find(item => item.menuurl === '/storage/recover/fill')
    return {
      flowDefineId: menu.flowid,
      resource: 'productBackOrder',
      title: '退仓信息填写',
      label: '退仓信息填写',
      labelName: 'name',
      relation: true,
      hasRelation: false,
      customOperation: [{
        name: 'task',
        label: '工单详情',
        icon: 'id-card-o'
      }],
      customToolbar: [{
        name: 'productInOrder',
        label: '退仓申请',
        icon: 'drop'
      }],
      tableInitList: ['orderCode', 'applyDeptName', 'applyUserName', 'applyTime'],
      tableFullList: ['orderCode', 'applyDeptName', 'applyUserName', 'applyTime'],
      columns: {
        type: {
          label: '需求类型',
          type: 'select'
        },
        applyRemark: {
          label: '234234'
        },
        stepDefineId: {
          label: '步骤定义',
          type: 'select'
        },
        orderCode: {
          label: '需求流水编号'
        },
        applyDeptName: {
          label: '需求部门'
        },
        applyUserName: {
          label: '需求人'
        },
        applyTime: {
          label: '填报日期',
          type: 'time'
        }
      },
      filterByInit: []
    }
  },
  created () {
    this.getRelation()
  },
  methods: {
    customToolbarEvent (name, data) {
      fetchCreate({
        resource: 'flow/start?flowDefineId=' + this.flowDefineId
      })
      .then(data => {
        if (String(data) === 'undefined') {
          this.$message({
            showClose: true,
            message: '没有权限,无法操作',
            type: 'error'
          })
          return false
        } else {
          this.$router.replace('/base/task/' + data)
        }
      })
    },
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
          this.columns[key].options = data[key]
        })
        // console.log(this.flowDefineId)
        this.filterByInit = [{
          name: 'stepDefineId',
          type: 'equalto',
          value: data.stepDefineId.find(item => item.flowDefineId === this.flowDefineId && item.label === '退仓信息填写').id
        }]
        this.hasRelation = true
      })
    }
  }
}
</script>

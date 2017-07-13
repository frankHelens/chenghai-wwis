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
        :toolbar="toolbar"
        :operation="operation"
        :columnsObject="columns"
        :dialogSize="dialogSize"
        :tableInitList="tableInitList"
        :tableFullList="tableFullList"
        :updateList="updateList"
        :filterByInit="filterByInit"
      >
      </datatable>
    </div>
  </div>
</template>

<script>
import Datatable from '../../components/Datatable'
export default {
  name: 'StepDefine',
  components: {
    Datatable
  },
  data () {
    return {
      stepId: this.$route.params.id,
      resource: 'flowStepDefine',
      title: '步骤定义列表',
      label: '步骤定义',
      labelName: 'name',
      dialogSize: 'tiny',
      relation: true,
      toolbar: {
        create: false
      },
      operation: {
        update: true
      },
      tableInitList: ['name', 'type', 'ownerIdList', 'createTime', 'enabled'],
      tableFullList: ['name', 'type', 'prop', 'controlType', 'flowDefineId', 'flowDefineName', 'stepPrevIds', 'stepNextIds', 'ownerIdList', 'formId', 'formTemplate', 'remark', 'createUserId', 'createTime', 'modifyUserId', 'modifyTime', 'sort', 'enabled'],
      updateList: ['sort', 'ownerIdList'],
      columns: {
        name: {
          label: '工作流名称',
          sort: true,
          filter: {
            type: 'input',
            like: true
          }
        },
        type: {
          label: '流程节点类型',
          type: 'select',
          sort: true,
          filter: {
            type: 'select'
          }
        },
        prop: {
          label: '流程节点属性',
          type: 'select',
          sort: true,
          filter: {
            type: 'select'
          }
        },
        controlType: {
          label: '流程节点控制类型',
          sort: true,
          type: 'select',
          filter: {
            type: 'select'
          }
        },
        flowDefineId: {
          label: '工作流定义',
          sort: true,
          type: 'select',
          filter: {
            type: 'select'
          }
        },
        flowDefineName: {
          label: '工作流定义名称',
          type: 'input'
        },
        stepPrevIds: {
          label: '流程上一个步骤'
        },
        stepNextIds: {
          label: '流程下一个步骤'
        },
        ownerIdList: {
          label: '节点所有者',
          type: 'multiselect',
          form: {
            type: 'multiselect'
          }
        },
        formId: {
          label: '表单'
        },
        formTemplate: {
          label: '步骤对应表单模板'
        },
        remark: {
          label: '备注说明'
        },
        createUserId: {
          label: '创建用户'
        },
        createTime: {
          label: '创建时间',
          type: 'time',
          filter: {
            type: 'dateRange'
          }
        },
        modifyUserId: {
          label: '修改用户'
        },
        modifyTime: {
          label: '修改时间',
          type: 'time'
        },
        sort: {
          label: '排序',
          form: {
            type: 'input'
          }
        },
        enabled: {
          label: '是否启用',
          type: 'select',
          filter: {
            type: 'select'
          }
        }
      },
      filterByInit: [{
        name: 'flowDefineId',
        type: 'equalto',
        value: this.$route.params.id
      }]
    }
  },
  watch: {
    $route (to) {
      this.stepId = to.params.id
      this.filterByInit = [{
        name: 'flowDefineId',
        type: 'equalto',
        value: this.$route.params.id
      }]
    }
  }
}
</script>

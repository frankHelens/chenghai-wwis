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
        :dialogSize="dialogSize"
        :relation="relation"
        :toolbar="toolbar"
        :operation="operation"
        :columnsObject="columns"
        :tableInitList="tableInitList"
        :tableFullList="tableFullList"
        :customOperation="customOperation"
        :updateList="updateList"
        @customOperationEvent="customOperationEvent"
      >
      </datatable>
    </div>
  </div>
</template>

<script>
import Datatable from '../../components/Datatable'

export default {
  name: 'flowDefine',
  components: {
    Datatable
  },
  data () {
    return {
      resource: 'flowDefine',
      title: '流程定义列表',
      label: '流程定义',
      labelName: 'name',
      relation: true,
      toolbar: {
        create: false
      },
      operation: {
        update: true
      },
      dialogSize: 'tiny',
      customOperation: [{
        name: 'step',
        label: '步骤',
        icon: 'id-card-o'
      }],
      tableInitList: ['name', 'type', 'dueDay', 'ownerIdList', 'createTime'],
      tableFullList: ['name', 'type', 'bizCode', 'bizTable', 'dueDay', 'ownerIdList', 'createUserId', 'createTime', 'modifyUserId', 'modifyTime', 'sort', 'enabled', 'pathTemplate', 'remark'],
      updateList: ['name', 'ownerIdList', 'enabled'],
      columns: {
        id: {
          label: 'ID',
          sort: true,
          filter: {
            type: 'select',
            like: true
          }
        },
        name: {
          label: '工作流名称',
          sort: true,
          filter: {
            type: 'input',
            like: true
          },
          form: {
            type: 'input'
          }
        },
        type: {
          label: '工作流类型',
          type: 'select',
          sort: true,
          filter: {
            type: 'select'
          }
        },
        bizCode: {
          label: '业务编码',
          filter: {
            type: 'input',
            like: true
          }
        },
        bizTable: {
          label: '业务表格名称'
        },
        dueDay: {
          label: '办理时限(天)'
        },
        remark: {
          label: '备注说明',
          type: 'input'
        },
        ownerIdList: {
          label: '流程所有者',
          type: 'multiselect',
          form: {
            type: 'multiselect'
          }
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
          label: '排序'
        },
        enabled: {
          label: '是否启用',
          type: 'select',
          filter: {
            type: 'select'
          },
          form: {
            type: 'switch'
          }
        },
        pathTemplate: {
          label: '流程路径模板'
        }
      }
    }
  },
  methods: {
    customOperationEvent (name, data) {
      if (name === 'step') {
        this.$router.push('flowDefine/' + data.id + '/StepDefine')
      }
    }
  }
}
</script>

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
        :toolbar="toolbar"
        :operation="operation"
        :relation="relation"
        :columnsObject="columns"
        :tableInitList="tableInitList"
        :tableFullList = 'tableFullList'
        :createList="createList"
        :updateList="updateList"
        :createFormValues="createFormValues"
        :formLabelWidth="'120px'"
      >
      </datatable>
    </div>
  </div>
</template>

<script>
import Datatable from '../../../components/Datatable'
import VForm from '../../../components/VForm'

export default {
  name: 'base',
  components: {
    Datatable,
    VForm
  },
  data () {
    return {
      resource: 'product',
      title: '物料信息管理',
      label: '物料',
      labelName: 'name',
      toolbar: {
        create: true
      },
      operation: {
        update: true,
        delete: true
      },
      dialogSize: 'small',
      tableInitList: ['code', 'name', 'size', 'type', 'unit', 'spec', 'costPrice'],
      tableFullList: ['code', 'name', 'size', 'type', 'unit', 'spec', 'costPrice'],
      createList: ['code', 'name', 'size', 'type', 'unit', 'spec', 'costPrice'],
      updateList: ['code', 'name', 'size', 'type', 'unit', 'spec', 'costPrice'],
      createFormValues: {
        name: '',
        spec: '',
        unit: '',
        type: '',
        size: '',
        code: '',
        basePrice: '',
        costPrice: ''
      },
      relation: true,
      columns: {
        name: {
          label: '物料名称',
          filter: {
            type: 'input',
            like: true
          },
          form: {
            type: 'input',
            rules: [
              { required: true, message: '请输入物料名称', trigger: 'blur' }
            ]
          }
        },
        basePrice: {
          label: '基础价格',
          form: {
            type: 'input',
            rules: [{
              required: true,
              message: '请输入基础价格',
              trigger: 'blur'
            }]
          }
        },
        costPrice: {
          label: '售价',
          form: {
            type: 'input'
          }
        },
        spec: {
          label: '物料描述',
          form: {
            type: 'input'
          }
        },
        unit: {
          label: '物料计量单位',
          type: 'select',
          width: '106px',
          filter: {
            type: 'select'
          },
          form: {
            type: 'select',
            live: true
          }
        },
        type: {
          label: '物料类别',
          type: 'select',
          filter: {
            type: 'select'
          },
          form: {
            type: 'select',
            live: true
          }
        },
        size: {
          label: '物料规格',
          type: 'select',
          form: {
            type: 'select',
            live: true
          }
        },
        code: {
          label: '物料代码',
          filter: {
            type: 'input',
            like: true
          },
          form: {
            type: 'input'
          }
        }
      }
    }
  }
}
</script>
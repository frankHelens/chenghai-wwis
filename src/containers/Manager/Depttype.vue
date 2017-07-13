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
        :columnsObject="columns"
        :tableInitList="tableInitList"
        :tableFullList="tableFullList"
        :createList="createList"
        :updateList="updateList"
        :createFormValues="createFormValues"
      >
      </datatable>
    </div>
  </div>
</template>

<script>
import Datatable from '../../components/Datatable'

export default {
  name: 'depttype',
  components: {
    Datatable
  },
  data () {
    return {
      resource: 'depttype',
      title: '组织类别管理',
      label: '组织类别',
      labelName: 'name',
      toolbar: {
        create: true
      },
      operation: {
        update: true,
        delete: true
      },
      dialogSize: 'tiny',
      tableInitList: ['id', 'name'],
      tableFullList: ['id', 'name'],
      createList: ['name'],
      updateList: ['name'],
      createFormValues: {
        name: ''
      },
      columns: {
        id: {
          label: 'ID',
          sort: true
        },
        name: {
          label: '组织类别名称',
          sort: true,
          filter: {
            type: 'input',
            like: true
          },
          form: {
            type: 'input',
            rules: [
              { max: 10, message: '长度不能大于10', trigger: 'blur' }
            ]
          }
        }
      }
    }
  }
}
</script>

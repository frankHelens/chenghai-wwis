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
  name: 'department',
  components: {
    Datatable
  },
  data () {
    return {
      resource: 'department',
      title: '组织架构管理',
      label: '组织架构',
      labelName: 'deptname',
      toolbar: {
        create: true
      },
      operation: {
        update: true,
        delete: true
      },
      dialogSize: 'tiny',
      tableInitList: ['deptname', 'deptlevelid', 'depttypeids', 'deptparentid', 'deptdesc'],
      tableFullList: ['deptname', 'deptlevelid', 'depttypeids', 'deptparentid', 'deptdesc'],
      createList: ['deptname', 'deptlevelid', 'depttypeids', 'deptparentid', 'deptdesc'],
      updateList: ['deptname', 'deptlevelid', 'depttypeids', 'deptparentid', 'deptdesc'],
      createFormValues: {
        deptname: '',
        deptlevelid: '',
        depttypeids: [],
        deptparentid: '',
        deptdesc: ''
      },
      relation: true,
      columns: {
        deptname: {
          label: '部门名称',
          sort: true,
          filter: {
            type: 'input',
            like: true
          },
          form: {
            type: 'input',
            rules: [
              { required: true, message: '请输入部门名称', trigger: 'blur' },
              { max: 20, message: '长度不能大于20', trigger: 'blur' }
            ]
          }
        },
        deptlevelid: {
          label: '部门级别',
          sort: true,
          type: 'select',
          live: true,
          filter: {
            type: 'select'
          },
          form: {
            type: 'select',
            rules: [
              { type: 'number', required: true, message: '请输入部门级别', trigger: 'change' }
            ]
          }
        },
        depttypeids: {
          label: '部门类别',
          type: 'multiselect',
          form: {
            type: 'multiselect',
            rules: [
              { type: 'array', required: true, message: '请选择部门类别', trigger: 'change' }
            ]
          }
        },
        deptparentid: {
          label: '上级部门',
          sort: true,
          type: 'select',
          live: true,
          filter: {
            type: 'select'
          },
          form: {
            type: 'select',
            rules: [
              { type: 'number', required: true, message: '请输入上级部门', trigger: 'change' }
            ]
          }
        },
        deptdesc: {
          label: '部门描述',
          filter: {
            type: 'input',
            like: true
          },
          form: {
            type: 'input',
            rules: [
              { max: 20, message: '长度不能大于20', trigger: 'blur' }
            ]
          }
        }
      }
    }
  }
}
</script>
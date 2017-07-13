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
        :operation="operation"
        :dialogSize="dialogSize"
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
  name: 'role',
  components: {
    Datatable
  },
  data () {
    return {
      resource: 'role',
      title: '角色管理',
      label: '角色',
      labelName: 'rolename',
      toolbar: {
        create: true
      },
      operation: {
        update: true,
        delete: true
      },
      tableInitList: ['rolename', 'roledesc', 'rolestate'],
      tableFullList: ['rolename', 'roledesc', 'rolestate'],
      createList: ['rolename', 'roledesc', 'rolestate', 'menuids'],
      updateList: ['rolename', 'roledesc', 'rolestate', 'menuids'],
      createFormValues: {
        rolename: '',
        roledesc: '',
        rolestate: '',
        menuids: []
      },
      relation: true,
      dialogSize: 'tiny',
      columns: {
        rolename: {
          label: '角色名称',
          sort: true,
          filter: {
            type: 'input',
            like: true
          },
          form: {
            type: 'input',
            rules: [
              { required: true, message: '请输入账号', trigger: 'blur' },
              { max: 50, message: '长度不能大于50', trigger: 'blur' }
            ]
          }
        },
        roledesc: {
          label: '角色描述',
          form: {
            type: 'input',
            rules: [
              { max: 50, message: '长度不能大于50', trigger: 'blur' }
            ]
          }
        },
        rolestate: {
          label: '角色状态',
          type: 'select',
          filter: {
            type: 'select'
          },
          form: {
            type: 'switch'
          }
        },
        menuids: {
          label: '权限列表',
          type: 'select',
          form: {
            type: 'tree'
          }
        }
      }
    }
  }
}
</script>
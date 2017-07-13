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
      >
      </datatable>
    </div>
  </div>
</template>

<script>
import Datatable from '../../components/Datatable'

export default {
  name: 'menu',
  components: {
    Datatable
  },
  data () {
    return {
      resource: 'menu',
      title: '菜单管理',
      label: '菜单',
      labelName: 'menulabel',
      toolbar: {
        create: true
      },
      operation: {
        update: true,
        delete: true
      },
      dialogSize: 'small',
      tableInitList: ['menuname', 'menulabel', 'menutype', 'menuparentid', 'menuorder'],
      tableFullList: ['menuname', 'menulabel', 'menutype', 'menuparentid', 'menuorder', 'flowid', 'stepid', 'isvisible', 'menuurl', 'systemid', 'menuicon'],
      createList: ['menuname', 'menulabel', 'menutype', 'menuparentid', 'menuorder', 'flowid', 'stepid', 'isvisible', 'menuurl', 'systemid', 'menuicon'],
      updateList: ['menuname', 'menulabel', 'menutype', 'menuparentid', 'menuorder', 'flowid', 'stepid', 'isvisible', 'menuurl', 'systemid', 'menuicon'],
      createFormValues: {
        menuname: '',
        menulabel: '',
        menutype: '',
        menuparentid: '',
        menuorder: '',
        flowid: 0,
        isvisible: 0,
        menuurl: '',
        systemid: 0,
        menuicon: ''
      },
      relation: true,
      columns: {
        menuname: {
          label: '菜单英文名',
          filter: {
            type: 'input',
            like: true
          },
          form: {
            type: 'input',
            rules: [
              { required: true, message: '请输入配置名称', trigger: 'blur' },
              { max: 30, message: '长度不能大于30', trigger: 'blur' }
            ]
          }
        },
        menulabel: {
          label: '菜单中文名',
          filter: {
            type: 'input',
            like: true
          },
          form: {
            type: 'input',
            rules: [
              { required: true, message: '请输入配置名称', trigger: 'blur' }
            ]
          }
        },
        menutype: {
          label: '菜单类型',
          type: 'select',
          filter: {
            type: 'select'
          },
          form: {
            type: 'select',
            rules: [
              { type: 'number', required: true, message: '请输入菜单类型', trigger: 'blur' }
            ]
          }
        },
        menuparentid: {
          label: '上级菜单',
          type: 'select',
          filter: {
            type: 'select',
            live: true
          },
          form: {
            type: 'select',
            live: true
          },
          optionsInit: [{id: 0, label: '无上级菜单'}]
        },
        menuorder: {
          label: '排序',
          sort: true,
          form: {
            type: 'input'
          }
        },
        isvisible: {
          label: '是否可见',
          type: 'select',
          form: {
            switchWidth: 'large',
            type: 'switch',
            rules: [
              { type: 'number', required: true, message: '请输入是否可见', trigger: 'blur' }
            ]
          }
        },
        menuurl: {
          label: '路径',
          form: {
            type: 'input'
          }
        },
        systemid: {
          label: '系统',
          type: 'select',
          filter: {
            type: 'select'
          },
          form: {
            type: 'select',
            rules: [
              { type: 'number', required: true, message: '请输入系统', trigger: 'blur' }
            ]
          },
          optionsInit: [{id: 0, label: '本身是系统'}]
        },
        flowid: {
          label: '关联流程',
          type: 'select',
          form: {
            type: 'select',
            live: true
          },
          optionsInit: [{id: 0, label: '无关联流程'}]
        },
        stepid: {
          label: '关联步骤',
          type: 'select',
          form: {
            type: 'select',
            live: true,
            changeOptions: true
          },
          optionsInit: [{id: 0, label: '无关联步骤'}]
        },
        menuicon: {
          label: 'icon',
          form: {
            type: 'input'
          }
        }
      }
    }
  }
}
</script>

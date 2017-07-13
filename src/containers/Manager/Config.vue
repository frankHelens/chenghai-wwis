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
        :tableFullList="tableFullList"
        :tableInitList="tableInitList"
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
  name: 'config',
  components: {
    Datatable
  },
  data () {
    return {
      resource: 'sysConfig',
      title: '参数配置',
      label: '参数配置',
      labelName: 'name',
      toolbar: {
        create: true
      },
      operation: {
        update: true,
        delete: true
      },
      dialogSize: 'tiny',
      tableInitList: ['name', 'enabled', 'sort', 'value', 'createTime', 'type'],
      tableFullList: ['name', 'enabled', 'sort', 'value', 'createTime', 'type'],
      createList: ['name', 'enabled', 'sort', 'value', 'type'],
      updateList: ['name', 'enabled', 'sort', 'value', 'type'],
      createFormValues: {
        name: '',
        enabled: true,
        sort: '',
        status: '',
        type: '',
        value: ''
      },
      relation: true,
      columns: {
        name: {
          label: '配置名称',
          sort: true,
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
        enabled: {
          label: '启用状态',
          sort: true,
          type: 'select',
          filter: {
            type: 'select'
          },
          form: {
            type: 'switch',
            default: true,
            validate: {
              required: true
            }
          }
        },
        sort: {
          label: '排序',
          sort: true,
          form: {
            type: 'number'
          }
        },
        createTime: {
          label: '创建时间',
          type: 'time'
        },
        status: {
          label: '记录状态',
          sort: true,
          filter: {
            type: 'input'
          },
          form: {
            type: 'input'
          }
        },
        type: {
          label: '配置类型',
          sort: true,
          filter: {
            type: 'input'
          },
          form: {
            type: 'input',
            rules: [
              { max: 20, message: '长度不能大于20', trigger: 'blur' }
            ]
          }
        },
        value: {
          label: '配置值',
          filter: {
            type: 'input',
            like: true
          },
          form: {
            type: 'input',
            validate: {
              required: true
            }
          }
        },
        upload: {
          label: '上传文件',
          form: {
            type: 'upload'
          }
        }
      }
    }
  }
}
</script>

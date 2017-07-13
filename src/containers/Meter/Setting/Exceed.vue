<template>
  <datatable
    class="datatable"
    :label="label"
    :labelName="labelName"
    :resource="resource"
    :dialogSize="dialogSize"
    :toolbar="toolbar"
    :operation="operation"
    :relation="relation"
    :columnsObject="columns"
    closeColumnFilter
    :tableInitList="tableInitList"
    :createList="createList"
    :updateList="updateList"
    :createFormValues="createFormValues"
  >
  </datatable>
</template>

<script>
import Datatable from '../../../components/Datatable'

export default {
  name: 'config',
  components: {
    Datatable
  },
  data () {
    return {
      resource: 'outtimeSetting',
      label: '超期设置',
      labelName: 'meterType',
      toolbar: {
        create: true
      },
      operation: {
        update: true,
        delete: true
      },
      dialogSize: 'tiny',
      tableInitList: ['meterType', 'meterDiameter', 'meterServiceYear'],
      createList: ['meterType', 'meterDiameter', 'meterServiceYear'],
      updateList: ['meterType', 'meterDiameter', 'meterServiceYear'],
      createFormValues: {
      },
      relation: false,
      columns: {
        id: {
          label: '超期设置'
        },
        meterType: {
          label: '表型',
          form: {
            type: 'input'
          }
        },
        meterDiameter: {
          label: '口径',
          form: {
            type: 'input'
          }
        },
        meterServiceYear: {
          label: '使用年限',
          form: {
            type: 'number'
          }
        }
      }
    }
  }
}
</script>

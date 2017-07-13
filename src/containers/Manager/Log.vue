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
        :columnsObject="columns"
        :tableInitList="tableInitList"
        :tableFullList="tableFullList"
      >
      </datatable>
    </div>
  </div>
</template>

<script>
import Datatable from '../../components/Datatable'

export default {
  name: 'log',
  components: {
    Datatable
  },
  data () {
    return {
      resource: 'logOperation',
      title: '操作日志',
      label: '日志',
      labelName: 'userId',
      tableInitList: ['userId', 'type', 'logTime', 'content'],
      tableFullList: ['userId', 'type', 'logTime', 'content'],
      relation: true,
      columns: {
        userId: {
          label: '操作用户',
          sort: true,
          type: 'select',
          filter: {
            type: 'select',
            live: true
          }
        },
        type: {
          label: '操作类型',
          sort: true,
          type: 'select',
          filter: {
            type: 'select'
          }
        },
        logTime: {
          label: '操作时间',
          type: 'time',
          filter: {
            type: 'dateRange'
          }
        },
        content: {
          label: '操作内容'
        }
      }
    }
  }
}
</script>

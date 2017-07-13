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
        :tableFullList = 'tableFullList'
      >
      </datatable>
    </div>
  </div>
</template>

<script>
import Datatable from '../../../components/Datatable'
import VForm from '../../../components/VForm'

export default {
  name: 'batch',
  components: {
    Datatable,
    VForm
  },
  data () {
    return {
      resource: 'productStoreLot',
      title: '批次库存管理',
      label: '批次库存管理',
      labelName: 'repertory',
      operation: {
        update: false,
        delete: false
      },
      tableInitList: ['productId', 'totalNum', 'currentNum', 'actualNum', 'borrowNum', 'outNum', 'createTime', 'updateTime'],
      tableFullList: ['productId', 'totalNum', 'currentNum', 'actualNum', 'borrowNum', 'outNum', 'createTime', 'updateTime'],
      relation: true,
      columns: {
        productId: {
          label: '物料',
          type: 'select',
          labelName: 'name'
        },
        totalNum: {
          label: '入仓库存数量',
          form: {
            type: 'input'
          }
        },
        currentNum: {
          label: '现库存数量',
          filter: {
            type: 'input',
            like: true
          },
          form: {
            type: 'input'
          }
        },
        actualNum: {
          label: '实际库存'
        },
        borrowNum: {
          label: '借出数量'
        },
        outNum: {
          label: '出仓数量'
        },
        createTime: {
          label: '入库时间',
          type: 'time'
        },
        updateTime: {
          label: '更新时间',
          type: 'time'
        },
        size: {
          label: '大小',
          type: 'select'
        },
        type: {
          label: '类型',
          type: 'select'
        },
        unit: {
          label: '规格'
        }
      }
    }
  }
}
</script>
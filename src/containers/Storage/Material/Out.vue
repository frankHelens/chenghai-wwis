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
        :tableFullList='tableFullList'
      >
      </datatable>
    </div>
  </div>
</template>

<script>
import Datatable from '../../../components/Datatable'
import VForm from '../../../components/VForm'

export default {
  name: 'out',
  components: {
    Datatable,
    VForm
  },
  data () {
    return {
      resource: 'productOut',
      title: '物料出库记录',
      label: '物料出库记录',
      labelName: 'name',
      operation: {
        update: false,
        delete: false
      },
      tableInitList: ['productId', 'outTime', 'productType', 'type', 'size', 'unit', 'outNum'],
      tableFullList: ['productId', 'outTime', 'quantity', 'origin', 'deliveryTime', 'expiryTime', 'shelfLife', 'source', 'state', 'warehouse', 'productType', 'type', 'size', 'unit', 'outNum'],
      relation: true,
      columns: {
        productId: {
          label: '物料',
          type: 'select',
          labelName: 'name',
          filter: {
            type: 'select'
          }
        },
        outNum: {
          label: '数量'
        },
        productInId: {
          label: '库存批次',
          labelName: 'productId',
          type: 'select'
        },
        outTime: {
          label: '出库时间',
          type: 'time'
        },
        quantity: {
          label: '批次数量'
        },
        origin: {
          label: '产地',
          filter: {
            type: 'input',
            like: true
          }
        },
        deliveryTime: {
          label: '出厂时间',
          type: 'time'
        },
        productType: {
          label: '库存类型',
          type: 'select'
        },
        expiryTime: {
          label: '失效时间',
          type: 'time'
        },
        shelfLife: {
          label: '保质期',
          type: 'select',
          filter: {
            type: 'select'
          }
        },
        source: {
          label: '来源',
          type: 'select',
          filter: {
            type: 'select'
          }
        },
        state: {
          label: '状态',
          type: 'select',
          filter: {
            type: 'select'
          }
        },
        warehouse: {
          label: '存放位置',
          type: 'select',
          filter: {
            type: 'select'
          }
        },
        type: {
          label: '物料类别',
          type: 'select',
          filter: {
            type: 'select'
          }
        },
        size: {
          label: '物料规格',
          type: 'select'
        },
        unit: {
          label: '物料计量单位',
          type: 'select',
          filter: {
            type: 'select'
          }
        }
      }
    }
  }
}
</script>
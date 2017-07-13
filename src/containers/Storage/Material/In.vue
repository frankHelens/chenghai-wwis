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
  name: 'in',
  components: {
    Datatable,
    VForm
  },
  data () {
    return {
      resource: 'productIn',
      title: '物料入库记录',
      label: '物料入库记录',
      labelName: 'productId',
      operation: {
        update: false,
        delete: false
      },
      tableInitList: ['productId', 'inTime', 'brand', 'factory', 'quantity'],
      tableFullList: ['productId', 'inTime', 'brand', 'factory', 'supplier', 'quantity', 'origin', 'deliveryTime', 'expiryTime', 'source', 'state', 'warehouse'],
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
        inTime: {
          label: '入库时间',
          type: 'time',
          timeFormat: 'YYYY-MM-DD'
        },
        brand: {
          label: '品牌',
          filter: {
            type: 'input',
            like: true
          }
        },
        factory: {
          label: '厂商',
          filter: {
            type: 'input',
            like: true
          }
        },
        supplier: {
          label: '供应商',
          filter: {
            type: 'input',
            like: true
          }
        },
        quantity: {
          label: '数量'
        },
        currentStock: {
          label: '现库存数量'
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
          type: 'time',
          timeFormat: 'YYYY-MM-DD'
        },
        expiryTime: {
          label: '失效时间',
          type: 'time',
          timeFormat: 'YYYY-MM-DD'
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
          label: '类型',
          type: 'select'
        },
        size: {
          label: '规格',
          type: 'select'
        },
        unit: {
          label: '单位',
          type: 'select'
        }
      }
    }
  }
}
</script>
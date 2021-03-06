<template>
  <div>
    <div class="main">
      <h2 class="title">
        {{title}}
      </h2>
      <div class="clearfix column-filter-warp">
        <div v-if="toolbarList.length > 0" class="toolbar">
          <el-button v-for="toolbar in toolbarList" :type="toolbar.style" @click="toolbarEvent(toolbar.name)">
            <i :class="['fa', 'fa-' + toolbar.icon]"></i> {{toolbar.label}}
          </el-button>
        </div>
      </div> 
      <v-datatable ref="table"
        :style="tableWrapperWidth"
        :tableStatus="tableStatus"
        :tableData="tableData"
        :tableColumns="tableColumns"
      >
        <v-thead slot="header" name="header">
          <v-tr>
            <v-th v-for="column in tableColumns"
              :column="column"/>
          </v-tr>
        </v-thead>
      </v-datatable>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { cloneDeep } from 'lodash'
import { fetchList } from '../../../utils/api'
import VDatatable from '../../../components/VDatatable'
import VForm from '../../../components/VForm'
import VTable from '../../../components/VDatatable/VTable'
import VThead from '../../../components/VDatatable/VThead'
import VTr from '../../../components/VDatatable/VTr'
import VTh from '../../../components/VDatatable/VTh'

export default {
  name: 'material-editer',
  components: {
    VDatatable,
    VForm,
    VTable,
    VThead,
    VTr,
    VTh
  },
  created () {
    this.getRelation()
  },
  data () {
    return {
      flowId: this.$route.params.id,
      title: '查看采购信息',
      toolbarList: [{
        label: '返回', name: 'back', icon: 'arrow-left', style: 'primary'
      }],
      tableList: ['productId', 'type', 'size', 'unit', 'num', 'actualPrice'],
      columns: {
        productId: {
          label: '材料',
          type: 'select'
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
          label: '材料',
          type: 'select'
        },
        num: {
          label: '数量'
        },
        actualPrice: {
          label: '单价'
        }
      },
      tableData: [],
      onLoad: true
    }
  },
  computed: {
    ...mapGetters([
      'isOpen',
      'isHover'
    ]), /* navbar状态获取,影响table宽度 */
    tableWrapperWidth () {
      const width = !this.isOpen && !this.isHover ? document.body.clientWidth - 85 : document.body.clientWidth - 275
      return {
        width: width + 'px'
      }
    }, /* 判断新增、编辑表单是否分栏 */
    tableColumns () {
      return this.tableList.map(key => Object.assign(this.columns[key], {name: key}))
    }, /* 计算table显示的字段 */
    createColumns () {
      return this.createList.map(key => Object.assign(this.columns[key], {name: key}))
    }, /* 计算新增表单的字段 */
    updateColumns () {
      return this.updateList.map(key => Object.assign(this.columns[key], {name: key}))
    }, /* 计算编辑表单的字段 */
    tableStatus () {
      return this.onLoad ? 'load' : !this.tableData.length ? 'nodata' : 'default'
    } /* 计算table的状态，'load'为加载中，'nodata'为没有数据 */
  },
  methods: {
    getRelation (value) {
      fetchList({
        resource: 'productInOrderDetail/relation'
      })
      .then((data) => {
        this.columns.productId.options = data.productId.map(item => {
          return {
            ...item,
            label: item.name
          }
        })
        this.columns.type.options = data.type
        this.columns.unit.options = data.unit
        this.columns.size.options = data.size
        this.getData()
      })
    }, /* 获取当前资源所关联的数据，并填到对应的列里 */
    getData () {
      this.tableData = []
      this.onLoad = true
      fetchList({
        resource: 'productInOrderDetail/' + this.flowId
      })
      .then((data) => {
        this.onLoad = false
        this.tableData = data.map(product => {
          const productOptions = this.columns.productId.options.find(item => item.id === product.productId)
          return {
            ...productOptions,
            ...product
          }
        })
      }).catch(() => {
        this.onLoad = false
      })
    }, /* 获取数据 */
    toolbarEvent (name, data) {
      if (name === 'back') {
        this.$router.push('/base/task/' + this.flowId)
      } else {
        /* 自定义按钮的点击事件 */
        this.$emit('customToolbarEvent', name, data)
      }
    }, /* toolbar里按钮的点击事件 */
    operationEvent (name, data, index) {
      if (name === 'update') {
        /* 编辑按钮的点击事件 */
        this.updateDialogVisible = true
        this.updateDialogFormValues = Object.assign(cloneDeep(data), {
          index: index
        })
      } else if (name === 'delete') {
        this.tableData.splice(index, 1)
      }
    },
    createFormEvent (name, values, columns) {
      if (name === 'submit') {
        const product = cloneDeep(values)
        const { type, size, unit } = this.columns.productId.options.find(item => item.id === product.productId)
        this.tableData.push({
          ...product,
          type,
          size,
          unit
        })
        this.createDialogVisible = false
      }
    },
    updateFormEvent (name, values, columns) {
      if (name === 'submit') {
        this.tableData[values.index] = cloneDeep(values)
        this.updateDialogVisible = false
      }
    }
  }
}
</script>

<style scoped lang="sass">
tr
  border-left: none
  border-top: none
  th
    text-align: left
  th,td
    min-width: 120px
    padding: 10px 20px
    background-color: #fff
    border-left: 1px solid #ddd
    border-top: 1px solid #ddd
    &:first-child
      border-left: none
  &:first-child th
    border-top: none
  &:last-child
    th,td
      border-bottom: 1px solid #ddd
.toolbar
  float: left
.noData
  text-align: center
  line-height: 5
.column-filter-warp
  margin: 20px 0
</style>

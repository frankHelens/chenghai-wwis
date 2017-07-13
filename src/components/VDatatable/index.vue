<template>
  <div class="table-wrapper">
    <v-table>
      <slot name="header"></slot>
      <v-tbody>
        <v-tr v-for="(data, index) in tableData" :class="index%2 === 0 ? 'columnBackground' : ''">
          <v-td v-for="column in tableColumns"
            :data="data"
            :column="column">
          </v-td>
          <td 
            v-if="operationList.length > 0"
            class="td-operation">
            <el-button v-for="operation in operationList" size="mini" @click="$emit('operationEvent', operation.name, data, operation.label)">
              <i :class="['fa', 'fa-' + operation.icon]"></i> {{operation.label}}
            </el-button>
          </td>
        </v-tr>
      </v-tbody>
    </v-table>
    <div class="noData" v-if="tableStatus === 'load'">loading...</div>
    <div class="noData" v-else-if="tableStatus === 'nodata'">暂时没有数据</div>
  </div>
</template>

<script>
import VTable from './VTable'
import VThead from './VThead'
import VTbody from './VTbody'
import VTfoot from './VTfoot'
import VTr from './VTr'
import VTh from './VTh'
import VTd from './VTd'
import VFilter from './VFilter'

export default {
  name: 'v-datatable',
  components: {
    VTable,
    VThead,
    VTbody,
    VTfoot,
    VFilter,
    VTr,
    VTh,
    VTd
  },
  props: {
    tableStatus: String,
    tableData: Array,
    tableColumns: Array,
    operationList: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
    }
  },
  computed: {
    filter () {
      return this.tableColumns.filter(item => !!item.filter).length
    }
  },
  methods: {
    handleFilterByChange (column, filterBy) {
      this.$emit('filterByChange', column, filterBy)
    },
    handleSortByChange (column, sortDirection) {
      this.$emit('orderByChange', column, sortDirection)
    }
  }
}
</script>

<style scoped lang="sass">
.table-wrapper
  flex: 1
  overflow: auto
  border: 1px solid #ddd
table
  width: 100%
  background-color: #fff
  border: none
  border-spacing: 0
  border-collapse: collapse
tr
  border-left: none
  border-top: none
  th
    text-align: left
  th,td
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
.th-filter
  text-align: left
  white-space: nowrap
.td-operation
  white-space: nowrap
.noData
  text-align: center
  line-height: 5
.columnBackground
  td
    background-color: #f1f1f1
</style>
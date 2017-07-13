<template>
  <div>
    <div class="table-wrapper">
      <v-table>
        <v-thead>
          <!-- 标题栏，设置了排序 -->
          <v-tr>
            <v-th v-for="column in columns"
              :column="column"
              :sortKey="sortKey"
              :sortDirection="sortOrders[column.name] > 0 ? 'asc' : 'dsc'"
              @sortBy="sortBy(column.name)"
            />
          </v-tr>
          <!-- <tr>
            <th v-for="key in columns">
              <input type="text">
            </th>
          </tr> -->
        </v-thead>
        <v-tbody>
          <v-tr v-for="data in currentData">
            <v-td v-for="column in columns"
              :data="data"
              :column="column"
              @handleChange="handleChange"
              >
            </v-td>
          </v-tr>
        </v-tbody>
      </v-table>
      <div class="noData" v-show="!paginationTotal&&!onLoad">暂时没有数据</div>
      <div class="noData" v-show="onLoad">loading...</div>
    </div>
    <div class="page">
      <el-pagination
        class="pagination"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[10, 25, 50, 100]"
        :page-size="pageSize"
        :current-page="pageCurrent"
        layout="total, sizes, prev, pager, next"
        :total="paginationTotal">
      </el-pagination>
      <!-- <el-pagination
        class="pagination"
        layout="prev, pager, next"
        :current-page="currentPage"
        :page-size="pageSize"
        :total="paginationTotal">
      </el-pagination> -->
    </div>
  </div>
</template>

<script>
import table from './table'
import thead from './thead'
import tbody from './tbody'
import tfoot from './tfoot'
import tr from './tr'
import th from './th'
import td from './td'

export default {
  name: 'Grid',
  components: {
    'v-table': table,
    'v-thead': thead,
    'v-tbody': tbody,
    'v-tfoot': tfoot,
    'v-tr': tr,
    'v-th': th,
    'v-td': td
  },
  props: {
    onLoad: {
      type: Boolean,
      default: true
    },
    tableData: {
      type: Array,
      default: []
    },
    columns: {
      type: Array,
      default: []
    }
  },
  data: function () {
    console.log('asdfasd')
    var sortOrders = {}
    this.columns.forEach(function (column) {
      sortOrders[column.name] = 1
    })
    return {
      sortKey: '',
      sortOrders: sortOrders,
      pageSize: 25,
      pageCurrent: 2
    }
  },
  computed: {
    filteredData: function () {
      var sortKey = this.sortKey
      var filterKey = this.filterKey && this.filterKey.toLowerCase()
      var order = this.sortOrders[sortKey] || 1
      var data = this.tableData
      if (filterKey) {
        data = data.filter(function (row) {
          return Object.keys(row).some(function (key) {
            return String(row[key]).toLowerCase().indexOf(filterKey) > -1
          })
        })
      }
      if (sortKey) {
        data = data.slice().sort(function (a, b) {
          a = a[sortKey]
          b = b[sortKey]
          return (a === b ? 0 : a > b ? 1 : -1) * order
        })
      }
      return data
    },
    paginationTotal: function () {
      return this.filteredData.length
    },
    currentData: function () {
      var filteredData = this.filteredData
      var pageCurrent = this.pageCurrent
      var pageSize = this.pageSize
      return filteredData.slice(pageSize * (pageCurrent - 1), pageSize * pageCurrent)
      // return this.filteredData.split(this.pageSize * (this.pageCurrent - 1), this.pageSize * this.currentPage)
    }
  },
  methods: {
    sortBy: function (key) {
      this.sortKey = key
      this.sortOrders[key] = this.sortOrders[key] * -1
    },
    handleSizeChange: function (value) {
      this.pageCurrent = 1
      this.pageSize = value
    },
    handleCurrentChange: function (value) {
      this.pageCurrent = value
    },
    handleChange: function (value, column, data) {
      return 'dfsdf'
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
  th,td
    min-width: 113px
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
.noData
  text-align: center
  line-height: 5
.page
  display: flex
.pageSize
  flex: 1
  padding-top: 12px
  text-align: left
.pageSizeSelect
  max-width: 100px
.pagination
  flex: 1
  padding-top: 12px
  text-align: right
</style>
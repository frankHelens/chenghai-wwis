<template>
  <div>
    <div class="clearfix column-filter-warp">
      <div v-if="toolbarList.length > 0" class="toolbar">
        <el-button v-for="toolbar in toolbarList" type="button" @click="toolbarEvent(toolbar.name)">
          <i :class="['fa', 'fa-' + toolbar.icon]"></i> {{toolbar.label}}
        </el-button>
      </div>
      <div
        class="toolbar filterBar clearfix"
        v-if="filterBar.length">
       <!--  <el-row>
          <el-col
            :span="8"
            > -->
        <div class="fl filterItem" v-for="column in filterBar">
          <v-filter-bar
            v-if="column.filterBar"
            :column="column"
            :searchQuery="filterBy.filter(item => item.name === column.name)"
            @filterBy="filterByChange"/>
        </div>
    <!--       </el-col>
        </el-row> -->
      </div>
      <column-filter
        v-if="!closeColumnFilter"
        class="column-filter"
        :columnsObject="columnsObject"
        :tableList="tableList"
        :tableFullList="tableFullList"
        @grandSonEvent="changeListEvent"/>
    </div> 
    <el-dialog :title="createDialogLabel"
      v-if="createDialogShow"
      v-model="createDialogVisible"
      :size="dialogSize"
      >
      <v-form
        :columns="createColumns"
        :formLabelWidth="formLabelWidth"
        :values="createFormValues"
        :isColumn="isDialogFormColumn"
        :buttonList="createDialogButtons"
        @buttonListEvent="createFormEvent">
      </v-form>
    </el-dialog>
    <el-dialog :title="updateDialogLabel"
      v-if="updateDialogShow"
      v-model="updateDialogVisible"
      :size="dialogSize"
      >
      <v-form
        :columns="updateColumns"
        :formLabelWidth="formLabelWidth"
        :values="updateDialogFormValues"
        :isColumn="isDialogFormColumn"
        :buttonList="updateDialogButtons"
        @buttonListEvent="updateFormEvent">
      </v-form>
    </el-dialog>
    <v-datatable ref="table"
      :style="tableWrapperWidth"
      :tableStatus="tableStatus"
      :tableData="tableData"
      :tableColumns="tableColumns"
      :operationList="operationList"
      @operationEvent="operationEvent"
    >
      <v-thead slot="header" name="header">
        <v-tr>
          <v-th v-for="column in tableColumns"
            :column="column"
            :active="orderBy.length ? orderBy[0].name === column.name : false "
            :sortDirection="orderBy.find(item => item.name === column.name)?orderBy.find(item => item.name === column.name).sort:null"
            :width="column.width"
            @sortBy="orderByChange"/>
          <th v-if="operationList.length > 0">
            操作
          </th>
        </v-tr>
        <tr v-if="isFilter && isFilterShow">
          <th
            v-for="column in tableColumns"
            class="th-filter"
            :width="column.width"
            >
            <v-filter
              v-if="column.filter"
              :column="column"
              :searchQuery="filterBy.filter(item => item.name === column.name)"
              @filterBy="filterByChange"/>
          </th>
          <th v-if="operationList.length > 0">
          </th>
        </tr>
      </v-thead>
    </v-datatable>
    <export-table
      v-if="isExport"
      :tableData="tableData"
      :tableColumns="tableColumns"
      style="display:none;">
    </export-table>
    <div class="page">
      <el-pagination
        class="pagination"
        layout="total, sizes, prev, pager, next"
        :page-sizes="[10, 25, 50, 100]"
        :page-size="pageSize"
        :current-page="pageIndex"
        :total="recordsFiltered"
        @size-change="pageSizeChange"
        @current-change="pageIndexChange">
      </el-pagination>
    </div>
  </div>
</template>

<script>
/* globals localStorage */
// import moment from 'moment'
import { mapGetters } from 'vuex'
import { cloneDeep } from 'lodash'
import { fetchList, fetchCreate, fetchUpdate, fetchDelete } from '../../utils/api'
import md5 from 'md5'
import { pinyinInitial } from 'hanyu-pinyin'
import VDatatable from '../VDatatable'
import VForm from '../VForm'
import VFormItem from '../VForm/VFormItem'
import VTable from '../VDatatable/VTable'
import VThead from '../VDatatable/VThead'
import VTbody from '../VDatatable/VTbody'
import VTfoot from '../VDatatable/VTfoot'
import VTr from '../VDatatable/VTr'
import VTh from '../VDatatable/VTh'
import VTd from '../VDatatable/VTd'
import VFilter from '../VDatatable/VFilter'
import VFilterBar from '../VDatatable/VFilterBar'
import ColumnFilter from './columnFilter'
import TableFilter from './TableFilter'
import { getLodop } from '../../utils/LodopFuncs'
import ExportTable from './ExportTable'
import tableExport from 'table-export'
import { getRealname } from '../../auth'
import moment from 'moment'

export default {
  name: 'Datatable',
  props: {
    label: String, /* 页面对话框标题 */
    labelName: String, /* 标题英文名 */
    resource: {
      type: String,
      default: ''
    }, /* api资源接口名 */
    relation: {
      type: Boolean,
      default: false
    }, /* 是否有关联数据接口 */
    relationResource: String, /* 是否关联其他数据接口 */
    closeColumnFilter: {
      type: Boolean,
      default: false
    },
    dialogSize: {
      type: String,
      default: 'small'
    }, /* 对话框显示的大小(tiny/small/large/full) */
    columnsObject: Object,
    /* 表格所有字段定义
      columnsObject: {
        name: { 字段英文名称
          label: 字段中文名称
          sort: 是否排序
          type: 渲染显示类型
          filter: {
            type: 'input' 操作的类型
          },
          form: {
            type: 'input',
            rules: [{
                required: 是否必填
                message:  没填或填错的提示
                trigger: 检测的方式
            }]
          }
        }
      }
    */
    createFormValues: Object, /* 新增对话框的初始值 */
    tableInitList: {
      type: Array,
      default: () => []
    }, /* 列过滤器的初始状态 */
    tableFullList: {
      type: Array,
      default: () => []
    }, /* 所有表格可以显示的字段 */
    createList: {
      type: Array,
      default: () => []
    }, /* 所有新增时填写的字段 */
    updateList: {
      type: Array,
      default: () => []
    }, /* 所有编辑时填写的字段 */
    toolbar: {
      type: Object,
      default: () => {
        return {}
      }
    }, /* 左上角工具栏按钮 */
    customToolbar: {
      type: Array,
      default: () => []
    }, /* 左上角工具栏按钮（自定义） */
    operation: {
      type: Object,
      default: () => {
        return {}
      }
    }, /* 操作栏栏按钮 */
    customOperation: {
      type: Array,
      default: () => []
    }, /* 操作栏栏按钮（自定义） */
    formLabelWidth: {
      type: String,
      default: '100px'
    }, /* 新增及编辑对话框的标签长度 */
    filterByInit: {
      type: Array,
      default: () => []
    }, /* 过滤器的初始化 */
    orderByInit: {
      type: Array,
      default: () => []
    }, /* 排序的初始化 */
    toolFilter: {
      type: Object,
      default: () => {}
    }
  },
  components: {
    VDatatable,
    VForm,
    VFormItem,
    VTable,
    VThead,
    VTbody,
    VTfoot,
    VFilter,
    VFilterBar,
    VTr,
    VTh,
    VTd,
    ColumnFilter,
    TableFilter,
    ExportTable
  },
  data () {
    return {
      tableList: localStorage[this.$route.path] ? JSON.parse(localStorage[this.$route.path]) : this.tableInitList,
      isFilterShow: !this.relation,
      columns: this.columnsObject,
      createDialogVisible: false,
      createDialogLabel: '新增' + this.label,
      createDialogButtons: [{
        name: 'submit',
        label: '提交',
        style: 'primary',
        validate: true,
        isShow: true
      }],
      updateDialogVisible: false,
      updateDialogLabel: '编辑' + this.label,
      updateDialogFormValues: {},
      updateDialogButtons: [{
        name: 'submit',
        label: '提交',
        style: 'primary',
        validate: true,
        isShow: true
      }],
      tableData: [],
      filterBy: this.filterByInit,
      orderBy: this.orderByInit,
      onLoad: true,
      pageSize: 10,
      pageIndex: 1,
      recordsFiltered: 0,
      recordsTotal: 0,
      isExport: false,
      getUserName: getRealname(),
      nowDate: moment().format('YYYY年MM月DD日'),
      filterValue: this.toolFilter ? this.toolFilter.Values : ''
    }
  },
  created () {
    this.relation ? this.getRelation() : this.getData()
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
    }, /* 影响table宽度计算，和navbar状态相关 */
    createDialogShow () {
      return this.createDialogVisible
    }, /* 判断新增弹窗是否打开 */
    updateDialogShow () {
      return this.updateDialogVisible
    }, /* 判断编辑弹窗是否打开 */
    isDialogFormColumn () {
      return !(this.dialogSize === 'tiny')
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
      return this.onLoad ? 'load' : !this.recordsFiltered ? 'nodata' : 'default'
    }, /* 计算table的状态，'load'为加载中，'nodata'为没有数据 */
    isFilter () {
      return this.tableColumns.filter(item => !!item.filter).length
    }, /* 计算table是否有过滤行 */
    filterBar () {
      if (this.tableColumns.filter(item => !!item.filterBar).length) {
        return [...this.tableColumns.filter(item => !!item.filterBar), {
          name: 'query',
          label: '查询',
          filterBar: {
            type: 'button'
          }
        }]
      } else {
        return []
      }
    }, /* 计算表格 */
    operationList () {
      const operationUpdate = this.operation.update ? [{
        label: '编辑', name: 'update', icon: 'edit'
      }] : []
      const operationDelete = this.operation.delete ? [{
        label: '删除', name: 'delete', icon: 'trash-o'
      }] : []
      return [...operationUpdate, ...operationDelete, ...this.customOperation]
    }, /* 计算table的操作列 */
    toolbarList () {
      const toolbarCreate = this.toolbar.create ? [{
        label: '新增' + this.label, name: 'create', icon: 'plus'
      }] : []
      const toolbarPrint = this.toolbar.print ? [{
        label: '打印', name: 'print', icon: 'print'
      }] : []
      const toolbarExport = this.toolbar.export ? [{
        label: '导出', name: 'export', icon: 'download'
      }] : []
      return [...toolbarCreate, ...toolbarPrint, ...toolbarExport, ...this.customToolbar]
    } /* 计算table的工具栏toolbar */
  },
  methods: {
    changeFormValue (values) {
      console.log(123123)
    },
    filterDom () {
      const dom = this.$refs.table.$el.cloneNode(true)
      dom.querySelectorAll('#table thead tr')[1].parentNode.removeChild(dom.querySelectorAll('#table thead tr')[1])
      const tr = dom.querySelectorAll('#table tr')
      for (var i = 0; i < tr.length; i++) {
        tr[i].removeChild(tr[i].lastElementChild)
      }
      return dom
    }, /* 筛选dom的一些用不上的列表 */
    changeListEvent (tableList) {
      this.tableList = tableList
      localStorage[this.$route.path] = JSON.stringify(tableList)
    }, /* 列显示的修改函数 */
    orderByChange (column, sortDirection) {
      this.orderBy = [{
        name: column.name,
        sort: sortDirection
      }, ...this.orderBy.filter(item => item.name !== column.name)]
      this.getData()
    }, /* 排序规则的修改函数 */
    filterByChange (column, filterBy) {
      this.filterBy = [...this.filterBy.filter(item => item.name !== column.name), ...filterBy]
      this.getData()
    }, /* 过滤规则的修改函数 */
    pageSizeChange (value) {
      this.pageSize = value
      this.pageIndex = 1
      this.getData()
    }, /* 每页显示记录数的修改函数 */
    pageIndexChange (value) {
      this.pageIndex = value
      this.getData()
    }, /* 当前页码的修改函数 */
    getRelation (value) {
      const resource = this.relationResource || this.resource
      fetchList({
        resource: resource + '/relation'
      })
      .then((data) => {
        Object.keys(data).map(key => {
          if (this.columns[key]) {
            this.columns[key].options = [...this.columns[key].optionsInit || [], ...data[key]].map(option => {
              const label = option[this.columns[key].labelName || 'label']
              const subtext = pinyinInitial(label)
              return {
                label,
                subtext,
                ...option
              }
            })
          }
        })
        this.isFilterShow = true
        this.getData()
      })
    }, /* 获取当前资源所关联的数据，并填到对应的列里 */
    getData () {
      this.tableData = []
      this.onLoad = true
      // setTimeout(function () {
      fetchList({
        resource: this.resource,
        orderBy: this.orderBy.map(item => item.name + '|' + item.sort).join(';'),
        filterBy: this.filterBy.map(item => item.name + '|' + item.type + '|' + item.value).join(';'),
        pageSize: this.pageSize,
        pageIndex: this.pageIndex
      })
      .then((data) => {
        this.onLoad = false
        this.tableRender(data)
      }).catch((error) => {
        this.onLoad = false
        console.log(error)
      })
      // }.bind(this), 500)
    }, /* 获取数据 */
    tableRender (data) {
      this.tableData = data.data
      this.recordsFiltered = data.recordsFiltered
      this.recordsTotal = data.recordsTotal
      if (data.relation) {
        const relationKeys = Object.keys(data.relation)
        this.columns = this.columns.map(column => {
          return relationKeys.indexOf(column.name) >= 0
            ? Object.assign(column, {options: data.relation[column.name]})
            : column
        })
      }
    },
    toolbarEvent (name, data) {
      if (name === 'create') {
        /* 新增按钮的点击事件 */
        this.createDialogVisible = true
        this.createDialogFormValues = this.createFormValues
      } else if (name === 'print') {
        /* 打印按钮的点击事件 */
        this.printEvent()
      } else if (name === 'export') {
        /* 导出按钮的点击事件 */
        this.exportEvent()
      } else {
        /* 自定义按钮的点击事件 */
        this.$emit('customToolbarEvent', name, data)
      }
    }, /* toolbar里按钮的点击事件 */
    operationEvent (name, data, label) {
      if (name === 'update') {
        /* 编辑按钮的点击事件 */
        this.updateDialogLabel = '编辑' + this.label + '【' + data[this.labelName] + '】'
        this.updateDialogVisible = true
        this.updateDialogFormValues = cloneDeep(data)
      } else if (name === 'delete') {
        /* 删除按钮的点击事件 */
        this.deleteEvent(data.id, data[this.labelName])
      } else {
        /* 自定义按钮的点击事件 */
        this.$emit('customOperationEvent', name, data, label)
      }
    }, /* operation里按钮的点击事件 */
    printEvent () {
      const dom = this.filterDom()
      let html = this.toolbar.print.removeColspan ? dom.innerHTML : this.$refs.table.$el.innerHTML
      const direction = this.toolbar.print.direction || 2 // 打印方向
      const title = `<h2>${this.toolbar.print.title}</h2>`
      const footer = `<p><span>打印人：${this.getUserName}</span><span>打印日期：${this.nowDate}</span></p>`
      const tableCSS = `<style>
        h2{text-align:center;}
        table{width:100%;border-spacing:0;border-collapse:collapse;box-sizing:border-box;border: 1px solid #ddd;}
        tr{height:45px;}
        tr td,tr th{background-color:#fff;border:1px solid #ddd;text-align:center;}
        tr td:first-child,tr th:first-child{border-left:none;}
        tr:first-child th{border-top:1px solid #ddd;}
        tr:last-child td,tr:last-child th{border-bottom:1px solid #ddd}
        input[type="text"],button,a,span{border:0 !important;}p span{margin-right:20px;}
      </style>`
      let LODOP = getLodop()
      // 设置横向打印
      LODOP.SET_PRINT_PAGESIZE(direction, '100%', '100%', 'A4')
      // 横向时的正向显示
      LODOP.SET_SHOW_MODE('LANDSCAPE_DEFROTATED', 1)
      // 底图上有模拟走纸板的条纹线, 可以隐藏该条线
      LODOP.SET_SHOW_MODE('HIDE_PAPER_BOARD', 1)
      // 设置适宽
      LODOP.SET_PRINT_MODE('PRINT_PAGE_PERCENT', 'Auto-Width')
      // 标题
      LODOP.ADD_PRINT_HTM(26, 0, '100%', 100, tableCSS + title)
      LODOP.SET_PRINT_STYLEA(0, 'ItemType', 1)
      // 内容
      LODOP.ADD_PRINT_HTM(70, 0, '100%', '84%', tableCSS + html)
      // 打印人 跟 时间
      LODOP.ADD_PRINT_HTM(740, '5%', '80%', 100, tableCSS + footer)
      LODOP.SET_PRINT_STYLEA(0, 'ItemType', 1)
      // 分页
      LODOP.ADD_PRINT_HTM(740, '80%', 300, 100, '总页号：<font color="#0000ff" format="ChineseNum" style="color:#000;"><span tdata="pageNO">第##页</span>/<span tdata="pageCount">共##页</span></font>')
      LODOP.SET_PRINT_STYLEA(0, 'ItemType', 1)
      LODOP.PREVIEW()
    }, /* 打印事件 */
    exportEvent () {
      this.isExport = true
      this.$confirm('确定导出数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        tableExport('exportTable', this.label, 'csv')
        this.isExport = false
      }).catch((err) => {
        console.log(err)
        this.isExport = false
      })
    }, /* 导出事件 */
    deleteEvent (id, label) {
      this.$confirm('删除' + this.label + '【' + label + '】, 是否继续?', '提示', {
        confirmButtonText: '删除',
        confirmButtonClass: 'el-button el-button--danger',
        cancelButtonText: '取消'
      }).then(() => {
        fetchDelete({
          resource: this.resource,
          id: id
        }).then(data => {
          if (data) {
            this.getData()
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          }
        })
      })
    }, /* 删除事件 */
    createFormEvent (name, values, columns) {
      if (name === 'submit') {
        let formValues = {}
        columns.map(item => {
          formValues[item.name] = item.form.type === 'password' ? md5(values[item.name]) : values[item.name]
        })
        this.createFormSubmit(formValues)
      }
    },
    createFormSubmit (data) {
      fetchCreate({
        resource: this.resource,
        data: data
      })
      .then(data => {
        this.getData()
        this.createDialogVisible = false
      })
    }, /* 新增表单的提交事件 */
    updateFormEvent (name, values, columns) {
      if (name === 'submit') {
        let formValues = {}
        columns.map(item => {
          formValues[item.name] = item.form.type === 'password' ? md5(values[item.name]) : values[item.name]
        })
        this.updateFormSubmit(formValues, values)
      }
    },
    updateFormSubmit (data, full) {
      fetchUpdate({
        resource: this.resource,
        id: full.id,
        data: data
      })
      .then(data => {
        this.getData()
        this.updateDialogVisible = false
      })
    } /* 编辑表单的提交事件 */
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
    min-width: 92px
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
.filterBar
  width: 79%
.filterItem
  margin-right: 20px  
.toolbar
  float: left
.column-filter
  float: right
.th-filter
  text-align: left
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
.column-filter-warp
  margin-bottom: 10px
</style>


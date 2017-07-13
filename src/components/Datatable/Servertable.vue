<template>
  <div>
    <div class="clearfix column-filter-warp">
      <div v-if="toolbarList.length > 0" class="toolbar">
        <el-button v-for="toolbar in toolbarList" type="button" @click="toolbarEvent(toolbar.name)">
          <i :class="['fa', 'fa-' + toolbar.icon]"></i> {{toolbar.label}}
        </el-button>
      </div>
      <column-filter
        class="column-filter"
        :columnsObject="columnsObject"
        :tableList="tableList"
        :tableFullList="serverFullList"
        @grandSonEvent="changeListEvent"/>
      <table-filter
        v-if="serviceList.length"
        class="column-filter table-filter"
        :serviceList="serviceList"
        @changeService="changeService"
      />
      <v-filter
        class="column-filter table-filter"
        v-if="timeColumn.name === 'createTime'"
        :column="timeColumn"
        :searchQuery="filterBy.filter(item => item.name === 'createTime')"
        @filterBy="filterByChange">
      </v-filter>
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
// import moment from 'moment'
import { mapGetters } from 'vuex'
import { cloneDeep } from 'lodash'
import { fetchList, fetchCreate, fetchUpdate, fetchDelete } from '../../utils/api'
import md5 from 'md5'
import { pinyinInitial } from 'hanyu-pinyin'
import VDatatable from '../VDatatable'
import VForm from '../VForm'
import VTable from '../VDatatable/VTable'
import VThead from '../VDatatable/VThead'
import VTbody from '../VDatatable/VTbody'
import VTfoot from '../VDatatable/VTfoot'
import VTr from '../VDatatable/VTr'
import VTh from '../VDatatable/VTh'
import VTd from '../VDatatable/VTd'
import VFilter from '../VDatatable/VFilter'
import ColumnFilter from './columnFilter'
import TableFilter from './TableFilter'
import { getLodop } from '../../utils/LodopFuncs'
// import tableExport from '../../utils/tableExport'
import tableExport from 'table-export'

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
    relationResource: String,
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
    serviceList: {
      type: Array,
      default: () => []
    }
  },
  components: {
    VDatatable,
    VForm,
    VTable,
    VThead,
    VTbody,
    VTfoot,
    VFilter,
    VTr,
    VTh,
    VTd,
    ColumnFilter,
    TableFilter
  },
  data () {
    return {
      tableList: this.tableInitList,
      serverFullList: this.tableFullList,
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
      selectValue: 0,
      timeColumn: {
        name: 'createTime',
        label: '办理时间',
        type: 'time',
        filter: {
          type: 'dateRange'
        },
        sort: true
      }
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
    // tableFull () {
    //   return this.serviceList.length ? this.serviceList[this.selectValue].tableFullList : this.tableFullList
    // }
  },
  methods: {
    changeService (value) {
      this.$emit('changeService', value)
      let serviceData = this.serviceList.find(item => item.value === value)
      // 改变初始tableInitList值
      this.tableList = serviceData.tableInitList
      this.serverFullList = serviceData.tableFullList
      // 改变初始filterByInit
      this.filterBy = this.serviceList.length ? serviceData.optionValue === '0' ? [] : [{
        name: 'serviceType',
        type: 'equalto',
        value: serviceData.optionValue
      }] : this.filterByInit
      this.relation ? this.getRelation() : this.getData()
    }, // 下拉控件函数
    changeListEvent (tableList) {
      this.tableList = tableList
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
    operationEvent (name, data, index) {
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
        this.$emit('customOperationEvent', name, data)
      }
    }, /* operation里按钮的点击事件 */
    printEvent () {
      try {
        var dom = this.$refs.table.$el.cloneNode(true)
        if (this.toolbar.print.removeColspan) {
          dom.querySelectorAll('#table thead tr')[1].parentNode.removeChild(dom.querySelectorAll('#table thead tr')[1])
        }
        if (this.toolbar.print.removeRowspan) {
          for (let i = 0; i < dom.querySelectorAll('#table tr').length; i++) {
            dom.querySelectorAll('#table tr')[i].lastChild.remove()
          }
        }
      } catch (err) {}
      let html = dom.innerHTML
      // html = html.querySelectorAll('#table thead tr')[1].parentNode.removeChild(html.querySelectorAll('#table thead tr')[1])
      const css = `<link rel="stylesheet" href="https://unpkg.com/element-ui/lib/theme-default/index.css">`
      const tableCSS = `<style>h1{text-align:center;}table{width:100%;background-color:#fff;border:none;border-spacing:0;border-collapse:collapse;margin-top:30px;border-left:1px solid #ddd;border-right:1px solid #ddd;padding:0px 5px;box-sizing:border-box;}tr{border-left:none;border-top:none}tr th{text-align:left}tr td,tr th{padding:10px 20px;background-color:#fff;border-left:1px solid #ddd;border-top:1px solid #ddd}tr td:first-child,tr th:first-child{border-left:none;}tr:first-child th{border-top:1px solid #ddd;}tr:last-child td,tr:last-child th{border-bottom:1px solid #ddd}input[type="text"],button,a,span{border:0 !important;}</style>`
      const title = `<h1>${this.toolbar.print.title}</h1>`
      var LODOP = getLodop()
      LODOP.PRINT_INIT('')
      LODOP.SET_PRINT_PAGESIZE(this.toolbar.print.direction || 1)
      LODOP.ADD_PRINT_HTM(30, 0, '100%', '100%', tableCSS + css + title + html)
      LODOP.PREVIEW()
    }, /* 打印事件 */
    exportEvent () {
      this.$confirm('确定导出数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        tableExport('table', '综合进度查询', 'csv')
      }).catch(() => {})
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
.table-filter
  margin-right: 10px
</style>


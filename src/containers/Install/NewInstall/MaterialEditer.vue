<template>
  <div>
    <div class="main">
      <h2 class="title">
        {{title}}
      </h2>
      <task-info :infoList="taskInfo" showIcon>  
      </task-info>
      <div class="clearfix column-filter-warp">
        <div v-if="toolbarList.length > 0" class="toolbar">
          <el-button v-for="toolbar in toolbarList" :type="toolbar.style" @click="toolbarEvent(toolbar.name)">
            <i :class="['fa', 'fa-' + toolbar.icon]"></i> {{toolbar.label}}
          </el-button>
        </div>
      </div> 
      <el-dialog :title="createDialogLabel"
        v-if="createDialogShow"
        v-model="createDialogVisible"
        :size="dialogSize"
        >
        <v-form
          :columns="createColumns"
          :values="createDialogFormValues"
          :isColumn="isDialogFormColumn"
          :buttonList="createDialogButtons"
          @buttonListEvent="createFormEvent">
        </v-form>
      </el-dialog>
      <el-dialog :title="updateDialogLabel"
        v-if="updateDialogShow"
        v-model="updateDialogVisible"
        :size="dialogSize"
        custom-class="dialog-style"
        >
        <v-form
          :columns="updateColumns"
          :values="updateDialogFormValues"
          :isColumn="isDialogFormColumn"
          :buttonList="updateDialogButtons"
          @buttonListEvent="updateFormEvent">
        </v-form>
      </el-dialog>
      <el-dialog title="提示" v-model="saveDialogVisible" size="tiny">
        <span class="save">是否保存材料计划？</span>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="saveDialogEvent">确 定</el-button>
          <el-button @click="cancelDialogEvent">取 消</el-button>
        </span>
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
            :column="column"/>
          <th v-if="operationList.length > 0">
            操作
          </th>
        </v-tr>
      </v-thead>
      </v-datatable>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { cloneDeep } from 'lodash'
import { pinyinInitial } from 'hanyu-pinyin'
import { fetchList, fetchUpdate } from '../../../utils/api'
import VDatatable from '../../../components/VDatatable'
import VForm from '../../../components/VForm'
import VTable from '../../../components/VDatatable/VTable'
import VThead from '../../../components/VDatatable/VThead'
import VTr from '../../../components/VDatatable/VTr'
import VTh from '../../../components/VDatatable/VTh'
import TaskInfo from '../../../components/Task/Info'

export default {
  name: 'material-editer',
  components: {
    VDatatable,
    VForm,
    VTable,
    VThead,
    VTr,
    VTh,
    TaskInfo
  },
  created () {
    this.getRelation()
  },
  data () {
    return {
      flowId: this.$route.params.id,
      title: '材料计划编辑',
      dialogSize: 'tiny',
      toolbarList: [{
        label: '返回', name: 'back', icon: 'arrow-left', style: 'primary'
      }, {
        label: '新增', name: 'create', icon: 'plus'
      }, {
        label: '保存', name: 'save', icon: 'save', style: 'primary'
      }],
      operationList: [{
        label: '编辑', name: 'update', icon: 'edit'
      }, {
        label: '删除', name: 'delete', icon: 'trash'
      }],
      tableList: ['productId', 'type', 'size', 'unit', 'planNum'],
      createList: ['productId', 'planNum'],
      updateList: ['productId', 'planNum'],
      columns: {
        productId: {
          label: '材料',
          type: 'select',
          form: {
            type: 'select',
            live: true,
            rules: [
              { type: 'number', required: true, message: '请输入材料', trigger: 'blur' }
            ]
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
        },
        planNum: {
          label: '数量',
          form: {
            type: 'number',
            rules: [
              { type: 'number', required: true, message: '请输入数量', trigger: 'blur' }
            ],
            isMin: 1
          }
        }
      },
      createDialogVisible: false,
      saveDialogVisible: false,
      createDialogLabel: '新增材料',
      createDialogButtons: [{
        name: 'submit',
        label: '提交',
        style: 'primary',
        validate: true
      }],
      updateDialogVisible: false,
      updateDialogLabel: '编辑材料',
      updateDialogButtons: [{
        name: 'submit',
        label: '提交',
        style: 'primary',
        validate: true
      }],
      tableData: [],
      onLoad: true,
      taskInfo: [],
      dialogName: ''
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
      return this.onLoad ? 'load' : !this.tableData.length ? 'nodata' : 'default'
    } /* 计算table的状态，'load'为加载中，'nodata'为没有数据 */
  },
  methods: {
    getRelation (value) {
      fetchList({
        resource: 'installProductPlan/relation'
      })
      .then((data) => {
        this.columns.productId.options = data.productId.map(item => {
          const productSize = data.size.find(size => size.id === item.size)
          const productType = data.type.find(type => type.id === item.type)
          const productUnit = data.unit.find(unit => unit.id === item.unit)
          const label = item.name
          const size = productSize ? productSize.label : ''
          const type = productType ? productType.label : ''
          const unit = productUnit ? productUnit.label : ''
          const subtext = pinyinInitial(type + label + size)
          return {
            ...item,
            label,
            subtext,
            optionLabel: type + ' - ' + label + ' - ' + size + '(' + unit + ')'
          }
        })
        this.columns.type.options = data.type
        this.columns.unit.options = data.unit
        this.columns.size.options = data.size
        this.getData()
        this.getInfo()
      })
    }, /* 获取当前资源所关联的数据，并填到对应的列里 */
    getData () {
      this.tableData = []
      this.onLoad = true
      fetchList({
        resource: 'installProductPlan/' + this.flowId
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
      if (name === 'create') {
        /* 新增按钮的点击事件 */
        this.createDialogVisible = true
        // 初始化
        this.createDialogFormValues = {
          planNum: 1
        }
      } else if (name === 'save') {
        this.saveDialogVisible = true
        this.dialogName = name
      } else if (name === 'back') {
        this.saveDialogVisible = true
        this.dialogName = name
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
    saveDialogEvent () {
      this.toolbarSave()
      this.saveDialogVisible = false
    },
    cancelDialogEvent () {
      if (this.dialogName === 'back') {
        this.$router.go(-1)
      }
      this.saveDialogVisible = false
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
    },
    toolbarSave () {
      const data = this.tableData.map(item => {
        const { productId, planNum } = item
        return { productId, planNum }
      })
      fetchUpdate({
        resource: 'installProductPlan',
        id: this.flowId,
        data: data
      }).then((data) => {
        if (data) {
          this.$router.push('/base/task/' + this.flowId)
        } else {
          this.$message({
            showClose: false,
            message: '材料表数据为空，保存失败',
            type: 'error'
          })
        }
      })
    },
    getInfo () {
      fetchList({
        resource: '/flowInstance/' + this.flowId,
        method: 'get'
      }).then(data => {
        // this.taskInfo = data.currentMainInfoList
        if (data.currentMainInfoList) {
          // 判断增容跟移表显示户号
          if (data.bizInstallOrder.serviceType === '5' || data.bizInstallOrder.serviceType === '6') {
            this.taskInfo = data.currentMainInfoList.filter(item => item.name !== 'meter_type')
          } else if (data.bizInstallOrder.serviceType === '1') {
            this.taskInfo = data.currentMainInfoList.filter(item => item.name !== 'client_no')
          }
        } else {
          this.taskInfo = []
        }
      })
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
.el-scrollbar
  .el-select-dropdown__wrap
    max-height: 444px !important
</style>
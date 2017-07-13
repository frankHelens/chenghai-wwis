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
        >
        <v-form
          :columns="updateColumns"
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
import { fetchList, fetchUpdate } from '../../../utils/api'
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
      title: '预借转领用',
      dialogSize: 'tiny',
      toolbarList: [{
        label: '返回', name: 'back', icon: 'arrow-left', style: 'primary'
      }, {
        label: '保存使用情况', name: 'save', icon: 'save', style: 'primary'
      }],
      operationList: [{
        label: '编辑', name: 'update', icon: 'edit'
      }, {
        label: '删除', name: 'delete', icon: 'trash'
      }],
      tableList: ['productId', 'type', 'size', 'unit', 'num', 'useNum'],
      createList: ['useNum'],
      updateList: ['useNum'],
      columns: {
        productId: {
          label: '材料',
          type: 'select',
          form: {
            type: 'select',
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
          label: '材料',
          type: 'select'
        },
        num: {
          label: '预借数量'
        },
        useNum: {
          label: '已用数量',
          form: {
            type: 'number',
            rules: [
              { type: 'number', required: true, message: '请输入数量', trigger: 'blur' }
            ],
            isMin: 0,
            isMax: 0
          }
        }
      },
      createDialogVisible: false,
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
        resource: 'productBackOrderDetail/relation'
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
        resource: 'productBackOrderDetail/' + this.flowId
      })
      .then((data) => {
        this.onLoad = false
        this.tableData = data.map(product => {
          const productOptions = this.columns.productId.options.find(item => item.id === product.id)
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
        this.createDialogFormValues = {
          num: 0
        }
      } else if (name === 'save') {
        this.toolbarSave()
      } else if (name === 'back') {
        this.$router.push('/base/task/' + this.flowId)
      } else {
        /* 自定义按钮的点击事件 */
        this.$emit('customToolbarEvent', name, data)
      }
    }, /* toolbar里按钮的点击事件 */
    operationEvent (name, data, index) {
      if (name === 'update') {
        this.columns.useNum.form.isMax = data.num
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
    },
    toolbarSave () {
      const data = this.tableData.map(item => {
        const { useNum, num } = item
        return { num, useNum, id: item.id }
      })
      fetchUpdate({
        resource: 'productBackOrderDetail',
        id: this.flowId,
        data: data
      }).then((data) => {
        if (data) {
          this.$router.push('/base/task/' + this.flowId)
        } else {
          this.$message({
            showClose: true,
            message: '数据为空，保存失败',
            type: 'error'
          })
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
</style>

<template>
  <div>
    <div class="main">
      <h2 class="title">
        {{title}}
      </h2>
      <task-info v-if="taskInfo.length > 0" :infoList="taskInfo" showIcon>  
      </task-info>
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
        <v-thead slot="header" name="header" class='column-filter-warp'>
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
import { fetchList } from '../../../utils/api'
import VDatatable from '../../../components/VDatatable'
import VThead from '../../../components/VDatatable/VThead'
import VTr from '../../../components/VDatatable/VTr'
import VTh from '../../../components/VDatatable/VTh'
import TaskInfo from '../../../components/Task/Info'

export default {
  name: 'material-viewer',
  components: {
    VDatatable,
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
      title: '查看材料计划',
      dialogSize: 'tiny',
      toolbarList: [{
        label: '返回', name: 'back', icon: 'arrow-left', style: 'primary'
      }],
      tableList: ['productId', 'type', 'size', 'unit', 'planNum'],
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
          label: '单位',
          type: 'select'
        },
        planNum: {
          label: '数量'
        }
      },
      createDialogVisible: false,
      updateDialogVisible: false,
      tableData: [],
      onLoad: true,
      taskInfo: []
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
    toolbarEvent (name, data) {
      if (name === 'back') {
        this.$router.go(-1)
      }
    },
    getRelation (value) {
      fetchList({
        resource: 'installProductPlan/relation'
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
        this.tableData = data.map(product => {
          const productOptions = this.columns.productId.options.find(item => item.id === product.productId)
          return {
            ...productOptions,
            ...product
          }
        })
        this.onLoad = false
      }).catch(() => {
        this.onLoad = false
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
.table-wrapper
  margin-top: 20px
.column-filter-warp
  margin-top: 20px
</style>
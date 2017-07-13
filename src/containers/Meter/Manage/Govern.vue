<template>
  <div>
    <datatable class="datatable"
    :label="label"
    :labelName="labelName"
    :resource="resource"
    :relation="relation"
    :columnsObject="columns"
    :tableInitList="tableInitList"
    :tableFullList="tableFullList"
    :customOperation="customOperation"
    @customOperationEvent="customOperationEvent">
    </datatable>
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      :size="dialogSize">
      <StepInfo :stepInfoList="stepInfoList"/>
      <el-steps
        v-if="isMeterLifecycleList"
        v-for="meterLifecycle in meterLifecycleList"
        :space="100"
        direction="vertical"
        :active="meterLifecycleList.length"
        class="steps"
        >
        <el-step :title="meterLifecycle.lifecycleSubTypeName">
          <div slot="icon">{{ meterLifecycle.lifecycleSubTypeName | iconFilter}}</div>
          <div slot="description">
            <div>
              <StepInfo :stepInfoList="meterLifecycleList"/>
            </div>
          </div>
        </el-step>
      </el-steps>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">导出</el-button>
        <el-button type="primary" @click="dialogVisible = false">打印</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Datatable from '../../../components/Datatable'
import VDialog from '../../../components/VDialog'
import StepInfo from '../../../components/Step/StepInfo'
import { fetch } from '../../../utils/api'

export default {
  name: 'meter-govern',
  components: {
    Datatable,
    VDialog,
    StepInfo
  },
  filters: {
    iconFilter (value) {
      return value ? value.split('')[0] : ''
    }
  },
  data () {
    return {
      dialogVisible: false,
      dialogSize: 'small',
      stepInfoList: [{
        name: 'barcode',
        label: '水表条形码',
        span: 14
      }, {
        name: 'type',
        label: '类别',
        span: 5
      }, {
        name: 'diameter',
        label: '口径',
        span: 5
      }, {
        name: 'model',
        label: '表型'
      }, {
        name: 'status',
        label: '水表状态'
      }, {
        name: 'condition',
        label: '水表情况'
      }],
      isMeterLifecycleList: false,
      meterLifecycleList: [{
        label: '入仓时间',
        name: 'operateTime',
        value: 1497347990000
      }, {
        label: '录入人',
        name: 'operateUserName',
        value: '操作者'
      }, {
        label: '名字',
        name: 'name',
        value: '黄蜂瑞'
      }, {
        label: '名字',
        name: 'name',
        value: '黄蜂瑞',
        span: 24
      }],
      resource: 'meterProduct',
      label: '水表管理',
      labelName: 'id',
      customOperation: [{
        name: 'detail',
        label: '查看',
        icon: 'eye'
      }],
      tableInitList: ['barcode', 'model', 'diameter', 'type', 'condition', 'status', 'warehouseName'],
      tableFullList: ['barcode', 'model', 'diameter', 'type', 'condition', 'status', 'warehouseName'],
      relation: false,
      columns: {
        id: {
          label: '水表',
          sort: true
        },
        type: {
          label: '水表类别'
        },
        barcode: {
          label: '水表条形码',
          filterBar: {
            filterLabel: '水表表段',
            type: 'digitRange'
          }
        },
        model: {
          label: '水表表型'
        },
        diameter: {
          label: '水表口径',
          type: 'select'
        },
        condition: {
          label: '水表情况'
        },
        status: {
          label: '水表状态',
          type: 'select',
          filterBar: {
            type: 'select'
          }
        },
        warehouseName: {
          label: '所在仓库'
        }
      }
    }
  },
  methods: {
    customOperationEvent (name, value) {
      if (name === 'detail') {
        this.getDetailEvent(value)
      }
    },
    getDetailEvent (value) {
      const id = value.id
      fetch({
        url: this.resource + '/' + id
      })
      .then((data) => {
        this.stepInfoList.map(stepItem => {
          stepItem.value = data[stepItem.name]
        })
        if (data.bizMeterLifecycleList.length) {
          // 判断是否显示生命周期图
          this.isMeterLifecycleList = true
          // console.log(data.bizMeterLifecycleList.length)
          this.meterLifecycleList.map(meterLifecycle => {
            meterLifecycle.value = data[meterLifecycle.name]
          })
        } else {
          this.isMeterLifecycleList = false
        }
        this.dialogVisible = true
      })
    }
  }
}
</script>

<style lang="sass" scoped>
.datatable
  height: 100% !important
</style>
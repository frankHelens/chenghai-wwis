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
    closeColumnFilter
    @customOperationEvent="customOperationEvent">
    </datatable>
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      :size="dialogSize">
      <StepInfo :stepInfoList="stepInfoList"/>
      <el-steps
        v-if="isMeterLifecycleList"
        :space="100"
        direction="vertical"
        :active="meterLifecycleList.length"
        >
        <el-step title="采购入仓">
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
      resource: 'meterUse',
      label: '水表管理',
      labelName: 'id',
      customOperation: [{
        name: 'detail',
        label: '查看',
        icon: 'eye'
      }],
      tableInitList: ['clientNo', 'clientName', 'mobile', 'address'],
      tableFullList: ['clientNo', 'clientName', 'mobile', 'address'],
      relation: false,
      columns: {
        clientNo: {
          label: '户号'
        },
        clientName: {
          label: '客户名称'
        },
        mobile: {
          label: '客户手机'
        },
        address: {
          label: '客户地址'
        },
        bookNo: {
          label: '册本号'
        },
        meterReader: {
          label: '抄表员'
        },
        meterId: {
          label: '水表'
        },
        meterBarcode: {
          label: '水表条形码'
        },
        isPlaned: {
          label: '是否已计划'
        },
        status: {
          label: '水表状态'
        },
        remark: {
          label: '备注'
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
          console.log(data.bizMeterLifecycleList.length)
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
  height: 450px !important
.step
</style>

      
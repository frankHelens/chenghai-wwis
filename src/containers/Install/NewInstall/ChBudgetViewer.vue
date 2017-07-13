<template>
<div class="content">
    <h2 class="title">
      {{title}}
    </h2>
  <task-info class="top-style" :infoList="taskInfo" showIcon></task-info>
  <div class="main el-table el-table--fit el-table--border el-table--enable-row-hover el-table--enable-row-transition">
    <div class="">
      <el-button
      v-for="button in buttonList"
      :type="button.style"
      @click="buttonListEvent(button.name, button.validate)">
        {{button.label}}
      </el-button>
      <table class="el-table__header">
        <el-form :model="formValues" ref="form" prop="rule">
          <thead>
            <th>序号</th>
            <th>项目名称</th>
            <th>金额</th>
            <th>计算依据说明</th>
          </thead>
          <tbody>
            <tr v-for="(item, index) in column">
              <td width="50">{{index+1}}</td>
              <td width="150">
               {{item.label}}
              </td>
              <td width="200">
                <el-form-item
                <el-input v-if="item.form"
                @blur="blurEvent"
                v-model="formValues[item.name]"
                @change="changeFormValue"
                />
                <div v-else>{{formValues[item.name]}}</div>
              </td>
              <td width="300">
                <!-- <el-input
                v-if="!item.showRemark"
                v-model="formValues[item.remark]"/> -->
                <div>{{formValues[item.remark]}}</div>
              </td>
            </tr>
          </tbody>
          <tr class="button-list-contains">
          <td></td>
          </tr>
        </el-form>  
      </table>
    </div>
  </div>
</div> 
</template>

<script>
import { fetch } from '../../../utils/api'
import VFormItem from '../../../components/VForm/VFormItem'
import TaskInfo from '../../../components/Task/Info'

export default {
  components: {
    VFormItem,
    TaskInfo
  },
  data () {
    return {
      title: '查看工程预算',
      flowId: this.$route.params.id,
      formValues: {},
      buttonList: [{
        name: 'back',
        label: '返回',
        style: 'primary',
        validate: true
      }],
      taskInfo: [],
      column: [{
        name: 'costWage',
        label: '综合工资',
        remark: 'costWageRemark'
      }, {
        name: 'costPipe',
        label: '管材费',
        remark: 'costPipeRemark'
      }, {
        name: 'costPart',
        label: '配件费',
        remark: 'costPartRemark'
      }, {
        name: 'costMeter',
        label: '水表费',
        remark: 'costMeterRemark'
      }, {
        name: 'costAttach',
        label: '附属工程费',
        remark: 'costAttachRemark'
      }, {
        name: 'costMeterTest',
        label: '水表检测费',
        remark: 'costMeterTestRemark'
      }, {
        name: 'costUnpredict',
        label: '不可预见费',
        remark: 'costUnpredictRemark'
      }, {
        name: 'cost1to7',
        label: '1~7合计'
      }, {
        name: 'costDesign',
        label: '设计费',
        remark: 'costDesignRemark'
      }, {
        name: 'costForceTest',
        label: '试压检测费',
        remark: 'costForceTestRemark'
      }, {
        name: 'costDeposit',
        label: '工程押金',
        remark: 'costDepositRemark'
      }, {
        name: 'costMachine',
        label: '机械费',
        remark: 'costMachineRemark'
      }, {
        name: 'costAgent',
        label: '代领代运费',
        remark: 'costAgentRemark'
      }, {
        name: 'costTax',
        label: '税金',
        remark: 'costTaxRemark'
      }, {
        name: 'costTotal',
        label: '总计',
        remark: 'costTotalRemark'
      }]
    }
  },
  created () {
    this.getData()
  },
  methods: {
    getData () {
      fetch({
        method: 'get',
        url: '/installCost/' + this.flowId
      }).then(data => {
        let formValues = {}
        Object.keys(data).map(key => {
          if (key.indexOf('Remark') === -1) {
            formValues[key] = parseFloat(data[key]).toFixed(2)
          } else {
            formValues[key] = data[key]
          }
        })
        this.formValues = formValues
        console.log(this.formValues)
      })
      fetch({
        method: 'get',
        url: '/flowInstance/' + this.flowId
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
    },
    buttonListEvent (name, validate) {
      if (validate) {
        if (name === 'back') {
          this.$router.go(-1)
        }
      }
    }
  }
}
</script>

<style lang="sass" scoped>
.main
  margin-top: 20px
  padding: 10px 0 0 10px
  display: inline-table 
.el-table__header
  margin-left: 15%
  border: 1px solid #eee
  text-align: center
  font-size: 15px
.el-table
  th
    font-size: 16px
    font-weight: bolder
    text-align: center
</style>
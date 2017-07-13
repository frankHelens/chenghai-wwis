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
     <el-dialog title="提示" v-model="saveDialogVisible" size="tiny">
        <span class="save">{{dialogLabel}}</span>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="saveDialogEvent">确 定</el-button>
          <el-button @click="cancelDialogEvent">取 消</el-button>
        </span>
      </el-dialog>
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
                @change="changeFormValue(formValues[item.name])"
                />
                <div v-else>{{formValues[item.name]}}</div>
              </td>
              <td width="300">
                <el-input
                v-if="!item.showRemark"
                v-model="formValues[item.remark]"/>
                <div v-else>{{formValues[item.remark]}}</div>
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
// import { isNumber } from 'lodash'
import TaskInfo from '../../../components/Task/Info'
// import nzh from 'nzh/cn'
// import { rmb } from '../../../utils/common'

export default {
  components: {
    VFormItem,
    TaskInfo
  },
  data () {
    return {
      title: '工程预算编辑',
      taskInfo: [],
      flowId: this.$route.params.id,
      formValues: {
        costWage: 0,
        costWageRemark: '91.51(人工综合单价)×工日',
        costPipe: 0,
        costPart: 0,
        costMeter: 0,
        costAttach: 0,
        costMeterTest: 0,
        costUnpredict: 0,
        costUnpredictRemark: '(1+~5)×5%',
        costDesign: 0,
        costDesignRemark: '(8)×1.5%',
        costForceTest: parseFloat(0).toFixed(2),
        costDeposit: parseFloat(0).toFixed(2),
        costMachine: parseFloat(0).toFixed(2),
        costAgent: parseFloat(0).toFixed(2),
        costTax: parseFloat(0).toFixed(2),
        costTotal: 0,
        costAgentRemark: '(8)×3%',
        costTaxRemark: '(8+~13)×3.43%',
        rule: [
          { type: 'number', message: '年龄必须为数字值', trigger: 'blur' }
        ]
      },
      buttonList: [{
        name: 'back',
        label: '返回',
        style: 'primary',
        validate: true
      }, {
        name: 'submit',
        label: '保存',
        style: 'primary',
        validate: true
      }],
      column: [{
        name: 'costWage',
        label: '综合工资',
        remark: 'costWageRemark',
        showRemark: true,
        form: {
          type: 'input'
        }
      }, {
        name: 'costPipe',
        label: '管材费',
        remark: 'costPipeRemark',
        form: {
          type: 'input'
        }
      }, {
        name: 'costPart',
        label: '配件费',
        remark: 'costPartRemark',
        form: {
          type: 'input'
        }
      }, {
        name: 'costMeter',
        label: '水表费',
        remark: 'costMeterRemark',
        form: {
          type: 'input'
        }
      }, {
        name: 'costAttach',
        label: '附属工程费',
        remark: 'costAttachRemark',
        form: {
          type: 'input'
        }
      }, {
        name: 'costMeterTest',
        label: '水表检测费',
        remark: 'costMeterTestRemark',
        form: {
          type: 'input'
        }
      }, {
        name: 'costUnpredict',
        label: '不可预见费',
        remark: 'costUnpredictRemark',
        showRemark: true,
        form: {
          type: 'input'
        }
      }, {
        name: 'cost1to7',
        label: '1~7合计',
        showRemark: true
      }, {
        name: 'costDesign',
        label: '设计费',
        remark: 'costDesignRemark',
        showRemark: true
      }, {
        name: 'costForceTest',
        label: '试压检测费',
        remark: 'costForceTestRemark',
        form: {
          type: 'input'
        }
      }, {
        name: 'costDeposit',
        label: '工程押金',
        remark: 'costDepositRemark',
        form: {
          type: 'input'
        }
      }, {
        name: 'costMachine',
        label: '机械费',
        remark: 'costMachineRemark',
        form: {
          type: 'input'
        }
      }, {
        name: 'costAgent',
        label: '代领代运费',
        remark: 'costAgentRemark',
        form: {
          type: 'input'
        },
        showRemark: true
      }, {
        name: 'costTax',
        label: '税金',
        remark: 'costTaxRemark',
        showRemark: true
      }, {
        name: 'costTotal',
        label: '总计',
        remark: 'costTotalRemark',
        showRemark: true
      }],
      saveDialogVisible: false,
      dialogLabel: '是否保存工程预算?',
      dialogName: ''
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
        // 初始化表单
        Object.keys(data).map(key => {
          if (key.indexOf('Remark') === -1) {
            this.formValues[key] = parseFloat(data[key]).toFixed(2)
          } else {
            this.formValues[key] = data[key]
          }
        })
        this.changeFormValue()
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
    blurEvent (e) { // 失去焦点的时候判断不是数组的屏蔽掉
      e.target.value = String(Number(e.target.value)) === 'NaN' ? 0 : Number(e.target.value)
    },
    changeFormValue (value) {
      // 计算1-7的合计
      let sevenList = []
      let sevenTotal = 0
      this.column.slice(0, 7).map(item => {
        sevenList.push(item.name)
      })
      Object.keys(this.formValues).filter(item => {
        return sevenList.indexOf(item) !== -1
      }).map(key => {
        sevenTotal += String(Number(this.formValues[key])) !== 'NaN' ? Number(this.formValues[key]) : 0
      })
      this.formValues.cost1to7 = sevenTotal.toFixed(2)
      // 计算设计费
      this.formValues.costDesign = (sevenTotal * 1.5 / 100) <= 20 ? 20 : (sevenTotal * 1.5 / 100).toFixed(2)
      // 计算代领代运费
      // this.formValues.costAgent = (sevenTotal * 3 / 100).toFixed(2)
      // 计算税金
      let tax = sevenTotal
      let taxList = ['costDesign', 'costForceTest', 'costDeposit', 'costMachine', 'costAgent']
      Object.keys(this.formValues).filter(item => {
        return taxList.indexOf(item) !== -1
      }).map(key => {
        tax += String(Number(this.formValues[key])) !== 'NaN' ? Number(this.formValues[key]) : 0
      })
      this.formValues.costTax = (tax * 3.43 / 100).toFixed(2)
      // 计算总计
      let allList = []
      let allTotal = sevenTotal
      this.column.slice(8, 9999).filter(data => {
        return data.name !== 'costTotal'
      }).map(item => {
        allList.push(item.name)
      })
      Object.keys(this.formValues).filter(item => {
        return allList.indexOf(item) !== -1
      }).map(key => {
        allTotal += String(Number(this.formValues[key])) !== 'NaN' ? Number(this.formValues[key]) : 0
      })
      this.formValues.costTotal = allTotal.toFixed(2)
      // this.formValues.costTotalRemark = rmb(this.formValues.costTotal)
    },
    buttonListEvent (name, validate) {
      this.saveDialogVisible = true
      this.dialogName = name
      // if (validate) {
      //   this.formSubmit(name, this.formValues, this.columns)
      // }
    },
    saveDialogEvent () {
      this.saveDialogVisible = false
      this.formSubmit(this.formValues)
    },
    cancelDialogEvent () {
      this.saveDialogVisible = false
      if (this.dialogName === 'back') {
        this.$router.go(-1)
      }
    },
    formSubmit (values) {
      // 筛选数值并进行数字化
      Object.keys(values).filter(data => {
        return data.indexOf('Remark') === -1
      }).map(item => {
        if (values[item] === 'NaN') {
          values[item] = ''
        } else {
          values[item] = Number(values[item])
        }
      })
      fetch({
        method: 'put',
        url: '/installCost/' + this.flowId,
        data: values
      }).then(data => {
        if (data) {
          this.$message({
            message: '提交成功！',
            showClose: true,
            type: 'success'
          })
          // location.reload()
          this.$router.push('/base/task/' + this.flowId)
        }
      })
    }
  }
}
</script>

<style lang="sass" scoped>
.main
  margin-top: 20px
  padding: 10px 0 0 10px
  display: table
.el-table__header
  margin-top: 20px
  margin: auto
  border: 1px solid #eee
  text-align: center
  font-size: 15px
.el-table
  th
    font-size: 16px
    font-weight: bolder
    text-align: center
.el-button
  display: inline-block    
</style>
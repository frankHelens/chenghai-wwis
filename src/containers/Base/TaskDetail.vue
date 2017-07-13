<template>
  <div class="content">
    <div class="main" v-if="taskDetailShow">
      <task-info
        class="task-info"
        v-if="taskInfo.length > 0"
        :showIcon="showIcon"
        :infoList="taskInfo"/>
      <div class="stepList-content">
        <!-- 判断当前为流程所有者则显示表单 -->
        <div v-if="currentStepOwner && (buttonList.length > 0)" class="step-style">
          <h3>当前步骤：{{currentName}}</h3>
          <v-form
            class="form"
            :isDialog="isDialog"
            :columns="formColumns"
            :values="formValues"
            :buttonList="buttonList"
            @buttonListEvent="formSubmit">
          </v-form>
        </div>
        <div v-if="stepList.length > 0" :class="currentStepOwner ? 'flowStyle' : 'fullStyle'" >
          <template>
            <div class="work-title">
              <h3>工作流程图</h3>
              <el-button
              @click="backEvent"
              icon="d-arrow-left"
              type="primary"
              size="small"
              >返回
              </el-button>
            </div>
            <task-step 
              :stepList="stepList"
              :showIcon="showIcon"
              :currentStepOwner = "currentStepOwner"
            />
          </template>  
        </div>
      </div>  
    </div>
  </div>
</template>

<script>
import { reduce, isString, cloneDeep } from 'lodash'
import moment from 'moment'
import { fetch } from '../../utils/api'
import { getUrl } from '../../utils/common'
import TaskInfo from '../../components/Task/Info'
import TaskStep from '../../components/Task/Step'
import VForm from '../../components/VForm'
import { getUserId } from '../../auth'

const stepStyle = (step) => {
  return step.status === 'BACKED'
  ? 'warning'
  : step.status === 'KILLED'
  ? 'danger'
  : step.status === 'FINISHED'
  ? 'success'
  : 'primary'
}
const stepInfoList = (item, data) => {
  if (item.id !== data.currentStepId || data.status === 'KILLED' || data.status === 'COMPLETED') {
    const stateLabel = item.status === 'KILLED'
    ? '终止'
    : item.status === 'BACKED'
    ? item.currentStepType === 'APPROVE'
    ? '审核不通过'
    : '回退'
    : ''
    if (item.type === 'FINISH') {
      return ['结束']
    } else {
      return [
        moment(item.endTime).format('YYYY-MM-DD HH:mm:ss'),
        '操作者:' + item.callerName,
        stateLabel
      ]
    }
  } else {
    return ['待办']
  }
}
const stepImageList = (item) => {
  return item.formList ? reduce(item.formList.filter(data => {
    return data.type === 'file'
  }), (result, current) => {
    const images = current.value !== '' && isString(current.value) ? current.value.split(',').map(url => {
      return {
        label: current.label,
        url: getUrl() + url
      }
    }) : []
    return [...result, ...images]
  }, []) : []
}

export default {
  name: 'task-detail',
  props: {
    showState: Boolean
  },
  components: {
    TaskInfo,
    TaskStep,
    VForm
  },
  data () {
    return {
      taskId: this.$route.params.id,
      taskNum: '',
      buttonList: [],
      formColumns: [],
      formValues: {},
      taskInfo: [],
      flowId: '',
      stepId: '',
      stepList: [],
      currentName: '',
      currentInfo: [],
      showIcon: true,
      stockList: [],
      reviewStatus: true,
      currentStepOwner: true,
      canBack: false,
      canStop: false,
      taskDetailShow: false,
      userId: getUserId(),
      canPrint: {
        can: false,
        url: ''
      },
      ownerIds: [],
      isDialog: true
    }
  },
  created () {
    this.getData()
  },
  watch: {
    $route (to) {
      this.taskId = to.params.id
      this.formColumns = []
      this.formValues = {}
      setTimeout(() => this.getData(), 1)
    }
  },
  methods: {
    getData () {
      this.taskDetailShow = false
      fetch({
        method: 'get',
        url: 'flowInstance/' + this.taskId
      }).then(data => {
        if (data) {
          this.currentStepOwner = this.showState ? false : data.currentStepOwner
          this.stepInit(data)
          this.taskInit(data)
          this.flowId = data.id
          this.stepId = data.currentStepId
          if (data.currentStepStatus !== 'FINISHED') {
            this.currentInit(data)
            this.buttonListInit(data)
            this.formInit(data.currentStepFormList || [])
            this.reviewStatus = true
          } else {
            this.reviewStatus = false
          }
          this.taskDetailShow = true
        }
      })
    },
    backEvent () {
      // 返回按钮事件
      this.$router.go(-1)
    },
    buttonListInit (data) {
      const stepDefine = data.stepDefineList.find(item => {
        return item.id === data.currentStepDefineId
      })
      this.canPrint.can = stepDefine.canPrint
      this.canPrint.url = stepDefine.canPrint ? stepDefine.printUrl : ''
      // this.ownerIds = stepDefine.ownerIds ? stepDefine.ownerIds.split(',').map(num => Number(num)) : []
      this.canBack = stepDefine.canBack
      this.canStop = stepDefine.canStop
      const approveLabel = data.currentStepName.indexOf('总经理') >= 0 ? '审批' : '审核'
      const submitButton = {
        name: 'submit',
        label: data.currentStepType === 'APPROVE' ? approveLabel + '通过' : '提交',
        style: data.currentStepType === 'APPROVE' ? 'success' : 'primary',
        validate: !data.currentStepFormList ? 0 : data.currentStepFormList.length === 0 ? 0 : 1
      }
      const backButton = {
        name: 'back',
        label: data.currentStepType === 'APPROVE' ? approveLabel + '不通过' : '回退',
        style: 'warning',
        validate: false
      }
      const stopButton = {
        name: 'stop',
        label: '终止',
        style: 'danger',
        validate: false
      }
      const buttonList = [
        submitButton,
        this.canBack ? backButton : null,
        this.canStop ? stopButton : null
      ]
      this.buttonList = buttonList.filter(data => {
        return data !== null
      })
    },
    taskInit (data) {
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
    },
    stepInit (data) {
      const stepDefineList = cloneDeep(data.stepDefineList)
      const stepInstanceList = data.stepInstanceList.map((item, index) => {
        const ownerIds = stepDefineList.find(findItem => findItem.id === item.stepDefineId).ownerIds.split(',')
        return {
          title: item.name,
          infoList: stepInfoList(item, data),
          formList: item.formList ? item.formList.filter(data => {
            return data.visible ? data.visible.indexOf('0') !== 0 : true
          }).filter(data => {
            // 判断当前用户是否是操作者,筛选流程图的按钮
            return ownerIds.indexOf(this.userId) === -1
             ? String(data.value).indexOf('Viewer') === -1
             ? data.type !== 'button'
             : true
             : true
          }).map(item => {
            if (item.type === 'button') { // 判断是否按钮
              return {
                type: item.type,
                label: item.label,
                url: item.value ? item.value + '/' + this.taskId : '',
                style: item.style
              }
            }
            return item.label + '：' + (item.value === '' || String(item.value) === 'undefined' ? '' : item.type === 'date' ? moment(item.value).format('YYYY-MM-DD') : item.value)
          }) : [],
          imageList: stepImageList(item),
          isActive: index === data.stepInstanceList.length - 2,
          styles: stepStyle(item),
          canOpen: item.id !== data.currentStepId
        }
      })
      stepDefineList.sort((a, b) => {
        return a.sort - b.sort
      }).pop()
      const index = stepDefineList.findIndex(item => {
        return item.id === data.currentStepDefineId
      })
      const stepFeatureList = data.status === 'KILLED' || data.status === 'COMPLETED' ? [] : stepDefineList.splice(index + 1).map(item => {
        return {
          styles: 'default',
          title: item.name,
          infoList: [],
          formList: [],
          imageList: [],
          isActive: false,
          canOpen: false
        }
      })
      this.stepList = [...stepInstanceList, ...stepFeatureList]
    },
    currentInit (data) {
      this.currentName = data.currentStepName
      this.currentInfo = [{
        icon: 'user',
        label: '操作者',
        value: data.currentUserName
      }, {
        icon: 'briefcase',
        label: '所属部门',
        value: data.deptName
      }]
    },
    formInit (formList) {
      let formValues = {}
      const formColumns = formList.map(formItem => {
        let column = {
          name: formItem.name,
          label: formItem.label,
          options: formItem.options,
          form: {
            type: formItem.type,
            chains: formItem.chains,
            width: formItem.width ? formItem : ''
          },
          sort: formItem.showIndex ? formItem.showIndex : 0
        }
        if (formItem.type === 'button') {
        // 判断表单类型
          column.form.url = formItem.value + '/' + this.taskId
        } else if (formItem.type === 'date') {
          formValues[formItem.name] = moment().format('YYYY-MM-DD')
        } else if (formItem.type === 'select') {
          formValues[formItem.name] = formItem.value
          ? formItem.value.constructor !== Number ? column.options.filter(item => {
            return item.label === formItem.value
          })[0].value : formItem.value
          : column.options && column.options !== []
          ? column.options[0].value : ''
        } else {
          formValues[formItem.name] = formItem.value ? formItem.value : isNaN(Number(formItem.defaultValue)) ? formItem.defaultValue : Number(formItem.defaultValue)
        }
        if (formItem.validation) {
          column.form.rules = []
          if (formItem.validation.required) {
            column.form.rules.push({type: formItem.dataType || 'string', required: true, message: '请输入' + formItem.label, trigger: 'change'})
          }
          if (formItem.validation.min) {
            column.form.rules.push({min: formItem.validation.min, message: '最少输入' + formItem.validation.min + '个字', trigger: 'blur'})
          }
          if (formItem.validation.max) {
            column.form.rules.push({max: formItem.validation.max, message: '最多输入' + formItem.validation.max + '个字', trigger: 'blur'})
          }
          if (formItem.validation.regex) {
            column.form.rules.push({pattern: new RegExp(formItem.validation.regex), message: formItem.validation.message, trigger: 'blur'})
          }
        }
        return column
      }).filter(item => {
        return item.sort !== -1
      })
      this.formColumns = formColumns.filter(column => column.form.type !== 'location').sort((a, b) => {
        return a.sort - b.sort
      })
      this.formValues = formValues
    },
    formSubmit (name, values, columns) {
      columns.map(column => {
        if (column.form && column.form.type === 'file' && values[column.name]) {
          if (Object.prototype.toString.call(values[column.name]) === '[object Array]') {
            values[column.name] = values[column.name].join(',')
          }
        }
      })
      const transType = name === 'back' ? -1 : name === 'stop' ? -2 : 1
      fetch({
        method: 'post',
        url: 'flow/submit',
        data: {
          transType,
          flowId: this.flowId,
          stepId: this.stepId,
          formValues: values
        }
      }).then(data => {
        if (data) {
          this.$message({
            message: '操作成功！',
            showClose: true,
            type: 'success'
          })
          // this.getData()
          if (this.canPrint.can) {
            this.$router.push(this.canPrint.url + '/' + this.flowId)
          } else {
            this.getData()
          }
        }
      })
    }
  }
}
</script>

<style lang="sass" scoped>
.main
  .stepList-content
    display: flex
    flex-direction: row
    margin-top: 28px
  .task-info
    margin-bottom: 10px
.step-style
  width: 40%
  margin-right: 5%
.flowStyle
  width: 55%
.fullStyle
  width: 100%    
.form
  max-width: 500px
  padding-top: 20px
.title
  font-size: 22px
  color: #222
  font-weight: bold
  font-family: "微软雅黑"
  margin-bottom: 0px
h3
  font-size: 16px
  color: #666
  font-weight: bold
.work-title
  width: 100%
  height: 28px
  line-height: 23px
  clear: blod
  h3
    float: left
  button
    float: right
.content
  padding-top: 15px    
</style>
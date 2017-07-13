<template>
<div @keyup.enter="formEnter">
  <el-form :model="formValues" :rules="formRules" ref="form" :label-width="formLabelWidth" class="demo-ruleForm">
    <el-row class="formList">
      <el-col
        v-for="column in columns"
        :span="isColumn&&!column.form.large?12:24">
        <v-form-item
          :column="column"
          :value="formValues[column.name]"
          :values="formValues"
          @changeValue="changeFormValue"
          @changeChain="changeChain"
          @uploadFile="uploadFile"
          @cardReader="cardReader"
        >
        </v-form-item>
      </el-col>
    </el-row>
    <el-form-item>
      <el-button
        v-for="button in buttonList"
        :type="button.style"
        @click="buttonListEvent(button.name, button.validate)">
        {{button.label}}
      </el-button>
      </v-form-button>
    </el-form-item>
  </el-form>
  <v-dialog
    v-if="isDialog"
    :dialogVisible="dialogVisible"
    :dialogContent="dialogContent"
    @dialogEvent="dialogEvent"
    @onDialogChange="onDialogChange">
    <h3 class="dialog-title">{{dialogContent.content}}</h3>
  </v-dialog>
</div> 
</template>

<script>
import { treeFormat } from '../../utils/common'
import { isNumber } from 'lodash'
import VFormItem from './VFormItem'
import VDialog from '../VDialog'
// import VFormButton from './VFormButton'

export default {
  props: {
    columns: {
      type: Array,
      default: () => []
    },
    values: {
      type: Object,
      default: () => {
        return {}
      }
    },
    isColumn: {
      type: Boolean,
      default: false
    },
    formLabelWidth: {
      type: String,
      default: '140px'
    },
    formEnterIndex: {
      type: Number
    },
    buttonList: {
      type: Array,
      default: () => []
    },
    isDialog: {
      type: Boolean,
      default: false
    }
  },
  components: {
    VFormItem,
    VDialog
    // VFormButton
  },
  data () {
    let values = {}
    let rules = {}
    this.columns.map(column => {
      if (column.form.type === 'tree') {
        column['treeData'] = treeFormat(column.options)
        values[column.name] = this.values[column.name]
      } else {
        if (column.form.rules) {
          rules[column.name] = column.form.rules
        }
        if (column.form.type === 'input' && isNumber(this.values[column.name])) {
          values[column.name] = this.values[column.name] + ''
        } else {
          values[column.name] = this.values[column.name]
        }
      }
      if (column.name === 'meter_near_no') {
        Object.assign(column.form, {
          autofocus: true
        })
      }
      return column
    })
    return {
      formValues: Object.assign(this.values, values),
      formRules: rules,
      dialogVisible: false,
      dialogContent: {}
    }
  },
  methods: {
    formEnter () {
      if (this.formEnterIndex !== undefined) {
        this.buttonListEvent(this.buttonList[this.formEnterIndex].name, this.buttonList[this.formEnterIndex].validate)
      }
    },
    uploadFile (name, value) {
      if (this.formValues[name]) {
        this.formValues[name].push(...value)
      } else {
        this.formValues[name] = value
      }
    },
    cardReader (name, CVRIDCard) { // 读取到的身份证内容填写到表单input中
      this.formValues.client_name = CVRIDCard.Name // 姓名
      this.formValues.client_address = CVRIDCard.Address // 地址
      this.formValues.card_no = CVRIDCard.CardNo // 证件号码
      this.formValues.agent_name = CVRIDCard.Name // 申办人姓名
      this.formValues.agent_idcard = CVRIDCard.CardNo // 证件号码
      // this.formValues.sex = CVRIDCard.Sex // 性别
      // this.formValues.Nation = CVRIDCard.Nation // 民族
      // this.formValues.Born = CVRIDCard.Born // 出身年月
      // this.formValues.IssuedAt = CVRIDCard.IssuedAt // 签发机关
      // this.formValues.EffectedDate = CVRIDCard.EffectedDate // 有效期
      // this.formValues.ExpiredDate = CVRIDCard.ExpiredDate // 过期
      // this.formValues.SAMID = CVRIDCard.SAMID // 模块号码
      // CVRIDCard.Pic // 图片img的name
      // CVRIDCard.Picture // 图片地址
      // CVRIDCard.PictureLen // 编码长度
      console.log(this.formValues.agent_name)
    },
    changeFormValue (name, value) {
      this.formValues[name] = value
    },
    changeChain (name, value, chain) {
      if (chain.type === 'equal') {
        this.formValues[chain.name] = value
      }
    },
    buttonListEvent (name, validate) {
      console.log(name)
      if (validate) {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            if (this.isDialog) {
              this.dialogVisible = true
              this.dialogContent = {
                name: name,
                content: '是否提交表单？'
              }
            } else {
              this.$emit('buttonListEvent', name, this.formValues, this.columns)
            }
          } else {
            console.log('error submit!!')
            return false
          }
        })
      } else {
        this.dialogVisible = true
        this.dialogContent = {
          name: name,
          content: name === 'stop' ? '是否终止表单？' : name === 'back' ? '是否回退表单？' : '是否提交表单？'
        }
        // this.$emit('buttonListEvent', name, this.formValues, this.columns)
      }
    },
    dialogEvent (name, data, bol) {
      this.dialogVisible = false
      if (bol) {
        this.$emit('buttonListEvent', name, this.formValues, this.columns)
      }
    },
    onDialogChange (val) {
      this.dialogVisible = val
    }
  }
}
</script>

<style scoped lang="sass">
.formList>div:nth-child(odd)
  clear: both
</style>
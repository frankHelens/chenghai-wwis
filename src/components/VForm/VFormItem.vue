<template>
  <el-form-item
    :label="column.label" 
    :prop="column.name" >
    <div class='text-value' 
      v-if="column.form.type === 'card'"
      >
      <OBJECT ref="card" classid="clsid:10946843-7507-44FE-ACE8-2B3483D179B7"
        id="CVR_IDCard" name="CVR_IDCard" width="0" height="0" >
      </OBJECT>
      <el-tooltip effect="dark" content="请将身份证放在读卡器后点击读卡" placement="top-start">
        <el-button size="small" type="primary" @click="cardReader">读卡</el-button>
      </el-tooltip>
    </div>
    <!-- 身份证扫描仪 TUDO-->
    <div class="text-value"
      v-else-if="column.form.type === 'scaner'"
    >
      <el-button size="small" type="primary" @click="cardScaner">扫描身份证</el-button>
      <el-dialog top="10%" title="扫描仪" v-model="scanerDialog" size="large" @close="closeScaner">
        <scaner :orderCode="values.order_code" @toggle="toggleEvent"></scaner>
      </el-dialog>
    </div>
    <div class='text-value'
      v-else-if="column.form.type === 'text'"
      >{{currentValue}}</div>
    <el-input
      v-else-if="column.form.type === 'input'"
      v-model="currentValue"
      :style="style"
      :disabled="column.form.disabled"
      :autofocus="column.form.autofocus"
      @change="changeValue"/>
    <el-input
      v-else-if="column.form.type === 'textarea'"
      type="textarea"
      :rows="3"
      :style="style"
      v-model="currentValue"
      @change="changeValue"/>
    <el-input
      v-else-if="column.form.type === 'password'"
      type="password"
      :style="style"
      v-model="currentValue"
      @change="changeValue"/>
    <el-input-number
      v-else-if="column.form.type === 'number'"
      v-model.number="currentValue"
      :min="column.form.isMin"
      :max="column.form.isMax"
      :style="style"
      auto-complete="off"
      @change="changeValue" />
    <el-date-picker
      v-else-if="column.form.type === 'date'"
      v-model="currentValue"
      type="date"
      placeholder="选择日期"
      @change="dateChangeValue">
    </el-date-picker>
    <el-input
      v-else-if="column.form.type === 'date'"
      v-model="currentValue"
      @change="changeValue"/>
    <el-select
      v-else-if="column.form.type === 'select'"
      v-model="currentValue"
      :filterable="column.form.live"
      :filter-method="filterMethod"
      :style="style"
      placeholder="请选择"
      @change="changeValue">
      <el-option
        v-for="option in optionsFilter"
        v-if="option.show"
        :label="option.label"
        :value="option.value" />
    </el-select>
    <el-select
      v-else-if="column.form.type === 'multiselect'"
      class="v-form-multiselect"
      placeholder="请选择"
      v-model="currentValue"
      :style="style"
      multiple
      :filterable="column.form.live"
      :filter-method="filterMethod"
      @change="changeValue">
      <el-option
        v-for="option in optionsFilter"
        v-if="option.show"
        :label="option.label"
        :value="option.value" />
    </el-select>
    <el-switch 
      v-else-if="column.form.type === 'switch'"
      v-model="currentValue"
      :width="switchStyle.width"
      :on-text="switchOptions[1].label"
      :off-text="switchOptions[0].label"
      :on-color="switchOptions[1].color"
      :off-color="switchOptions[0].color"
      @change="switchValue">
    </el-switch>
    <el-tree
      v-else-if="column.form.type === 'tree'"
      show-checkbox
      node-key="id"
      :accordion="true"
      :data="column.treeData"
      :default-checked-keys="Array.from(currentValue)"
      @check-change="treeChangeValue"
      >
    </el-tree>
    <el-upload
      v-else-if="column.form.type === 'file'"
      :style="style"
      :action="upLoadUrl"
      :on-success="uploadSuccess"
      :before-upload="beforeValue"
      :file-list="fileList"
      :on-remove="removeValue"
      list-type="picture"
      >
      <el-tooltip effect="dark" content="只能上传jpg/png文件，且不超过5M" placement="top-start">
        <el-button size="small" type="primary">点击上传</el-button>
      </el-tooltip>
    </el-upload>
    <router-link
      v-else-if="column.form.type === 'button'"
      :to="column.form.url">
      <el-button
        size="small"
        type="primary">
        {{column.label}}
      </el-button>
    </router-link>
  </el-form-item>
</template>

<script>
import { isNumber } from 'lodash'
import { getApi } from '../../utils/common'
import Scaner from '../Facility/Scaner'

export default {
  props: {
    column: Object,
    value: String | Number | Object | Array | Set,
    values: Object
  },
  components: {
    Scaner
  },
  data () {
    const options = this.column.options ? this.column.options.map(option => {
      return {
        ...option,
        show: true,
        label: option.optionLabel || option.label,
        value: option.value || option.id
      }
    }) : []
    let currentValue = this.value
    if (this.column.form.type === 'switch') {
      currentValue = Boolean(this.value)
    } else if (this.column.form.type === 'file') {
      currentValue = this.value ? this.value.split(',') : []
    } else if (this.column.form.type === 'tree') {
      currentValue = new Set(this.value)
    } else if (this.column.form.type === 'number') {
      console.log(currentValue)
    }
    return {
      options: options,
      currentValue: currentValue,
      optionsFilter: options,
      switchStyle: {
        width: this.column.form.switchWidth === 'large' ? 75 : 60
      },
      style: {
        maxWidth: this.column.form.width ? this.column.form.width : '170px'
      },
      fileList: [],
      scanerDialog: false,
      testFather: '大师的发放'
    }
  },
  watch: {
    value (val) {
      let currentValue = val
      if (this.column.form.type === 'switch') {
        currentValue = Boolean(val)
      } else if (this.column.form.type === 'file') {
        // 加上去就报错, 不加的话上传就没问题
        // currentValue = val ? val.split(',') : []
      } else if (this.column.form.type === 'tree') {
        currentValue = new Set(this.value)
      } else if (this.column.form.type === 'number') {
      }
      this.currentValue = currentValue
    }
  },
  computed: {
    // currentValue () {
    //   let currentValue = this.value
    //   if (this.column.form.type === 'switch') {
    //     currentValue = Boolean(this.value)
    //   } else if (this.column.form.type === 'file') {
    //     currentValue = this.value ? this.value.split(',') : []
    //   }
    //   return currentValue
    // },
    upLoadUrl () {
      return getApi() + 'fileUpload/'
    },
    switchOptions () {
      if (this.column.form.type === 'switch') {
        return this.column.options.sort((a, b) => a.id - b.id).map(option => {
          let color = ''
          if (option.style === 'success') {
            color = '#58d68d'
          } else if (option.style === 'primary') {
            color = '#03a9f4'
          } else if (option.style === 'info') {
            color = '#03a9f4'
          } else if (option.style === 'warning') {
            color = '#ffcd14'
          } else if (option.style === 'danger') {
            color = '#fe6553'
          }
          return {
            ...option,
            color: color
          }
        })
      } else {
        return false
      }
    },
    twoDecimal (num) {
      return this.column.form.decimal ? parseFloat(num).toFixed(2) : num
    }
  },
  methods: {
    cardReader () { // 身份证读卡器
      if (this.$refs.card.ReadCard() === '0') {
        this.$emit('cardReader', this.column.name, this.$refs.card)
        // const CVRIDCard = this.$refs.card
        // console.log(CVRIDCard.Name, CVRIDCard.Sex, CVRIDCard.Nation, CVRIDCard.Born, CVRIDCard.Address, CVRIDCard.CardNo, CVRIDCard.IssuedAt, CVRIDCard.EffectedDate, CVRIDCard.ExpiredDate, CVRIDCard.SAMID, CVRIDCard.Pic, CVRIDCard.Picture, CVRIDCard.PictureLen)
      } else {
        this.$message({
          showClose: true,
          message: this.$refs.card.ReadCard(),
          type: 'error'
        })
      }
    },
    cardScaner () { // 身份证扫描仪
      this.scanerDialog = true
    },
    closeScaner () { // 扫描仪弹框关闭后执行
    },
    filterMethod (text) {
      if (this.options.some(option => option.label === text)) {
        this.optionsFilter = this.options.map(option => {
          return {
            ...option,
            show: true
          }
        })
      } else {
        this.optionsFilter = this.options.map(option => {
          return {
            ...option,
            show: option.label.indexOf(text) >= 0 || option.subtext.indexOf(text) >= 0
          }
        })
      }
    },
    selectChangeVisible (value, a, b) {
    },
    selectChangeValue (value) {
    },
    changeValue (value) {
      this.$emit('changeValue', this.column.name, this.isNumber && isNumber(value) ? Number(value) : value)
      if (this.column.form.chains) {
        this.column.form.chains.map(chain => {
          this.$emit('changeChain', this.column.name, this.isNumber && isNumber(value) ? Number(value) : value, chain)
        })
      }
    },
    dateChangeValue (value) {
      this.$emit('changeValue', this.column.name, value)
    },
    treeChangeValue (data, state) {
      let currentValue = this.currentValue
      state ? currentValue.add(data.id) : currentValue.delete(data.id)
      this.$emit('changeValue', this.column.name, Array.from(currentValue))
    },
    switchValue (value) {
      this.$emit('changeValue', this.column.name, Number(value))
    },
    uploadSuccess (response, file, fileList) {
      // console.log('上传成功')
      this.fileList = fileList
      this.$emit('uploadFile', this.column.name, response.data)
    },
    removeValue (file) {
      console.log(file)
    },
    beforeValue (value) {
      const isJPG = value.type === 'image/jpeg' || value.type === 'image/jpg' || value.type === 'image/png'
      const isLt5M = value.size / 1024 / 1024 < 5
      if (!isLt5M) {
        this.$message({
          showClose: true,
          message: '上传失败,文件大小不能超过5m',
          type: 'error'
        })
      }
      if (!isJPG) {
        this.$message({
          showClose: true,
          message: '上传文件失败,只能上传jpg/png图片',
          type: 'error'
        })
      }
      return isJPG && isLt5M
    },
    toggleEvent (e) {
      this.scanerDialog = false
    }
  }
}
</script>

<style scoped lang="sass">
.v-form-multiselect
  width: 100%
.onClass
  color: success
.text-value
  font-size: 16px
  color: #666   
.iframe
  display: block
  width: 100% 
  margin: auto
</style>
<template>
  <div>
    <div class="clearfix"
      v-if="column.filterBar.type === 'input'">
      <label class="el-form-item__label fl" :for="column.name">{{column.filterBar.filterLabel || column.label}}</label>
      <el-input
        class="el-form-item__content fl"
        :label="column.name"
        :value="value"
        :placeholder="holder"
        @change="inputEvent"/>
    </div>
    <div class="clearfix"
      v-else-if="column.filterBar.type === 'select'">
      <label class="el-form-item__label fl" :for="column.name">{{column.filterBar.filterLabel || column.label}}</label>
      <el-select
        class="el-form-item__content fl"
        v-model="value"
        :label="column.name"
        placeholder="请选择"
        :filterable="column.live"
        :filter-method="filterMethod"
        @change="selectEvent">
        <el-option
          v-for="option in options"
          v-if="option.show"
          :label="option.label"
          :value="option.value">
        </el-option>
      </el-select>
    </div>
    <div class="clearfix"
      v-else-if="column.filterBar.type === 'dateRange'">
      <label class="el-form-item__label fl" :for="column.name">{{column.filterBar.filterLabel || column.label}}</label>
      <el-date-picker
        class="el-form-item__content fl"
        v-model="value"
        type="daterange"
        placeholder="选择日期范围"
        @change="dataPickerEvent"
        >
      </el-date-picker>
    </div>
    <div class="clearfix"
      v-else-if="column.filterBar.type === 'digitRange'">
      <label class="el-form-item__label fl" :for="column.name">{{column.filterBar.filterLabel || column.label}}</label>
      <div 
        class="digit-input el-date-editor el-input fl digitRange">
        <input 
          type="text" 
          class="minStyle digit-input_inner el-input__inner" 
          @change="minDigitEvent"
          v-bind:value="value"/>
        <div class="digit_input_center digit-input_inner">-</div>
        <input 
          type="text"
          class="maxStyle digit-input_inner el-input__inner"
          @change="maxDigitEvent"
          :value="value"/>
      </div>
    </div>
    <el-button
     v-else-if="column.filterBar.type === 'button'"
     @click="filterEvent()">
      {{column.filterBar.filterLabel || column.label}}
    </el-button>
  </div>
</template>

<script>
import debounce from 'lodash/debounce'
import moment from 'moment'
export default {
  name: 'v-filter',
  props: {
    column: Object,
    searchQuery: Array
  },
  data () {
    const options = this.column.options ? [{
      id: '',
      value: '',
      label: '全部',
      subtext: 'qb'
    }, ...this.column.options].map(option => {
      return {
        ...option,
        value: option.value || option.id,
        show: true
      }
    }) : []
    return {
      fullOptions: options,
      options: options,
      search: this.searchQuery,
      searchQueryIsDirty: false,
      isCalculating: false,
      value: '',
      holder: '请搜索' + this.column.label
    }
  },
  computed: {
    searchIndicator () {
      if (this.isCalculating) {
        return 'loading'
      } else if (this.searchQueryIsDirty) {
        return 'typing'
      } else {
        return 'done'
      }
    }
  },
  methods: {
    filterMethod (text) {
      if (this.options.some(option => option.label === text)) {
        this.options = this.fullOptions.map(option => {
          return {
            ...option,
            show: true
          }
        })
      } else {
        this.options = this.fullOptions.map(option => {
          return {
            ...option,
            show: option.label.indexOf(text) >= 0 || option.subtext.indexOf(text) >= 0
          }
        })
      }
    },
    inputEvent: debounce(function (value) {
      this.searchQueryIsDirty = true
      this.search = value === '' ? [] : [{
        name: this.column.name,
        type: this.column.filterBar.like ? 'like' : 'equalto',
        value: value
      }]
    }, 500),
    selectEvent (value) {
      this.searchQueryIsDirty = true
      if (value !== '' && value !== undefined) {
        this.search = [{
          name: this.column.name,
          type: 'equalto',
          value: value
        }]
      } else {
        this.search = []
      }
    },
    dataPickerEvent (value) {
      var valueArr = value.split(' - ')
      this.searchQueryIsDirty = true
      if (value !== '') {
        this.search = [{
          name: this.column.name,
          type: 'greaterthanorequalto',
          value: moment(valueArr[0]).format('x')
        }, {
          name: this.column.name,
          type: 'lessthanorequalto',
          value: moment(valueArr[1]).endOf('day').format('x')
        }]
      } else {
        this.search = []
      }
    },
    minDigitEvent: debounce(function (e) {
      if (e.srcElement.value !== '') {
        this.search = [{
          name: this.column.name,
          type: 'greaterthanorequalto',
          value: moment(e.srcElement.value).format('x')
        }]
      } else {
        this.search = []
      }
    }, 500),
    maxDigitEvent: debounce(function (e) {
      if (e.srcElement.value !== '') {
        this.search = [{
          name: this.column.name,
          type: 'lessthanorequalto',
          value: moment(e.srcElement.value).format('x')
        }]
      } else {
        this.search = []
      }
    }, 500),
    filterEvent () {
      this.isCalculating = true
      this.$emit('filterBy', this.column, this.search)
      setTimeout(function () {
        this.isCalculating = false
        this.searchQueryIsDirty = false
      }.bind(this), 1000)
    }
  }
}
</script>

<style scoped lang="sass">
th
  text-align: left
.minStyle
  flex: 1
.maxStyle
  flex: 1
.digit-input_inner
  width: 42%
  float: left
.digit_input_center
  width: 16%
  height: 36px
  line-height: 36px
  text-align: center
  color: #bfcbd9
  // background-color: #bfcbd9
.el-form-item__content
  width: 150px
.digitRange
  width: 240px
</style>
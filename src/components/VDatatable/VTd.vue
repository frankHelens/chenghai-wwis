<template>
  <td v-if="column"
    >
    <slot></slot>
    <template v-if="isToolTip">
      <div
        class="text-overflow"
        :style="columnStyle">
        <el-popover
          placement="top-start"
          trigger="hover">
          <div class="text-break">{{ content }}</div>
          <span slot="reference">{{ content }}</span>
        </el-popover>
      </div>
      <!-- <el-popover
        placement="top-start"
        title="标题"
        width="200"
        trigger="hover"
        :value="tooltipShow"
        :content="content">
      </el-popover> -->
    </template>
    <div
      v-else
      :style="columnStyle">
      {{ content }}
    </div>
<!--     <div v-else-if="column.type === 'time'">
      {{ data[column.name] | timeRender  }}
    </div>
    <div v-else-if="column.type === 'select'">
      {{ data[column.name] | selectRender(column.options)  }}
    </div>
    <div v-else-if="column.type === 'multiselect'">
      {{ data[column.name] | multiselectRender(column.options)  }}
    </div> -->
    <!-- <div v-else-if="column.type === 'button'">
      <button v-for="button in column.buttons"  @click="button.handle">
        {{ button.label }}
      </button>
    </div> -->
    <!-- <div v-else @click="handleChange(data[column.name],column,data)">
      {{ data[column.name] }}
    </div> -->
  </td>
</template>

<script>
import moment from 'moment'
export default {
  name: 'v-td',
  props: {
    data: {
      type: Object,
      default: {}
    },
    column: {
      type: Object
    },
    name: {
      type: String
    }
  },
  data () {
    return {
      tooltipShow: false
    }
  },
  computed: {
    columnStyle () {
      return this.column.width ? {
        width: this.column.width
      } : {}
    },
    isToolTip () {
      const type = this.column.type
      return this.content && (!type || type === 'select' || type === 'multiselect') && isNaN(this.content) && this.content.length > 10
    },
    content () {
      // console.log(column.options)
      const column = this.column
      const value = this.data[column.name]
      return column.type
      ? column.type === 'select'
      ? this.selectRender(value, column.options)
      : column.type === 'time'
      ? this.timeRender(value)
      : column.type === 'multiselect'
      // ? 'test'
      ? this.multiselectRender(value, column.options)
      : null
      : value
    }
  },
  methods: {
    tooltipToggle (state) {
      this.tooltipShow = state
    },
    handleChange (value, column, data) {
      this.$emit('handleChange', value, column, data)
    },
    timeRender (value) {
      return value ? moment(value).format(this.column.timeFormat || 'YYYY-MM-DD HH:mm:ss') : null
    },
    multiselectRender (values, options) {
      return values.map(value => {
        const item = options.find(option => option.id === value)
        return item ? item.label : ''
      }).join(',')
    },
    selectRender (value, options) {
      const option = options ? options.find(option => {
        return option.value !== undefined ? option.value === value : option.id === value
      }) : null
      return option ? option.label : null
    }
  }
}
</script>

<style scoped lang="sass">
.text-overflow
  max-width: 300px
  text-overflow: ellipsis
  white-space: nowrap
  overflow: hidden
.text-break
  word-break: break-all
  word-wrap: break-word
  max-width: 300px
</style>
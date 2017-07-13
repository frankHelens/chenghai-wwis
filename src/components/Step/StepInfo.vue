<template>
  <el-row class="step-list">
    <el-col
      class="step-list-item"
      v-for="stepInfo in stepInfoList"
      :span="stepInfo.span || 8"
    ><span>{{stepInfo.label}}：</span>{{stepInfo.value | dataFilter(stepInfo.type)}}</el-col>
  </el-row>
</template>

<script>
  import moment from 'moment'
  
  export default {
    props: {
      stepInfoList: Array
    },
    data () {
      return {}
    },
    filters: {
      dataFilter (val, type) {
        if (type === 'date') {
          return moment(val).format('YYYY-MM-DD')
        } else if (type === 'time') {
          return moment(val).format('YYYY-MM-DD HH:mm:ss')
        } else {
          return val
        }
      }
    }
  }
</script>

<style lang="sass" scoped>
.step-list
  width: 90%
  font-size: 14px
  color: #424e67
  margin: 0 auto 20px
  span
    font-weight: bold
  .step-list-item
    margin: 10px 0;
</style>
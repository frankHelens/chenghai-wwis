<template>
  <div>
    <ul :class="showIcon?'flow-Info-list' : 'Other-flow-Info-list'">
      <li v-for="(item, index) in infoList" >
        <el-tooltip
          effect="light"
          placement="top"
          :content="item.value">
          <span>{{item.label}}：<strong>{{item.value}}</strong></span>
        </el-tooltip>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    infoList: Array,
    showIcon: Boolean
  },
  data () {
    return {
    }
  }
}
</script>

<style lang="sass" scoped>
h3
  font-family: "微软雅黑"
.flow-Info-list
  margin-top: 15px
  background: #f7f8fa
  padding-top: 15px
  display: flex
  flex-direction: row
  flex-wrap: wrap
  font-size: 14px
  color: #555555
  li
    width: 23%
    margin-bottom: 30px
    padding-left: 10px
    border-left: 3px solid #03a9f4
    .el-tooltip
      max-width: 100%
      overflow: hidden
      text-overflow: ellipsis
      white-space: nowrap
    .show-value
      background: #03a9f4
.Other-flow-Info-list
  flex: 1
  margin-top: 20px
  background: #f7f8fa
  display: flex
  padding: 20px 0
  li
    flex: 1
  dl
    width: 200px
    display: flex
    dd
      display: flex
      flex-direction: 'row' 
      align-items: center
      margin-left: 20px
      h4
        font-size: 16px
        color: #222
      p
        margin-left: 10px 
        font-size: 16px
        color: #555
</style>
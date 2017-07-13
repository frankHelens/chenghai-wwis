<template>
  <li>
    <router-link :to="'/base/task/'+taskId">
      {{taskId}}.{{currentStepName}}
      <!-- <b :class="{colorRed: isTimeout}">({{remainingTimeText}})</b> -->
      <b :class="{colorRed: !isNotify, colorGreen: isNotify}">({{isNotify | filterNotify}})</b>
      <p>{{clientName}}-{{clientContact}}</p>
      <!-- <el-progress
        :text-inside="true"
        :stroke-width="5"
        :percentage="percentage"
        :status="isTimeout?'exception':'success'"
        class="mt10"></el-progress> -->
    </router-link>
  </li>
</template>

<script>
import moment from 'moment'
export default {
  name: 'task-item',
  props: {
    taskId: Number,
    currentStepName: String,
    remainingTime: Number,
    totalTime: Number,
    clientName: String,
    clientContact: String,
    isNotify: {
      type: Number,
      default: 0
    }
  },
  filters: {
    filterNotify (val) {
      if (val === 0) {
        return '未通知'
      }
      if (val === 1) {
        return '已通知'
      }
    }
  },
  computed: {
    isTimeout () {
      return this.remainingTime < 0
    },
    percentage () {
      return this.isTimeout ? 100 : ((this.totalTime - this.remainingTime) * 100 / this.totalTime) > 0 ? (this.totalTime - this.remainingTime) * 100 / this.totalTime : 0
    },
    remainingTimeText () {
      if (this.isTimeout) {
        return '已超时'
      } else {
        return '剩余' + moment.duration(this.remainingTime).days() + '天' + moment.duration(this.remainingTime).hours() + '小时'
      }
    }
  }
}
</script>

<style scoped lang="sass">
li
  padding: 20px 0
  border-bottom: 1px solid #e8e8e8
  &:nth-last-of-type(1)
    border-bottom: 0px
  a
    display: block
    font-size: 14px
    color: #999
    text-decoration: none
  b
    font-size: 12px
    margin-left: 5px
  p
    margin-top: 10px
.colorRed
  color: #fe6553
.colorGreen
  color: rgb(88, 214, 141)
</style>

<template>
  <div class="topbar">
    <logo v-show="isOpen"></logo>
    <menu-toggle></menu-toggle>
    <ul class="top-menu pull-right">
      <!-- <top-menu-item  badge=2>
        <span slot="title">
          <i slot="title" class="fa fa-bell-o"></i>
          报警
        </span>
        <alarms slot="list"></alarms> 
      </top-menu-item> -->
      <top-menu-item>
        <span slot="title">
          <i slot="title" class="fa fa-qrcode"></i>
          APP下载
        </span>
        <div slot="list" class="qr">
          <img :src="getAndroidQR" alt="">
          <!-- <img :src="getIOSQR" alt=""> -->
        </div>
      </top-menu-item>
      <top-menu-item :badge="taskNum">
        <span slot="title">
          <i slot="title" class="fa fa-tasks"></i>
          任务
        </span>
        <task-list slot="list" @getTaskNum="getTaskNum" />
      </top-menu-item>
      <top-menu-item>
        <span slot="title">
          {{realname}}
          <i class="fa fa-angle-down"></i>
        </span>
        <account slot="list"></account>
      </top-menu-item>
    </ul>
  </div>
</template>
<script>
import { getRealname } from '../../../auth'
import Logo from './Logo'
import MenuToggle from './MenuToggle'
import TopMenuItem from './TopMenuItem'
import Alarms from './Alarms'
import TaskList from './TaskList'
import Account from './Account'
import { getUrl } from '../../../utils/common'

export default {
  name: 'Topbar',
  props: {
    isOpen: Boolean
  },
  components: {
    Logo,
    MenuToggle,
    TopMenuItem,
    Alarms,
    TaskList,
    Account
  },
  data () {
    return {
      taskNum: 0,
      realname: getRealname()
    }
  },
  methods: {
    getTaskNum (taskNum) {
      this.taskNum = taskNum
    }
  },
  computed: {
    getAndroidQR () {
      return getUrl() + '/app/android.png'
    },
    getIOSQR () {
      return getUrl() + '/app/iso.png'
    }
  }
}
</script>

<style scoped lang="sass">
.topbar
  width: 100%
  margin: 0
  border: 0
  padding: 0
  height: 50px
  min-height: 50px
  background-color: #1e2430
.top-menu
  margin: 0
  padding-left: 20px
  padding-right: 20px
  list-style: none
.qr
  width: 150px
  padding: 10px
  overflow: hidden
  img
    width: 100%
    border: 1px solid #eee
    // float: left
    vertical-align: middle
  // img:nth-child(1)
    // margin-right: 7%
</style>

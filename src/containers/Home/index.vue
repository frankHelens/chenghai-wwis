<template>
  <div id="home" class="container">
    <div class="topbar">
      <topbar :isOpen="isOpen" />
    </div>
    <div class="wrapper">
      <navbar 
        :class="{'nav':true,'navbar-open':isOpen}" 
        :isOpen="isOpen" 
        :routesPure="routesPure"/>
      <router-view class="content"></router-view>
    </div>
  </div>
</template>

<script>
import { getMenus } from '../../auth'
import { mapGetters } from 'vuex'

import Navbar from './Navbar'
import Topbar from './Topbar'

export default {
  components: {
    Navbar,
    Topbar
  },
  data () {
    return {
      routesPure: getMenus().map(item => {
        return {
          id: item.id,
          pid: item.menuparentid,
          label: item.menulabel,
          name: item.menuname,
          icon: item.menuicon,
          url: item.menuurl,
          flowid: item.flowid
        }
      })
      // routesPure: [
      //   {
      //     id: '1',
      //     pid: '0',
      //     name: 'datacenter',
      //     icon: 'home',
      //     label: '数据中心',
      //     url: '/datacenter'
      //   }, {
      //     id: '2',
      //     pid: '0',
      //     name: 'manager',
      //     icon: 'cog',
      //     label: '系统管理',
      //     url: '/manager'
      //   }, {
      //     id: '21',
      //     pid: '2',
      //     name: 'config',
      //     label: '系统配置',
      //     url: '/manager/config'
      //   }, {
      //     id: '22',
      //     pid: '2',
      //     name: 'menu',
      //     label: '菜单配置',
      //     url: '/manager/menu'
      //   }, {
      //     id: '23',
      //     pid: '2',
      //     name: 'deptlevel',
      //     label: '组织级别管理',
      //     url: '/manager/deptlevel'
      //   }, {
      //     id: '24',
      //     pid: '2',
      //     name: 'depttype',
      //     label: '组织类别管理',
      //     url: '/manager/depttype'
      //   }, {
      //     id: '25',
      //     pid: '2',
      //     name: 'department',
      //     label: '组织架构管理',
      //     url: '/manager/department'
      //   }, {
      //     id: '26',
      //     pid: '2',
      //     name: 'role',
      //     label: '角色管理',
      //     url: '/manager/role'
      //   }, {
      //     id: '27',
      //     pid: '2',
      //     name: 'account',
      //     label: '账号管理',
      //     url: '/manager/account'
      //   }, {
      //     id: '28',
      //     pid: '2',
      //     name: 'log',
      //     label: '操作日志',
      //     url: '/manager/log'
      //   }, {
      //     id: '3',
      //     pid: '0',
      //     name: 'install',
      //     icon: 'dashboard',
      //     label: '水表报装',
      //     url: '/install'
      //   }, {
      //     id: '31',
      //     pid: '3',
      //     name: 'apply',
      //     label: '用水申报',
      //     url: '/install/apply'
      //   }, {
      //     id: '32',
      //     pid: '3',
      //     name: 'survey',
      //     label: '勘察计划',
      //     url: '/install/survey'
      //   }, {
      //     id: '33',
      //     pid: '3',
      //     name: 'budget',
      //     label: '工程预算',
      //     url: '/install/budget'
      //   }, {
      //     id: '34',
      //     pid: '3',
      //     name: 'verify',
      //     label: '审核审批',
      //     url: '/install/verify'
      //   }, {
      //     id: '35',
      //     pid: '3',
      //     name: 'charge',
      //     label: '结算收费',
      //     url: '/install/charge'
      //   }, {
      //     id: '36',
      //     pid: '3',
      //     name: 'agreement',
      //     label: '签订协议书',
      //     url: '/install/agreement'
      //   }, {
      //     id: '37',
      //     pid: '3',
      //     name: 'Archive',
      //     label: '施工安装归档',
      //     url: '/install/Archive'
      //   }, {
      //     id: '38',
      //     pid: '3',
      //     name: 'statistics',
      //     label: '统计报表',
      //     url: '/install/statistics'
      //   }, {
      //     id: '4',
      //     pid: '0',
      //     name: 'storage',
      //     icon: 'hdd-o',
      //     label: '仓储中心',
      //     url: '/storage'
      //   }, {
      //     id: '41',
      //     pid: '4',
      //     name: 'material',
      //     label: '物料管理',
      //     url: '/storage/material'
      //   }, {
      //     id: '42',
      //     pid: '4',
      //     name: 'repertory',
      //     label: '物料库存批次',
      //     url: '/storage/repertory'
      //   }, {
      //     id: '43',
      //     pid: '4',
      //     name: 'demand',
      //     label: '物资需求',
      //     url: '/storage/demand'
      //   }, {
      //     id: '44',
      //     pid: '4',
      //     name: 'purchase',
      //     label: '采购入仓',
      //     url: '/storage/purchase'
      //   }, {
      //     id: '45',
      //     pid: '4',
      //     name: 'receive',
      //     label: '材料出仓',
      //     url: '/storage/receive'
      //   }, {
      //     id: '46',
      //     pid: '4',
      //     name: 'recover',
      //     label: '材料退仓',
      //     url: '/storage/recover'
      //   }, {
      //     id: '47',
      //     pid: '4',
      //     name: 'transfer',
      //     label: '预借转领用',
      //     url: '/storage/transfer'
      //   }, {
      //     id: '48',
      //     pid: '4',
      //     name: 'statistics',
      //     label: '统计报表',
      //     url: '/storage/statistics'
      //   }, {
      //     id: '5',
      //     pid: '0',
      //     name: 'work',
      //     icon: 'tasks',
      //     label: '工单管理',
      //     url: '/work'
      //   }, {
      //     id: '51',
      //     pid: '5',
      //     name: 'flow',
      //     label: '流程定义列表',
      //     url: '/work/flowDefine'
      //   }
      // ]
    }
  },
  computed: {
    ...mapGetters([
      'isOpen'
    ])
  },
  motheds: {
    toggleNav: function () {
      this.isOpen = !this.isOpen
    }
  }
}
</script>

<style scoped lang="sass">
.container
  display: flex
  flex-direction: column
  height: 100%
.wrapper
  flex: 1
  display: flex
  flex-direction: row
.nav
  width: 45px
  overflow: auto
  &.navbar-open
    width: 235px
.content
  flex: 1
  overflow: auto
</style>
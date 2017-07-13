<template>
  <div>
    <div class="main">
      <h2 class="title">
        {{title}}
      </h2>
      <div>
        <div class="left">
          <system-config :datas="configData" />
        </div>
        <router-view class="right"></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import systemConfig from './systemConfig'
import { fetchList } from '../../utils/api'
import { sortBy } from 'lodash'

export default {
  components: {
    systemConfig
  },
  data () {
    return {
      title: '系统配置',
      configData: []
    }
  },
  created () {
    fetchList({
      resource: 'dictOption'
    }).then(result => {
      this.configData = sortBy(result, data => data.sort)
    })
  }
}
</script>

<style lang="sass" scoped>
.left
  float: left
  border-right: 1px solid #dae3eb
  width: 40%
  padding-right: 100px
  box-sizing: border-box
.right
  float: left
  width: 59%
  padding-left: 85px
  box-sizing: border-box
</style>
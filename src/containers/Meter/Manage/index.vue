<template>
  <div class="main">
    <tab-pane
      :tabList="tabList"
      :path="path">
      <div slot="govern" class="tab-style">
        <govern class="tab-style"/>
      </div>
      <div slot="situation" class="tab-style">
        <situation class="tab-style"/>
      </div>
    </tab-pane>
  </div>
</template>

<script>
import Govern from './Govern'
import situation from './situation'
import TabPane from '../../../components/TabPane'

export default {
  components: {
    Govern,
    situation,
    TabPane
  },
  data () {
    return {
      name: 'manage',
      tabList: [{
        name: 'govern',
        label: '水表详情'
      }, {
        name: 'situation',
        label: '用水情况'
      }],
      path: '/meter/manage'
    }
  }
}
</script>


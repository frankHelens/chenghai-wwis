<template>
  <div>
    <tab-pane
      :tabList="tabList">
      <div slot="exceed" class="tab-style">
        <exceed/>
      </div>
    </tab-pane>
  </div>

</template>

<script>
import TabPane from '../../../components/TabPane'
import Exceed from './Exceed'
export default {
  components: {
    TabPane,
    Exceed
  },
  data () {
    return {
      title: '水表设置',
      tabList: [{
        name: 'exceed',
        label: '水表超期设置'
      }]
    }
  }
}
</script>

<style lang="sass" scoped>

</style>

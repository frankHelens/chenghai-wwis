<template>
  <div class="flow-step-list">
    <div>
      <ul>
        <step 
          v-for="(data, index) in stepList" 
          :styles="data.styles" 
          :title="data.title"
          :infoList="data.infoList"
          :formList="data.formList"
          :imageList="data.imageList"
          :isActive="data.isActive"
          :canOpen="data.canOpen"
          :currentStepOwner = 'currentStepOwner'
          :index="index + 1"
        />
      </ul>
    </div>
  </div>
</template>

<script>
import step from './StepItem'

export default {
  props: {
    stepList: Array,
    currentStepOwner: Boolean
  },
  components: {
    step
  },
  data () {
    return {
    }
  }

}
</script>

<style lang="sass" scoped>
.flow-step-list
  margin-top: 10px
  div
    height: 400px
    background: #f6f8fa
    padding: 20px 35px 20px 30px
    box-sizing: border-box
    overflow-y: auto
    ul
      padding-right: 20px
h3,h6
  font-family: '微软雅黑'
</style>


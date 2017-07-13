<template>
  <div class="logo">
    <span href="index.html">{{title}}</span>
  </div>
</template>

<script>
import { TITLE } from '../../../utils/common'

export default {
  name: 'Logo',
  data () {
    return {
      title: TITLE
    }
  }
}
</script>

<style scoped lang="sass">
.logo
  float: left
  display: block
  width: 150px
  height: 50px
  padding-left: 20px
  padding-right: 20px
  span
    line-height: 50px
    font-size: 18px
    color: #a7b5c6
    cursor: pointer
    &:hover
      color: #ccc
</style>

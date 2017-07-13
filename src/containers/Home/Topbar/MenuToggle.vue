<template>
  <span class="menu-toggle" @click="changeOpen">
    <i class="fa fa-align-justify"></i>
  </span>
</template>

<script>
import { mapMutations } from 'vuex'

export default {
  name: 'MenuToggler',
  data () {
    return {
    }
  },
  methods: {
    ...mapMutations([
      'changeOpen'
    ])
  }
}
</script>

<style scoped lang="sass">
.menu-toggle
  display: inline-block
  width: 45px
  text-align: center
  font-size: 18px
  line-height: 50px
  color: #8b9cb7
  cursor: pointer
  &:hover
    color: #ccc
</style>
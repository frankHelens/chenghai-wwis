<template>
  <ul @mouseenter="changeHover(true)" @mouseleave="changeHover(false)">
    <nav-item v-for="item in navlist" :item="item" :navIsOpen="navIsOpen" ></nav-item>
  </ul>
</template>

<script>
import { mapMutations } from 'vuex'
import { treeFormat } from '../../../utils/common'
import NavItem from './NavItem'

export default {
  name: 'NavList',
  components: {
    NavItem
  },
  props: {
    data: Array,
    navIsOpen: Boolean
  },
  computed: {
    navlist: function () {
      return treeFormat(this.data)
    }
  },
  methods: {
    ...mapMutations([
      'changeHover'
    ])
  }
}
</script>

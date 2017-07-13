<template>
  <li class="top-menu-item pull-left" :class="{ 'top-menu-open': isActive }">
    <a href="javascript:;" @click="handleOpen" v-Clickoutside="handleClose">
        <!-- <img alt="" class="img-circle" src="../assets/layouts/layout/img/avatar3_small.jpg"> -->
        <slot name="title"></slot>
        <span class="badge badge-default" v-if="badge">{{badge}}</span>
        <!-- <slot name="badge"></slot> -->
    </a>
    <div>
      <slot name="list"></slot>
    </div>
  </li>
</template>

<script>
import Clickoutside from '../../../utils/clickoutside'

export default {
  name: 'TopMenu',
  directives: { Clickoutside },
  props: ['badge'],
  data () {
    return {
      isActive: false
    }
  },
  methods: {
    handleOpen () {
      this.isActive = true
    },
    handleClose () {
      this.isActive = false
    }
  }
}
</script>

<style scoped lang="sass">
.badge
  position: absolute
  top: 10px
  left: 0
  font-weight: 300
  padding: 3px 6px
  font-family: "Open Sans",sans-serif
  font-size: 11px!important
  font-weight: 300
  height: 18px
  line-height: 18px
  color: #fff
  padding: 0 6px
  border-radius: 12px!important
  text-shadow: none!important
  text-align: center
  vertical-align: middle
.badge-default
  background-color: #03a9f4
  color: #fff
.top-menu-item
  position: relative
  >a
    display: block
    padding: 0 12px
    line-height: 50px
    color: #a7b5c6
    text-decoration: none
    &:hover
      color: #ccc
  >div
    display: none;
    position: absolute
    z-index: 1000
    top: 42px
    right: 0
    margin: 10px 0 0
    min-width: 175px
    float: left;
    list-style: none
    text-shadow: none
    border: 1px solid #eee
    background-color: #fff
    box-shadow: 5px 5px rgba(102,102,102,.1)
    &:before
      position: absolute
      top: -7px
      right: 9px
      display: inline-block!important
      border-right: 7px solid transparent
      border-bottom: 7px solid #eee
      border-left: 7px solid transparent
      border-bottom-color: rgba(0,0,0,.1)
      content: ''
    &:after
      position: absolute
      top: -6px
      right: 10px
      display: inline-block!important
      border-right: 6px solid transparent
      border-bottom: 6px solid #fff
      border-left: 6px solid transparent
      content: ''
.top-menu-open
  >a
    background-color: #39414c
  >div
    display: block
</style>

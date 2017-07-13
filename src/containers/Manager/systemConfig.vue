<template>
  <ul>
    <li><h6>类别</h6></li>
    <li v-if="datas.length > 0" v-for="val in datas" :class="{active: val.id === routeID}">
      <router-link :to="'/manager/system/' + val.id">
        <span>{{val.label}}</span>
      </router-link>
    </li>
  </ul>
</template>

<script>
export default {
  props: {
    datas: Array
  },
  data () {
    return {
      routeID: this.$route.params.id
    }
  },
  watch: {
    '$route': 'upActive'
  },
  methods: {
    upActive () {
      this.routeID = this.$route.params.id
    }
  }
}
</script>

<style lang="sass" scoped>
li
  height: 60px
  box-sizing: border-box
  display: flex
  justify-content: center
  align-items: center
  color: #555
  font-size: 14px
  border: 1px solid #d1dbe5
  border-bottom: 0px
  text-align: center
  &:nth-last-of-type(1)
    border-bottom: 1px solid #d1dbe5
  h6
    flex: 1
  a
    display: flex
    justify-content: center
    align-items: center
    width: 100%
    height: 100%
    color: #999
    text-decoration: none
  span
    flex: 1
    display: block
.active
  border-left: 3px solid #03a9f4
  background: #f7f8fc
</style>
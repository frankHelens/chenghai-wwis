<template>
  <ul class="top-menu-alarms">
    <li>
      <a href="javascript:;">警告1</a>
    </li>
    <li>
      <a href="javascript:;">警告2</a>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'Alarms',
  data () {
    return {
    }
  },
  methods: {
  }
}
</script>

<style scoped lang="sass">
.top-menu-alarms
  list-style: none
  padding: 0
  >li
    >a
      padding: 8px 16px
      color: #999999
      text-decoration: none
      display: block
      clear: both
      font-weight: 300
      line-height: 18px
      white-space: nowrap
      &:hover
        text-decoration: none
        color: #262626
        background-color: #e1e5ec
      >i
        display: inline-block
        width: 24px
        text-align: center
</style>

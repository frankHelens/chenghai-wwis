<template>
  <thead>
    <slot></slot>
  </thead>
</template>

<script>
export default {
  name: 'v-thead',
  created () {
    this.isThead = true
  },
  computed: {
    showCheckbox () {
      return this.$parent.showCheckbox
    },
    enableSelectAll () {
      return this.$parent.enableSelectAll
    },
    multiSelectable () {
      return this.$parent.multiSelectable
    },
    isSelectAll () {
      return this.$parent.isSelectAll
    }
  },
  methods: {
    selectAll () {
      this.$parent.selectAll()
    },
    unSelectAll () {
      this.$parent.unSelectAll()
    }
  }
}
</script>

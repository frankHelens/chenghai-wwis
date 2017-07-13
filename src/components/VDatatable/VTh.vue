<template>
  <th
    @click="handleClick" 
    :class="{isSort: column.sort, active: active }">
    {{ column.label }}
    <span v-if="column.sort" class="arrow" :class="classDirection"
    >
    </span>
  </th>
</template>

<script>
export default {
  name: 'v-th',
  props: {
    column: Object,
    active: {
      type: Boolean,
      default: false
    },
    sortDirection: {
      type: String,
      default: 'sort'
    }
  },
  computed: {
    classDirection () {
      return this.sortDirection === 'asc'
      ? 'fa fa-sort-asc'
      : this.sortDirection === 'desc'
      ? 'fa fa-sort-desc'
      : 'fa fa-sort'
    }
  },
  methods: {
    handleClick () {
      if (this.column.sort) {
        this.$emit('sortBy', this.column, this.sortDirection === 'desc' ? 'asc' : 'desc')
      }
    }
  }
}
</script>

<style scoped lang="sass">
th
  text-align: left
  &.isSort
    cursor: pointer
    .arrow
      display: inline-block
      width: 0
      height: 0
      margin-left: 5px
      opacity: 0.66
    &.active
      .arrow
        opacity: 1
</style>
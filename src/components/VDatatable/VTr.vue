<template>
  <tr>
    <slot></slot>
  </tr>
</template>

<script>
import VTd from './VTd'
import VTh from './VTh'
export default {
  name: 'v-tr',
  props: {
    selectable: {
      type: Boolean,
      default: true
    },
    selected: {
      type: Boolean,
      default: false
    },
    fHeader: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      hover: false,
      isThead: this.$parent.isThead
    }
  },
  mounted () {
    if (this.selected) {
      this.$parent.selectRow(this.rowId)
    }
  },
  computed: {
    className () {
      return {
        hover: this.hover,
        selected: this.isSelected,
        stripe: false
      }
    },
    isTh () {
      return this.$parent.isThead
    },
    isTf () {
      return this.$parent.isTfoot
    },
    isTb () {
      return this.$parent.isTbody
    },
    isSelected () {
      return this.$parent.selectedRows && this.$parent.selectedRows.indexOf(this.rowId) !== -1
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
    handleClick (e) {
      if (!this.$parent.isTbody) return
      if (this.selectable) {
        if (!this.isSelected) {
          this.$parent.selectRow(this.rowId)
        } else {
          this.$parent.unSelectRow(this.rowId)
        }
      }
      this.$parent.handleRowClick(e, this)
    },
    handleSelectAllChange (val) {
      if (val) {
        this.$parent.selectAll()
      } else {
        this.$parent.unSelectAll()
      }
    },
    handleCellHover (event, name, td) {
      if (this.$parent.handleCellHover) this.$parent.handleCellHover(event, name, td, this.rowId, this)
    },
    handleCellHoverExit (event, name, td) {
      if (this.$parent.handleCellHoverExit) this.$parent.handleCellHoverExit(event, name, td, this.rowId, this)
    },
    handleCellClick (event, name, td) {
      if (this.$parent.handleCellClick) this.$parent.handleCellClick(event, name, td, this.rowId, this)
    }
  },
  watch: {
    selected (val, oldVal) {
      if (val === oldVal) return
      if (val) {
        this.$parent.selectRow(this.rowId, false)
      } else {
        this.$parent.unSelectRow(this.rowId, false)
      }
    }
  },
  components: {
    VTd,
    VTh
  }
}
</script>

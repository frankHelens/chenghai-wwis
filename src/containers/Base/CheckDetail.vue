<template>
	<task-detail :showState="show"></task-detail>
</template>

<script>
import TaskDetail from './TaskDetail'

export default {
  components: {
    TaskDetail
  },
  data () {
    return {
      show: true
    }
  }
}
</script>
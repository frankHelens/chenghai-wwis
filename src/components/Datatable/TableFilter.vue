<template>
  <el-select v-model="value" placeholder="请选择服务项目" @change="selectEvent">
    <el-option
      v-for="item in serviceList"
      :label="item.label"
      :value="item.value">
    </el-option>
  </el-select>
</template>

<script>
  export default {
    props: {
      serviceList: Array
    },
    data () {
      return {
        value: 0
      }
    },
    methods: {
      selectEvent () {
        this.$emit('changeService', this.value)
      }
    }
  }
</script>
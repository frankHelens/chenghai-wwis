<template>
    <!-- v-for="button in buttonList" -->
  <!-- <el-button
    :type="button.style"
    @click="buttonListEvent(button.name, button.validate, button.callBackFn)">
    {{button.label}}
  </el-button> -->
  <el-button
  :type="btnObject.style"
  @click="buttonListEvent(btnObject.name, btnObject.validate)">{{btnObject.label}}</el-button> 
</template>

<script>
export default {
  props: {
    btnObject: {
      type: Object,
      default: () => []
    }
  },
  data () {
    return {
      buttonListEvent (name, validate) {
        if (validate) {
          // this.$refs['form'].validate((valid) => {
          //   if (valid) {
          //     this.$emit('buttonListEvent', name, this.formValues, this.columns)
          //   } else {
          //     console.log('error submit!!')
          //     return false
          //   }
          // })
        } else {
          this.$emit('buttonListEvent', name, validate)
        }
      }
    }
  },
  methods: {}
}

</script>
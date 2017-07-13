<template>
  <div class="content">
    <div class="main">
      <h2 class="title">
        {{title}}
      </h2>
      <task-info :infoList="taskInfo" showIcon>
      </task-info>
      <v-form
        v-if="formShow"
        class="form"
        :columns="formColumns"
        :toolbar = "toolbar"
        :values="formValues"
        :buttonList="buttonList"
        :isColumn = 'isColumn'
        @buttonListEvent="formSubmit">
      </v-form>
    </div>
  </div>
</template>

<script>
import { fetch } from '../../../utils/api'
import VForm from '../../../components/VForm'
import TaskInfo from '../../../components/Task/Info'
import { config } from '../../../utils/common'

export default {
  name: 'task-item',
  components: {
    VForm,
    TaskInfo
  },
  data () {
    return {
      toolbar: {
        export: true
      },
      flowId: this.$route.params.id,
      ...config.install.newinstall.budgetEditer
    }
  },
  created () {
    this.getData()
  },
  methods: {
    getData () {
      fetch({
        method: 'get',
        url: '/installCost/' + this.flowId
      }).then(data => {
        let formValues = {}
        Object.keys(data).map(key => {
          formValues[key] = parseFloat(data[key]).toFixed(2)
        })
        this.formValues = formValues
        this.formShow = true
      })
      fetch({
        method: 'get',
        url: '/flowInstance/' + this.flowId
      }).then(data => {
        this.taskInfo = data.currentMainInfoList
      })
    },
    formSubmit (name, values) {
      Object.keys(values).map(item => {
        values[item] = Number(values[item])
      })
      if (name === 'submit') {
        fetch({
          method: 'put',
          url: '/installCost/' + this.flowId,
          data: values
        }).then(data => {
          if (data) {
            this.$message({
              message: '提交成功！',
              showClose: true,
              type: 'success'
            })
            this.$router.push('/base/task/' + this.flowId)
          }
        })
      }
      if (name === 'back') {
        this.$router.push('/base/task/' + this.flowId)
      }
    }
  }
}
</script>
<style lang="sass" scoped>
.form
  max-width: 1000px
  padding-top: 20px
</style>

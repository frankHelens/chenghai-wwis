<template>
  <el-dialog
    title="提示"
    v-model="isDialog"
    size="tiny">
    <slot></slot>
    <ul class="dialog-content" v-if="dialogContent.showMsg">
      <li>客户名称：{{dialogContent.data.clientName}}</li>
      <li>联系电话：{{dialogContent.data.clientPhone || dialogContent.data.clientContact || dialogContent.data.clientMobile}}</li>
      <li>水表口径：{{dialogContent.data.meterDiameter}}mm</li>
      <li>地址：{{dialogContent.data.clientAddress}}</li>
    </ul>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogEvent(dialogContent.name, dialogContent.data, false)">取 消</el-button>
      <el-button type="primary" @click="dialogEvent(dialogContent.name, dialogContent.data, true)">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  export default {
    props: {
      dialogVisible: Boolean,
      dialogContent: {
        type: Object,
        default: () => {
          return {}
        }
      }
    },
    data () {
      return {
        isDialog: this.dialogVisible
      }
    },
    methods: {
      dialogEvent (name, data, bol) {
        this.$emit('dialogEvent', name, data, bol)
      }
    },
    watch: {
      dialogVisible (val) {
        this.isDialog = val
      },
      isDialog (val) {
        this.$emit('onDialogChange', val) // 组件内对isDialog变更后向外部发送事件通知
      }
    }
  }
</script>


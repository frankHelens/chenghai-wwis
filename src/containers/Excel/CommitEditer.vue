<template>
	<div>
    <div class="main">
      <h2 class="title">
        {{title}}
      </h2>
      <div class="button-list">
        <div>
          <el-button icon="arrow-left" @click="backEvent" type="primary">返回</el-button>
        </div>
        <el-upload
          class="upload-style"
          ref="upload"
          :action="getURL"
          :on-success="uploadSuccess"
          :before-upload="beforeValue"
          :show-file-list="false"
          :file-list="fileList"
          :auto-upload="true">
          <!-- <span class="fa fa-cloud-upload">上传</span> -->
          <el-button slot="trigger" type="primary" icon="upload">上传</el-button>
        </el-upload>
      </div>
      <el-table
        :data="fileList"
        border
        stripe
        height="450"
        style="width: 100%">
        <el-table-column
          label="序号"
          type="index"
          width="80">
        </el-table-column>
        <el-table-column
          v-for="data in titleList"
          :type="data.type"
          :prop="data.prop"
          :label="data.label"
          :min-width="data.width">
        </el-table-column>
        <el-table-column
          label="操作"
          width="150">
          <template scope="scope">
            <el-button type="success" size="small" @click="downClick(scope.row)">下载</el-button>
            <el-button type="danger" @click="updateClick(scope.row)" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <v-dialog
      :dialogVisible="dialogVisible"
      :dialogContent="dialogContent"
      @dialogEvent="dialogEvent"
      @onDialogChange="onDialogChange">
      <h3 class="dialog-title">{{dialogContent.content}}</h3>
    </v-dialog>
	</div>
</template>

<script>
import { fetch, fetchList } from '../../utils/api'
import { getApi, getUrl, renderSize } from '../../utils/common'
import VDialog from '../../components/VDialog'

export default {
  components: {
    VDialog
  },
  data () {
    return {
      title: '',
      // materialViewer
      // surveyViewer
      // budgetViewer
      orderCode: '',
      dialogVisible: false,
      dialogContent: {},
      resource: 'fileUpload/budget?',
      fileList: [],
      titleList: [{
        prop: 'name',
        label: '文件名',
        width: '100'
      }, {
        prop: 'size',
        label: '文件大小',
        width: '100'
      }, {
        prop: 'path',
        label: '文件路径',
        width: '200'
      }],
      filterBy: [{
        name: 'flowInstanceId',
        type: 'equalto',
        value: this.$route.params.id
      }]
    }
  },
  created () {
    this.changeTitle()
    this.getData()
  },
  computed: {
    getURL () {
      return getApi() + this.resource
    }
  },
  methods: {
    changeTitle () {
      switch (this.$route.path.split('/')[2]) {
        case 'materialEditer':
          this.title = '材料计划及工程预算'
          break
        case 'surveyEditer':
          this.title = '勘察计划'
          break
        case 'budgetEditer':
          this.title = '工程预算'
          break
        case 'settleEditer':
          this.title = '施工验收结算'
          this.resource = 'fileUpload/up?directory=settle&'
          break
      }
    },
    getData () {
      fetchList({
        resource: 'installorder',
        filterBy: this.filterBy.map(item => item.name + '|' + item.type + '|' + item.value).join(';')
      })
      .then((data) => {
        const orderCode = data.data[0].orderCode
        this.orderCode = orderCode
        this.resource = this.resource + 'orderCode=' + orderCode
        this.title = this.title + '【' + orderCode + '】'
        this.getExcelList()
      }).catch((error) => {
        console.log(error)
      })
      console.log(this.fileList)
    },
    getExcelList () {
      fetch({
        method: 'get',
        url: this.resource
      })
      .then(data => {
        this.fileList = data.length ? data.map(item => {
          item.path = getUrl() + item.path
          item.size = renderSize(item.size)
          return item
        }) : []
      })
    },
    deleteExcel (fileName) { // 删除服务器的事件
      fetch({
        method: 'delete',
        url: this.resource + '&fileName=' + encodeURI(fileName)
      })
      .then(data => {
        this.getExcelList()
      })
    },
    uploadSuccess (response, file, fileList) { // 上传成功执行的函数
      this.fileList.map(item => {
        if (item.name === file.name) {
          this.dialogVisible = true
          this.dialogContent = {
            name: 'repetition',
            data: {
              file: file,
              response: response
            },
            content: '上传的文件名有重复,是否覆盖原文件?'
          }
        }
      })
      if (!this.dialogVisible) { // 判断文件是否重复
        // 执行上传
        this.getFileList(response, file)
      }
    },
    beforeValue (file) {
      if (file.name.indexOf('.xls') === -1 && file.name.indexOf('.doc') === -1 && file.name.indexOf('.cad') === -1) {
        this.$message({
          message: '请上传正确的文件格式!',
          type: 'error'
        })
        return false
      }
    },
    updateClick (data) { // 删除事件
      this.dialogVisible = true
      this.dialogVisible = true
      this.dialogContent = {
        data: data,
        name: 'delete',
        content: '确定要删除文件吗?'
      }
    },
    downClick (data) { // 下载事件
      window.location.href = data.path
    },
    dialogEvent (name, data, bol) { // 弹框事件
      if (name === 'repetition') {
        if (bol) {
          const fileIndex = this.fileList.findIndex(index => {
            return index.name === data.file.name
          })
          this.fileList.splice(fileIndex, 1)
          this.getFileList(data.response, data.file)
        } else {
          // this.getFileList(data.response, data.file)
        }
      }
      if (name === 'delete') {
        if (bol) {
          this.deleteExcel(data.name)
        }
      }
      this.dialogVisible = false
    },
    getFileList (response, file) { // 添加excel列表到表格中
      this.fileList.push(...response.data.map((item, index) => {
        return {
          path: getUrl() + item,
          size: renderSize(file.size),
          name: file.name
        }
      }))
    },
    backEvent () { // 返回按钮
      this.$router.go(-1)
    },
    onDialogChange (val) {
      this.dialogVisible = val
    }
  }
}
</script>

<style scoped lang="sass">
.button-list
  display: flex
  flex-direction: row
  margin-bottom: 25px
  div
    margin-right: 10px
.upload-style
  width: 50%
</style>  
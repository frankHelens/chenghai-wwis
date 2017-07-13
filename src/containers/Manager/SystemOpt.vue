<template>
  <div>
    <h5 class="title">添加选项:</h5>
    <div class="search">
      <input style="cursor:pointer" type="text" name="add" placeholder="请输入要添加的选项" class="input" v-model="add" @click="createEvent" readonly />
    </div>
    <table class="box">
      <tr v-for="(data, key) in datas" :class="{active: icon === key}">
        <td>
          <span @click="updateEvent(data)">{{data.optionValue}}</span>
        </td>
        <td>
          <span @click="updateEvent(data)">{{data.label}}</span>
        </td>
        <td>
          <i class="fa fa-times" @click="delData(data.id)"></i>
        </td>
      </tr>
    </table>
    <!-- <ul class="box">
      <li v-for="(data, key) in datas" :class="{active: icon === key}">
        <div>
          <span @click="updateEvent(data)">{{data.label}}</span>
          <i class="fa fa-times" @click="delData(data.id)"></i>
        </div>
      </li>
    </ul> -->
    <button type="submit" class="btn" @click="subData">提交</button>
    <el-dialog :title="createDialogLabel"
      v-if="createDialogShow"
      v-model="createDialogVisible"
      :size="dialogSize"
      >
      <v-form
        :columns="createColumns"
        :formLabelWidth="formLabelWidth"
        :values="createFormValues"
        :buttonList="createDialogButtons"
        @buttonListEvent="createFormEvent">
      </v-form>
    </el-dialog>
    <el-dialog :title="updateDialogLabel"
      v-if="updateDialogShow"
      v-model="updateDialogVisible"
      :size="dialogSize"
      >
      <v-form
        :columns="updateColumns"
        :formLabelWidth="formLabelWidth"
        :values="updateDialogFormValues"
        :buttonList="updateDialogButtons"
        @buttonListEvent="updateFormEvent">
      </v-form>
    </el-dialog>
    <!-- <el-dialog title="添加选项" v-model="dialog" :size="size">
      <el-form :model="form">
      <el-form-item label="编号" :label-width="formLabelWidth">
        <el-input v-model="form.id" auto-complete="off"></el-input>
      </el-form-item>
        <el-form-item label="名称" :label-width="formLabelWidth">
          <el-input v-model="form.name" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialog = false">取 消</el-button>
        <el-button type="primary" @click="createData">确 定</el-button>
      </div>
    </el-dialog> -->
  </div>
</template>

<script>
import { fetchList, fetchCreate, fetchUpdate, fetchDelete } from '../../utils/api'
import { sortBy } from 'lodash'
import VForm from '../../components/VForm'

export default {
  data () {
    return {
      datas: [],
      icon: '',
      add: '',
      dialog: false,
      formLabelWidth: '60px',
      form: {
        name: '',
        id: ''
      },
      dialogSize: 'tiny',
      createDialogVisible: false,
      createDialogLabel: '新增配置',
      createDialogButtons: [{
        name: 'submit',
        label: '提交',
        style: 'primary',
        validate: true,
        isShow: true
      }],
      createFormValues: {
        label: '',
        optionValue: ''
      },
      updateDialogVisible: false,
      updateDialogLabel: '编辑配置',
      updateDialogFormValues: {},
      updateDialogButtons: [{
        name: 'submit',
        label: '提交',
        style: 'primary',
        validate: true,
        isShow: true
      }],
      createList: ['optionValue', 'label'],
      updateList: ['optionValue', 'label'],
      columns: {
        label: {
          label: '标签',
          form: {
            type: 'input'
          }
        },
        optionValue: {
          label: '值',
          form: {
            type: 'input'
          }
        }
      }
    }
  },
  components: {
    VForm
  },
  created () {
    this.fetchData()
  },
  watch: {
    '$route': 'fetchData'
  },
  computed: {
    createDialogShow () {
      return this.createDialogVisible
    }, /* 判断新增弹窗是否打开 */
    updateDialogShow () {
      return this.updateDialogVisible
    }, /* 判断新增弹窗是否打开 */
    createColumns () {
      return this.createList.map(key => Object.assign(this.columns[key], {name: key}))
    }, /* 计算新增表单的字段 */
    updateColumns () {
      return this.updateList.map(key => Object.assign(this.columns[key], {name: key}))
    } /* 计算编辑表单的字段 */
  },
  methods: {
    createEvent () {
      this.createDialogVisible = true
    },
    updateEvent (data) {
      this.updateDialogVisible = true
      this.updateDialogFormValues = {
        id: data.id,
        label: data.label,
        optionValue: data.optionValue
      }
    },
    createFormEvent (name, value) {
      if (name === 'submit') {
        fetchCreate({
          resource: 'dictOption/' + this.$route.params.id,
          data: value
        }).then(data => {
          if (data) {
            this.$message({
              message: '提交成功',
              type: 'success'
            })
          }
          this.fetchData()
          // this.$router.go(0)
        })
      }
      this.createDialogVisible = false
    },
    updateFormEvent (name, data) {
      if (name === 'submit') {
        fetchUpdate({
          resource: 'dictOption/' + this.$route.params.id,
          id: data.id,
          data: {
            label: data.label,
            optionValue: data.optionValue
          }
        }).then(data => {
          if (data) {
            this.$message({
              message: '提交成功',
              type: 'success'
            })
          }
          this.fetchData()
        })
      }
      this.updateDialogVisible = false
    },
    getPoint (key) {
      this.icon = key
    },
    losePoint (id, key) {
      this.icon = ''
      if (this.$refs.input[key].value) {
        this.update(id, this.$refs.input[key].value)
      }
    },
    subData () {
      this.$router.go(0)
    },
    fetchData () {
      fetchList({
        resource: 'dictOption/' + this.$route.params.id
      }).then(result => {
        console.log(this.datas)
        this.datas = sortBy(result, data => data.sort)
        console.log(this.datas)
      })
    },
    createData () {
      if (!this.form.id || !parseInt(this.form.id)) {
        this.$message.error('请正确输入编号')
        return
      } else if (!this.form.name) {
        this.$message.error('请正确输入名称')
        return
      } else {
        fetchCreate({
          resource: 'dictOption/' + this.$route.params.id,
          data: {
            label: this.form.name,
            optionValue: this.form.optionValue
          }
        }).then(data => {
          if (data) {
            this.$message({
              message: '提交成功',
              type: 'success'
            })
          }
        })
      }
      this.createDialogVisible = false
    },
    update (id, val) {
      fetchUpdate({
        resource: 'dictOption',
        id: this.$route.params.id + '/' + id,
        data: {
          label: val
        }
      }).then(data => {
      })
    },
    delData (id) {
      this.$confirm('确定删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        fetchDelete({
          resource: 'dictOption',
          id: this.$route.params.id + '/' + id
        }).then(data => {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.fetchData()
        })
      }).catch(() => {
      })
    }
  }
}
</script>

<style lang="sass" scoped>
.title
  color: #555
  font-size: 18px
.search
  border: 1px solid #d1dbe5
  height: 50px
  width: 440px
  box-sizing: border-box
  padding-left: 20px
  margin-top: 30px
.input
  height: 100%
  display: block
  outline-style: none
  border: 0px
.box
  margin-top: 10px
  width: 440px
  tr
    @extend .search
    margin-top: 0px
    border-bottom: 0px
    border-top: 0px
    padding-right: 20px
    &:nth-last-of-type(1)
      border-bottom: 1px solid #d1dbe5
      span
        border-bottom: 1px solid transparent
    &:nth-of-type(1)
      border-top: 1px solid #d1dbe5
    td
      // display: flex
      // justify-content: center
      // align-items: center
      border-bottom: 1px solid #d1dbe5
      padding: 0 24px
      // height: 100%
      // padding-bottom: 1px
      // box-sizing: border-box
    label
      font-size: 14px
      color: #222
      display: block
      width: 30px
      margin-right: 5px
    span
      flex: 1
    i
      color: #dde4ec
      cursor: pointer
.btn
  display: block
  background: #03a9f4
  color: #fff
  font-size: 16px
  text-align: center
  padding: 15px 0
  margin-top: 20px
  border: 0px
  border-radius: 8px
  width: 440px
  cursor: pointer
.active
  border: 1px solid #03a9f4 !important
  span
    border-bottom: 1px solid transparent !important
</style>
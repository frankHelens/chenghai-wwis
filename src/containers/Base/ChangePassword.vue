<template>
  <div>
    <div class="main">
      <h2 class="title">
        {{title}}
      </h2>
      <br>
      <el-row>
        <el-col :span="8">
          <v-form
            :columns="columns"
            :values="values"
            :buttonList="buttonList"
            @buttonListEvent="buttonSubmit">
          </v-form>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import md5 from 'md5'
import { fetch } from '../../utils/api'
import { logout } from '../../auth'
import VForm from '../../components/VForm'

export default {
  name: 'change-password',
  components: {
    VForm
  },
  data () {
    return {
      title: '修改密码',
      buttonList: [{
        name: 'submit',
        label: '提交',
        style: 'primary',
        validate: true
      }],
      columns: [{
        name: 'oldpassword',
        label: '旧密码',
        form: {
          type: 'password',
          rules: [
            { required: true, message: '请输入密码', trigger: 'blur' }
          ]
        }
      }, {
        name: 'newpassword',
        label: '新密码',
        form: {
          type: 'password',
          rules: [
            { required: true, message: '请输入密码', trigger: 'blur' }
          ]
        }
      }],
      values: {
        oldpassword: '',
        newpassword: ''
      }
    }
  },
  methods: {
    buttonSubmit (name, values) {
      if (name === 'submit') {
        fetch({
          method: 'put',
          url: 'user/changepassword',
          data: {
            oldpassword: md5(values.oldpassword),
            newpassword: md5(values.newpassword)
          }
        }).then(data => {
          if (data) {
            logout(() => {
              this.$message({
                message: '修改密码成功，请重新登录！',
                showClose: true,
                type: 'success'
              })
              this.$router.replace('/login')
            })
          }
        })
      }
    }
  }
}
</script>
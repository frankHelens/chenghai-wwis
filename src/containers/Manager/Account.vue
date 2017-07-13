<template>
  <div>
    <div class="main">
      <h2 class="title">
        {{title}}
      </h2>
      <datatable class="datatable"
        :label="label"
        :labelName="labelName"
        :resource="resource"
        :toolbar="toolbar"
        :operation="operation"
        :customOperation="customOperation"
        :relation="relation"
        :columnsObject="columns"
        :tableInitList="tableInitList"
        :tableFullList="tableFullList"
        :createList="createList"
        :updateList="updateList"
        :createFormValues="createFormValues"
        @customOperationEvent="customOperationEvent"
      >
      </datatable>
      <el-dialog :title="resetLabel"
        v-model="resetVisible"
        :size="'tiny'"
        >
        <v-form
          :columns="resetColumns"
          :values="resetFormValues"
          :buttonList="resetButtonList"
          @buttonListEvent="resetButtonEvent">
        </v-form>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import md5 from 'md5'
import { fetch } from '../../utils/api'
import Datatable from '../../components/Datatable'
import VForm from '../../components/VForm'

export default {
  name: 'account',
  components: {
    Datatable,
    VForm
  },
  data () {
    return {
      resource: 'user',
      title: '账号管理',
      label: '账号',
      labelName: 'realname',
      toolbar: {
        create: true
      },
      operation: {
        update: true,
        delete: true
      },
      customOperation: [{
        name: 'reset',
        label: '重置密码',
        icon: 'lock'
      }],
      resetButtonList: [{
        name: 'submit',
        label: '提交',
        style: 'primary',
        validate: true
      }],
      tableInitList: ['loginname', 'realname', 'roleids', 'deptid', 'userstate', 'sex'],
      tableFullList: ['loginname', 'realname', 'roleids', 'deptid', 'userstate', 'title', 'email', 'qq', 'phone', 'mobile', 'address', 'nickname', 'sex'],
      createList: ['loginname', 'loginpassword', 'realname', 'roleids', 'deptid', 'title', 'email', 'phone', 'mobile', 'qq', 'nickname', 'sex', 'userstate', 'address'],
      updateList: ['loginname', 'realname', 'roleids', 'deptid', 'title', 'email', 'phone', 'mobile', 'qq', 'nickname', 'sex', 'userstate', 'address'],
      createFormValues: {
        loginname: '',
        loginpassword: '',
        realname: '',
        deptid: '',
        roleids: [],
        title: '',
        email: '',
        phone: '',
        mobile: '',
        qq: '',
        nickname: '',
        userstate: 1,
        sex: '',
        address: ''
      },
      relation: true,
      columns: {
        loginname: {
          label: '账号',
          sort: true,
          filter: {
            type: 'input',
            like: true
          },
          form: {
            type: 'input',
            rules: [
              { required: true, message: '请输入账号', trigger: 'blur' },
              { max: 10, message: '长度不能大于10', trigger: 'blur' }
            ]
          }
        },
        loginpassword: {
          label: '密码',
          form: {
            type: 'password',
            rules: [
              { required: true, message: '请输入密码', trigger: 'blur' }
            ]
          }
        },
        realname: {
          label: '姓名',
          sort: true,
          filter: {
            type: 'input',
            like: true
          },
          form: {
            type: 'input',
            rules: [
              { required: true, message: '请输入姓名', trigger: 'blur' },
              { max: 10, message: '长度不能大于10', trigger: 'blur' }
            ]
          }
        },
        deptid: {
          label: '所属部门',
          sort: true,
          type: 'select',
          live: true,
          filter: {
            type: 'select'
          },
          form: {
            type: 'select',
            live: true
          }
        },
        roleids: {
          label: '角色',
          type: 'multiselect',
          form: {
            type: 'multiselect',
            live: true,
            rules: [
              { type: 'array', required: true, message: '请选择角色', trigger: 'blur' }
            ]
          }
        },
        userstate: {
          label: '启用状态',
          sort: true,
          type: 'select',
          filter: {
            type: 'select'
          },
          form: {
            type: 'switch'
          }
        },
        title: {
          label: '头衔',
          form: {
            type: 'input'
          }
        },
        email: {
          label: '电子邮箱',
          form: {
            type: 'input'
          }
        },
        phone: {
          label: '电话',
          filter: {
            type: 'input',
            like: true
          },
          form: {
            type: 'input'
          }
        },
        mobile: {
          label: '手机',
          filter: {
            type: 'input',
            like: true
          },
          form: {
            type: 'input'
          }
        },
        address: {
          label: '地址',
          filter: {
            type: 'input',
            like: true
          },
          form: {
            type: 'input',
            large: true,
            rules: [
              { max: 25, message: '长度不能大于25', trigger: 'blur' }
            ]
          }
        },
        qq: {
          label: 'QQ',
          form: {
            type: 'input'
          }
        },
        nickname: {
          label: '昵称',
          form: {
            type: 'input'
          }
        },
        sex: {
          label: '性别',
          type: 'select',
          form: {
            type: 'select'
          }
        }
      },
      resetColumns: [{
        name: 'newpassword',
        label: '新密码',
        form: {
          type: 'password',
          rules: [
            { required: true, message: '请输入密码', trigger: 'blur' }
          ]
        }
      }],
      resetLabel: '重置密码',
      resetVisible: false,
      resetValues: [{
        name: 'newpassword',
        label: '新密码',
        form: {
          type: 'password',
          rules: [
            { required: true, message: '请输入密码', trigger: 'blur' }
          ]
        }
      }],
      resetFormId: '',
      resetFormValues: {
        newpassword: ''
      }
    }
  },
  methods: {
    customOperationEvent (name, data) {
      if (name === 'reset') {
        this.resetVisible = true
        this.resetFormValues.newpassword = ''
        this.resetFormId = data.id
      }
    },
    resetButtonEvent (name, values) {
      if (name === 'submit') {
        fetch({
          method: 'put',
          url: 'user/resetpassword/' + this.resetFormId,
          data: {
            newpassword: md5(values.newpassword)
          }
        }).then(data => {
          if (data) {
            this.$message({
              message: '修改密码成功！',
              showClose: true,
              type: 'success'
            })
          }
          this.resetVisible = false
        })
      }
    }
  }
}
</script>
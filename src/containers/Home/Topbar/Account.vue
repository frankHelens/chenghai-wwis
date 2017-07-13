<template>
  <ul class="top-menu-account">
    <li>
      <router-link to="/base/changePassword">
        <i class="fa fa-lock"></i>修改密码
      </router-link>
    </li>
    <li>
      <a href="javascript:;" @click="logout">
        <i class="fa fa-sign-out"></i>退出
      </a>
    </li>
  </ul>
</template>

<script>
import { logout } from '../../../auth'

export default {
  name: 'Account',
  data () {
    return {
    }
  },
  methods: {
    logout () {
      logout(() => {
        this.$message({
          message: '退出成功',
          showClose: true,
          type: 'success'
        })
        this.$router.replace('/login')
      })
    }
  }
}
</script>

<style scoped lang="sass">
.top-menu-account
  list-style: none
  padding: 0
  >li
    >a
      padding: 8px 16px
      color: #999999
      text-decoration: none
      display: block
      clear: both
      font-weight: 300
      line-height: 18px
      white-space: nowrap
      &:hover
        text-decoration: none
        color: #262626
        background-color: #e1e5ec
      >i
        display: inline-block
        width: 24px
        text-align: center
</style>

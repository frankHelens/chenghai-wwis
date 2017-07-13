import Ownership from '../../containers/Install/Ownership'

import Apply from '../../containers/Install/Ownership/Apply'
import Audit from '../../containers/Install/Ownership/Audit'
import Pigeonhole from '../../containers/Install/Ownership/Pigeonhole'

const ownershipRoutes = {
  path: 'ownership',
  component: Ownership,
  children: [
    { path: 'apply', component: Apply },
    { path: 'audit', component: Audit },
    { path: 'pigeonhole', component: Pigeonhole }
    // { path: 'apply',
    //   beforeEnter (to, from, next) {
    //     const menu = getMenus().find(item => item.menuurl === '/install/apply')
    //     fetchCreate({
    //       resource: 'flow/start?flowDefineId=' + menu.flowid
    //     })
    //     .then(data => {
    //       if (String(data) === 'undefined') {
    //         this.$message({
    //           showClose: true,
    //           message: '没有权限,无法操作',
    //           type: 'error'
    //         })
    //         return false
    //       } else {
    //         next('/base/task/' + data)
    //       }
    //     })
    //   }
    // },
  ]
}

export default ownershipRoutes

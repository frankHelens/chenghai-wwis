
import Base from '../containers/Base'

import TaskList from '../containers/Base/TaskList'
import TaskDetail from '../containers/Base/TaskDetail'
import ChangePassword from '../containers/Base/ChangePassword'
import CheckDetail from '../containers/Base/CheckDetail'

const baseRoutes = {
  path: 'base',
  component: Base,
  children: [
    { path: 'task', component: TaskList },
    {
      path: 'task/:id',
      component: TaskDetail,
      meta: { keepAlive: false }
    },
    { path: 'changePassword', component: ChangePassword },
    {
      path: 'checkTask/:id',
      component: CheckDetail,
      meta: { keepAlive: false }
    }
  ]
}

export default baseRoutes

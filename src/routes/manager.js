import Manager from '../containers/Manager'

import Account from '../containers/Manager/Account'
import Role from '../containers/Manager/Role'
import Department from '../containers/Manager/Department'
import Depttype from '../containers/Manager/Depttype'
import Deptlevel from '../containers/Manager/Deptlevel'
import Config from '../containers/Manager/Config'
import Menu from '../containers/Manager/Menu'
import Log from '../containers/Manager/Log'
import System from '../containers/Manager/System'
import SystemOpt from '../containers/Manager/SystemOpt'

const managerRoutes = {
  path: 'manager',
  component: Manager,
  children: [
    { path: 'account', component: Account },
    { path: 'role', component: Role },
    { path: 'department', component: Department },
    { path: 'depttype', component: Depttype },
    { path: 'deptlevel', component: Deptlevel },
    { path: 'config', component: Config },
    { path: 'menu', component: Menu },
    { path: 'log', component: Log },
    {
      path: 'system',
      component: System,
      children: [
        { path: ':id', component: SystemOpt }
      ]
    }
  ]
}

export default managerRoutes

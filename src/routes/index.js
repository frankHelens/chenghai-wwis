
import VueRouter from 'vue-router'

import { loggedIn, logout, getMenus } from '../auth'
import Home from '../containers/Home'
import Login from '../containers/Login'
import NotFound from '../containers/Common/NotFound'

import managerRoutes from './manager'
import datacenterRoutes from './datacenter'
import installRoutes from './install'
import storageRoutes from './storage'
import baseRoutes from './base'
import workRoutes from './work'
import printRoutes from './print'
import excelRoutes from './excel'

function requireAuth (to, from, next) {
  if (!loggedIn()) {
    next({
      path: '/login',
      query: { redirect: to.fullPath }
    })
  } else {
    const Menus = getMenus()
    console.log(Menus[0].menuurl)
    next()
  }
}
const routes = [
  { path: '/',
    component: Home,
    children: [
      managerRoutes,
      datacenterRoutes,
      installRoutes,
      storageRoutes,
      baseRoutes,
      workRoutes,
      printRoutes,
      excelRoutes
    ],
    redirect: '/base/task',
    beforeEnter: requireAuth
  },
  { path: '/home', alias: '/' },
  { path: '/login', component: Login },
  { path: '/logout',
    beforeEnter (to, from, next) {
      logout()
      next('/login')
    }
  },
  { path: '*', component: NotFound }
]

const router = new VueRouter({
  mode: 'hash',
  base: __dirname,
  routes: routes
})

export default router

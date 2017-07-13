/* globals localStorage */

import { fetch } from './utils/api'
import md5 from 'md5'

const menuRender = function (menuList, roleList) {
  const parentList = menuList.filter(menu => roleList.indexOf(menu.id) !== -1).map(menu => menu.menuparentid)
  const resultList = [...new Set([...parentList, ...roleList])].filter(item => item)
  if (resultList.length === roleList.length) {
    return menuList.filter(menu => resultList.indexOf(menu.id) !== -1).sort((m, n) => m.menuorder - n.menuorder)
  } else {
    return menuRender(menuList, resultList)
  }
}

export function login (username, password, callback) {
  fetch({
    method: 'put',
    url: 'login',
    data: {
      loginpassword: md5(password),
      loginname: username
    }
  }).then(function (data) {
    if (data) {
      localStorage.token = data.token
      localStorage.realname = data.realname
      localStorage.menus = JSON.stringify(menuRender(data.menuList, data.roleList))
      localStorage.userId = data.userid
      callback()
    }
  })
}
export function setCurrentPage (page) {
  localStorage.currentPage = page
}
export function getCurrentPage (page) {
  return localStorage.currentPage
}
export function getToken () {
  return localStorage.token
}
export function getMenus () {
  return JSON.parse(localStorage.menus)
}
export function getRealname () {
  return localStorage.realname
}
export function getUserId () {
  return localStorage.userId
}
export function logout (callback) {
  delete localStorage.userId
  delete localStorage.token
  delete localStorage.menus
  delete localStorage.realname
  if (callback) callback()
}
export function loggedIn () {
  return !!localStorage.token
}


// this is aliased in webpack config based on server/client build

/* globals localStorage */

import axios from 'axios'
import moment from 'moment'
import md5 from 'md5'
import { Message } from 'element-ui'
import { getApi } from './common'
import router from '../routes'

axios.defaults.baseURL = getApi()
axios.defaults.headers.common['Gddx-Access-AppId'] = 'web'
axios.defaults.headers.post['Content-Type'] = 'application/json'
axios.defaults.headers.delete['Content-Type'] = 'application/json'

function signFormat (props) {
  return md5(Object.keys(props).map(el => (el + '=' + props[el]).toLowerCase()).sort().join('&') + localStorage.token)
}

export function fetch (props) {
  let sign = {
    'Gddx-Access-Token': localStorage.token,
    'Gddx-Access-Version': '0.1.0'
  }
  const timeStamp = moment().format('x')
  return axios({
    ...props,
    headers: {
      ...props.headers,
      'Gddx-Access-Sign': signFormat({
        ...sign,
        ...props.params,
        ...props.data,
        'Gddx-Access-TimeStamp': timeStamp
      }),
      'Gddx-Access-TimeStamp': timeStamp,
      'Gddx-Access-Token': sign['Gddx-Access-Token'],
      'Gddx-Access-Version': sign['Gddx-Access-Version']
    },
    params: {
      ...props.params,
      timeStamp: timeStamp
    }
  }).then(function (response) {
    if (response.data.code === 0) {
      return response.data.data
    } else if (response.data.code === 1) {
      router.push('/login')
      throw Object({
        response: {
          status: '',
          statusText: '访问超时，请重新登录！'
        }
      })
    } else {
      throw Object({
        response: {
          status: response.data.code,
          statusText: response.data.message
        }
      })
    }
  }).catch((error) => {
    Message({
      type: 'error',
      showClose: true,
      message: error.response.status + ':' + error.response.statusText
    })
  })
}

export function fetchList (props) {
  return fetch({
    method: 'get',
    url: props.resource,
    params: {
      orderBy: props.orderBy,
      filterBy: props.filterBy,
      pageSize: props.pageSize,
      pageIndex: props.pageIndex
    }
  })
}

export function fetchItem (props) {
  return fetch('get', props.resource + '/' + props.id, null, props.callback, props.errorCallback)
}

export function fetchCreate (props) {
  return fetch({
    method: 'post',
    url: props.resource,
    data: props.data
  })
}

export function fetchUpdate (props) {
  return fetch({
    method: 'put',
    url: props.resource + '/' + props.id,
    data: props.data
  })
}

export function fetchDelete (props) {
  return fetch({
    method: 'delete',
    url: props.resource + '/' + props.id,
    data: {}
  })
}

export function fetchTest (test) {
  return console.log(test)
}

export function fetchImg (props) {
  return axios({
    url: props.url
  }).then(function (response) {
    return response
  }).catch((err) => {
    return err
  })
}

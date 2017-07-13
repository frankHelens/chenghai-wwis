import { isArray, cloneDeep } from 'lodash'

const URL = process.env.URL
const API = process.env.API
export const TITLE = process.env.TITLE

// export const config = process.env.config

export function getUrl () {
  return URL
}

export function getApi () {
  return URL + API
}

export function treeFormat (list, key = 'id', parentKey = 'pid', childKey = 'children') {
  let sNodes = cloneDeep(list)
  let i, j, k, l, len, len1, r, tmpMap
  if (isArray(sNodes)) {
    r = []
    tmpMap = []
    for (k = 0, len = sNodes.length; k < len; k++) {
      i = sNodes[k]
      i.text = i.label
      tmpMap[i[key]] = i
    }
    for (l = 0, len1 = sNodes.length; l < len1; l++) {
      j = sNodes[l]
      if (tmpMap[j[parentKey]] && j[key] !== j[parentKey]) {
        if (!tmpMap[j[parentKey]][childKey]) {
          tmpMap[j[parentKey]][childKey] = []
        }
        tmpMap[j[parentKey]][childKey].push(j)
      } else {
        r.push(j)
      }
    }
    return r
  } else {
    return [sNodes]
  }
}

export function rmb (num) {
  const numArray = num.split('.')
  const numList = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖']
  const radiceList = ['', '拾', '佰', '仟']
  const unitList = ['', '万', '亿', '兆']
  const decList = ['角', '分']
  const num1 = numArray[0].split('').reverse().map((num, index) => {
    const unit = unitList[index / 4] || ''
    return numList[Number(num)] + radiceList[index % 4] + unit
  }).reverse()
  const num2 = numArray[1] === '00' ? ['整'] : numArray[1].split('').map((num, index) => numList[Number(num)] + decList[index])
  return [
    ...num1,
    '元',
    ...num2
  ].join('')
}

export function renderSize (value) {
  if (value) {
    let unitArr = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    let index = 0
    let srcsize = parseFloat(value)
    let quotient = srcsize
    while (quotient > 1024) {
      index += 1
      quotient = quotient / 1024
    }
    return quotient.toFixed(2) + ' ' + unitArr[index]
  } else {
    return '0B'
  }
}

import jsonp from '../jsonp/index'
import {commonParams, option} from '../config'
export function getranklist () {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg'
  const data = Object.assign(commonParams, {
    platform: 'h5',
    needNewCode: 1,
    _: 1506820428600,
    uin: 0
  })
  return jsonp(url, data, option)
}
export function getToplist (topid) {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg'
  const data = Object.assign(commonParams, {
    uin: 0,
    platform: 'h5',
    needNewCode: 1,
    tpl: 3,
    page: 'detail',
    type: 'top',
    topid,
    _: 1508719384795
  })
  return jsonp(url, data, option)
}

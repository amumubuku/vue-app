import jsonp from './jsonp'
import {commonParams, option} from './config'
export function search (key) {
  const url = 'https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp'
  const data = Object.assign(commonParams, {
    uin: 0,
    platform: 'h5',
    needNewCode: 1,
    w: key,
    zhidaqu: 1,
    catZhida: 1,
    t: 0,
    flag: 1,
    ie: 'utf-8',
    sem: 1,
    aggr: 0,
    perpage: 20,
    n: 20,
    p: 1,
    remoteplace: 'txt.mqq.all',
    _: 1509163406254
  })
  return jsonp(url, data, option)
}
export function gethotkey () {
  const url = 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg'
  const data = Object.assign(commonParams, {
    uin: 0,
    needNewCode: 1,
    platform: 'h5'
  })
  return jsonp(url, data, option)
}


import jsonp from '../jsonp/'
import {commonParams, option} from '../config.js'
export function getSingerlist () {
  const url = 'https://c.y.qq.com/v8/fcg-bin/v8.fcg'
  const data = Object.assign({}, commonParams, {
    channel: 'singer',
    page: 'list',
    key: 'all_all_all',
    pagesize: 100,
    pagenum: 1,
    loginUin: 0,
    hostUin: 0,
    platform: 'yqq',
    needNewCode: 0
  })

  return jsonp(url, data, option)
}
export function getSingers (mid) {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg'
  const data = Object.assign(commonParams, {
    loginUin: 0,
    hostUin: 0,
    platform: 'yqq',
    needNewCode: 0,
    singermid: mid,
    order: 'listen',
    begin: 0,
    num: 50,
    songstatus: 1
  })
  return jsonp(url, data, option)
}
export function infoMusic (songmid) {
  const url = 'https://c.y.qq.com/base/fcgi-bin/fcg_music_express_mobile3.fcg'
  let op = {
    param: 'callback'
  }
  const data = Object.assign(commonParams, {
    loginUin: 775574656,
    hostUin: 0,
    platform: 'yqq',
    needNewCode: 0,
    cid: 205361747,
    uin: 775574656,
    songmid,
    filename: `C400${songmid}.m4a`,
    guid: 3429347272
  })
  return jsonp(url, data, op)
}


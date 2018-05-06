import {Base64} from 'js-base64'
import {getLyric} from '../api/Lyric'
export default class Song {
  constructor ({ id, mid, singer, name, alum, duration, image, url }) {
    this.id = id
    this.mid = mid
    this.singer = singer
    this.name = name
    this.alum = alum
    this.duration = duration
    this.image = `https://y.gtimg.cn/music/photo_new/T002R300x300M000${alum}.jpg?max_age=2592000`
  }
  getLyric () {
    if (this.lyric) {
      return Promise.resolve(this.lyric)
    }
    return new Promise((resolve, reject) => {
      getLyric(this.id).then(res => {
        if (res.retcode === 0) {
          this.lyric = Base64.decode(res.lyric)
          resolve(this.lyric)
        } else {
          reject('no lyric')
        }
      })
    })
  }
}
function filetsinger (singer) {
  let ret = []
  if (!singer) {
    return ''
  } else {
    singer.forEach((item, index) => {
      ret.push(item.name)
    })
  }
  return ret.join('/')
}
export function createsong (musicdata) {
  return new Song({
    id: musicdata.songid,
    mid: musicdata.songmid,
    singer: filetsinger(musicdata.singer),
    name: musicdata.songname,
    alum: musicdata.albummid,
    duration: musicdata.interval
  })
}

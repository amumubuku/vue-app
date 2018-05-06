import {createsong} from '../../base/song'
export function dobounce (fuc, delay) {
  let timer
  return function (...args) {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      fuc.apply(this, args)
    }, delay)
  }
}
export function normalSongs (data) {
  var res = []
  data.forEach((song, index) => {
    if (song.albummid && song.songid) {
      res.push(createsong(song))
    }
  })
  return res
}
export function Shuffle (arr) {
  let songs = arr.slice()
  songs.sort(() => {
    return 0.5 - Math.random()
  })
  return songs
}
export function getRandom (min, max) {
  return Math.floor(Math.random() * max + min)
}

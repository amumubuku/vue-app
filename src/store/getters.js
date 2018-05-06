import {normalSongs} from '../common/js/util'
export const singer = state => state.singer
export const playlist = state => state.playlist
export const currentIndex = state => state.currentIndex
export const currentSong = state => {
  return state.playlist[state.currentIndex] || {}
}
export const fullScreen = state => state.fullScreen
export const playing = state => state.playing
export const iscloselist = state => state.closelist
export const disc = state => state.disc
export const toplist = state => state.toplist
export const loadsearch = state => state.searchHitory
export const loadplaylist = state => normalSongs(state.playHitory)
export const player = state => state.player
export const playMode = state => state.playMode

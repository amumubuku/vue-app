import * as types from './mutation-types'

const mutations = {
  [types.SET_SINGER] (state, singer) {
    state.singer = singer
  },
  [types.SET_PLAYER] (state, flag) {
    state.player = flag
  },
  [types.SET_PLAYLIST] (state, list) {
    state.playlist = list
  },
  [types.ADD_PLAYLIST] (state, song) {
    state.playlist.unshift(song)
  },
  [types.SET_CURRENT_INDEX] (state, index) {
    state.currentIndex = index
  },
  [types.SET_FULLSCREEN] (state, flag) {
    state.fullScreen = flag
  },
  [types.SET_PLAYING] (state, flag) {
    state.playing = flag
  },
  [types.SET_ISCLOSELIST] (state, flag) {
    state.closelist = flag
  },
  [types.SET_DISC] (state, disc) {
    state.disc = disc
  },
  [types.SET_TOPLIST] (state, list) {
    state.toplist = list
  },
  [types.SET_SEARCH_HITORY] (state, hitory) {
    state.searchHitory = hitory
  },
  [types.SET_PLAYLIST_HITORY] (state, hitory) {
    state.playHitory = hitory
  },
  [types.SET_PLAYMODE] (state, Mode) {
    state.playMode = Mode
  },
  [types.DELETE_ARRER] (state, index) {
    if (index === 'empty') {
      state.playlist.splice(0, state.playlist.length)
      state.playing = false
      return
    }
    if (index < state.currentIndex) {
      state.currentIndex = state.currentIndex - 1
    }
    state.playlist.splice(index, 1)
  }
}
export default mutations

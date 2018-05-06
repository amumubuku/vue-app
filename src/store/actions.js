import * as types from './mutation-types'
import {saveSearch, deleteSearch, clearSearch, savePlaylist} from '../common/js/cache'
export const selectPlay = ({ commit, state }, {list, index}) => {
  commit(types.SET_PLAYLIST, list)
  commit(types.SET_CURRENT_INDEX, index)
  commit(types.SET_FULLSCREEN, true)
  commit(types.SET_PLAYING, true)
  commit(types.SET_PLAYER, true)
}
export const addPlay = ({commit, state}, song) => {
  commit(types.ADD_PLAYLIST, song)
  commit(types.SET_CURRENT_INDEX, 0)
  if (!state.playing) {
    commit(types.SET_FULLSCREEN, true)
    commit(types.SET_PLAYING, true)
    commit(types.SET_PLAYER, true)
  }
}
export const saveSearchHitory = ({commit}, query) => {
  commit(types.SET_SEARCH_HITORY, saveSearch(query))
}
export const deleteSearchHitory = ({commit}, query) => {
  commit(types.SET_SEARCH_HITORY, deleteSearch(query))
}
export const clearSearchHitory = ({commit}) => {
  commit(types.SET_SEARCH_HITORY, clearSearch())
}
export const savePlayHitory = ({commit}, song) => {
  commit(types.SET_PLAYLIST_HITORY, savePlaylist(song))
}

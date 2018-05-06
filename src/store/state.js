import {loadSearch, loadPlaylist} from '../common/js/cache'

const state = {
  player: false,
  playMode: 0,
  singer: {},
  playlist: [],
  currentIndex: -1,
  playing: '',
  fullScreen: false,
  closelist: false,
  disc: {},
  toplist: {},
  searchHitory: loadSearch(),
  playHitory: loadPlaylist()
}
export default state

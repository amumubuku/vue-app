import jsonp from './jsonp'
export function getLyric (mid) {
  const url = `https://api.darlin.me/music/lyric/${mid}/`
  return jsonp(url, {}, 'callback')
}

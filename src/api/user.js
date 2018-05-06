import axios from 'axios'
export function getlikesongs () {
  const url = 'http://74520.club/songs.js'
  return axios.get(url
  ).then(res => {
    return Promise.resolve(res.data)
  })
}

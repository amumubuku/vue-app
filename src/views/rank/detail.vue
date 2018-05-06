<template>
  <transition name="slide">
     <music-list :songs="songs" :title="toplist.topTitle" :bgurl="bgurl" :ifrank="true"></music-list>
  </transition>
</template>
<script>
  import MusicList from '../../components/music-list.vue'
  import {getToplist} from '../../api/rank/rank'
  import {mapGetters} from 'vuex'
  import {createsong} from '../../base/song'
  export default {
    data () {
      return {
        songs: []
      }
    },
    computed: {
      ...mapGetters([
        'toplist'
      ]),
      bgurl () {
        if (this.songs.length) {
          return this.songs[0].image
        }
        return ''
      }
    },
    created () {
      this._getToplist()
    },
    methods: {
      _getToplist () {
        if (!this.toplist.id) {
          this.$router.back()
          return
        }
        getToplist(this.toplist.id).then(res => {
          this.songs = this.normaltoplist(res.songlist)
        })
      },
      normaltoplist (data) {
        var res = []
        data.forEach((item, index) => {
          var musicdata = item.data
          if (musicdata.albumid && musicdata.songid) {
            res.push(createsong(musicdata))
          }
        })
        return res
      }
    },
    components: {MusicList}
  }
</script>
<style>
</style>

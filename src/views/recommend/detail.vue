<template>
  <transition name="slide">
    <music-list :songs='songlist' :title="disc.dissname" :bgurl="disc.imgurl"></music-list>
  </transition>
</template>
<script>
  import {mapGetters} from 'vuex'
  import MusicList from '../../components/music-list.vue'
  import {createsong} from '../../base/song'
  import {getSongList} from '../../api/recommend/recommend'
  export default {
    data () {
      return {
        songlist: []
      }
    },
    computed: {
      ...mapGetters([
        'disc'
      ])
    },
    created () {
      this._getSonglist()
    },
    methods: {
      _getSonglist () {
        if (!this.disc.dissid) {
          this.$router.back()
          return
        }
        getSongList(this.disc.dissid).then(res => {
          this.songlist = this._normalizeSong(res.cdlist[0].songlist)
        })
      },
      _normalizeSong (data) {
        var res = []
        data.forEach((val, index) => {
          var musicdata = val
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

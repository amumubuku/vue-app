<template>
  <transition name="slide">
    <music-list :songs='musiclist' :title="singer.name" :bgurl="singer.picUrl"></music-list>
  </transition>
</template>
<script>
  import {mapGetters} from 'vuex'
  import {getSingers} from '../../api/singer/singer'
  import MusicList from '../../components/music-list.vue'
  import {createsong} from '../../base/song'
  export default {
    data () {
      return {
        musiclist: []
      }
    },
    computed: {
      ...mapGetters([
        'singer'
      ])
    },
    created () {
      this._getsinger()
    },
    methods: {
      _getsinger () {
        if (!this.singer.id) {
          this.$router.push('/search')
          return
        }
        getSingers(this.singer.id).then(res => {
          this.musiclist = this._normalizesongs(res.data.list)
        })
      },
      _normalizesongs (list) {
        let ret = []
        list.forEach((item, index) => {
          const musicdata = item.musicData
          if (musicdata.songid && musicdata.albummid) {
            ret.push(createsong(musicdata))
          }
        })
        return ret
      }
    },
    components: {MusicList}
  }
</script>
<style>
  .slide-enter-active,.slide-leave-active {
    transition: all 0.3s
  }
  .slide-enter,.slide-leave-to {
    transform: translate3d(100%, 0, 0)
  }
</style>

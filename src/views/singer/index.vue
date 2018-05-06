<template>
    <div class="singer" ref="singer">
      <singer-list :hot="hot" :songs="singerlist" @select="select" ref="scroll"></singer-list>
      <router-view></router-view>
    </div>
</template>
<script>
  import {getSingerlist} from '../../api/singer/singer'
  import SingerList from '../../base/singerlist.vue'
  import Singer from '../../base/singer'
  import { mapMutations } from 'vuex'
  import {playListMixin} from '../../common/js/mixin'
  const hotindex = 12
  export default {
    mixins: [playListMixin],
    created () {
      this._getsingerlist()
    },
    data () {
      return {
        singerlist: [],
        hot: []
      }
    },
    methods: {
      handlePlayList (playlist) {
        const bottom = playlist.length > 0 ? '50px' : ''
        this.$refs.singer.style.bottom = bottom
        this.$refs.scroll.refresh()
      },
      _getsingerlist () {
        getSingerlist().then(res => {
          this.singerlist = this.normalizesinger(res.data.list)
          this.hot = this.sliceSinger(res.data.list)
        })
      },
      ...mapMutations({
        setSinger: 'SET_SINGER'
      }),
      normalizesinger: function (data) {
        let singer = {}
        let ret = []
        data.forEach((item, index) => {
          const key = item.Findex
          if (!singer[key]) {
            singer[key] = {
              key: key,
              item: []
            }
          }
          singer[key].item.push(new Singer({
            id: item.Fsinger_mid,
            name: item.Fsinger_name
          }))
        })
        for (let k in singer) {
          const val = singer[k]
          if (val.key.match(/[a-zA-Z]/)) {
            ret.push(val)
          }
        }
        ret.sort((a, b) => {
          return a.key.charCodeAt(0) - b.key.charCodeAt(0)
        })
        return ret
      },
      sliceSinger (data) {
        let singer = data.slice(0, hotindex)
        let hot = []
        singer.forEach((item, index) => {
          hot.push(new Singer({
            id: item.Fsinger_mid,
            name: item.Fsinger_name
          }))
        })
        return hot
      },
      select (singer) {
        this.$router.push({
          path: `/singer/${singer.id}`
        })
        this.setSinger(singer)
      }
    },
    components: {SingerList}
  }
</script>
<style scoped lang="stylus">
  .singer
    position fixed
    top 40px
    bottom 0
    left 0
    right 0
    z-index 2
</style>

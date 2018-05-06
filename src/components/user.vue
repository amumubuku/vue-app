<template>
  <transition name="slide">
    <div class="user-content" ref="user">
      <div class="user-header">
        <div class="back" @click="back">
          <i class="icon-arrows-2"></i>
        </div>
        <div class="switch-like" :class="{'active' : currentShow === 'like'}" @click="changeSwitch('like')">我喜欢的</div>
        <div class="switch-playlist" :class="{'active' : currentShow === 'playlist'}" @click="changeSwitch('playlist')">最近播放</div>
      </div>
      <div class="user-conter" v-show="currentShow === 'like'">
        <div class="user-random" @click.stop="random">随便播放全部
          <i class="icon-play-button"></i>
        </div>
        <scroll class="scroll" :data="songs" ref="scroll" >
          <ul>
            <li class="song-item" v-for="(song, index) in songs" @click="selectsong(song)">
              <div class="song-conter">
                <i class="play-index">{{index + 1}}</i>
                <h3>{{song.name}}</h3>
                <span>{{song.singer}}</span>
              </div>
            </li>
          </ul>
        </scroll>
      </div>
      <div class="user-conter" v-show="currentShow === 'playlist'">
        <scroll class="scroll" :data="loadplaylist" ref="playlist">
          <ul class="play-wrapper">
            <li class="song-item" v-for="(song, index) in loadplaylist" @click="selectsong(song)">
              <div class="song-conter">
                <h3>{{song.name}}</h3>
                <span>{{song.singer}}</span>
              </div>
            </li>
          </ul>
        </scroll>
      </div>
      <div class="loader" v-show="!songs.length > 0"></div>
    </div>
  </transition>
</template>
<script>
    import {normalSongs, getRandom} from '../common/js/util'
    import {getlikesongs} from '../api/user'
    import Scroll from '../base/scroll.vue'
    import {mapActions, mapGetters, mapMutations} from 'vuex'
    import {playListMixin} from '../common/js/mixin'
    export default {
      mixins: [playListMixin],
      data () {
        return {
          currentShow: 'like',
          songs: []
        }
      },
      created () {
        this._getlikelist()
      },
      computed: {
        ...mapGetters([
          'loadplaylist'
        ])
      },
      watch: {
        loadplaylist () {
          this.$refs.playlist.refresh()
        }
      },
      methods: {
        random () {
          this.changeMode(1)
          this.selectPlay({
            list: this.songs.slice(),
            index: getRandom(0, this.songs.length)
          })
        },
        handlePlayList (playlist) {
          const bottom = playlist.length > 0 ? '50px' : ''
          this.$refs.user.style.bottom = bottom
          this.$refs.scroll.refresh()
        },
        ...mapActions([
          'selectPlay',
          'addPlay'
        ]),
        ...mapMutations({
          changeMode: 'SET_PLAYMODE'
        }),
        selectsong (song) {
          this.addPlay(song)
        },
        _getlikelist () {
          getlikesongs().then(res => {
            this.songs = normalSongs(res)
          })
        },
        changeSwitch (str) {
          this.currentShow = str
        },
        back () {
          this.$router.back()
        }
      },
      components: {Scroll}
    }
</script>
<style lang="stylus" scoped>
  .play-wrapper
     padding 10px 0 0 30px
     .song-item
      margin-bottom 10px
  .user-content
    position fixed
    z-index 31
    top 0
    left 0
    bottom 0
    right 0
    background #222
    .user-conter
      position absolute
      width 100%
      bottom 0
      top 52px
      overflow hidden
      .user-random
        width: 150px;
        height: 32px;
        border: 1px solid #ffcd32;
        border-radius: 28px;
        color: #ffcd32;
        line-height: 32px;
        text-align: center;
        font-size: 14px;
        margin: 0 auto;
        margin-top 14px
        margin-bottom 4px
        position relative
        z-index 2
      h3
       color #fff
       font-size 14px
      span
      font-size 13px
    .user-header
      display flex
      background-color #222
      align-items center
      color #ccc
      text-align center
      margin 0 20%
      margin-top 7px
      height 30px
      border-radius 6px
      border 1px solid #333
      font-size 14px
      .switch-like, .switch-playlist
        flex 1
        height 30px
        line-height 30px
        font-size 13px
  .active
     background-color #333
     color #fff
     border none
  .back
    position fixed
    width 40px
    height 40px
    text-align center
    line-height 40px
    top 5px
    left 5px
    font-size 22px
    .icon-back-arrow
      top 1px
      left 2px
      color #d0ff16
  ul
   padding 0 0 58px 58px
  .song-item
   display flex
   .song-conter
    color #fff
    flex 1
    h3
     font-size 14px
    span
     line-height 30px
     color hsla(0,0%,100%,.3)
     font-size 13px
  .play-index
    position relative
    left -26px
    top 25px
    font-size 18px
</style>

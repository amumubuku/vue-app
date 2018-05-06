<template>
  <transition name="bounceInUp">
    <div class="playlist">
      <div class="play-wrapper">
        <div class="list-header">
          <div class="songlist" @click="_changeMode">
            <i :class="iconmode"></i>
            <span>{{_playMode()}}</span>
          </div>
          <div class="play-state">
            <i class="icon-folder" @click="pushSearch">添加音乐</i>
            <span class="icon-garbage" @click="deletesongs"></span>
          </div>
        </div>
        <div class="list-content">
          <scroll class='scroll' :data="playlist"
           ref="listView"
          >
            <ul>
              <li v-for="(item, index) in playlist" :class="{'songactive':index  == currentIndex}" @click="toggleplay(index)" :key="item.id" ref="songitem">
                <i :class="{'icon-multimedia':index  == currentIndex}"></i>
                <span v-text="playsong(item)"></span>
                <i class="icon-close-1" @click.stop="deletesong(index)"></i>
              </li>
            </ul>
          </scroll>
        </div>
      </div>
      <div class="close" @click="closeplaylist">关闭</div>
    </div>
  </transition>
</template>
<script>
   import {mapGetters, mapMutations} from 'vuex'
   import Scroll from './scroll.vue'
   export default {
     props: {
       musiclength: {
         type: Number,
         default: 0
       }
     },
     data () {
       return {
         playlength: '',
         isplay: false
       }
     },
     computed: {
       ...mapGetters([
         'playlist',
         'currentIndex',
         'Playing',
         'iscloselist',
         'playMode'
       ]),
       iconmode () {
         return this.playMode === 0 ? 'icon-arrows' : this.playMode === 1 ? 'icon-shuffle' : 'icon-process-arrows'
       }
     },
     mounted () {
       setTimeout(() => {
         this._ScrollTo()
       }, 20)
     },
     methods: {
       _changeMode () {
         let mode = this.playMode + 1
         this.changeMode(mode % 3)
       },
       pushSearch () {
         this.setfullScreen(false)
         this.closeplaylist()
         this.$router.push({
           path: '/search'
         })
       },
       deletesongs () {
         this.delete('empty')
         this.setfullScreen(false)
         this.closeplaylist()
       },
       deletesong (index) {
         this.delete(index)
       },
       _playMode () {
         return this.playMode === 0 ? `循环列表(${this.musiclength}首)` : this.playMode === 1 ? `随机播放(${this.musiclength}首)` : `单曲循环`
       },
       ...mapMutations({
         setshowlist: 'SET_ISCLOSELIST',
         setCurrentindex: 'SET_CURRENT_INDEX',
         setPlaying: 'SET_PLAYING',
         delete: 'DELETE_ARRER',
         setfullScreen: 'SET_FULLSCREEN',
         changeMode: 'SET_PLAYMODE'
       }),
       playsong (item) {
         return `${item.name} - ${item.singer}`
       },
       closeplaylist () {
         this.setshowlist(false)
       },
       toggleplay (index) {
         this.setCurrentindex(index)
         if (!this.playing) {
           this.toggleplaying()
         }
       },
       _ScrollTo () {
         let item = this.$refs.songitem
         if (!this.currentIndex < 4) {
           this.$refs.listView.scrollToElement(item[this.currentIndex + 1], 0, false, true)
         }
       },
       toggleplaying () {
         this.setPlaying(!this.playing)
       }
     },
     components: {Scroll}
   }
</script>
<style scoped>
  .icon-garbage {
    padding: 8px;
    box-sizing: content-box;
    font-size: 18px;
    position: relative;
    left: -6px;
    top:1px;
  }
  .icon-shuffle,.icon-process-arrows,.icon-arrows {
    padding: 8px;
    font-size: 18px;
    position: relative;
    top:3px;
  }
  .icon-multimedia {
    font-size: 20px;
    line-height: 36px;
    position: relative;
    margin-left: 6px;
  }
  .list-header {
    height: 40px;
    border-bottom: 1px solid #c0c0c0;
    border-top: 1px solid #c0c0c0;
    text-align: center;
    line-height: 38px;
    color: #333;
    display: flex;
    align-items: center;
  }
  .list-header .songlist {
    flex: 1;
    text-align: justify;
    font-size: 13px;
  }
  .list-header .play-state {
    flex: 1;
    text-align: end;
  }
  .icon-folder {
    font-size: 13px;
    padding: 0 4px;
    padding-right: 12px;
    border-right: 1px solid #c0c0c0;
  }
  .icon-folder:before {
    position: relative;
    top: 2px;
    padding: 8px;
    font-size: 16px;
  }
  .close {
    height: 38px;
    text-align: center;
    position: absolute;
    bottom:0;
    width: 100%;
    color: #fff;
    z-index: 2;
    background-color: #999;
    line-height: 38px;
    font-size: 16px;
  }
  .playlist {
    position: fixed;
    width: 100%;
    height: 60%;
    background-color: #fff;
    z-index: 999;
    bottom: 0;
  }
  .play-wrapper {
    position: relative;
    height: 100%;

  }
  .list-content {
    position: absolute;
    height: 100%;
    width: 100%;
    color: #fff;
    overflow: hidden;
  }
  .list-content li {
    border-bottom: 1px solid #e9eaec;
    line-height: 36px;
    display: flex;
    color: black;
  }
  .list-content ul {
    padding-bottom: 80px;
  }
  .playlist .songactive {
    color: red;
    font-weight: 400;
  }
  .list-content li span{
    flex: 1;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    padding-left: 10px;
    font-size: 12px
  }
  .icon-close-1 {
    font-size: 12px;
    color: #000;
    padding:  0 14px;
    line-height: 36px;
    opacity: 0.6;
  }
  .bounceInUp-enter-active {
    animation: bounceInUp 1s;
  }
  .bounceInUp-leave-active {
    animation: bounceOutDown 1s;
  }
  @keyframes bounceOutDown {
    20% {
      transform: translate3d(0, 10px, 0);
    }

    40%, 45% {
      opacity: 1;
      transform: translate3d(0, -20px, 0);
    }

    to {
      opacity: 0;
      transform: translate3d(0, 2000px, 0);
    }
  }
  @keyframes bounceInUp {
    from, 60%, 75%, 90%, to {
      animation-timing-function: cubic-bezier(0.215, 0.610, 0.355, 1.000);
    }

    from {
      opacity: 0;
      transform: translate3d(0, 3000px, 0);
    }

    60% {
      opacity: 1;
      transform: translate3d(0, -20px, 0);
    }

    75% {
      transform: translate3d(0, 10px, 0);
    }

    90% {
      transform: translate3d(0, -5px, 0);
    }

    to {
      transform: translate3d(0, 0, 0);
    }
  }

</style>

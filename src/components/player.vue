
<template>
   <div class="player" v-show="player">
       <transition name="normal">
         <div class="normal-player" v-show="fullScreen">
           <div class="background">
             <img :src="currentSong.image" alt="">
           </div>
           <div class="top">
             <div class="back" @click="back">
               <i class="icon-arrows-1"></i>
             </div>
             <h2 v-html="currentSong.singer"> </h2>
             <h3 v-html="currentSong.name"></h3>
           </div>
           <div class="middle"
                @touchstart.prevent="middleTouchStart"
                @touchmove.prevent="middleTouchMove"
                @touchend="middleTouchEnd"
           >
             <div class="middle-l" ref="middleL">
                 <div  class="cd-wrapper">
                   <img :src="currentSong.image" :class="rotate" alt="">
                 </div>
               <div class="playing-lyric">
                 <p>{{playingLyric}}</p>
               </div>
             </div>
             <!--歌词-->
               <scroll class="scroll middle-r" ref="lyriclist" :data="currentLyric && currentLyric.lines">
                 <div class="lyric-wrapper">
                   <div v-if="currentLyric">
                     <p ref="lyricLine"
                        class="text"
                        v-for="(line, index) in currentLyric.lines"
                        :key="line.key"
                        :class="{'current': currentLineNum === index}"
                     >
                       {{line.txt}}
                     </p>
                   </div>
                 </div>
               </scroll>
           </div>
           <div class="bottom">
             <div class="dot-wrapper">
               <span class="dot" :class="{'active' : currentShow === 'cd'}"></span>
               <span class="dot" :class="{'active' : currentShow === 'lyric'}"></span>
             </div>
             <div class="progress-bar">
               <span class="begin">{{format(currentTime)}}</span>
                <progress-bar @percentChange="onProgressBarchange" :percent="percent"></progress-bar>
               <span class="end">{{format(currentSong.duration)}}</span>
             </div>
             <div class="play-icons">
               <div class="play-icon" @click="_changeMode">
                   <i :class="iconmode"></i>
               </div>
               <div class="play-icon" @click="prev" :class="Ready">
                   <i class="icon-circle"></i>
               </div>
               <div class="play-icon play-pause"  @click="toggleplaying" :class="Ready">
                   <i :class="playIcon"></i>
               </div>
               <div class="play-icon" @click="next" :class="Ready">
                   <i class="icon-arrows-5"></i>
               </div>
               <div class="play-icon playlist-icon" @click="showlist">
                 <div class="icon-playlist" >
                   <span class="path1"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span><span class="path5"></span><span class="path6"></span><span class="path7"></span><span class="path8"></span><span class="path9"></span><span class="path10"></span><span class="path11"></span><span class="path12"></span><span class="path13"></span>
                 </div>
               </div>
             </div>
           </div>
         </div>
       </transition>
     <div class="mini-player" v-show="!fullScreen" @click="open">
        <div class="play-title">
          <img :src="currentSong.image" alt="" width="100%" height="100%" :class="rotate" >
        </div>
        <div class="singer">
          <h5 v-html="currentSong.singer"></h5>
          <span v-html="currentSong.name"></span>
        </div>
        <div class="play-ing" @click.stop="toggleplaying">
          <i :class="miniIcon"></i>
        </div>
        <div class="play-list" @click.stop="showlist">
          <div class="icon-playlist">
            <span class="path1"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span><span class="path5"></span><span class="path6"></span><span class="path7"></span><span class="path8"></span><span class="path9"></span><span class="path10"></span><span class="path11"></span><span class="path12"></span><span class="path13"></span>
          </div>
        </div>
     </div>
     <play-list v-if="iscloselist" :musiclength="playlist.length"></play-list>
     <audio :src="url" ref="audio"
            @ended="next"
            @timeupdate="updateTime"
            @error="error"
            @play="ready"
     >
     </audio>
   </div>
</template>
<script type="text/ecmascript-6">
  import {mapGetters, mapMutations, mapActions} from 'vuex'
  import ProgressBar from '../base/progressBar.vue'
  import PlayList from '../base/playlist.vue'
  import {infoMusic} from '../api/singer/singer'
  import Lyric from 'lyric-parser'
  import Scroll from '../base/scroll.vue'
  import {prefixStyle} from '../common/js/dom'
  import {getRandom} from '../common/js/util'
  const transform = prefixStyle('transform')
  const transitionDuration = prefixStyle('transitionDuration')
  export default{
    computed: {
      ...mapGetters([
        'playlist',
        'currentIndex',
        'currentSong',
        'playing',
        'fullScreen',
        'iscloselist',
        'player',
        'playMode'
      ]),
      iconmode () {
        return this.playMode === 0 ? 'icon-arrows-3' : this.playMode === 1 ? 'icon-arrows-4' : 'icon-music-note-with-loop-circular-arrows-around'
      },
      playIcon () {
        return this.playing ? 'icon-shapes' : 'icon-play-button'
      },
      miniIcon () {
        return this.playing ? 'icon-pause' : 'icon-arrows-6'
      },
      percent () {
        return this.currentTime / this.currentSong.duration
      },
      rotate () {
        return {
          'stoprotate': !this.playing
        }
      },
      Ready () {
        return this.songReady ? '' : 'disable'
      }
    },
    data () {
      return {
        currentTime: 0,
        duration: 0,
        currentLyric: null,
        currentLineNum: 0,
        currentShow: 'cd',
        playingLyric: '',
        songReady: false,
        url: ''
      }
    },
    watch: {
      currentSong (newSong, oldSong) {
        // 当列表没有歌曲时 直接return
        if (!newSong.id) return
        if (newSong === oldSong) {
          return
        }
        // 防止歌词切换跳动
        if (this.currentLyric) {
          this.currentLyric.stop()
        }
        this._getMusicUrl()
        this.getLyric()
        setTimeout(() => {
          this.$refs.audio.play()
        }, 200)
      },
      playing (newPlaying) {
        const audio = this.$refs.audio
        this.$nextTick(() => {
          newPlaying ? audio.play() : audio.pause()
        })
      }
    },
    created () {
      this.touch = {}
    },
    methods: {
      _changeMode () {
        let mode = this.playMode + 1
        this.changeMode(mode % 3)
      },
      ...mapActions([
        'savePlayHitory'
      ]),
      ...mapMutations({
        setfullScreen: 'SET_FULLSCREEN',
        setPlaying: 'SET_PLAYING',
        setCurrentindex: 'SET_CURRENT_INDEX',
        setshowlist: 'SET_ISCLOSELIST',
        changeMode: 'SET_PLAYMODE'
      }),
      middleTouchStart (e) {
        this.touch.initiated = true
        // 用来判断是否是一次移动
        this.touch.moved = false
        const touch = e.touches[0]
        this.touch.startX = touch.pageX
        this.touch.startY = touch.pageY
      },
      middleTouchMove (e) {
        // 没有touchstart 返回
        if (!this.touch.initiated) {
          return
        }
        const touch = e.touches[0]
        const deltaX = touch.pageX - this.touch.startX
        const deltaY = touch.pageY - this.touch.startY
        // y轴距离大于x轴距离 => 纵向滚动 => 返回
        if (Math.abs(deltaY) > Math.abs(deltaX)) {
          return
        }
        if (!this.touch.moved) {
          this.touch.moved = true
        }
        const left = this.currentShow === 'cd' ? 0 : -window.innerWidth
        const offsetWidth = Math.min(0, Math.max(-window.innerWidth, left + deltaX))
        this.touch.percent = Math.abs(offsetWidth / window.innerWidth)
        this.$refs.lyriclist.$el.style[transform] = `translate3d(${offsetWidth}px,0,0)`
        this.$refs.lyriclist.$el.style[transitionDuration] = 0
        this.$refs.middleL.style.opacity = 1 - this.touch.percent
        this.$refs.middleL.style[transitionDuration] = 0
      },
      middleTouchEnd () {
        if (!this.touch.moved) {
          return
        }
        let offsetWidth
        let opacity
        if (this.currentShow === 'cd') {
          if (this.touch.percent > 0.1) {
            offsetWidth = -window.innerWidth
            opacity = 0
            this.currentShow = 'lyric'
          } else {
            offsetWidth = 0
            opacity = 1
          }
        } else {
          if (this.touch.percent < 0.9) {
            offsetWidth = 0
            this.currentShow = 'cd'
            opacity = 1
          } else {
            offsetWidth = -window.innerWidth
            opacity = 0
          }
        }
        // 动画缓冲时间
        const time = 300
        this.$refs.lyriclist.$el.style[transform] = `translate3d(${offsetWidth}px,0,0)`
        this.$refs.lyriclist.$el.style[transitionDuration] = `${time}ms`
        this.$refs.middleL.style.opacity = opacity
        this.$refs.middleL.style[transitionDuration] = `${time}ms`
        this.touch.initiated = false
      },
      onProgressBarchange (percent) {
        const currentTime = percent * this.currentSong.duration
        this.$refs.audio.currentTime = currentTime
        if (!this.playing) {
          this.toggleplaying()
        }
        if (this.currentLyric) {
          this.currentLyric.seek(currentTime * 1000)
        }
      },
      // 展示播放列表
      showlist () {
        this.setshowlist(!this.iscloselist)
      },
  // 切换播放状态
      toggleplaying () {
        this.setPlaying(!this.playing)
        if (this.currentLyric) {
          this.currentLyric.togglePlay()
        }
      },
      back () {
        this.setfullScreen(false)
      },
      open () {
        this.setfullScreen(true)
      },
      next () {
        let index
        if (this.playlist.length === 1) {
          this.loop()
          return
        }
        if (this.playMode === 2) {
          this.loop()
          return
        }
        if (this.playMode === 1) {
          let random = getRandom(0, this.playlist.length)
          if (this.currentIndex === random) {
            random = random(0, this.playlist.length)
          }
          this.setCurrentindex(random)
          return
        }
        index = this.currentIndex + 1
        if (index > this.playlist.length - 1) {
          index = 0
        }
        if (this.songReady) {
          this.setCurrentindex(index)
        }
        if (!this.playing) {
          this.toggleplaying()
        }
        this.songReady = false
      },
      prev () {
        if (this.playlist.length === 1) {
          this.loop()
          return
        }
        if (this.playMode === 2) {
          this.loop()
          return
        }
        if (this.playMode === 1) {
          let random = getRandom(0, this.playlist.length)
          if (this.currentIndex === random) {
            random = random(0, this.playlist.length)
          }
          this.setCurrentindex(random)
          return
        }
        let index = this.currentIndex - 1
        if (index < 0) {
          index = this.playlist.length - 1
        }
        if (this.songReady) {
          this.setCurrentindex(index)
        }
        if (!this.playing) {
          this.toggleplaying()
        }
        this.songReady = false
      },
      // 格式化时间
      format (interval) {
        interval = interval | 0
        const minute = interval / 60 | 0
        const second = this._pad(interval % 60)
        return `${minute}:${second}`
      },
      _pad (num, n = 2) {
        let len = num.toString().length
        while (len < n) {
          num = '0' + num
          len++
        }
        return num
      },
      updateTime (e) {
        this.currentTime = e.target.currentTime
      },
      error () {
        this.next()
      },
      loop () {
        this.$refs.audio.currentTime = 0
        this.$refs.audio.play()

        // 循环播放 歌词回到开始的时候
        if (this.currentLyric) {
          this.currentLyric.seek(0)
        }
      },
      ready () {
        this.songReady = true
        document.title = `${this.currentSong.name}(${this.currentSong.singer})`
        this.savePlayHitory({
          songid: this.currentSong.id,
          songmid: this.currentSong.mid,
          singer: [{
            name: this.currentSong.singer
          }],
          songname: this.currentSong.name,
          albummid: this.currentSong.alum,
          interval: this.currentSong.duration
        })
      },
      _getMusicUrl () {
        infoMusic(this.currentSong.mid).then((res) => {
          let data = res.data.items[0]
          this.url = `http://dl.stream.qqmusic.qq.com/${data.filename}?vkey=${data.vkey}&guid=3429347272&uin=775574656&fromtag=66`
        })
      },
      getLyric () {
        this.currentSong.getLyric().then(lyric => {
          if (lyric.length === 27) {
            this.playingLyric = lyric.slice(10)
            return
          }
          if (this.currentLyric === lyric) {
            return
          }
          this.currentLyric = new Lyric(lyric, this.handleLyric)
          if (this.playing) {
            this.currentLyric.play()
          }
        }).catch(() => {
          this.currentLyric = null
          this.currentLineNum = 0
          this.playingLyric = ''
        })
      },
      handleLyric ({lineNum, txt}) {
        this.currentLineNum = lineNum
        if (lineNum > 5) {
          let lineEl = this.$refs.lyricLine[lineNum - 5]
          this.$refs.lyriclist.scrollToElement(lineEl, 1000)
        } else {
          this.$refs.lyriclist.scrollTo(0, 0, 1000)
        }
        this.playingLyric = txt
      }
    },
    components: {ProgressBar, PlayList, Scroll}
  }
</script>
<style scoped lang="stylus">
  .play-list {
    position: relative;
    top: -2px;
  }
  .text
    line-height: 24px;
    font-size 14px

  .disable {
    color:  rgba(255, 205, 49, 0.5) !important;
  }
  .icon-music {
    font-size: 32px;
    margin-bottom: 8px;
  }
  .playing-lyric {
    margin-top: 40px;
    color: #fff;
    text-align: center;
    font-size 13px
  }
  .dot-wrapper {
    height:8px;
    text-align: center;
    margin-bottom: 5px;
  }
  .dot-wrapper .dot {
    width: 8px;
    height: 100%;
    display: inline-table;
    border-radius: 50%;
    background-color: #ccc;
  }
  .dot-wrapper > .active {
    border-radius: 5px;
    background-color: #fff;
    width: 18px;
  }
  .player .current {
    color: #fff;
    font-size: 15px;
  }
  .lyric-wrapper {
    padding-bottom: 34px;
  }
  .text {
    color: hsla(0,0%,100%,.5);
    font-size: 14px;
  }
  .play-icons > .play-pause {
     font-size: 36px;
   }
   .progress-bar {
      height: 30px;
      flex: 1;
      display: flex;
      align-items: center;
      color: #fff;
      padding: 0 40px;
      margin-bottom: 5px;
    }
    .play-title {
      flex: 0 0 40px;
      height:40px;
      width: 40px;
      margin: 0 12px 0 12px;
    }
    .play-title > img {
      display: inline-block;
      border-radius: 50%;
      border: 1px solid #222;
      animation: rotate 20s linear infinite
    }
    .singer {
      width:63%;
      overflow hidden;
    }
    .singer h5 {
      color: black;
      font-size: 13px;
      margin: 0;
      white-space:nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .singer > span {
      font-size: 13px;
      color: #646464;
      white-space:nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .play-ing, .play-list {
      flex:0 0 35px;

      text-align: center;
    }
  .icon-arrows-6:before ,.icon-pause:before{
    color: #d40707;
  }
  .play-ing {
    position relative
    left -13px
    font-size: 24px;
    padding 4px
  }
  .play-list {
    position relative
    left -7px
    top -1px
    font-size 28px
  }
  .play-list >.icon-music {
    font-size 28px
  }
 .play-list >.icon-playlist > .path1:before,
 .play-list >.icon-playlist > .path2:before,
 .play-list >.icon-playlist > .path3:before,
 .play-list >.icon-playlist > .path4:before,
 .play-list >.icon-playlist > .path5:before,
 .play-list >.icon-playlist > .path6:before,
 .play-list >.icon-playlist > .path7:before,
 .play-list >.icon-playlist > .path8:before,
 .play-list >.icon-playlist > .path9:before,
 .play-list >.icon-playlist > .path10:before,
 .play-list >.icon-playlist > .path11:before,
 .play-list >.icon-playlist > .path12:before,
 .play-list >.icon-playlist > .path13:before {
    color black

  }
   .mini-player {
     position: fixed;
     bottom: 0;
     width: 100%;
     height: 50px;
     z-index: 120;
     background-color: #fff;
     display: flex;
     align-items: center;
     border-top 1px solid #c0c0c0
   }
  .bottom {
    position: relative;
    width: 100%;
    bottom: 125px;
  }
  .play-icons {
    display: flex;
    align-items: center;
    text-align: center;
  }
  .play-icon {
    flex: 1;
    font-size: 28px;
    color: #d0ff16;
  }
  .playlist-icon {
    font-size: 32px;
  }
  .middle {
    position: fixed;
    top:10%;
    width: 100%;
    bottom: 20%;
    white-space: nowrap;
  }
  .middle-l{
    display: inline-block;
    vertical-align: top;
    position: relative;
    width: 100%;
    height: 0;
    padding-top: 80%;
  }
  .middle-r {
    display: inline-block;
    position: absolute;
    height: 100%;
    width: 100%;
    overflow: hidden;
    text-align: center;
  }
  .cd-wrapper{
    top: 0;
    width: 80%;
    box-sizing: border-box;
    height: 100%;
    position: absolute;
    left: 8%;
  }
  .top  {
    position: absolute;
    top:0;
    left: 0;
    width: 100%;
  }
  .normal-player {
    position: fixed;
    top:0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #222;
    z-index: 100;
  }
  .player .stoprotate {
    animation-play-state:paused;
  }
  .player h2 {
    font-size: 16px;
    padding-top: 12px;
    text-align: center;
    color: #fff;
  }
  .player h2 ,.player h3 {
    color: #fff;
    text-align: center;
    width: 100%;
  }
  .player h3 {
    font-size: 15px;
    padding-top: 4px;
  }
   .cd-wrapper img {
    border-radius: 50%;
    border:10px solid hsla(0,0%,100%,.1);
    position: absolute;
    width: 100%;
    height: 100%;  animation: rotate 20s linear infinite;
  }
  .player .back {
    position: absolute;
    top: 8px;
    left: 6px;
    z-index: 22;
    width: 42px;
    height: 42px;
  }
  .player .back  i {
    display: block;
    font-size: 22px;
    color: #d0ff16;
    text-align: center;
  }
  .normal-player {
    width: 100%;
    height: 100%;
    background-color: #222;
  }
  .background {
    width: 100%;
    height: 100%;
    filter: blur(20px);
    opacity: .7;
  }
  .background > img {
    width:100%;
    height: 100%;
  }
  .normal-enter-active  {
    animation: bounceInDown .8s;
   }
  .normal-leave-active {
    animation: bounceOutUp .4s;
  }
  @keyframes bounceOutUp {
    20% {
      transform: translate3d(0, -10px, 0);
    }
    40%, 45% {
      opacity: 1;
      transform: translate3d(0, 20px, 0);
    }

    to {
      opacity: 0;
      transform: translate3d(0, -2000px, 0);
    }
  }
  @keyframes bounceInDown {
    from, 60%, 75%, 90%, to {
      animation-timing-function: cubic-bezier(0.215, 0.610, 0.355, 1.000);
    }

    0% {
      opacity: 0;
      transform: translate3d(0, -3000px, 0);
    }

    60% {
      opacity: 1;
      transform: translate3d(0, 25px, 0);
    }

    75% {
      transform: translate3d(0, -10px, 0);
    }

    90% {
      transform: translate3d(0, 5px, 0);
    }

    to {
      transform: none;
    }
  }
  @keyframes rotate {
    0% {
     transform: rotate(0deg);
    }
    100% {
     transform: rotate(360deg);
    }
  }
</style>

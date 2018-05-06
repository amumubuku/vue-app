<template>
  <div class="music-list" ref="music">
    <!--返回上一层-->
    <div class="back" @click="back">
      <i class="icon-arrows-2"></i>
    </div>
    <!--歌曲信息-->
    <h1 class="title" v-html="title"></h1>
    <div class="bg-image" :style="bgStyle" ref="bgImg">
      <div class="play-warpper">
        <div class="random" @click="random">随便播放全部
          <i class="icon-play-button"></i>
        </div>
      </div>
      <div class="filter"></div>
    </div>
    <!--歌曲列表-->
    <div class="songs" ref="songs">
      <scroll class="scroll"
              :data="songs"
              @scroll="scrollY"
              :listenScroll="listenScroll"
              :probeType="probeType"
               ref="scroll">
        <ul>
          <li v-for="(item, index) in songs" :key="item.key" @click="selectItem(item, index)">
            <div  v-if="ifrank" :class="rank(index)" v-html="index > 2 ? index + 1:'' " class="panklist">
            </div>
            <div class="content">
              <h3>{{item.name}}</h3>
              <span>{{item.singer}}</span>
            </div>
          </li>
        </ul>
      </scroll>
    </div>
    <div class="loader" v-show="!songs.length"></div>
  </div>
</template>

<script>
  import Scroll from '../base/scroll.vue'
  import {playListMixin} from '../common/js/mixin'
  import {mapActions, mapMutations} from 'vuex'
  import {prefixStyle} from '../common/js/dom'
  import {getRandom} from '../common/js/util'
  const transform = prefixStyle('transform')
  export default {
    mixins: [playListMixin],
    props: {
      bgurl: {
        type: String,
        default: ''
      },
      songs: {
        type: Array,
        default: []
      },
      title: {
        type: String,
        default: ''
      },
      ifrank: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        scroll: 0
      }
    },
    created () {
      this.listenScroll = true
      this.probeType = 3
    },
    mounted () {
      this.padingheight = this.$refs.bgImg.clientHeight
      this.$refs.songs.style.top = `${this.padingheight}px`
    },
    computed: {
      // 加载歌手背景图片
      bgStyle () {
        return `background-image:url(${this.bgurl})`
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
      scrollY (pos) {
        let imgHeight = this.$refs.bgImg.clientHeight
        const scale = Math.abs(pos.y / imgHeight)
        if (pos.y > 0) {
          this.$refs.bgImg.style[transform] = `scale(${1 + scale})`
        }
      },
      handlePlayList (playlist) {
        const bottom = playlist.length > 0 ? '50px' : ''
        this.$refs.songs.style.bottom = bottom
        this.$refs.scroll.refresh()
      },
      ...mapActions([
        'selectPlay',
        'randomPlay'
      ]),
      ...mapMutations({
        changeMode: 'SET_PLAYMODE'
      }),
      selectItem (item, index) {
        this.selectPlay({
          list: this.songs.slice(),
          index
        })
      },
      back () {
        this.$router.back()
      },
      rank (index) {
        return index === 0 ? 'icon-trophy first' : index === 1 ? 'icon-trophy secound' : index === 2 ? 'icon-trophy third' : ''
      }
    },
    components: {Scroll}
  }
</script>

<style >
  .random > .icon-play-button {
    font-size: 18px;
    position: relative;
    top:3px;
   }
  .play-warpper {
    width: 100%;
    height: 32px;
    position: absolute;
    bottom:18px;
    z-index: 2;
  }
  .random {
    width: 150px;
    height: 32px;
    border: 1px solid #ffcd32;
    border-radius: 28px;
    z-index: 99;
    color: #ffcd32;
    line-height: 32px;
    text-align: center;
    margin: 0 auto;
    font-size: 14px;
  }
  .songs .first {
    color: #ffd000;
  }
  .filter {
    width:100%;
    height: 100%;
    background: rgba(7,17,27,.4);
    position: absolute;
    top:0;
    left: 0;
  }
  .songs .secound {
    color: #cbcbcb;
  }
  .songs .third {
    color: #d6aa35;
  }
  .songs .first, .songs .secound ,.songs .third {
    margin: 0 10px;
    line-height: 43px;
    font-size: 26px;
  }
  .panklist {
     margin: 0 16px;
     position: relative;
     top: -1px;
     font-size: 20px;
     line-height: 43px;
     color: #ffcd32;
  }
  .songs .content {
    flex: 1;
  }
  .songs {
    position: fixed;
    top:290px;
    bottom: 0;
    right: 0;
    left: 0;
    width: 100%;
    z-index: 3;
  }
  .songs >.scroll {
    height: 100%;
  }
  .music-list {
    position: fixed;
    z-index: 100;
    top: 0;
    left: 0;
    bottom:0;
    right:0;
    background:#222
  }
  .back {
    position:absolute;
    top: 4px;
    z-index: 50;
    width: 42px;
    height: 42px;
    left: -1px;
  }
  .back i {
    display: block;
    font-size: 22px;
    color: #ffcd32;
    text-align: center;
    padding-top: 5px;
  }
  .title {
    width: 100%;
    z-index: 40;
    text-align: center;
    font-size:15px;
    color:#fff;
    position: absolute;
    line-height: 40px;
  }
  .bg-image {
    position: relative;
    width: 100%;
    height: 0;
    padding-top: 70%;
    transform-origin: top;
    background-size: cover;
  }
  .songs ul {
    position: absolute;
    background-color: #222;
    z-index: 22;
    width: 100%;
    padding: 20px 0 3px 20px;
  }
  .songs li {
    border-bottom: 1px solid rgba(255,255,255,.15);
    padding-bottom: 3px;
    display: flex;
  }
  .songs li h3 {
    color: #FFF;
    font-size: 12px;
    padding-top: 8px;
  }
  .songs li span,h3 {
    color: #646464;
    white-space:nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    font-size: 14px;
    width: 100%;
  }
  .songs li span {
    line-height: 22px;
    font-size: 12px;
  }

</style>

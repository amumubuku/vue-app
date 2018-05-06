<template>
   <scroll class="scroll"  @scroll="scroll"
           :listenScroll="listenScroll"
           :probeType="probeType"
           :data="songs"
           ref="listView"
   >
     <div class="singer-list" ref="Group">
       <div class="singer-group">
         <h3 class="singer-title">热门</h3>
         <div class="singer-item" v-for="(val, index) in hot" :key="val.id"  @click="selectsinger(val)">
           <img :src="val.picUrl" alt="">
           <span v-text="val.name"></span>
         </div>
       </div>
       <div class="singer-group" v-for="(singer,index) in songs">
         <h3 class="singer-title">{{singer.key}}</h3>
         <div class="singer-item" v-for="(val, index) in singer.item" :key="val.id"  @click="selectsinger(val)">
           <img :src="val.picUrl" alt="">
           <span v-text="val.name"></span>
         </div>
       </div>
     </div>
     <div class="singer-wrapper"
       @touchstart="ShortcutTouchStrat"
       @touchmove="ShortcutTouchMove"
     >
       <ul ref="ul">
         <li class="singer-key" :class="[currenIndex === 0 ? 'disable' : '']" :data-index="0">
           热
         </li>
         <li class="singer-key" v-for="(singer,index) in songs" :class="[index + 1 === currenIndex ? 'disable' : '']" :data-index="index + 1">
           {{singer.key}}
         </li>
       </ul>
     </div>
     <div class="loader" v-show="!songs.length > 0"></div>
   </scroll>
</template>
<script>
    import Scroll from './scroll.vue'
    import {attribute} from '../common/js/dom'
    const ANCHOR_HEIGHT = 17
    export default {
      data () {
        return {
          currenIndex: 0,
          scrollY: -1
        }
      },
      props: {
        hot: {
          type: Array,
          default: []
        },
        songs: {
          type: Array,
          default: []
        }
      },
      computed: {},
      watch: {
        songs (newVal) {
          setTimeout(() => {
            this.createHeight()
          }, 20)
        },
        scrollY (newY) {
          const listHeight = this.listHeight
          if (newY > 0) {
            this.currenIndex = 0
            return
          }
          for (var i = 0; i < listHeight.length; i++) {
            let height1 = listHeight[i]
            let height2 = listHeight[i + 1]
            if (-newY >= height1 && -newY < height2) {
              this.currenIndex = i
              return
            }
          }
        }
      },
      methods: {
        ShortcutTouchStrat (e) {
          let ShortcutIndex = attribute(e.target, 'data-index')
          this.touch.ShortcutIndex = ShortcutIndex
          this.touch.pageY = e.touches[0].pageY
          this.scrollTo(ShortcutIndex)
        },
        ShortcutTouchMove (e) {
          let anchorindex = (e.touches[0].pageY - this.touch.pageY) / ANCHOR_HEIGHT | 0
          const deltaY = parseInt(this.touch.ShortcutIndex) + anchorindex
          this.scrollTo(deltaY)
        },
        scrollTo (index) {
          this.scrollY = -this.listHeight[index]
          this.$refs.listView.scrollToElement(this.$refs.Group.children[index], 1000, false, true)
        },
        refresh () {
          this.$refs.listView.refresh()
        },
        selectsinger (val) {
          this.$emit('select', val)
        },
        createHeight () {
          this.listHeight = []
          this.GroupList = this.$refs.Group.children
          let height = 0
          this.listHeight.push(height)
          for (var i = 0; i < this.GroupList.length; i++) {
            let item = this.GroupList[i]
            height += item.clientHeight
            this.listHeight.push(height)
          }
        },
        scroll (pos) {
          this.scrollY = pos.y
        }
      },
      created () {
        this.touch = {}
        this.listenScroll = true
        this.probeType = 3
      },
      components: {Scroll}
    }
</script>
<style scoped lang="stylus">
  .disable
    color #24ca40
  .singer-title
    padding 3px 0  3px 22px
    font-size 14px
    background-color #495060
    color #fff
    font-weight 600
  .singer-wrapper
    position absolute
    background-color #333
    border-radius 8px
    border-left 1px solid #fff
    top 50%
    right 0
    z-index 11
    width 18px
    padding 20px 0
    transform translateY(-50%)
    .singer-key
      padding 2px
      font-size 13px
      text-align center
      color #fff
      opacity .7
    .disable
      color #d0ff16
      opacity 1
  .singer-item
    display flex
    align-items center
    img
      width 50px
      height 50px
      border-radius 50%
      margin 5px 12px 5px 15px
    span
     font-size 14px
  .scroll
   height 100%
   overflow hidden

</style>

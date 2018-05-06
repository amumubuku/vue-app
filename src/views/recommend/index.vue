<template>
  <div class="recommend" ref="recommend">
    <scroll :data="recommendlist" class="scroll" ref="scroll">
      <div class="recommend-content">
        <div v-if="imgList.length > 0" class="slider-show">
          <slider>
            <li v-for="item in imgList" class="slider-item" ref="slider_item">
              <a :href="item.linkUrl">
                <img :src="item.picUrl" alt="">
              </a>
            </li>
          </slider>
        </div>
        <div class="recommend-list">
          <h1>热门歌单</h1>
          <ul>
            <li v-for="(item, index) in recommendlist" :key="item.id" :class="[index % 2 ==0 ? 'active' :'' ]" @click="selectrecommend(item)">
              <div class="recommend-left">
                <img :src="item.imgurl" alt="">
              </div>
              <div class="recommend-right">
                <span v-text="item.creator.name"></span>
                <p v-text="item.dissname"></p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </scroll>
    <div class="loader" v-show="!recommendlist.length > 0"></div>
    <router-view></router-view>
  </div>
</template>
<script>
  import {mapMutations} from 'vuex'
  import {getimgList, getRecommendslist} from '../../api/recommend/recommend.js'
  import Scroll from '../../base/scroll.vue'
  import Slider from '../../base/slider.vue'
  import {playListMixin} from '../../common/js/mixin'
  export default {
    mixins: [playListMixin],
    created () {
      this._getimglist()
      this._getRecommendslist()
    },
    data () {
      return {
        imgList: [],
        recommendlist: []
      }
    },
    methods: {
      handlePlayList (playlist) {
        const bottom = playlist.length > 0 ? '50px' : ''
        this.$refs.recommend.style.bottom = bottom
        this.$refs.scroll.refresh()
      },
      ...mapMutations({
        setDisc: 'SET_DISC'
      }),
      _getimglist () {
        getimgList().then(res => {
          this.imgList = res.data.slider
        })
      },
      _getRecommendslist () {
        getRecommendslist().then(res => {
          this.recommendlist = res.data.list
        })
      },
      selectrecommend (val) {
        this.$router.push({
          path: `/recommend/${val.dissid}`
        })
        this.setDisc(val)
      }
    },
    components: {Scroll, Slider}
  }
</script>
<style>
  .scroll {
    overflow: hidden;
    height:100%;
  }
  .slider-show {
    margin-top: 5px;
  }
  .slider-item {
    border-radius: 6px;
    width: 82%;
  }
  .recommend{
    position: fixed;
    width: 100%;
    top: 37px;
    bottom: 0;
    z-index: 2;
  }
  .slider {
    position: relative;
    padding-top: 46%;
  }
  .slider-wrapper {
    height: 100%;
    width: 100%;
    position: absolute;
    top:0;
  }
  .slider-wrapper img {
    width: 100%;
    height: 100%;
  }
  .recommend-right {
    flex: 1;
    overflow: hidden;
  }
  .recommend-list h1 {
    text-align: center;
    color: #31c27c;
    font-weight: 500;
    margin:6px 0 6px 0;
    font-size: 14px;
  }
  .recommend-list ul li {
    display: flex;
    align-items: center;
    margin-bottom: 3px;
  }
  .recommend-list ul li img{
    width: 68px;
    height: 68px;
    padding:  0 11px 0 11px;
  }
  .recommend-list ul li span {
    font-size: 14px;
  }
  .recommend-list ul li  p {
    font-weight: 400;
    line-height: 24px;
    color: #666;
    font-size: 13px;
  }
</style>

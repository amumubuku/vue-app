<template>
  <div class="rank" ref="rank">
      <scroll class='scroll' :data="ranklist" ref="scroll">
        <div>
          <div class="toplist-item"  v-for="(item, index) in ranklist" :key="item.key" :class="[index % 2 ==0 ? 'active': '']" @click="selectrank(item)" >
            <div class="icon">
              <img :src="item.picUrl" alt="">
            </div>
              <ul>
                  <li v-for="(val, index) in item.songList">
                    <span class="song" v-text="index+1"></span>
                    <span class="song">{{normalname(val)}}</span>
                  </li>
              </ul>
          </div>
        </div>
      </scroll>
     <div class="loader" v-show="!ranklist.length > 0"></div>
     <router-view></router-view>
  </div>
</template>
<script>
  import {getranklist} from '../../api/rank/rank'
  import {playListMixin} from '../../common/js/mixin'
  import Scroll from '../../base/scroll.vue'
  import {mapMutations} from 'vuex'
  export default {
    mixins: [playListMixin],
    created () {
      this._getranklist()
    },
    data () {
      return {
        ranklist: []
      }
    },
    methods: {
      handlePlayList (playlist) {
        const bottom = playlist.length > 0 ? '50px' : ''
        this.$refs.rank.style.bottom = bottom
        this.$refs.scroll.refresh()
      },
      _getranklist () {
        getranklist().then(res => {
          this.ranklist = res.data.topList
        })
      },
      selectrank (val) {
        this.$router.push({
          path: `/rank/${val.id}`
        })
        this.settoplist(val)
      },
      normalname (val) {
        return `${val.songname} - ${val.singername}`
      },
      ...mapMutations({
        settoplist: 'SET_TOPLIST'
      })
    },
    components: {Scroll}
  }
</script>
<style>
  .icon {
    flex: 0 0 100px;
    width: 100px;
    height: 100px;
    margin: 2px 17px 0 18px;
  }
  .rank {
    position: fixed;
    top:40px;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 2;
  }
  .toplist-centent {
    height: 100%;
  }
  .scroll {
    height:100%;
    overflow: hidden;
  }
  .toplist {
    margin-top: 2px;
    height: 100%;
  }
  .toplist-item {
    display: flex;
    align-items: center;
  }
  .toplist-item img {
    width: 94px;
    height: 94px;
    max-width: none;
  }
  .toplist-item ul {
    list-style: none;
    flex: 1;
    display: flex;
    justify-content: center;
    height: 100px;
    overflow: hidden;
    flex-direction: column;
  }
  .toplist-item ul li {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    line-height: 26px;
    font-size: 13px;
  }
</style>

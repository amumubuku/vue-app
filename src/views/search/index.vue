<template>
  <div class="search">
     <div class="search-box">
       <i class="icon-search"></i>
       <input type="text" v-model="value" placeholder="搜索歌曲、歌手">
       <div  v-show="value" class="icon-close-2" @click="empty"></div>
     </div>
     <div class="search-wrapper">
        <h1>热门搜索</h1>
        <ul>
          <li v-for="item in hotkey" :key="item.id" @click="setval(item.k)">
            <span v-text="item.k"></span>
          </li>
        </ul>
     </div>
    <!--搜索结果组件-->
    <search-list :songs="result" v-show="value" @selectsong="selection" :value="value" :singer="zhida" :singerImg="singerImg" @selectsinger="selectsinger"></search-list>
    <!--搜索历史-->
     <div class="search-hitory">
       <h3>
         <span class="search-text">搜索历史</span>
         <span class="icon-garbage" @click="crearHitory"></span>
       </h3>
       <ul>
         <li v-for="value in loadsearch" @click="selectQuery(value)">
           <span class="search-text">{{value}}</span>
           <span class="Eliminate" @click.stop="deleteHitory(value)">
              <i class="icon-close" ></i>
           </span>
         </li>
       </ul>
     </div>
    <router-view></router-view>
  </div>
</template>
<script>
  import {search, gethotkey} from '../../api/search'
  import {createsong} from '../../base/song'
  import SearchList from '../../components/searchlist.vue'
  import {dobounce} from '../../common/js/util'
  import Hostory from '../../components/user.vue'
  import {mapActions, mapMutations, mapGetters} from 'vuex'
  export default {
    data () {
      return {
        value: '',
        hotkey: [],
        result: [],
        zhida: {},
        singerImg: ''
      }
    },
    computed: {
      ...mapGetters([
        'loadsearch'
      ])
    },
    created () {
      this.$watch('value', dobounce((newVal) => {
        this.value = newVal
        this._getserach()
      }, 300))
      this._getHotkey()
    },
    methods: {
      ...mapActions([
        'addPlay',
        'saveSearchHitory',
        'deleteSearchHitory',
        'clearSearchHitory'
      ]),
      ...mapMutations({
        setSinger: 'SET_SINGER'
      }),
      empty () {
        this.value = ''
      },
      selectQuery (value) {
        this.value = value
      },
      crearHitory () {
        this.clearSearchHitory()
      },
      deleteHitory (item) {
        this.deleteSearchHitory(item)
      },
      selectsinger (singer) {
        this.$router.push({
          path: `/search/${singer.id}`
        })
        this.setSinger(singer)
      },
      selection (item, value) {
        this.addPlay(item)
        this.saveSearchHitory(value)
      },
      _getserach () {
        search(this.value).then((res) => {
          this.result = this._normalSong(res.data.song.list)
          this.zhida = res.data.zhida
          this.singerImg = `https://y.gtimg.cn/music/photo_new/T001R300x300M000${res.data.zhida.singermid}.jpg?max_age=2592000`
        })
      },
      _getHotkey () {
        gethotkey().then((res) => {
          this.hotkey = this._getkey(res.data.hotkey)
        })
      },
      _getkey (data) {
        var res = []
        data.forEach((item, index) => {
          if (index > 9) {
            return
          }
          res.push(item)
        })
        return res
      },
      _normalSong (data) {
        const res = []
        data.forEach((item, index) => {
          res.push(createsong(item))
        })
        return res
      },
      setval (val) {
        this.value = val
      }
    },
    components: {SearchList, Hostory}
  }
</script>
<style scoped>
  .icon-close-2 {
    position: absolute;
    top: 20px;
    font-size: 18px;
    width: 30px;
    height: 30px;
    color: #333;
    right: 22px;
    text-align: center;
    line-height: 30px;
    padding: 2px;
  }
  .icon-search {
    position: absolute;
    left: 24px;
    top: 27px;
    font-size: 18px;
    width: 30px;
    height: 30px;
    color: #a2a2a2;
  }
  input {
    padding-left: 27px;
    margin: 0 5px;
    line-height: 18px;
    color: #333;
    font-size: 14px;
    outline: 0;
    flex: 1;
    margin: 0 18px;
    border: 1px solid #c9c9c9 ;
    border-radius: 4px;
  }
  ul {
    margin-top: 6px;
  }
   h3{
     display: flex;
     color: #000;
     font-size: 14px;
   }
   .search-text {
     flex: 1;
   }
   .icon-garbage{
     font-size: 20px;
     position: relative;
     left: -10%;
     padding: 6px;
   }
  .Eliminate {
    position: relative;
    left: -11%;
    padding: 0 6px;
  }
  .search-hitory {
    position: relative;
    margin-top: 8px;
    width: 100%;
    margin-left: 5%;
  }
  .search-hitory li {
    display: flex;
    height: 30px;
    line-height: 30px;
    align-items: center;
    color: #666;
  }
  .search-box {
    height: 43px;
    display: flex;
    background-color: #f4f4f4;
    margin-top: 20px;
    padding: 15px 0;
    position: relative;
  }
  .mint-search {
    height: 58px;
  }
  .search {
    position: fixed;
    top:37px;
    width: 100%;
    bottom: 0;
    z-index: 11;
    background-color: #fff;
  }
  .mint-searchbar {
    background-color: #dddee1;
  }
  .search-wrapper {
    position: relative;
    margin-top: 22px;
    font-size: 13px;
  }
  .search-wrapper h1 {
    font-size: 16px;
    font-weight: 300;
    padding-left:17px ;
    color: #1c2438;
  }
  .search-wrapper li {
    display: inline-block;
    border: 1px solid #d3d4da;
    border-radius: 34px;
    margin:  3px 12px;
    padding:  0 12px;
    line-height: 30px;
    font-size: 12px;
  }
</style>

<template>
    <div class="search-list">
         <scroll class="scroll" :data="songs">
           <ul>
             <li class="singer" v-if="singer.type == 2" @click="selectsinger">
               <img :src='singerImg' alt="">
               <h6>{{singer.singername}}</h6>
               <div class="singer-item">
                 <span>{{normal()}}</span>
               </div>
             </li>
             <li v-for="item in songs" @click="selectsong(item)">
               <span class="song-name">{{item.name}}</span>
               <span class="song-singer">{{item.singer}}</span>
             </li>
           </ul>
         </scroll>
      <div class="loader" v-show="!songs.length > 0"></div>
    </div>
</template>
<script>
    import Singer from '../base/singer'
    import Scroll from '../base/scroll.vue'
    export default {
      props: {
        songs: {
          type: Array,
          default: []
        },
        value: {
          type: String,
          default: ''
        },
        singer: {
          type: Object,
          default: {}
        },
        singerImg: {
          type: String,
          default: ''
        }
      },
      methods: {
        selectsong (item) {
          this.$emit('selectsong', item, this.value)
        },
        normal () {
          return `单曲: ${this.singer.songnum}  专辑: ${this.singer.albumnum}`
        },
        selectsinger () {
          this.$emit('selectsinger', new Singer({
            id: this.singer.singermid,
            name: this.singer.singername
          }))
        }
      },
      components: {Scroll}
    }
</script>
<style scoped>
  .search-list {
    overflow: hidden;
    position:fixed;
    top:130px;
    background-color: #fff;
    z-index: 22;
    width: 100%;
    bottom: 0;
  }
  .search-list ul {
    padding-bottom:88px;
  }
  .music-box {
    height: 100%;
  }
  .loader {
    position:fixed;
    top:50%;
  }
  .search-list li {
    padding-left: 12px;
    border-bottom:1px solid #e5e5e5;
  }
  img {
    width: 54px;
    height: 54px;
    border-radius: 50%;
    margin-bottom: 3px;
  }
  span {
    display: block;
    line-height: 20px;
  }
  h6 {
    margin:  0;
    position: absolute;
    top: 10px;
    left: 76px;
    font-size: 18px;
    font-weight: 400;
  }
  .song-name {
    font-size: 14px;
    padding-top:6px;
  }
  .song-singer {
    font-size: 12px;
    color: #a18080;
    padding-bottom: 6px;
  }
  .singer-item{
    position: absolute;
    top: 37px;
    left: 77px;
    color: #a18080;
  }
  .singer-item span {
    font-size: 14px;
  }
</style>

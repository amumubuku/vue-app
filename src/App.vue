<template>
  <div id="app">
    <m-header></m-header>
    <keep-alive>
     <router-view></router-view>
    </keep-alive>
    <player></player>
  </div>
</template>
<script>
  import MHeader from './components/header/index.vue'
  import Player from './components/player.vue'
  export default {
    created () {
      window.mmPlayer = window.mmplayer = '(｡･∀･)ﾉﾞ嗨, 朋友感谢你能调试代码!\n当前版本为：V' + '1.0' + '\nGithub：https://github.com/amumubuku/vue-app\n歌曲来源于网易云音乐 (http://y.qq.com)'
      console.info('%c' + window.mmPlayer, 'color:blue')
    },
    components: {MHeader, Player}
  }
</script>
<style>
 #app {
   height: 100%;
   width: 100%;
 }
 ul{
   padding: 0;
   margin: 0;
 }
 h1,h2,h3,h4,h5 {
   margin: 0;
   padding: 0;
 }
.active {
  background-color: #f8f8f9;
  border-bottom: 1px solid #e5e5e5;
}
 .slide-enter-active,.slide-leave-active {
   transition: all 0.3s;
 }
 .slide-enter,.slide-leave-to {
   transform: translate3d(100%, 0, 0)
 }
 .scroll {
   height: 100%;
 }
 .loader {
   position: relative;
   width: 2.5em;
   height: 2.5em;
   transform: rotate(165deg);
   z-index: 9999;
 }
 .loader:before, .loader:after {
   content: '';
   position: absolute;
   top: 50%;
   left: 50%;
   display: block;
   width: 0.5em;
   height: 0.5em;
   border-radius: 0.25em;
   transform: translate(-50%, -50%);
 }
 .loader:before {
   animation: before 2s infinite;
 }
 .loader:after {
   animation: after 2s infinite;
 }

 @keyframes before {
   0% {
     width: 0.5em;
     box-shadow: 1em -0.5em rgba(225, 20, 98, 0.75), -1em 0.5em rgba(111, 202, 220, 0.75);
   }
   35% {
     width: 2.5em;
     box-shadow: 0 -0.5em rgba(225, 20, 98, 0.75), 0 0.5em rgba(111, 202, 220, 0.75);
   }
   70% {
     width: 0.5em;
     box-shadow: -1em -0.5em rgba(225, 20, 98, 0.75), 1em 0.5em rgba(111, 202, 220, 0.75);
   }
   100% {
     box-shadow: 1em -0.5em rgba(225, 20, 98, 0.75), -1em 0.5em rgba(111, 202, 220, 0.75);
   }
 }
 @keyframes after {
   0% {
     height: 0.5em;
     box-shadow: 0.5em 1em rgba(61, 184, 143, 0.75), -0.5em -1em rgba(233, 169, 32, 0.75);
   }
   35% {
     height: 2.5em;
     box-shadow: 0.5em 0 rgba(61, 184, 143, 0.75), -0.5em 0 rgba(233, 169, 32, 0.75);
   }
   70% {
     height: 0.5em;
     box-shadow: 0.5em -1em rgba(61, 184, 143, 0.75), -0.5em 1em rgba(233, 169, 32, 0.75);
   }
   100% {
     box-shadow: 0.5em 1em rgba(61, 184, 143, 0.75), -0.5em -1em rgba(233, 169, 32, 0.75);
   }
 }

 html,
 body {
   height: 100%;
 }
 .loader {
   position: absolute;
   top: calc(50% - 1.25em);
   left: calc(50% - 1.25em);
 }
</style>

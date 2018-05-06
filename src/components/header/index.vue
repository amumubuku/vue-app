<template>
   <div class="header">
     <tab></tab>
   </div>
</template>
<script>
    import tab from './tab.vue'
    export default {
      components: {tab}
    }
</script>
<style lang="stylus" scoped>
  .header
    position: absolute
    width: 100%
    img
      height: 40px
  .Logo
    background-color: #31c27c
    text-align: left
  .user
    width: 40px
    height: 40px
    position: absolute
    right: 10px
    top: 6px
    font-size: 30px
    color: #fff
</style>

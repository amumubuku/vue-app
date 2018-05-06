<template>
  <div class="tab">
     <router-link tag="div" to="/recommend" class="tab-item">
       <span class="tab-link">推荐</span>
     </router-link>
    <router-link tag="div" to="/singer" class="tab-item">
      <span class="tab-link">歌手</span>
    </router-link>
    <router-link tag="div" to="/rank" class="tab-item">
      <span class="tab-link">排行</span>
    </router-link>
    <router-link tag="div" to="/search" class="tab-item">
      <span class="tab-link">搜索</span>
    </router-link>
  </div>
</template>
<script>
    export default {}
</script>
<style scoped>
 .tab {
   display: flex;
   line-height:39px;
   text-align: center;
   font-size: 14px;
   background: rgba(246,246,246,0.96)
 }
  .tab > .tab-item {
    flex: 1;
  }
  .tab-link {
    padding-bottom: 7px;
    font-size: 14px;
  }
 .router-link-active > .tab-link {
   color: #31c27c;
   border-bottom: 2px solid #31c27c;
   font-weight: 800;
   font-size: 14px;
 }
</style>

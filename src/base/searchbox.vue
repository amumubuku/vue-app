<template>
    <div class="search-input">

    </div>
</template>
<script>
    export default {
      data () {
        return {
          qurey: '',
          firstName: '',
          lastName: ''
        }
      },
      props: {
        songs: {
          type: Array,
          default: []
        }
      },
      computed: {},
      watch: {},
      methods: {},
      created () {},
      components: {}
    }
</script>
<style scoped>
  input {
    display: inline-block;
    width: 100%;
    height: 40px;
    line-height: 1.5;
    font-size: 12px;
    border: 1px solid #dddee1;
    border-radius: 8px;
    color: #495060;
    background-color: #fff;
    background-image: none;
    position: relative;
    cursor: text;
    transition: border .2s ease-in-out,background .2s ease-in-out,box-shadow .2s ease-in-out;
    outline-color: #e74c3c;
    outline-radius:8px;
  }
  .search-input{
    width: 87%;
    height: 40px;
    margin: 0 auto;
    border-radius: 10px;
    margin-top: 20px;
  }
</style>

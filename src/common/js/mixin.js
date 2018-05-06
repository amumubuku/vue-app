import {mapGetters} from 'vuex'
export const playListMixin = {
  computed: {
    ...mapGetters([
      'playlist'
    ])
  },
  mounted () {
    this.handlePlayList(this.playlist)
  },
  activated () {
    this.handlePlayList(this.playlist)
  },
  watch: {
    playlist (newVal) {
      this.handlePlayList(newVal)
    }
  },
  methods: {
    // 外部定义
    handlePlayList () {
      throw new Error('component must implement handlePlayList method')
    }
  }
}

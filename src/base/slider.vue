<template>
  <div class="slider" ref="slider"
     @touchstart.prevent="SliderTouchStart"
     @touchmove.prevent="SliderTouchMove"
     @touchend="SliderTouchEnd"
  >
    <ul class="slider-group" ref="sliderGroup">
     <slot></slot>
    </ul>
    <div class="dots">
      <span class="dot-item" v-for="(item, index) in sliderLenth" :class="[index === currentPageIndex ? 'disable' : '']"></span>
    </div>
  </div>
</template>
<script>
  import {prefixStyle} from '../common/js/dom'
  const transform = prefixStyle('transform')
  const transitionDuration = prefixStyle('transitionDuration')
  export default {
    data () {
      return {
        currentPageIndex: 2,
        sliderLenth: []
      }
    },
    mounted () {
      setTimeout(() => {
        this.data = this._initWidth()
        this._initSlider(this.data)
        this.setInterval()
      }, 20)
      window.addEventListener('resize', () => {
        this.data = this._initWidth()
        this._initSlider(this.data)
      }
      )
    },
    created () {
      this.touch = {}
    },
    activated () {
      this.currentPageIndex = 2
      this.data = this._initWidth()
      this._initSlider(this.data)
      this.setInterval()
    },
    deactivated () {
      clearInterval(this.timer)
    },
    methods: {
      SliderTouchStart (e) {
        clearInterval(this.timer)
        const touch = e.touches[0]
        this.touch.initiated = true
        this.touch.pageX = touch.pageX
        this.touch.pageY = touch.pageY
        this.first = this.currentPageIndex === 0 ? 4 : this.currentPageIndex - 1
        this.last = this.currentPageIndex === 4 ? 0 : this.currentPageIndex + 1
      },
      SliderTouchMove (e) {
        const touch = e.touches[0]
        if (!this.touch.initiated) {
          return
        }
        this.deltaX = Math.max(-this.width * 0.8, Math.min(this.width * 0.8, touch.pageX - this.touch.pageX))
        let deltaY = touch.pageY - this.touch.pageY
        this.touch.percent = Math.abs(this.deltaX / this.width)
        if (Math.abs(this.deltaX) < Math.abs(deltaY)) {
          return
        }
        this.children[this.first].style[transform] = `translate3d(${this.offsetMin + this.deltaX}px,0,0)`
        this.children[this.first].style[transitionDuration] = '0ms'
        this.children[this.first].style.zIndex = 6
        this.children[this.currentPageIndex].style[transform] = `translate3d(${this.offsetWidth + this.deltaX}px,0,0)`
        this.children[this.currentPageIndex].style[transitionDuration] = '0ms'
        this.children[this.last].style[transform] = `translate3d(${this.offsetMax + this.deltaX}px,0,0)`
        this.children[this.last].style[transitionDuration] = '0ms'
        this.children[this.last].style.zIndex = 6
      },
      SliderTouchEnd () {
        if (this.deltaX > 0 && this.touch.percent > 0.25) {
          this.data.push(this.data.shift())
          this.currentPageIndex--
          if (this.currentPageIndex < 0) {
            this.currentPageIndex = 4
          }
          this.currentPageIndex = this.currentPageIndex % 5
          this._initSlider(this.data, 1000)
          this.setInterval()
          return
        }
        if (this.deltaX < 0 && this.touch.percent > 0.25) {
          this.currentPageIndex++
          this.data.unshift(this.data.pop())
          this.currentPageIndex = this.currentPageIndex % 5
          this._initSlider(this.data, 1000)
          this.setInterval()
          return
        }
        this._initSlider(this.data, 600)
      },
      setInterval () {
        this.timer = setInterval(() => {
          this.currentPageIndex++
          this.currentPageIndex = this.currentPageIndex % 5
          this.data.unshift(this.data.pop())
          this._initSlider(this.data, 1000)
        }, 3000)
      },
      _initWidth () {
        this.width = this.$refs.slider.clientWidth
        this.height = this.$refs.sliderGroup.clientHeight
        this.Imgwidth = this.width * 0.92
        this.offsetWidth = (this.width - this.width * 0.92) / 2
        this.offsetMin = -(this.Imgwidth - this.offsetWidth + 4)
        this.offsetMax = this.width - this.offsetWidth + 4
        const data = [-this.width, this.offsetMin, this.offsetWidth, this.offsetMax, this.width]
        return data
      },
      _initSlider (data, duration) {
        const time = duration || 0
        this.children = this.$refs.sliderGroup.children
        this.sliderLenth = this.children.length
        for (var i = 0; i < this.children.length; i++) {
          this.children[i].style.position = 'absolute'
          this.children[i].style.zIndex = 0
          this.children[i].children[0].children[0].style.height = '92%'
          this.children[i].children[0].children[0].style.marginTop = `${(this.height - this.height * 0.92) / 2}px`
          this.children[i].style[transform] = `translate3d(${data[i]}px,0,0)`
          this.children[i].style[transitionDuration] = `${time}ms`
        }
        this.children[this.currentPageIndex].style.zIndex = 100
        this.children[this.currentPageIndex].children[0].children[0].style.height = '100%'
        this.children[this.currentPageIndex].children[0].children[0].style.marginTop = 0
      }
    }
  }
</script>
<style scoped lang="stylus">
  .dots
     text-align center
     position absolute
     width 100%
     height 20px
     z-index 3114
     bottom 6px
    .dot-item
       display inline-block
       width 8px
       height 8px
       border-radius 50%
       background-color #187361
       margin 0 4px
  .disable
    width 18px
    border-radius 18px
    background-color #fff
  .slider-group
    display: flex
    width: 100%
    position absolute
    align-items center
    height 100%
    list-style none
    top 0
    .slider-item
      width: 100%
      height:98%
      top: 0
      left: 0
      img
        border-radius: 6px
        width: 92%
        height 92%

</style>

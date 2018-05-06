<template>
    <div class="progress-wrapper" ref="progressBar" @click="PlayChange">
      <div class="progress-inner" ref="progress">
      </div>
      <div class="progress-btn" ref="progressBtn"
          @touchstart.prevent="progressTouchStart"
          @touchmove.prevent="progressTouchMove"
          @touchend.prevent="progressTouchEnd"
      ></div>
    </div>
</template>
<script>
    import {prefixStyle} from '../common/js/dom'
    const transform = prefixStyle('transform')
    const progressBtnWidth = 16
    export default {
      props: {
        percent: {
          type: Number,
          defalut: 0
        }
      },
      created () {
        this.touch = {}
      },
      methods: {
        // 进度条拖动效果
        progressTouchStart (e) {
          this.touch.initiated = true
          this.touch.startX = e.touches[0].pageX
          this.touch.left = this.$refs.progress.clientWidth
        },
        progressTouchMove (e) {
          const deltaX = e.touches[0].pageX - this.touch.startX
          const offwidth = Math.min(Math.max(0, deltaX + this.touch.left), this.$refs.progressBar.clientWidth - progressBtnWidth)
          this._offset(offwidth)
        },
        progressTouchEnd () {
          this.touch.initiated = false
          this._triggerPercent()
        },
        _triggerPercent () {
          const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
          const percent = this.$refs.progress.clientWidth / barWidth
          this.$emit('percentChange', percent)
        },
        _offset (offsetWidth) {
          this.$refs.progressBtn.style[transform] = `translate3d(${offsetWidth}px,0,0)`
          this.$refs.progress.style.width = `${offsetWidth}px`
        },
        PlayChange (e) {
          let offleft = e.clientX - (document.body.clientWidth - (this.$refs.progressBar.clientWidth - progressBtnWidth)) / 2
          this._offset(offleft)
          this._triggerPercent()
        }
      },
      watch: {
        percent (newVal) {
          if (newVal >= 0 && !this.touch.initiated) {
            const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
            const offsetWidth = newVal * barWidth
            this._offset(offsetWidth)
          }
        }
      }
    }
</script>
<style>
  .progress-bar .progress-wrapper {
    flex: 1;
    background-color: black;
    height: 3px;
    opacity: .6;
    margin:  0 5px;
    position: relative;
  }
  .progress-inner {
     height: 100%;
     background-color: #FF0000;
  }
  .progress-btn {
    width: 16px;
    height: 16px;
    position: absolute;
    top: -6px;
    border-radius: 50%;
    background-color: #fff;
    box-sizing: border-box;
    border: 3px solid #FF0000;
    border-radius: 50%;
    opacity: 1;
  }
</style>

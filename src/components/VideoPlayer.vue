<template>
  <div class="video-player">
    <video ref="videoPlayer" class="video-js" :width="200" :height="200"></video>
  </div>
</template>

<script setup>
import videojs from 'video.js'
import { onMounted, ref, onUnmounted, nextTick } from 'vue'

let player = ref(null)

const videoPlayer = ref(null)

const props = defineProps({
  options: {
    type: Object,
    default: () => {},
  }
})

onMounted(() => {
  nextTick(() => {
    player = videojs(videoPlayer.value, props.options, () => {
      player.log('onPlayerReady')
    })
  })
})

onUnmounted(() => {
  if (player) {
    player.dispose()
  }
})
</script>

<style lang="less" scoped>
.video-player {
  // width: 100%;
  // height: 200px;
  .video-js {
    :deep(.vjs-tech) {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
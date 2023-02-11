<script setup>
import { onMounted, ref, nextTick } from 'vue'
import Viewer from 'viewerjs'
import VideoPlayer from './components/VideoPlayer.vue'
import { Waterfall } from 'vue-waterfall-plugin-next'

let imageList = ref([])

const videoOptions = ref({
  autoplay: false,
  controls: true,
  loadingSpinner: false,
  errorDisplay: false,
  textTrackSettings: false,
  bigPlayButton: true,
  controlBar: false,
})

onMounted(() => {
  window.fetch('/getImages')
    .then(function(response) {
      return response.json()
    }).then((json) => {
      console.log('fetch json', json)
      imageList.value = json
      nextTick(() => {
        initView()
      })
    }).catch((error) => {
      console.log('fetch failed', error)
    })
})

const initView = () => {
  const viewer = new Viewer(document.getElementById('images'), {
    button: true,
    viewed() {
      viewer.zoomTo(1)
    },
  })
}

const handleOpenPdf = (url) => {
  window.open(url)
}
</script>

<template>
  <div id="images" class="platform-content">
    <!-- <div v-for="item in imageList" :key="item">
      <img :src="`/current/${item}`" alt="" />
    </div> -->
    <Waterfall :list="imageList" :width="200" :gutter="20">
      <template #item="{ item }">
        <div class="item" v-if="item.indexOf('.pdf') > -1" @click="handleOpenPdf(`/current/${item}`)">
          <span class="pdf">PDF</span>
        </div>
        <div class="item" v-else-if="item.indexOf('.mp4') > -1">
          <video-player :options="{ ...videoOptions, sources: [{ src: `/current/${item}`, type: 'video/mp4' }] }" />
        </div>
        <div class="item" v-else>
          <img :src="`/current/${item}`" :alt="item" :title="`\/${item}`" />
        </div>
      </template>
    </Waterfall>
  </div>
</template>

<style lang="less" scoped>
.platform-content {
  .item {
    width: 100%;
    height: 200px;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    z-index: 999;
    background-color: black;
    img {
      width: 100%;
      height: 100%;
      object-fit: scale-down;
    }
    .pdf {
      color: white;
      font-size: 32px;
    }
  }
  :deep(.waterfall-item) {
    z-index: 999;
  }
  :deep(.waterfall-card) {
    z-index: 999;
  }
  :deep(.vjs-big-play-button) {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>

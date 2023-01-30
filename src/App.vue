<script setup>
import { onMounted, ref, nextTick } from 'vue'
import Viewer from 'viewerjs'
import VideoPlayer from './components/VideoPlayer.vue'
import { Waterfall } from 'vue-waterfall-plugin-next'

let imageList = ref([])

const videoOptions = ref({
  autoplay: true,
  controls: true,
  height: 200,
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
</script>

<template>
  <div id="images" class="platform-content">
    <!-- <div v-for="item in imageList" :key="item">
      <img :src="`/current/${item}`" alt="" />
    </div> -->
    <Waterfall :list="imageList" :width="200" :gutter="20">
      <template #item="{ item }">
        <div class="item" v-if="item.indexOf('.mp4') < 0">
          <img :src="`/current/${item}`" :alt="item" :title="`\/${item}`" />
        </div>
        <div class="item" v-else>
          <video-player :options="{ ...videoOptions, sources: [{ src: `/current/${item}`, type: 'video/mp4'}] }" />
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
    background-color: black;
    img {
      width: 100%;
      height: 100%;
      object-fit: scale-down;
    }
  }
}
</style>

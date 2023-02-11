<script setup>
import { onMounted, ref, nextTick } from 'vue'
import Viewer from 'viewerjs'
import VideoPlayer from './components/VideoPlayer.vue'
import { Waterfall } from 'vue-waterfall-plugin-next'

let imageList = ref([])

let showList = ref([])

const types = ref('全部')

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
      showList.value = json
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

const onRadioChange = (value) => {
  console.log(value)
  if (value ===  '全部') {
    showList.value = imageList.value
  } else {
    showList.value = imageList.value.filter(item => item.indexOf(`.${value}`) > -1)
  }
}
</script>

<template>
  <div id="images" class="platform-content">
    <!-- <div v-for="item in imageList" :key="item">
      <img :src="`/current/${item}`" alt="" />
    </div> -->
    <div class="platform-btn">
      <el-radio-group v-model="types" @change="onRadioChange">
      <el-radio-button label="全部" />
      <el-radio-button label="png" />
      <el-radio-button label="svg" />
      <el-radio-button label="jpg" />
      <el-radio-button label="jpeg" />
      <el-radio-button label="webp" />
      <el-radio-button label="gif" />
      <el-radio-button label="apng" />
      <el-radio-button label="mp4" />
      <el-radio-button label="pdf" />
      <el-radio-button label="xmind" />
    </el-radio-group>
    </div>
    <Waterfall :list="showList" :width="200" :gutter="20">
      <template #item="{ item }">
        <div class="item" v-if="item.indexOf('.pdf') > -1" @click="handleOpenPdf(`/current/${item}`)">
          <span class="pdf">{{ item.slice(item.lastIndexOf('/') + 1) }}</span>
        </div>
        <div class="item" v-else-if="item.indexOf('.xmind') > -1">
          <span class="xmind">{{ item.slice(item.lastIndexOf('/') + 1) }}</span>
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
  .platform-btn {
    width: 100%;
    height: 50px;
    display: flex;
    justify-content: center;
  }
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
      font-size: 18px;
    }
    .xmind {
      color: white;
      font-size: 18px;
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

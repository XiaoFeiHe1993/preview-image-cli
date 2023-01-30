<script setup>
import { onMounted, ref, nextTick } from 'vue'
import Viewer from 'viewerjs'
import { Waterfall } from 'vue-waterfall-plugin-next'

let imageList = ref([])

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
        <div class="item">
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
    background-color: black;
    img {
      width: 100%;
      height: 100%;
      object-fit: scale-down;
    }
  }
}
</style>

<script setup>
import { onMounted, ref } from 'vue'
import Viewer from 'viewerjs'

let imageList = ref([])

onMounted(() => {
  window.fetch('/getImages')
    .then(function(response) {
      return response.json()
    }).then((json) => {
      console.log('fetch json', json)
      imageList.value = json
      setTimeout(() => {
        initView()
      }, 3000)
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
  <div id="images">
    <div v-for="item in imageList" :key="item">
      <img :src="`http://localhost:7001/current/${item}`" alt="" />
    </div>
  </div>  
</template>

<style lang="less" scoped>
.platform-content {
  height: 100%;
  display: flex;
  flex-direction: column;
  &-bottom {
    width: 100%;
    height: calc(100% - 61px);
    display: flex;
  }
}
</style>

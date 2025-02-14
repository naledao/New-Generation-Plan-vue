<script setup>
import {ref} from "vue";
import router from "@/router/index.js";
const active=ref('/look')
const onChangeView=(value)=>{
  router.push(value)
}
</script>

<template>
  <RouterView></RouterView>
  <van-tabbar v-model="active" @change="onChangeView">
    <van-tabbar-item icon="browsing-history-o" name='/look'>查看</van-tabbar-item>
    <van-tabbar-item icon="add-o" name='/add'>添加</van-tabbar-item>
    <van-tabbar-item icon="back-top" name="/renew">更新</van-tabbar-item>
  </van-tabbar>
</template>

<style scoped>

</style>

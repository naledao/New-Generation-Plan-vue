<script setup>
import {onMounted, ref} from "vue";
import {getAllTimes, getAnimeByQuarterAndWeek, search} from "@/api/api.js";
import {tomd5} from "@/utils/md5.js";
import {showLoadingToast, showToast} from "vant";
import AnimeMsgComponent from "@/components/AnimeMsgComponent.vue";
const timesValue = ref('本季番');
const times = ref([
  // { text: '本季番', value: '本季番' }
]);
const msgList=ref([])
const changeTime=async ()=>{
  const load=showLoadingToast({
    message: '加载中...',
    forbidClick: true,
  })
  let currentTimes = Date.now()
  const res=await getAnimeByQuarterAndWeek(timesValue.value,weeksValue.value,currentTimes,await tomd5(currentTimes))
  msgList.value=[]
  await sleep(1200)
  msgList.value=res.data
  load.close()
}
const changeWeek=async ()=>{
  const load=showLoadingToast({
    message: '加载中...',
    forbidClick: true,
  })
  let currentTimes = Date.now()
  const res=await getAnimeByQuarterAndWeek(timesValue.value,weeksValue.value,currentTimes,await tomd5(currentTimes))
  msgList.value=[]
  await sleep(1200)
  msgList.value=res.data
  load.close()
}
const weeks = [
  { text: '全部', value: '全部' },
  { text: '周一', value: '星期一' },
  { text: '周二', value: '星期二' },
  { text: '周三', value: '星期三' },
  { text: '周四', value: '星期四' },
  { text: '周五', value: '星期五' },
  { text: '周六', value: '星期六' },
  { text: '周日', value: '星期日' },
  { text: '剧场版动画', value: '剧场版动画' },
  { text: '特殊放送番', value: '特殊放送番' },
];
const weeksValue = ref('全部');
onMounted(async ()=>{
  const load=showLoadingToast({
    message: '加载中...',
    forbidClick: true,
  })
  let currentTimes = Date.now()
  const res=await getAllTimes(currentTimes+'',await tomd5(currentTimes))
  if(res.data.length>0){
    timesValue.value=res.data[0]
  }
  for(let index=0;index<res.data.length;index++){
    times.value.push({
      text:res.data[index],
      value:res.data[index],
    })
  }
  await changeTime()
  load.close()
})
const Function=[
  {text:'请选择功能',value:0},
  {text:'搜索',value:1}
]
const souValue=ref(0)
const showBottom=ref(false)
const work=()=>{
  if(souValue.value===1){
    showBottom.value=true
  }
}
const searchvalue=ref('')
const onSearch=async ()=>{
  const load=showLoadingToast({
    message: '加载中...',
    forbidClick: true,
  })
  if(searchvalue.value===null || searchvalue.value===''){
    showToast('情输入搜索内容')
    return
  }
  const res=await search(searchvalue.value)
  showBottom.value=false
  msgList.value=[]
  for(let index=0;index<res.data.length;index++){
    await sleep(300)
    msgList.value.push(res.data[index])
  }
  load.close()
}
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
const updateDec=(object,index)=>{
  msgList.value[index]=object
}
</script>

<template>
  <van-popup v-model:show="showBottom" position="top" :style="{ height: '60%' }" closeable close-icon-position="bottom-right"	:close-on-click-overlay="false"	>
    <van-search
        v-model="searchvalue"
        show-action
        placeholder="请输入动漫名称"
    >
      <template #action>
        <div @click="onSearch">点击搜索</div>
      </template>
    </van-search>

  </van-popup>
  <van-sticky>
    <van-dropdown-menu>
      <van-dropdown-item v-model="timesValue" :options="times" @change="changeTime"/>
      <van-dropdown-item v-model="weeksValue" :options="weeks" @change="changeWeek"/>
      <van-dropdown-item v-model="souValue" :options="Function" @click="work"/>
    </van-dropdown-menu>
  </van-sticky>
  <van-empty image="search" description="暂无相关动漫信息" v-if="msgList.length===0"/>
  <AnimeMsgComponent v-else v-for="(item,index) in msgList" :key=index
                     :pic="item.pic" :msg="item.msg" :subject-id="item.subjectId"
                     :name="item.name" :rating="(Number(item.rate)/2)" :dec="item.dec"
                     :id="item.id" :quarter="item.quarter" :week="item.week"
                     @updateDec="updateDec" :index="index" :is-hand="item.isHand"

  >
  </AnimeMsgComponent>
  <div style="margin-top: 38px"></div>
</template>

<style scoped>

</style>
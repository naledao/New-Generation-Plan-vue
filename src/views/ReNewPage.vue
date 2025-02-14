<script setup>
import {onMounted, ref} from "vue";
import {
  getAllHistory,
  getAnimePicAndDec,
  getDec,
  getdouban,
  getdoubandec,
  getMonthlyAnime,
  updateMsg
} from "@/api/api.js";
import {formatDate} from "../utils/timeFormat.js";
import {showLoadingToast, showToast} from "vant";
import CardComponent from "@/components/CardComponent.vue";
import SumNationComponent from "@/components/SumNationComponent.vue";
const html=ref('')
const douban=ref()
const doubanHtml=ref('')
const month=ref(7)
const map=ref(new Map())
map.value.set('星期一',[])
map.value.set('星期二' ,[])
map.value.set('星期三',[])
map.value.set('星期四',[])
map.value.set('星期五',[])
map.value.set('星期六',[])
map.value.set('星期日',[])
map.value.set('剧场版动画',[])
map.value.set('特殊放送番',[])
const dom=ref()
const timesValue = ref('/addon.php?r=bangumi/table');
const weeksValue = ref('全部');
const times = ref([
  { text: '本季番', value: '/addon.php?r=bangumi/table' }
]);
const curji=new Set()
curji.add(1)
curji.add(4)
curji.add(7)
curji.add(10)
const timesMap=ref(new Map())
const getQuarter=(url)=>{
  if(url==='/addon.php?r=bangumi/table'){
    let currentDate = new Date();
    let curmonth = currentDate.getMonth()
    let curyear=currentDate.getFullYear()
    for(let i=curmonth+1;i>=1;i--){
      if(curji.has(i)){
        let m=i
        if(i!==10){
          m='0'+i
        }
        return `${curyear}年${m}月`
      }
    }
  }
  else{
    return timesMap.value.get(url).substring(0,8)
  }
}
const weeks = [
  { text: '全部', value: '全部' },
  // { text: '周一', value: '星期一' },
  // { text: '周二', value: '星期二' },
  // { text: '周三', value: '星期三' },
  // { text: '周四', value: '星期四' },
  // { text: '周五', value: '星期五' },
  // { text: '周六', value: '星期六' },
  // { text: '剧场版动画', value: '剧场版动画' },
  // { text: '特殊放送番', value: '特殊放送番' },
];
const getBasicAnime=async (url)=> {
  const data = await getMonthlyAnime(url)
  html.value = data.data
  if (dom.value) {
    //进行人机验证
    const element1 = await dom.value.getElementsByClassName('box clear bgm-wrap')
    const element6 = element1[0].childNodes[3].childNodes
    for (let index = 0; index < element6.length; index++) {
      if (index % 2 !== 0) {
        const childNodes = element6.item(index).childNodes;
        let startindex = 0
        let endindex = childNodes.length
        let day = childNodes.item(1).textContent.trim().substring(0, 3);
        if (day === '剧场版') {
          day = '剧场版动画'
          startindex = 0
          endindex = childNodes.length
        }
        else if (day === '特殊放') {
          day = '特殊放送番'
          startindex = 0
          endindex = childNodes.length
        }
        else {
          for (let index2 = 0; index2 < childNodes.length; index2++) {
            if (childNodes.item(index2).nodeName === 'DD' && childNodes.item(index2).textContent.trim() !== '') {
              if (childNodes.item(index2).textContent.trim() === month.value + '月新番→') {
                startindex = index2 + 1
              } else if (childNodes.item(index2).textContent.trim() === '←' + month.value + '月新番') {
                endindex = index2
                break
              }
            }
          }
        }
        for (let index2 = startindex; index2 < endindex; index2++) {
          // await sleep(4000)
          if (day === '剧场版动画') {
            if (childNodes.item(index2).nodeName === 'DD' && childNodes.item(index2).textContent.trim() !== '' && childNodes.item(index2).textContent.trim() !== '已配信→' && childNodes.item(index2).textContent.trim() !== '即将配信→') {
              const animeName = childNodes.item(index2).textContent.trim()
              const msg = childNodes.item(index2).childNodes.item(1).getAttribute('data-balloon').trim()
              let arr=map.value.has(day)?map.value.get(day):[]
              arr.push({name:animeName,msg:msg,pic:'',dec:'',rate:'',week:day,subjectId:'-1'})
              map.value.set(day,arr)
            }
          }
          else if (day === '特殊放送番') {
            if (childNodes.item(index2).nodeName === 'DD') {
              const animeName = childNodes.item(index2).textContent.trim()
              const msg = childNodes.item(index2).childNodes.item(1).getAttribute('data-balloon').trim()
              let arr=map.value.has(day)?map.value.get(day):[]
              arr.push({name:animeName,msg:msg,pic:'',dec:'',rate:'',week:day,subjectId:'-1'})
              map.value.set(day,arr)
            }
          }
          else {
            if (childNodes.item(index2).nodeName === 'DD' && childNodes.item(index2).textContent.trim() !== '') {
              const animeName = childNodes.item(index2).textContent.trim()
              const msg = childNodes.item(index2).childNodes.item(1).getAttribute('data-balloon');
              let arr=map.value.has(day)?map.value.get(day):[]
              arr.push({name:animeName,msg:msg,pic:'',dec:'',rate:'',week:day,subjectId:'-1'})
              map.value.set(day,arr)
            }
          }
        }
      }
    }
  }
}
// eslint-disable-next-line no-unused-vars
const getPicAndDec=async (name)=>{
  const data=await getAnimePicAndDec(name)
  doubanHtml.value=data.data
  if(douban.value){
    const element1 = await douban.value.getElementsByClassName('img')
    const ul=element1.item(0).childNodes.item(1)
    if(ul.childNodes.length===1){
      return {
        'pic':'https://images.wallpaperscraft.com/image/single/penguin_street_wall_1268495_240x320.jpg',
        'dec':'暂无剧情介绍'
      }
    }
    const a=ul.childNodes.item(1).childNodes.item(0)
    let pic=a.childNodes.item(0).src
    if(pic.startsWith("http://")){
      let urlObj = new URL(pic)
      pic='https://aiqidm1.com'+urlObj.pathname
    }
    const res=await getDec(a.href)
    Dechtml.value=res.data
    if(Dec.value){
      const childNodes7 = await Dec.value.childNodes
      const childNodes8 = await childNodes7.item(35)
      const childNodes9 = await childNodes8.childNodes.item(1)
      const childNodes10 = await childNodes9.childNodes.item(9)
      const childNodes11 = await childNodes10.childNodes.item(1)
      const childNodes12 = await childNodes11.childNodes.item(3)
      const childNodes13 = await childNodes12.childNodes.item(3)
      const dec=childNodes13.childNodes.item(1).textContent.trim()
      return {'pic':pic,'dec':dec}
    }
  }
}
const getAllTimes=async ()=> {
  const data = await getMonthlyAnime('/addon.php?r=bangumi/table')
  html.value = data.data
  if (dom.value) {
    let elementById = await dom.value.getElementsByTagName('form')
    let nexturl=elementById[0].action.substring(21).trim()
    const data2 = await getMonthlyAnime(nexturl)
    robotTestHtml.value=data2.data
    elementById=await robotTest.value.getElementsByTagName('form')
    elementById[0].submit()
    const be=await dom.value.getElementsByClassName('module')
    for(let index=2;index<be[1].childNodes.length;index++){
      if(be[1].childNodes.item(index).nodeName==='LI'){
        times.value.push({
          text:be[1].childNodes.item(index).childNodes.item(1).textContent.trim(),
          value:'/'+be[1].childNodes.item(index).childNodes.item(1).getAttribute('href')
        })
        timesMap.value.set('/'+be[1].childNodes.item(index).childNodes.item(1).getAttribute('href'),be[1].childNodes.item(index).childNodes.item(1).textContent.trim())
      }
    }
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

onMounted(async ()=>{
  // await getBasicAnime()
  // const data=await getPicAndDec('无职转生')
  // console.log(data)
  loading.value=true
  await getAllTimes("/addon.php?r=bangumi/table")
  const res=await getAllHistory(getQuarter('/addon.php?r=bangumi/table'))
  his.value=res.data
  loading.value=false
  document.onselectstart = function(){
    return false
  }

})
const Dechtml=ref('')
const Dec=ref()
const his=ref([])
const loading=ref(false)
const changeTime=async (value)=>{
  // const data=await getPicAndDec2('异世界失格')
  // console.log(data.dec)
  loading.value=true
  const res=await getAllHistory(getQuarter(value))
  his.value=res.data
  timesValue.value=value
  loading.value=false
}
const showBottom=ref(false)
const tempor1=ref({
  name:'',
  pic:'',
})
const total=ref(0)
const curnum=ref(0)
const renew=async ()=>{
  map.value.clear()
  total.value=0
  out:for(let i=0;i<times.value.length;i++){
    if(times.value[i].value===timesValue.value){
      if(timesValue.value==='/addon.php?r=bangumi/table'){
        let currentDate = new Date();
        let curmonth = currentDate.getMonth();
        for(let i=curmonth+1;i>=1;i--){
          if(curji.has(i)){
            month.value=i;
            break out;
          }
        }
      }
      else{
        month.value=times.value[i].text.substring(5,7)
        if(month.value.startsWith('0')){
          month.value=month.value.substring(1,2)
        }
        break
      }
    }
  }
  const load=showLoadingToast({
    message: '加载中...',
    forbidClick: true,
  });
  await getBasicAnime(timesValue.value)
  // eslint-disable-next-line no-unused-vars
  for (let [key, value] of map.value) {
    // if(timesValue.value==='/addon.php?r=bangumi/table'){
    //   console.log(value)
    // }
    total.value=total.value+value.length
  }
  curnum.value=0
  showBottom.value=true
  load.close()
}
const bthload=ref(false)
const confirmRenew=async ()=>{
  if(curnum.value===total.value){
    showToast('更新完成')
    return
  }
  curnum.value=0
  bthload.value=true
  // eslint-disable-next-line no-unused-vars
  for (let [key, value] of map.value) {
    for(let i=0;i<value.length;i++){
      const res=await getPicAndDec2(value[i].name)
      value[i].pic=res.pic
      value[i].dec=res.dec
      value[i].rate=res.rate
      value[i].subjectId=res.id
      const res2=await updateMsg(value[i],curnum.value+1,total.value,getQuarter(timesValue.value))
      if(res2.data===0){
        bthload.value=false
        tempor1.value.name=''
        tempor1.value.pic=''
        curnum.value=0
        return
      }
      curnum.value=curnum.value+1
      tempor1.value.name=value[i].name
      tempor1.value.pic=res.pic
      await sleep(3000)
    }
  }
  bthload.value=false
}
const closePop=async ()=>{
  bthload.value=false
  await changeTime(timesValue.value)
}
const douban2html=ref('')
const douban2=ref()
const curdou=ref({})
const getPicAndDec2=async (name)=>{
  const res=await getdouban(name)
  douban2html.value=res.data
  if(douban2.value){
    const el1=await douban2.value.getElementsByTagName('script')
    const text=el1.item(6).text.trim()
    curdou.value=JSON.parse(text.substring(18,text.length-29)).items[0]
    let pic='https://images.wallpaperscraft.com/image/single/penguin_street_wall_1268495_240x320.jpg'
    let rate='0'
    let dec='暂无介绍'
    let id='-1'
    if(curdou.value){
      if('cover_url' in curdou.value){
        pic=curdou.value.cover_url
      }
      id=curdou.value.id
      if('rating' in curdou.value){
        rate=curdou.value.rating.value
      }
      const res2=await getdoubandec(id)
      dec=res2.data
    }
    return {
      pic:pic,
      rate:rate,
      dec:dec,
      id:id
    }
  }
}
const robotTestHtml=ref('')
const robotTest=ref()
</script>

<template>
  <div v-html="html" ref="dom" style="display: none"></div>
  <div v-html="doubanHtml" ref="douban" style="display: none"></div>
  <div v-html="Dechtml" ref="Dec" style="display: none"></div>
  <div v-html="douban2html" ref="douban2" style="display: none"></div>
  <div v-html="robotTestHtml" ref="robotTest" style="display: none"></div>
  <van-popup
      class="three"
      v-model:show="showBottom"
      position="bottom"
      :style="{ height: '100%' }"
      closeable
      @close="closePop">
    <van-empty image="search" description="本季度暂无动漫" v-if="map.size===0"/>
    <div v-else  class="four">
      <CardComponent :name="tempor1.name" :image-src="tempor1.pic"/>
      <SumNationComponent :total-pages="total" :current-page="curnum" style="margin-top: 12px"></SumNationComponent>
      <div style="margin-top: 3px;font-size: 12px;color: #aaaaaa">已完成</div>
      <van-progress :percentage="Math.ceil(((curnum))*((100/total)))" style="margin-top: 16px;width: 96%;"/>
    </div>
    <van-button type="primary" square class="footer" :loading="bthload" loading-text="更新中..." @click="confirmRenew" :disabled="bthload">{{curnum===total?'更新完成':'确定'}}</van-button>
  </van-popup>
  <div>
    <van-dropdown-menu>
      <van-dropdown-item v-model="timesValue" :options="times" @change="changeTime"/>
      <van-dropdown-item v-model="weeksValue" :options="weeks"/>
    </van-dropdown-menu>
    <van-loading v-if="loading===true" class="two"/>
    <div v-else>
      <van-empty image="search" description="更新记录为空" v-if="his.length===0"/>
      <div v-else class="one">
        <div class="stripe" v-for="(item,index) in his" :key="index">{{formatDate(item.updateTime)}}</div>
        <div style="margin-top: 6px"></div>
      </div>
    </div>
      <van-button type="primary" block square class="footer" @click="renew">点击更新</van-button>
  </div>
</template>

<style scoped>
.four{
  margin-top: 120px;
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
}
.three{
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  align-items: center;
}
.two{
  display: flex;
  width:100%;
  flex-direction: row ;
  justify-content: center;
  height: calc(100vh - 200px);
  align-items: center;
}
.one{
  display: flex;
  flex-direction: column;
  height: 680px;
  align-items: center;
  overflow: auto;
}
.footer {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  text-align: center;
  padding: 10px;
  margin-bottom: 60px ;
}
.stripe {
  width: 300px;
  height: 30px;
  background: linear-gradient(145deg, #f0f0f0, #cacaca);
  border-radius: 10px;
  box-shadow: 5px 5px 10px #aaaaaa, -5px -5px 10px #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: #333;
  margin-top: 12px;
}
</style>

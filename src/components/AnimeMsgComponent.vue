<script setup>
import {showImagePreview, showLoadingToast, showToast} from "vant";
import {ref} from "vue";
import {edit, getAllTimes} from "@/api/api.js";
import {tomd5} from "@/utils/md5.js";

const props=defineProps({
  isHand:{
    type:Number,
    required:true
  },
  index:{
    type:Number,
    required:true
  },
  week:{
    type:String,
    required:true
  },
  quarter:{
    type:String,
    required:true
  },
  id:{
    type:Number,
    required:true
  },
  pic:{
    type:String,
    default:'https://images.wallpaperscraft.com/image/single/penguin_street_wall_1268495_240x320.jpg'
  },
  msg:{
    type:String,
    default:'暂无相关信息'
  },
  subjectId:{
    type:String,
    default:'-1'
  },
  name:{
    type:String,
    default:'未知动漫'
  },
  rating:{
    type:Number,
    default:0
  },
  dec:{
    type:String,
    default:'暂无剧情介绍'
  },
})
const animeHand=ref(props.isHand !== 0)
const id=ref(props.id)
const animeName=ref(props.name)
const animePic=ref(props.pic)
const animeMsg=ref(props.msg)
const animeDec=ref(props.dec)
const animeRating=ref(props.rating*2)
const animeSubjectId=ref(props.subjectId)
const showTop=ref(false)
const doubleClick=()=>{
  showTop.value=true
}
const onSubmit=async ()=>{
  const load=showLoadingToast({
    message:'修改中...',
    forbidClick:true
  })
  const anime={
    id:id.value,
    name:animeName.value,
    pic:animePic.value,
    msg:animeMsg.value,
    dec:animeDec.value,
    isDel:isdel.value===false?0:1,
    quarter:animeQuarter.value,
    week:animeWeek.value,
    rate:animeRating.value,
    subjectId:animeSubjectId.value,
    isHand:animeHand.value===false?0:1
  }
  const chuan={
    name:animeName.value,
    pic:animePic.value,
    msg:animeMsg.value,
    dec:animeDec.value,
    rate:animeRating.value,
  }
  const res=await edit(anime)
  if(res.data===1){
    showToast('修改成功')
    props.rating=anime.rate
    props.msg=anime.msg
    props.subjectId=anime.subjectId
    props.name=anime.name
    props.pic=anime.pic
    props.dec=anime.dec
    emit('updateDec', chuan,props.index)
    showTop.value=false
  }
  else {
    showToast('修改失败')
  }
  load.close()
}
const isdel=ref(false)
const animeQuarter=ref(props.quarter)
const showPicker=ref(false)
const column=ref([])
const getQuarter=async ()=>{
  const load=showLoadingToast({
    message:'加载中',
    forbidClick:true
  })
  let cur=Date.now()
  const res=await getAllTimes(cur,await tomd5(cur))
  column.value=[]
  for(let index=0;index<res.data.length;index++){
    column.value.push({
      text:res.data[index],
      value:res.data[index]
    })
  }
  showPicker.value=true
  load.close()
}
const onConfirm=(value)=>{
  animeQuarter.value=value.selectedValues[0]
  showPicker.value=false
}
const animeWeek=ref(props.week)
const showweek=ref(false)
const weeks=[
  { text: '周一', value: '星期一' },
  { text: '周二', value: '星期二' },
  { text: '周三', value: '星期三' },
  { text: '周四', value: '星期四' },
  { text: '周五', value: '星期五' },
  { text: '周六', value: '星期六' },
  { text: '周日', value: '星期日' },
  { text: '剧场版动画', value: '剧场版动画' },
  { text: '特殊放送番', value: '特殊放送番' },
]
const Confirmweek=(value)=>{
  animeWeek.value=value.selectedValues[0]
  showweek.value=false
}
const showPic=()=>{
  showRight.value=true
  let cv=props.pic
  image.value=cv.replace('s_ratio_poster','1')
  console.log(image.value)
}
const image=ref('')
const showRight=ref(false)
const ms=ref('no-referrer')
const emit=defineEmits(['updateDec'])
const pasteToAndroid=()=>{
  Android.paste(props.name)
}
const toDouban=()=>{
  Android.toDouBan(props.subjectId)
}
</script>

<template>
  <van-popup v-model:show="showRight" position="right" :style="{ height: '100%' ,width:'100%'}" closeable close-icon-position="bottom-right  " >
    <van-image
        width="100%"
        height="69%"
        fit="fill"
        :src="image"
        :referrerpolicy="ms"
        style="margin-top: 120px"
    >
      <template v-slot:loading>
        <van-loading type="spinner" size="20" />
      </template>
    </van-image>
  </van-popup>
  <van-popup v-model:show="showTop" position="top" :style="{ height: '100%' }" closeable close-icon-position="bottom-right  ">
    <van-form @submit="onSubmit">
      <van-cell-group inset>
        <van-field
            v-model="animeName"
            name="名称"
            label="名称"
            placeholder="请输入名称"
            :rules="[{ required: true, message: '请填写名称' }]"
        />
        <van-field
            v-model="animePic"
            name="封面"
            label="封面"
            placeholder="请输入封面"
            :rules="[{ required: true, message: '请填写封面' }]"
        />
        <van-field
            v-model="animeMsg"
            name="相关信息"
            label="相关信息"
            placeholder="请输入相关信息"
            :rules="[{ required: true, message: '请填写相关信息' }]"
        />
        <van-field
            v-model="animeDec"
            name="简介"
            label="简介"
            placeholder="请输入简介"
            :rules="[{ required: true, message: '请填写简介' }]"
        />
        <van-field name="switch" label="是否删除">
          <template #input>
            <van-switch v-model="isdel" />
          </template>
        </van-field>
        <van-field name="switch" label="是否手动更新">
          <template #input>
            <van-switch v-model="animeHand" />
          </template>
        </van-field>
        <van-field
            v-model="animeQuarter"
            is-link
            readonly
            name="picker"
            label="季度"
            placeholder="点击选择季度"
            @click="getQuarter"
        />
        <van-popup v-model:show="showPicker" position="bottom">
          <van-picker
              :columns="column"
              @confirm="onConfirm"
              @cancel="showPicker = false"
          />
        </van-popup>
        <van-field
            v-model="animeWeek"
            is-link
            readonly
            name="picker"
            label="播出频段"
            placeholder="点击选择频段"
            @click="showweek = true"
        />
        <van-popup v-model:show="showweek" position="bottom">
          <van-picker
              :columns="weeks"
              @confirm="Confirmweek"
              @cancel="showweek = false"
          />
        </van-popup>
        <van-field
            v-model="animeRating"
            name="评分"
            label="评分"
            placeholder="请输入评分"
            :rules="[{ required: true, message: '请填写评分' }]"
        />
        <van-field
            v-model="animeSubjectId"
            name="豆瓣ID"
            label="豆瓣ID"
            placeholder="请输入豆瓣ID"
            :rules="[{ required: true, message: '请填写豆瓣ID' }]"
        />
      </van-cell-group>
      <div style="margin: 16px;">
        <van-button round block type="primary" native-type="submit">
          提交
        </van-button>
      </div>
    </van-form>

  </van-popup>
  <div class="movie-card"   @dblclick="doubleClick">
    <div class="poster-section">
      <img class="poster1" :src="pic" alt="封面" referrerpolicy="no-referrer" onerror="pic='https://images.wallpaperscraft.com/image/single/penguin_street_wall_1268495_240x320.jpg'" @click="showPic"/>
      <div class="poster2">
        <div class="text">
          {{(msg===''||msg===null)?'暂无相关信息':msg}}
        </div>
        <div class="buttons">
          <button class="button" @click="pasteToAndroid">复制番剧名称</button>
          <button class="button" style="margin-left: 12px" @click="toDouban">跳转至豆瓣</button>
        </div>
      </div>
    </div>
    <div>
      <h1 class="title">{{name}}</h1>
      <div class="one">
        <van-rate
            readonly
            allow-half
            v-model="props.rating"
            :size="25"
            color="#ffd21e"
            void-icon="star"
            void-color="#eee"
        />
        <span class="stars">{{rating===0?'暂无评分':rating*2}}</span>
      </div>
      <div class="summary">
        <p>
          {{(dec==='' || dec===null)?'暂无简介':dec}}
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.one{
  display: flex;
  flex-direction: row;
  width: 100%;
}
.buttons {
  display: flex;
  justify-content: space-between;
}
.button {
  background: #008cba;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 10px 20px;
  font-size: 0.6em;
  cursor: pointer;
  transition: background 0.3s;
}
.button:hover {
  background: #005f75;
}
.button:active {
  background: #004450;
}
.text {
  font-size: 0.8em;
  margin-bottom: 20px;
  color: #333;
  padding-left: 6px;
  padding-right: 6px;
}
.movie-card {
  display: flex;
  flex-direction: column;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 16px;
  background-color: #fff;
}

.poster-section {
  display: flex;
}

.poster1 {
  width: 30%;
  height: 140px;
  border-radius: 8px;
}
.poster2 {
width: 70%;
  height: 140px;
  border-radius: 8px;
  margin-left: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: rgb(183, 183, 187); /* 0代表完全透明 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}


.title {
  font-size: 24px;
  font-weight: bold;
}


.stars {
  font-size: 18px;
  color: #f39c12;
  margin-top: 3px;
  margin-left: 6px;
}



.summary {
  margin-top: 16px;
  font-size: 14px;
  color: #333;
}


button {
  background-color: #ffcc00;
  border: none;
  padding: 8px 16px;
  font-size: 16px;
  cursor: pointer;
  border-radius: 8px;
}

button:hover {
  background-color: #ff9900;
}
</style>
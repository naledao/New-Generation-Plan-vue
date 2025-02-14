<script setup>
import {showLoadingToast, showToast} from "vant";
import {ref} from "vue";
import {getAllTimes, updateMsg} from "@/api/api.js";
import {tomd5} from "@/utils/md5.js";
const animeName=ref()
const animePic=ref()
const animeMsg=ref()
const animeDec=ref()
const animeRating=ref()
const animeSubjectId=ref()
const onSubmit=async ()=>{
  const load=showLoadingToast({
    message:'添加中...',
    forbidClick:true
  })
  const anime={
    name:animeName.value,
    pic:animePic.value,
    msg:animeMsg.value,
    dec:animeDec.value,
    isDel:isdel.value===false?0:1,
    quarter:animeQuarter.value,
    week:animeWeek.value,
    rate:animeRating.value,
    subjectId:animeSubjectId.value
  }
  const res=await updateMsg(anime,1,2,animeQuarter.value)
  if(res.data===1){
    showToast('添加成功')
  }
  else {
    showToast('添加失败')
  }
  load.close()
}
const isdel=ref(false)
const animeQuarter=ref()
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
const animeWeek=ref()
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
</script>

<template>
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
</template>

<style scoped>

</style>
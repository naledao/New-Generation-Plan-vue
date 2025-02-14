import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useLoadStore = defineStore('load', () => {
  const AddPageLoad = ref(true)
  const LookPageLoad = ref(true)
  const ReNewPageLoad = ref(true)
  const changeAddPageLoad = (load)=>{
    AddPageLoad.value=load
  }
  const changeLookPageLoad = (load)=>{
    LookPageLoad.value=load
  }
  const changeReNewPageLoad = (load)=>{
    ReNewPageLoad.value=load
  }


  return {
    AddPageLoad,
    LookPageLoad,
    ReNewPageLoad,
    changeAddPageLoad,
    changeLookPageLoad,
    changeReNewPageLoad,
  }
})

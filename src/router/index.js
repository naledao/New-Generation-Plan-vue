import { createRouter, createWebHistory } from 'vue-router'
import ReNewPage from "@/views/ReNewPage.vue";
import LookPage from "@/views/LookPage.vue";
import AddPage from "@/views/AddPage.vue";


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path:'/renew',
      component:ReNewPage
    },
    {
      path:'/look',
      component:LookPage
    },
    {
      path:'/add',
      component:AddPage
    },
    {
      path:'/',
      redirect:'/look'
    }
  ]
})
router.beforeEach((to, from, next) => {
  if (to.matched.length === 0) {  // 如果未匹配到路由
    router.push('/look')
  } else {
    next()  // 如果匹配到正确跳转
  }
})
export default router

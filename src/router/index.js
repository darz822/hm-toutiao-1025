import VueRouter from 'vue-router'
import Vue from 'vue'
import local from '@/utils/local'

import Login from '@/views/login'
import Home from '@/views/home'
import welcome from '@/views/welcome'
import NotFound from '@/views/404'
import Article from '@/views/article'
import Image from '@/views/image'

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [{
    // 登陆
    path: '/login',
    component: Login
  },
  {
    // 首页
    path: '/',
    component: Home,
    children: [
      // 欢迎
      {
        path: '/',
        component: welcome
      },
      {
        path: '/article',
        component: Article
      },
      // 素材
      {
        path: '/image',
        component: Image
      }
    ]
  },
  // 404处理
  {
    path: '*',
    component: NotFound
  }
  ]
})

// 路由导航守卫（前置导航守卫）
router.beforeEach((to, from, next) => {
  // to跳转目标路由对象
  // from从哪里跳转过来的路由对象
  // next()放行 next('/login')拦截到登陆
  // next()
  // 如果你访问的不是登陆页面，且没有登陆，跳转到登陆页面
  const user = local.getUser()
  if (to.path !== '/login' && !user) return next('/login')
  next()
})

export default router

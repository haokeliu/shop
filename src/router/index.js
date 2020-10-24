import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login'
import home from '../components/home'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/home',
    name: 'home',
    component: home
  }
]
const router = new VueRouter({
  routes
})

// 挂载路由导航守卫
router.beforeEach((to, form, next) => {
  // to， 要访问的路径
  // from 从哪个路径来
  // next 是个函数表示放行
  //  next()表示放行， next('/login')表示强制跳转到登录页
  if (to.path === '/login') return next()
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router

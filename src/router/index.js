import Vue from 'vue'
import VueRouter from 'vue-router'
import { message } from 'ant-design-vue';

Vue.use(VueRouter)

const routes = [
  {
    name: 'login',
    path: '/login',
    component: () => import('../views/Login.vue')
  },
  {
    name: 'index',
    path: '/index',
    alias: '/',
    redirect: '/init',
    children: [
      {
        name: 'init',
        path: '/init',
        component: () => import('../components/DataSourceInit.vue')
      },
      {
        name: 'filelist',
        path: '/filelist',
        component: () => import('../components/FileList.vue')
      },
      {
        name: 'datasourcelist',
        path: '/datasourcelist',
        component: () => import('../components/DataSourceList.vue')
      },
    ],
    component: () => import('../views/Index.vue')
  },
  {
    name: 'Error404',
    path: '*',
    component: () => import('../views/ErrorPage.vue')

  },
]

const router = new VueRouter({
  mode: 'hash',
  routes
})

router.beforeEach((to, from, next) => {
  let token = sessionStorage.getItem("Authorization");
  if (to.name != "login") {
    if (null != token && token.length != 0) {
      next();
    } else {
      message.error("请登录！", 3);
      next({ name: "login" });
    }
  } else {
    if (null != token && token.length != 0) {
      next({ name: "index" });
    } else {
      next();
    }
  }

})

export default router

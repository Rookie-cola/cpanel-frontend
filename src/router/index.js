import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/* Router Modules */
import chartsRouter from './modules/charts'

export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: 'dashboard', icon: 'dashboard', affix: true }
      }
    ]
  },
  {
    path: '/ufw-manage-table',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/table/firewall-manage-table.vue'),
        name: 'UfwManageTable',
        meta: { title: 'ufwManage', icon: 'Firewall' }
      }
    ]
  },
  {
    path: '/process-manage-table',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/table/process-manage-table.vue'),
        name: 'ProcessManageTable',
        meta: { title: 'processManage', icon: 'process' }
      }
    ]
  },
  {
    path: '/file-manage-table',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/table/file-manage-table.vue'),
        name: 'FileManageTable',
        meta: { title: 'fileManage', icon: 'file' }
      }
    ]
  },
  {
    path: '/website-manage-table',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/table/website-manage-table.vue'),
        name: 'WebsiteManageTable',
        meta: { title: 'websiteManage', icon: 'Website' }
      }
    ]
  },
  {
    path: '/docker-manage-table',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/table/docker-manage-table.vue'),
        name: 'DockerManageTable',
        meta: { title: 'dockerManage', icon: 'Docker' }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router

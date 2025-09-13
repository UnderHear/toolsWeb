import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Index',
    component: () => import('@/views/index.vue')
  },
  {
    path: '/tool',
    name: 'Tool',
    component: () => import('@/views/tool.vue')
  },
  {
    path: '/component',
    name: 'Component',
    component: () => import('@/views/components.vue')
  },
  {
    path: '/namecard',
    name: 'Namecard',
    component: () => import('@/views/namecard.vue')
  },
  {
    path: '/namecard/UnderHear',
    name: 'UnderHear',
    component: () => import('@/views/namecard/UnderHear/index.vue')
  },
  {
    path: '/namecard/UnderHear/project',
    name: 'Project',
    component: () => import('@/views/namecard/UnderHear/project.vue')
  },
  {
    path: '/tool/pathplanner',
    name: 'PathPlanner',
    component: () => import('@/views/tool/pathplanner/pathplanner.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(_to, _from, savedPosition) {
    // 如果有保存的位置，使用它；否则滚动到顶部
    if (savedPosition) {
      return savedPosition
    }
    return { top: 0 }
  }
})

export default router
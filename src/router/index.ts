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
  routes
})

export default router
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
    path: '/namecard/project',
    name: 'Project',
    component: () => import('@/views/namecard/project.vue')
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
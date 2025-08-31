import { createRouter, createWebHistory } from 'vue-router'
import Index from '@/views/index.vue'
import Namecard from '@/views/namecard.vue'
import Tool from '@/views/tool.vue'

const routes = [
  {
    path: '/',
    name: 'Index',
    component: Index
  },
  {
    path: '/tool',
    name: 'Tool',
    component: Tool
  },
  {
    path: '/namecard',
    name: 'Namecard',
    component: Namecard
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
<template>
  <header class="sticky top-0 z-50 w-full bg-[#fefefe]/66 backdrop-blur-2xl shadow-[0_1px_2px_rgba(0,0,0,0.2)]">
    <div class="container flex h-16 items-center justify-center px-4">
      <nav>
        <ul class="flex space-x-6">
          <li v-for="item in navigationItems" :key="item.name">
            <a
              :href="item.href"
              :class="[
                'px-4 py-2 rounded-md text-sm font-medium transition-colors',
                item.active 
                  ? 'bg-primary text-primary-foreground' 
                  : 'text-foreground hover:bg-accent hover:text-accent-foreground'
              ]"
              @click="navigateToPage(item)"
            >
              {{ item.name }}
            </a>
          </li>
        </ul>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// Types
interface NavigationItem {
  name: string
  href: string
  active: boolean
}

// Default navigation data
const navigationItems = ref<NavigationItem[]>([
  { name: '首页', href: '/', active: true },
  { name: '关于', href: '/about', active: false },
  { name: '项目', href: '/projects', active: false },
  { name: '博客', href: '/blog', active: false },
])

// Methods
const navigateToPage = (item: NavigationItem) => {
  // Update active state
  navigationItems.value.forEach(navItem => {
    navItem.active = navItem.name === item.name
  })
  
  // Navigate to the page
  window.location.href = item.href
}
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
}

ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

a {
  text-decoration: none;
}
</style>
<template>
  <div class="components-wrapper">
    <div class="components-header">
      <h1 class="title">UI 组件库</h1>
      <p class="subtitle">这里展示本站自研的 UI 组件库，提供现代化、美观且易用的组件。</p>
      <p class="subtitle">所有组件都经过精心设计，支持 TypeScript 并遵循最佳实践。</p>
    </div>

    <div class="components-grid">
      <div v-for="component in components" :key="component.id" class="component-card">
        <div class="component-content">
          <div class="component-header-info">
            <h3 class="component-name">{{ component.name }}</h3>
            <span class="component-category">{{ component.category }}</span>
          </div>
          <div class="component-description">
            <p>{{ component.description.zh }}</p>
            <p class="description-en">{{ component.description.en }}</p>
          </div>
          <div class="component-preview">
            <div class="preview-container">
              <!-- 这里可以放置组件的预览 -->
              <div class="preview-placeholder">
                <span class="preview-text">{{ component.name }} Preview</span>
              </div>
            </div>
          </div>
          <div class="component-actions">
            <div class="component-info">
              <span class="version">v{{ component.version }}</span>
              <span class="status" :class="`status-${component.status}`">{{ getStatusText(component.status) }}</span>
            </div>
            <div class="action-buttons">
              <button class="demo-button" :class="{ disabled: component.status === 'development' }">
                {{ component.status === 'development' ? '开发中' : '查看示例' }}
              </button>
              <button class="docs-button">
                文档
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface ComponentDescription {
  zh: string
  en: string
}

interface Component {
  id: number
  name: string
  description: ComponentDescription
  category: string
  version: string
  status: 'stable' | 'beta' | 'development'
}

const components = ref<Component[]>([
  {
    id: 1,
    name: 'ZLink',
    description: {
      zh: '智能链接组件，支持外部链接标识、多种样式变体和完整的可访问性支持。',
      en: 'Smart link component with external link indicators, multiple style variants and full accessibility support.'
    },
    category: '导航',
    version: '1.0.0',
    status: 'stable'
  },
  {
    id: 2,
    name: 'ZSelect',
    description: {
      zh: '现代化选择器组件，支持搜索、多选、自定义选项渲染等高级功能。',
      en: 'Modern select component with search, multi-select, custom option rendering and more advanced features.'
    },
    category: '表单',
    version: '1.2.0',
    status: 'stable'
  },
  {
    id: 3,
    name: 'ZButton',
    description: {
      zh: '多功能按钮组件，提供多种尺寸、颜色主题和加载状态。',
      en: 'Versatile button component with multiple sizes, color themes and loading states.'
    },
    category: '基础',
    version: '1.1.0',
    status: 'beta'
  },
  {
    id: 4,
    name: 'ZModal',
    description: {
      zh: '响应式模态框组件，支持嵌套、拖拽、自定义动画等特性。',
      en: 'Responsive modal component with nesting, dragging, custom animations and more features.'
    },
    category: '反馈',
    version: '0.8.0',
    status: 'development'
  },
  {
    id: 5,
    name: 'ZTable',
    description: {
      zh: '功能强大的表格组件，支持排序、筛选、分页、虚拟滚动等功能。',
      en: 'Powerful table component with sorting, filtering, pagination, virtual scrolling and more.'
    },
    category: '数据展示',
    version: '0.5.0',
    status: 'development'
  },
  {
    id: 6,
    name: 'ZCard',
    description: {
      zh: '灵活的卡片容器组件，支持多种布局模式和交互效果。',
      en: 'Flexible card container component with multiple layout modes and interactive effects.'
    },
    category: '布局',
    version: '1.0.0',
    status: 'stable'
  }
])

const getStatusText = (status: string) => {
  const statusMap = {
    stable: '稳定版',
    beta: '测试版',
    development: '开发中'
  }
  return statusMap[status as keyof typeof statusMap] || status
}
</script>

<style scoped>
.components-wrapper {
  max-width: 1150px;
  margin: 0 auto;
  padding: 2rem;
  background: #fff;
  min-height: 100vh;
}

.components-header {
  text-align: center;
  margin-bottom: 3rem;
}

.title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #24292f;
  margin-bottom: 1rem;
  line-height: 1.2;
}

.subtitle {
  font-size: 1.05rem;
  color: #656d76;
  line-height: 1.6;
  max-width: 620px;
  margin: 0 auto;
}

.components-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
}

.component-card {
  background: white;
  border: 1px solid #d1d9e1;
  border-radius: 8px;
  padding: 2rem;
  display: flex;
  transition: all 0.2s ease;
  min-height: 280px;
}

.component-card:hover {
  border-color: #0969da;
  box-shadow: 0 4px 14px -4px rgba(0,0,0,0.08);
}

.component-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.component-header-info {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
  gap: 1rem;
}

.component-name {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #24292f;
  line-height: 1.3;
  flex: 1;
}

.component-category {
  font-size: 0.75rem;
  color: #656d76;
  background-color: #f6f8fa;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-weight: 500;
  white-space: nowrap;
}

.component-description {
  margin-bottom: 1.5rem;
}

.component-description p {
  margin: 0 0 0.75rem 0;
  font-size: 0.95rem;
  line-height: 1.6;
  color: #24292f;
}

.description-en {
  color: #656d76 !important;
  font-style: italic;
  font-size: 0.9rem !important;
}

.component-preview {
  flex: 1;
  margin-bottom: 1.5rem;
}

.preview-container {
  background: #f6f8fa;
  border: 1px solid #d1d9e1;
  border-radius: 6px;
  padding: 1.5rem;
  min-height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.preview-placeholder {
  color: #656d76;
  font-size: 0.9rem;
  text-align: center;
}

.preview-text {
  opacity: 0.7;
}

.component-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.component-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.version {
  font-size: 0.8rem;
  color: #656d76;
  background: #f6f8fa;
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
  font-family: 'Monaco', 'Menlo', monospace;
}

.status {
  font-size: 0.75rem;
  padding: 0.2rem 0.5rem;
  border-radius: 12px;
  font-weight: 500;
}

.status-stable {
  background: #d1f7d1;
  color: #0f5132;
}

.status-beta {
  background: #fff3cd;
  color: #664d03;
}

.status-development {
  background: #f8d7da;
  color: #721c24;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.demo-button,
.docs-button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.demo-button {
  background-color: #0969da;
  color: white;
}

.demo-button:hover:not(.disabled) {
  background-color: #0860ca;
}

.demo-button.disabled {
  background-color: #656d76;
  cursor: not-allowed;
  opacity: 0.6;
}

.docs-button {
  background-color: #f6f8fa;
  color: #24292f;
  border: 1px solid #d1d9e1;
}

.docs-button:hover {
  background-color: #e9f2fb;
  border-color: #0969da;
}

@media (max-width: 768px) {
  .components-wrapper {
    padding: 1rem;
  }

  .title {
    font-size: 2rem;
  }

  .subtitle {
    font-size: 1rem;
  }

  .components-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .component-card {
    padding: 1.5rem;
    min-height: auto;
  }

  .component-header-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .component-actions {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }

  .action-buttons {
    align-self: flex-end;
  }
}
</style>
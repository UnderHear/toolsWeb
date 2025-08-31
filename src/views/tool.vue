<template>
  <div class="tool-container">
    <h1>工具页面</h1>
    <p>仍在设计中...</p>
    <div class="tools-grid">
      <div class="tool-card">
        <h3>工具1</h3>
        <p>工具1的描述</p>
      </div>
      <div class="tool-card">
        <h3>工具2</h3>
        <p>工具2的描述</p>
      </div>
      <div class="tool-card">
        <h3>工具3</h3>
        <p>工具3的描述</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 工具页面逻辑
</script>

<style scoped>
.tool-container {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.tools-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
}

.tool-card {
  padding: 1.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}

.tool-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.tool-card h3 {
  margin: 0 0 0.5rem 0;
  color: #1a202c;
}

.tool-card p {
  margin: 0;
  color: #4a5568;
}
</style>
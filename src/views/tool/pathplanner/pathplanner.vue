<template>
  <div class="pathplanner-container">
    <div class="pathplanner-header">
      <h1 class="pathplanner-title">路径规划器</h1>
      <p class="pathplanner-subtitle">智能路径规划工具，帮助您找到最优路径</p>
    </div>

    <div class="pathplanner-content">
      <div class="pathplanner-card">
        <h2>功能特性</h2>
        <ul>
          <li>智能路径算法</li>
          <li>实时路况分析</li>
          <li>多种出行方式</li>
          <li>最优路径推荐</li>
        </ul>
      </div>

      <div class="pathplanner-card">
        <h2>使用说明</h2>
        <p>该工具正在开发中，敬请期待...</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 路径规划器组件
</script>

<style scoped>
.pathplanner-container {
  max-width: 1150px;
  margin: 0 auto;
  padding: 2rem;
  background-color: #fff;
  min-height: 100vh;
}

.pathplanner-header {
  text-align: center;
  margin-bottom: 3rem;
}

.pathplanner-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #24292f;
  margin-bottom: 1rem;
  line-height: 1.2;
}

.pathplanner-subtitle {
  font-size: 1.1rem;
  color: #656d76;
  line-height: 1.6;
  max-width: 600px;
  margin: 0 auto;
}

.pathplanner-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.pathplanner-card {
  background: white;
  border: 1px solid #d1d9e1;
  border-radius: 8px;
  padding: 2rem;
  transition: all 0.2s ease;
}

.pathplanner-card:hover {
  border-color: #0969da;
  box-shadow: 0 4px 12px rgba(9, 105, 218, 0.1);
  transform: translateY(-2px);
}

.pathplanner-card h2 {
  margin: 0 0 1rem 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #24292f;
}

.pathplanner-card ul {
  margin: 0;
  padding-left: 1.5rem;
}

.pathplanner-card li {
  margin-bottom: 0.5rem;
  color: #24292f;
  line-height: 1.6;
}

.pathplanner-card p {
  margin: 0;
  color: #656d76;
  line-height: 1.6;
}

@media (max-width: 768px) {
  .pathplanner-container {
    padding: 1rem;
  }

  .pathplanner-title {
    font-size: 2rem;
  }

  .pathplanner-subtitle {
    font-size: 1rem;
  }

  .pathplanner-content {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .pathplanner-card {
    padding: 1.5rem;
  }
}
</style>
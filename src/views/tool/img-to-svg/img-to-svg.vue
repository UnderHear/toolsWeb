<template>
  <div class="img2svg-container">
    <div class="img2svg-header">
      <h1 class="img2svg-title">PNG / JPG 转 SVG</h1>
      <p class="img2svg-subtitle">将位图转换为可缩放的矢量图（SVG），减少失真，适合图标与简单插画。</p>
      <p class="img2svg-subtitle-en">Convert bitmap images (PNG/JPG) to scalable SVG vector graphics.</p>
    </div>

    <div class="layout">
      <aside class="sidebar">
        <div class="panel card">
          <h2 class="panel-title">上传图片</h2>
          <div class="upload-box" @dragover.prevent @drop.prevent="onDrop">
            <input ref="fileInput" type="file" accept="image/png,image/jpeg" @change="onFileChange" hidden />
            <div class="upload-inner" @click="triggerFile">
              <p v-if="!imageSrc" class="hint">点击或拖拽 PNG / JPG 图片到此</p>
              <img v-else :src="imageSrc" alt="preview" class="preview" />
            </div>
          </div>
          <button class="btn small" :disabled="!imageSrc || converting" @click="convert">{{ converting ? '转换中...' : '开始转换' }}</button>
          <button class="btn ghost small" :disabled="!imageSrc || converting" @click="clearAll">清除</button>
        </div>

        <div class="panel card">
          <h2 class="panel-title">参数设置</h2>
          <div class="form-row">
            <label>颜色数量 <span class="muted">{{ colors }}</span></label>
            <input type="range" min="2" max="32" v-model.number="colors" />
          </div>
          <div class="form-row">
            <label>路径精度 <span class="muted">{{ pathTolerance.toFixed(2) }}</span></label>
            <input type="range" min="0.2" max="6" step="0.1" v-model.number="pathTolerance" />
          </div>
          <div class="form-row">
            <label>最小区域 <span class="muted">{{ minArea }}</span></label>
            <input type="range" min="1" max="80" v-model.number="minArea" />
          </div>
          <div class="tips muted">
            * 颜色越少、精度越高，SVG 更简洁；可适当提高最小区域过滤杂点。
          </div>
        </div>
      </aside>

      <main class="content">
        <div class="card output-card">
          <h2 class="panel-title">结果预览</h2>
          <div v-if="error" class="error-box">{{ error }}</div>
          <div v-if="!svgContent && !error" class="placeholder muted">还没有结果，上传并转换一张图片。</div>
          <div v-if="svgContent" class="result-wrapper">
            <div class="svg-preview" v-html="svgContent"></div>
            <div class="actions">
              <button class="btn" @click="downloadSvg" :disabled="!svgContent">下载 SVG</button>
              <button class="btn ghost" @click="copySvg" :disabled="!svgContent">复制代码</button>
            </div>
          </div>
        </div>

        <div class="card info-card">
          <h2>说明 / About</h2>
          <ul>
            <li>该工具通过颜色量化与路径拟合，将位图转换为多个 SVG path。</li>
            <li>适合图标、徽章、扁平插画；不适合复杂照片（结果会非常庞大）。</li>
            <li>所有处理在浏览器本地完成，不上传服务器，保障隐私。</li>
          </ul>
          <ul class="en">
            <li>Uses color quantization + path tracing to produce SVG paths.</li>
            <li>Best for icons, badges, flat illustrations; not ideal for complex photos.</li>
            <li>All processing happens locally in your browser, no upload.</li>
          </ul>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const fileInput = ref<HTMLInputElement | null>(null)
const imageSrc = ref<string | null>(null)
const svgContent = ref<string | null>(null)
const error = ref('')
const converting = ref(false)

// 参数
const colors = ref(8)
const pathTolerance = ref(1.5)
const minArea = ref(8)

function triggerFile() { fileInput.value?.click() }

function onFileChange(e: Event) {
  const files = (e.target as HTMLInputElement).files
  if (!files || !files[0]) return
  loadFile(files[0])
}
function onDrop(e: DragEvent) {
  const file = e.dataTransfer?.files?.[0]
  if (file) loadFile(file)
}

function loadFile(file: File) {
  error.value = ''
  svgContent.value = null
  const valid = ['image/png', 'image/jpeg']
  if (!valid.includes(file.type)) {
    error.value = '仅支持 PNG / JPG'
    return
  }
  const reader = new FileReader()
  reader.onload = () => { imageSrc.value = reader.result as string }
  reader.readAsDataURL(file)
}

async function convert() {
  if (!imageSrc.value) return
  converting.value = true
  error.value = ''
  svgContent.value = null
  try {
    const img = await loadImage(imageSrc.value)
    const { width, height } = img
    const canvas = document.createElement('canvas')
    canvas.width = width; canvas.height = height
    const ctx = canvas.getContext('2d')!
    ctx.drawImage(img, 0, 0)
    const imageData = ctx.getImageData(0, 0, width, height)
    // 1) 颜色量化
    const quantized = quantize(imageData.data, colors.value)
    // 2) 分区与路径追踪
    const paths = tracePaths(quantized, width, height, minArea.value, pathTolerance.value)
    // 3) 生成 SVG
    svgContent.value = buildSvg(paths, width, height)
  } catch (e) {
    console.error(e)
    error.value = '转换失败：' + (e as Error).message
  } finally {
    converting.value = false
  }
}

function clearAll() {
  imageSrc.value = null
  svgContent.value = null
  error.value = ''
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('图片加载失败'))
    img.src = src
  })
}

// 简单颜色量化 (k-means 替代：用 median-cut 近似) 这里用简化版本：随机采样 + 迭代收敛
function quantize(data: Uint8ClampedArray, k: number) {
  // 采样
  const samples: number[][] = []
  for (let i = 0; i < data.length; i += 4 * 24) { // 间隔采样
    samples.push([data[i], data[i + 1], data[i + 2]])
  }
  // 初始化中心
  const centers = samples.slice(0, k)
  const dist = (a: number[], b: number[]) => {
    const dx = a[0] - b[0]; const dy = a[1] - b[1]; const dz = a[2] - b[2]
    return dx * dx + dy * dy + dz * dz
  }
  for (let iter = 0; iter < 8; iter++) {
    const clusters: number[][][] = Array.from({ length: k }, () => [])
    for (const s of samples) {
      let best = 0, bd = Infinity
      for (let c = 0; c < k; c++) {
        const d = dist(s, centers[c])
        if (d < bd) { bd = d; best = c }
      }
      clusters[best].push(s)
    }
    for (let c = 0; c < k; c++) {
      const cl = clusters[c]
      if (!cl.length) continue
      let r = 0, g = 0, b = 0
      for (const p of cl) { r += p[0]; g += p[1]; b += p[2] }
      centers[c] = [Math.round(r / cl.length), Math.round(g / cl.length), Math.round(b / cl.length)]
    }
  }
  // 应用到整张图
  const out = new Uint8ClampedArray(data.length / 4)
  for (let i = 0; i < data.length; i += 4) {
    const pix = [data[i], data[i + 1], data[i + 2]]
    let best = 0, bd = Infinity
    for (let c = 0; c < k; c++) {
      const d = dist(pix, centers[c])
      if (d < bd) { bd = d; best = c }
    }
    out[i / 4] = best
  }
  return { index: out, palette: centers }
}


function tracePaths(q: { index: Uint8ClampedArray; palette: number[][] }, w: number, h: number, minArea: number, tolerance: number) {
  const visited = new Uint8Array(q.index.length)
  const paths: { color: number; outline: [number, number][] }[] = []
  const dirs = [[1,0],[-1,0],[0,1],[0,-1]]
  function flood(x: number, y: number, col: number) {
    const stack = [[x,y]]
    const pts: [number, number][] = []
    visited[y * w + x] = 1
    while (stack.length) {
      const [cx, cy] = stack.pop()!
      pts.push([cx, cy])
      for (const [dx, dy] of dirs) {
        const nx = cx + dx, ny = cy + dy
        if (nx>=0 && nx<w && ny>=0 && ny<h) {
          const idx = ny * w + nx
          if (!visited[idx] && q.index[idx] === col) {
            visited[idx] = 1
            stack.push([nx, ny])
          }
        }
      }
    }
    return pts
  }
  function simplify(points: [number, number][]) {
    // 粗略边界：取点集合的凸包 (Graham scan)
    if (points.length < 3) return points
    points.sort((a,b)=> a[0]===b[0]? a[1]-b[1]: a[0]-b[0])
    const cross = (o:[number,number], a:[number,number], b:[number,number]) => (a[0]-o[0])*(b[1]-o[1]) - (a[1]-o[1])*(b[0]-o[0])
    const lower:[number,number][]=[]
    for (const p of points) {
      while (lower.length>=2 && cross(lower[lower.length-2], lower[lower.length-1], p) <= 0) lower.pop()
      lower.push(p)
    }
    const upper:[number,number][]=[]
    for (let i=points.length-1;i>=0;i--) {
      const p=points[i]
      while (upper.length>=2 && cross(upper[upper.length-2], upper[upper.length-1], p) <= 0) upper.pop()
      upper.push(p)
    }
    upper.pop(); lower.pop()
    const hull = lower.concat(upper)
    // 再做一次基于容差的抽稀
    if (tolerance <= 0) return hull
    const simplified:[number,number][]= []
    for (let i=0;i<hull.length;i++) {
      const prev = hull[(i-1+hull.length)%hull.length]
      const cur = hull[i]
      const next = hull[(i+1)%hull.length]
      const area = Math.abs(prev[0]* (cur[1]-next[1]) + cur[0]*(next[1]-prev[1]) + next[0]*(prev[1]-cur[1]))/2
      if (area > tolerance) simplified.push(cur)
    }
    return simplified.length>=3? simplified : hull
  }
  for (let y=0;y<h;y++) {
    for (let x=0;x<w;x++) {
      const idx = y*w + x
      if (visited[idx]) continue
      const col = q.index[idx]
      const pts = flood(x,y,col)
      if (pts.length < minArea) continue
      const outline = simplify(pts)
      paths.push({ color: col, outline })
    }
  }
  return paths
}

function buildSvg(paths: { color: number; outline: [number, number][] }[], w: number, h: number) {
  if (!paths.length) return ''
  const maxColor = colors.value
  const palette = paths.reduce((acc, p) => acc.add(p.color), new Set<number>())
  const used = Array.from(palette)
  const colorMap = new Map<number, string>()
  for (const c of used) {
    // 给每个颜色一个 HEX (简单映射：色相按索引均分)
    const hue = Math.round((c / maxColor) * 360)
    colorMap.set(c, `hsl(${hue} 70% 50%)`)
  }
  const pathStr = paths.map(p => {
    const o = p.outline
    if (o.length < 2) return ''
    const d = 'M' + o.map(pt => pt[0] + ' ' + pt[1]).join('L') + 'Z'
    return `<path d="${d}" fill="${colorMap.get(p.color)}" stroke="${colorMap.get(p.color)}" stroke-width="1" />`
  }).join('\n')
  return `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${w} ${h}' shape-rendering='geometricPrecision'>\n${pathStr}\n</svg>`
}

function downloadSvg() {
  if (!svgContent.value) return
  const blob = new Blob([svgContent.value], { type: 'image/svg+xml' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'image.svg'
  a.click()
  URL.revokeObjectURL(url)
}
function copySvg() {
  if (!svgContent.value) return
  navigator.clipboard.writeText(svgContent.value)
}
</script>

<style scoped>
.img2svg-container { max-width: 1200px; margin:0 auto; padding:2rem; background:#fff; min-height:100vh; }
.img2svg-header { text-align:center; margin-bottom:1.5rem; }
.img2svg-title { font-size:2.2rem; font-weight:700; color:#24292f; margin:0 0 .5rem; }
.img2svg-subtitle { font-size:1rem; color:#24292f; margin:.25rem 0; line-height:1.5; }
.img2svg-subtitle-en { font-size:.9rem; color:#64707b; font-style:italic; margin:0; }
.layout { display:grid; grid-template-columns: 320px 1fr; gap:1rem; align-items:start; }
.sidebar { position:sticky; top:1rem; display:flex; flex-direction:column; gap:1rem; }
.card { background:#fff; border:1px solid #d1d9e1; padding:1rem 1.25rem; transition:all .2s ease; }
.card:hover { border-color:#0969da; box-shadow:0 4px 12px rgba(9,105,218,.06); }
.panel-title { margin:0 0 .75rem; font-size:1.05rem; font-weight:600; color:#24292f; }
.upload-box { border:1px dashed #c9d1d9; border-radius:8px; background:#f6f8fa; padding:.75rem; cursor:pointer; }
.upload-inner { display:flex; align-items:center; justify-content:center; min-height:140px; }
.hint { color:#656d76; font-size:.9rem; }
.preview { max-width:100%; max-height:240px; object-fit:contain; border-radius:4px; }
.btn { padding:0.45rem 0.75rem; border:1px solid #c9d1d9; background:#f6f8fa; color:#24292f; border-radius:6px; cursor:pointer; font-size:.85rem; }
.btn.small { font-size:.75rem; padding:0.35rem 0.65rem; }
.btn.primary { background:#0969da; border-color:#0969da; color:#fff; }
.btn.ghost { background:transparent; }
.btn:disabled { opacity:.55; cursor:not-allowed; }
.form-row { display:grid; gap:.4rem; margin-bottom:.75rem; }
.form-row label { font-size:.85rem; font-weight:600; color:#24292f; display:flex; justify-content:space-between; }
.muted { color:#656d76; font-size:.75rem; }
.tips { font-size:.7rem; line-height:1.4; }
.output-card { min-height:300px; display:flex; flex-direction:column; gap:1rem; }
.placeholder { font-size:.85rem; }
.result-wrapper { display:flex; flex-direction:column; gap:1rem; }
.svg-preview { max-width:100%; max-height:480px; overflow:auto; border:1px solid #e1e6eb; padding:.5rem; border-radius:6px; background:#fff; }
.actions { display:flex; gap:.5rem; }
.error-box { background:#fee2e2; color:#b91c1c; padding:.5rem .75rem; border:1px solid #fca5a5; border-radius:6px; font-size:.75rem; }
.info-card h2 { margin:0 0 .5rem; font-size:1.1rem; font-weight:600; }
.info-card ul { margin:.25rem 0 .75rem; padding-left:1.25rem; }
.info-card li { margin-bottom:.3rem; line-height:1.5; font-size:.85rem; color:#24292f; }
.info-card ul.en { color:#64707b; font-style:italic; }

@media (max-width: 840px) {
  .layout { grid-template-columns: 1fr; }
  .sidebar { position:static; }
}
</style>

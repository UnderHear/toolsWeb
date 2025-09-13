# AI Coding Assistant Instructions for toolsWeb

## Project Overview
This is a Vue 3 + TypeScript portfolio/personal website built with Vite, featuring bilingual content (Chinese/English), custom UI components, and interactive tools. The project showcases development skills through a personal profile site with integrated tools like a path planning visualizer.

## Architecture & Tech Stack
- **Frontend**: Vue 3 (Composition API) + TypeScript + Vite
- **Styling**: Tailwind CSS v4 + custom CSS variables
- **UI Components**: Custom z-ui library + Reka UI integration
- **Icons**: @icon-park/vue-next
- **Build**: Vite with Vue plugin and Tailwind integration
- **Data**: JSON files for content (projects, tool configurations)

## Key Conventions & Patterns

### 1. Component Structure
```typescript
// src/components/z-ui/tag/zTechTag/zTechTag.vue
<template>
  <span class="tech-tag">
    <slot></slot>
  </span>
</template>

<script setup lang="ts">
// Component logic here
</script>

<style scoped>
.tech-tag {
  // Custom styling with specific color scheme
}
</style>
```

**Patterns to follow:**
- Use `<script setup lang="ts">` for all components
- Export components via `index.ts` files: `export { default as ComponentName } from './ComponentName.vue'`
- Custom z-ui components use kebab-case naming (e.g., `zTechTag`)
- Reka UI components follow shadcn/ui patterns with `class-variance-authority`

### 2. Bilingual Content Pattern
```vue
<template>
  <div>
    <p class="bio-en">{{ project.description.en }}</p>
    <p class="bio-cn">{{ project.description.zh }}</p>
  </div>
</template>
```

**Always provide both English and Chinese versions:**
- English content: `description.en`, `bio-en` classes
- Chinese content: `description.zh`, `bio-cn` classes
- Use italic styling for Chinese text: `font-style: italic; color: #64707b;`

### 3. Responsive Design
```css
/* Mobile-first approach with max-md breakpoints */
max-md:top-4 max-md:w-fit max-md:mx-auto max-md:rounded-[24px] max-md:shadow-none

/* Media queries for complex layouts */
@media (max-width: 768px) {
  .container {
    flex-direction: column;
    padding: 16px;
  }
}
```

**Responsive patterns:**
- Use `max-md:` prefix for mobile-specific Tailwind classes
- Container max-width: `1300px` with centered layout
- Mobile navigation: sticky header with rounded corners

### 4. Color Scheme & Styling
```css
/* Primary colors */
--primary: #0969da
--background: #f8fafc
--foreground: #24292f

/* Custom styling patterns */
.tech-tag {
  background-color: #ddf4ff;
  color: #0969da;
  padding: 0px 10px 0px 10px;
  border-radius: 100px;
}
```

**Consistent styling:**
- GitHub-inspired color palette (#0969da, #24292f, #656d76)
- Border radius: `6px` for cards, `100px` for tags
- Box shadows: `0 1px 1px rgba(220,220,220,1)` for subtle depth

### 5. Data Management
```typescript
// src/views/namecard/UnderHear/data/Projectcard.json
[
  {
    "id": 1,
    "title": "Project Title",
    "description": {
      "zh": "Chinese description",
      "en": "English description"
    },
    "technologies": ["Vue3", "TypeScript"],
    "projectLink": "#"
  }
]
```

**Data patterns:**
- JSON files for static content
- Bilingual descriptions with `zh`/`en` structure
- Technology arrays for skill tags
- Project metadata (dates, status, links)

### 6. Routing & Navigation
```typescript
// src/router/index.ts
{
  path: '/namecard/UnderHear/project',
  name: 'Project',
  component: () => import('@/views/namecard/UnderHear/project.vue')
}
```

**Routing patterns:**
- Lazy-loaded components with dynamic imports
- Nested routes for complex sections
- Chinese route names in navigation

### 7. Icon Usage
```vue
<template>
  <icon-park type="github" theme="filled" size="20" fill="#5a5a5a" />
</template>
```

**Icon patterns:**
- @icon-park/vue-next with theme and fill props
- Consistent 20px size for UI elements
- Semantic color coding (#5a5a5a for muted, #1a7f37 for success)

## Development Workflows

### Build Commands
```bash
npm run dev      # Start dev server with HMR
npm run build    # Production build with TypeScript checking
npm run preview  # Preview production build
```

### Component Creation
1. Create component file in appropriate directory (`src/components/z-ui/` or `src/components/ui/`)
2. Export via `index.ts`: `export { default as ComponentName } from './ComponentName.vue'`
3. Use in templates: `<zComponentName>` or `<Button>`
4. Follow naming: PascalCase for files, camelCase for imports

### Adding New Features
1. **Pages**: Add route to `src/router/index.ts`, create component in `src/views/`
2. **Tools**: Create in `src/views/tool/`, follow pathplanner.vue patterns
3. **Components**: Add to `src/components/z-ui/` or `src/components/ui/`
4. **Data**: Add JSON files to appropriate `data/` directories

## Code Quality Standards

### TypeScript
- Strict mode enabled (`"strict": true`)
- No unused variables/parameters
- Explicit types for component props and data structures

### Styling
- Tailwind CSS classes with custom utilities
- Scoped styles for component isolation
- Consistent spacing and color usage
- Mobile-responsive design patterns

### File Organization
```
src/
├── components/
│   ├── ui/          # Reusable UI components (Button, Select, etc.)
│   └── z-ui/        # Custom branded components (zTechTag, zSelect, etc.)
├── views/           # Page components
├── router/          # Vue Router configuration
├── lib/             # Utilities (cn function, etc.)
└── data/            # JSON data files
```

## Common Patterns to Follow

### Error Handling
```typescript
try {
  // Operation
} catch (e) {
  console.error(e)
  message.value = '运行失败：' + (e as Error).message
}
```

### Reactive Data
```typescript
const projects = ref<Project[]>([])
onMounted(() => {
  projects.value = projectData.slice(0, 3)
})
```

### Component Props
```typescript
interface Props {
  variant?: ButtonVariants["variant"]
  size?: ButtonVariants["size"]
}
const props = withDefaults(defineProps<Props>(), {
  as: "button",
})
```

## Integration Points

### External Services
- **Deployment**: Docker + Nginx + Ubuntu on Alibaba Cloud
- **Icons**: @icon-park/vue-next library
- **UI**: Reka UI + custom z-ui components
- **Styling**: Tailwind CSS v4 with custom configuration

### Third-party Libraries
- `vue-router` for navigation
- `@vueuse/core` for Vue utilities
- `class-variance-authority` for component variants
- `clsx` + `tailwind-merge` for conditional classes

## Performance Considerations
- Lazy-loaded route components
- Scoped styles for CSS isolation
- Tree-shakable imports
- Optimized bundle with Vite

## Testing & Validation
- TypeScript strict checking on build
- Vue 3 devtools integration
- Console logging for debugging
- Visual testing through dev server

Remember: This project emphasizes clean architecture, bilingual support, and responsive design. Always maintain consistency with existing patterns, especially the Chinese/English bilingual structure and the custom z-ui component library.
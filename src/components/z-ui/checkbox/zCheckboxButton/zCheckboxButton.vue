<template>
  <label
    class="z-checkbox-button"
    :class="[
      {
        'is-disabled': isDisabled,
        'is-checked': isChecked,
        'is-focus': focus
      },
      size ? `z-checkbox-button--${size}` : ''
    ]"
    role="checkbox"
    :aria-checked="isChecked"
    :aria-disabled="isDisabled"
  >
    <input
      v-if="trueLabel || falseLabel"
      ref="checkbox"
      class="z-checkbox-button__original"
      type="checkbox"
      :name="name"
      :disabled="isDisabled"
      :true-value="trueLabel"
      :false-value="falseLabel"
      v-model="model"
      @change="handleChange"
      @focus="focus = true"
      @blur="focus = false"
    >
    <input
      v-else
      ref="checkbox"
      class="z-checkbox-button__original"
      type="checkbox"
      :name="name"
      :disabled="isDisabled"
      :value="label"
      v-model="model"
      @change="handleChange"
      @focus="focus = true"
      @blur="focus = false"
    >
    <span
      class="z-checkbox-button__inner"
      :style="isChecked ? activeStyle : null"
    >
      <slot>{{ label }}</slot>
    </span>
  </label>
</template>

<script setup lang="ts">
import { computed, inject, nextTick, ref } from 'vue'
import type { CheckboxGroupContext } from '../types'

interface CheckboxButtonProps {
  modelValue?: string | number | boolean
  label?: string | number | boolean | object
  disabled?: boolean
  checked?: boolean
  name?: string
  trueLabel?: string | number
  falseLabel?: string | number
}

interface CheckboxButtonEmits {
  (e: 'update:modelValue', value: string | number | boolean | (string | number | boolean)[]): void
  (e: 'change', value: string | number | boolean | (string | number | boolean)[]): void
}

const props = withDefaults(defineProps<CheckboxButtonProps>(), {
  disabled: false,
  checked: false
})

const emit = defineEmits<CheckboxButtonEmits>()

// 注入 checkbox-group 上下文
const checkboxGroup = inject<CheckboxGroupContext>('CheckboxGroup', undefined)

// 响应式数据
const focus = ref(false)
const selfModel = ref(false)
const checkbox = ref<HTMLInputElement>()

// 计算属性
const isGroup = computed(() => !!checkboxGroup)

const isDisabled = computed(() => {
  return props.disabled || (checkboxGroup?.disabled ?? false)
})

const size = computed(() => {
  return checkboxGroup?.size
})

const model = computed({
  get() {
    return isGroup.value
      ? checkboxGroup!.modelValue
      : props.modelValue !== undefined
      ? props.modelValue
      : selfModel.value
  },
  set(val) {
    if (isGroup.value) {
      checkboxGroup!.changeEvent(val)
    } else {
      emit('update:modelValue', val)
      selfModel.value = val as boolean
    }
  }
})

const isChecked = computed(() => {
  if (typeof model.value === 'boolean') {
    return model.value
  } else if (Array.isArray(model.value)) {
    return model.value.includes(props.label as string | number | boolean)
  } else if (model.value !== null && model.value !== undefined) {
    return model.value === props.trueLabel
  }
  return false
})

const activeStyle = computed(() => {
  if (!checkboxGroup) return {}
  
  return {
    backgroundColor: checkboxGroup.fill?.value || '#409EFF',
    borderColor: checkboxGroup.fill?.value || '#409EFF',
    color: checkboxGroup.textColor?.value || '#ffffff',
    boxShadow: '-1px 0 0 0 ' + (checkboxGroup.fill?.value || '#409EFF')
  }
})

const isLimitExceeded = computed(() => {
  if (!checkboxGroup || !checkboxGroup.max || !checkboxGroup.min) return false
  
  const { max, min } = checkboxGroup
  const modelValue = checkboxGroup.modelValue as (string | number | boolean)[]
  
  return (
    (modelValue.length >= max && !isChecked.value) ||
    (modelValue.length <= min && isChecked.value)
  )
})

// 方法
const handleChange = (evt: Event) => {
  if (isLimitExceeded.value) return
  
  const target = evt.target as HTMLInputElement
  let value: string | number | boolean | (string | number | boolean)[] = target.checked
  
  if (Array.isArray(model.value)) {
    const newValue = [...model.value]
    if (target.checked) {
      if (!newValue.includes(props.label as string | number | boolean)) {
        newValue.push(props.label as string | number | boolean)
      }
    } else {
      const index = newValue.indexOf(props.label as string | number | boolean)
      if (index > -1) {
        newValue.splice(index, 1)
      }
    }
    value = newValue
  } else {
    value = target.checked ? props.trueLabel || true : props.falseLabel || false
  }
  
  emit('change', value)
  
  nextTick(() => {
    if (checkbox.value) {
      checkbox.value.checked = isChecked.value
    }
  })
}
</script>

<style scoped>
.z-checkbox-button {
  position: relative;
  display: inline-block;
  outline: none;
  cursor: pointer;
  vertical-align: middle;
}

.z-checkbox-button.is-disabled {
  cursor: not-allowed;
}

.z-checkbox-button.is-disabled .z-checkbox-button__inner {
  color: #c0c4cc;
  cursor: not-allowed;
  background-image: none;
  background-color: #fff;
  border-color: #ebeef5;
  box-shadow: none;
}

.z-checkbox-button.is-disabled.is-checked .z-checkbox-button__inner {
  background-color: #f2f6fc;
  border-color: #dcdfe6;
  color: #c0c4cc;
  box-shadow: -1px 0 0 0 #dcdfe6;
}

.z-checkbox-button.is-focus .z-checkbox-button__inner {
  border-color: #409eff;
}

.z-checkbox-button:first-child .z-checkbox-button__inner {
  border-left: 1px solid #dcdfe6;
  border-radius: 4px 0 0 4px;
  box-shadow: none !important;
}

.z-checkbox-button:last-child .z-checkbox-button__inner {
  border-radius: 0 4px 4px 0;
}

.z-checkbox-button:first-child:last-child .z-checkbox-button__inner {
  border-radius: 4px;
}

.z-checkbox-button__original {
  opacity: 0;
  outline: none;
  position: absolute;
  margin: 0;
  z-index: -1;
}

.z-checkbox-button__inner {
  display: inline-block;
  line-height: 1;
  font-weight: 500;
  white-space: nowrap;
  vertical-align: middle;
  cursor: pointer;
  background: #fff;
  border: 1px solid #dcdfe6;
  border-left: 0;
  color: #606266;
  -webkit-appearance: none;
  text-align: center;
  box-sizing: border-box;
  outline: none;
  margin: 0;
  position: relative;
  transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
  padding: 12px 20px;
  font-size: 14px;
  border-radius: 0;
}

.z-checkbox-button__inner:hover {
  color: #409eff;
}

.z-checkbox-button__inner [class*="z-icon-"] {
  line-height: 0.9;
}

.z-checkbox-button__inner [class*="z-icon-"] + span {
  margin-left: 5px;
}

.z-checkbox-button.is-checked .z-checkbox-button__inner {
  color: #fff;
  background-color: #409eff;
  border-color: #409eff;
  box-shadow: -1px 0 0 0 #409eff;
}

.z-checkbox-button.is-checked:first-child .z-checkbox-button__inner {
  border-left-color: #409eff;
}

/* 尺寸变体 */
.z-checkbox-button--large .z-checkbox-button__inner {
  padding: 14px 24px;
  font-size: 16px;
  border-radius: 0;
}

.z-checkbox-button--medium .z-checkbox-button__inner {
  padding: 10px 20px;
  font-size: 14px;
  border-radius: 0;
}

.z-checkbox-button--small .z-checkbox-button__inner {
  padding: 9px 15px;
  font-size: 12px;
  border-radius: 0;
}

.z-checkbox-button--mini .z-checkbox-button__inner {
  padding: 7px 15px;
  font-size: 12px;
  border-radius: 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .z-checkbox-button__inner {
    padding: 10px 15px;
    font-size: 13px;
  }
  
  .z-checkbox-button--large .z-checkbox-button__inner {
    padding: 12px 20px;
    font-size: 15px;
  }
  
  .z-checkbox-button--small .z-checkbox-button__inner {
    padding: 8px 12px;
    font-size: 11px;
  }
  
  .z-checkbox-button--mini .z-checkbox-button__inner {
    padding: 6px 12px;
    font-size: 11px;
  }
}

/* 高对比度模式支持 */
@media (prefers-contrast: high) {
  .z-checkbox-button__inner {
    border-width: 2px;
  }
  
  .z-checkbox-button.is-checked .z-checkbox-button__inner {
    background-color: #000;
    border-color: #000;
    color: #fff;
  }
  
  .z-checkbox-button.is-disabled .z-checkbox-button__inner {
    background-color: #f0f0f0;
    border-color: #999;
    color: #666;
  }
}

/* 深色主题支持 */
@media (prefers-color-scheme: dark) {
  .z-checkbox-button__inner {
    background-color: #2a2a2a;
    border-color: #555;
    color: #e0e0e0;
  }
  
  .z-checkbox-button__inner:hover {
    color: #409eff;
    border-color: #409eff;
  }
  
  .z-checkbox-button.is-checked .z-checkbox-button__inner {
    background-color: #409eff;
    border-color: #409eff;
    color: #fff;
    box-shadow: -1px 0 0 0 #409eff;
  }
  
  .z-checkbox-button.is-disabled .z-checkbox-button__inner {
    background-color: #1a1a1a;
    border-color: #404040;
    color: #666;
  }
  
  .z-checkbox-button.is-disabled.is-checked .z-checkbox-button__inner {
    background-color: #2a2a2a;
    border-color: #404040;
    color: #666;
    box-shadow: -1px 0 0 0 #404040;
  }
  
  .z-checkbox-button:first-child .z-checkbox-button__inner {
    border-left-color: #555;
  }
  
  .z-checkbox-button.is-checked:first-child .z-checkbox-button__inner {
    border-left-color: #409eff;
  }
}

/* 无障碍支持 */
.z-checkbox-button:focus-within .z-checkbox-button__inner {
  outline: 2px solid #409eff;
  outline-offset: 2px;
}

@media (prefers-reduced-motion: reduce) {
  .z-checkbox-button__inner {
    transition: none;
  }
}

/* 动画效果 */
@keyframes buttonPress {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(0.98);
  }
  100% {
    transform: scale(1);
  }
}

.z-checkbox-button:active .z-checkbox-button__inner {
  animation: buttonPress 0.1s ease-in-out;
}

@media (prefers-reduced-motion: reduce) {
  .z-checkbox-button:active .z-checkbox-button__inner {
    animation: none;
  }
}
</style>
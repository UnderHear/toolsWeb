<template>
    <div class="my-select" :class="{ disabled, open }" @keydown.stop.prevent="onKeydown" tabindex="0">
        <button class="my-select-trigger" :disabled="disabled" type="button" @click="toggle"
            :aria-expanded="open ? 'true' : 'false'" :aria-haspopup="'listbox'">
            <span class="my-select-value">{{ selectedLabel || placeholder }}</span>
            <span class="my-select-arrow" :class="{ rotate: open }">
                <svg aria-hidden="true" height="16" viewBox="0 0 16 16" width="16">
                    <path
                        d="m4.427 7.427 3.396 3.396a.25.25 0 0 0 .354 0l3.396-3.396A.25.25 0 0 0 11.396 7H4.604a.25.25 0 0 0-.177.427Z" />
                </svg>
            </span>
        </button>
        <transition name="my-select-fade">
            <div v-if="open" class="my-select-dropdown" role="listbox" :aria-activedescendant="activeId">
                <div ref="listEl" class="my-select-options">
                    <div v-for="(option, idx) in options" :id="idBase + '-' + option.value" :key="option.value"
                        class="my-select-option" :class="{
                            selected: option.value === modelValue,
                            active: idx === highlightedIndex,
                        }" role="option" :aria-selected="option.value === modelValue ? 'true' : 'false'"
                        @click="select(option.value)" @mousemove="setHighlight(idx)">
                        <span class="label">{{ option.label }}</span>
                        <span v-if="option.value === modelValue" class="check">√</span>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'

interface Option {
    value: string
    label: string
}

const props = defineProps<{
    modelValue: string
    options: Option[]
    placeholder?: string
    disabled?: boolean
}>()
const emit = defineEmits(['update:modelValue', 'open', 'close'])

const open = ref(false)
const highlightedIndex = ref(-1)
const listEl = ref<HTMLDivElement | null>(null)
const idBase = `myselect-${Math.random().toString(36).slice(2)}`
// 用于区分不同实例，实现互斥展开
const instanceId = `myselect-inst-${Math.random().toString(36).slice(2)}`

const activeId = computed(() => {
    if (highlightedIndex.value < 0) return undefined
    const opt = props.options[highlightedIndex.value]
    return opt ? idBase + '-' + opt.value : undefined
})
const selectedLabel = computed(() => {
    const found = props.options.find(opt => opt.value === props.modelValue)
    return found ? found.label : ''
})

function toggle() {
    if (props.disabled) return
    open.value = !open.value
    if (open.value) {
        emit('open')
    // 通知其他选择框关闭
    window.dispatchEvent(new CustomEvent('my-select-open', { detail: { id: instanceId } }))
        initHighlight()
        nextTick(() => scrollHighlightedIntoView())
    } else emit('close')
}
function select(val: string) {
    emit('update:modelValue', val)
    open.value = false
    emit('close')
}
function initHighlight() {
    const idx = props.options.findIndex(o => o.value === props.modelValue)
    highlightedIndex.value = idx >= 0 ? idx : 0
}
function setHighlight(i: number) {
    highlightedIndex.value = i
}
function move(delta: number) {
    if (!open.value) {
        toggle();
        return
    }
    const len = props.options.length
    if (!len) return
    highlightedIndex.value = ((highlightedIndex.value + delta) + len) % len
    nextTick(() => scrollHighlightedIntoView())
}
function scrollHighlightedIntoView() {
    if (!listEl.value) return
    const li = listEl.value.children[highlightedIndex.value] as HTMLElement | undefined
    if (li) {
        const parent = listEl.value
        const top = li.offsetTop
        const bottom = top + li.offsetHeight
        if (top < parent.scrollTop) parent.scrollTop = top
        else if (bottom > parent.scrollTop + parent.clientHeight) parent.scrollTop = bottom - parent.clientHeight
    }
}
function onKeydown(e: KeyboardEvent) {
    if (props.disabled) return
    switch (e.key) {
        case 'ArrowDown': move(1); break
        case 'ArrowUp': move(-1); break
        case 'Enter':
        case ' ': // space
            if (!open.value) { toggle() } else if (highlightedIndex.value >= 0) select(props.options[highlightedIndex.value].value)
            break
        case 'Escape':
            if (open.value) { open.value = false; emit('close') }
            break
        case 'Tab':
            open.value = false; emit('close')
            break
    }
}
function handleClickOutside(e: MouseEvent) {
    if (!(e.target as HTMLElement).closest('.my-select')) {
        if (open.value) emit('close')
        open.value = false
    }
}
onMounted(() => {
    document.addEventListener('mousedown', handleClickOutside)
    // 监听其它实例打开事件
    window.addEventListener('my-select-open', handleOtherOpen as EventListener)
})
onBeforeUnmount(() => {
    document.removeEventListener('mousedown', handleClickOutside)
    window.removeEventListener('my-select-open', handleOtherOpen as EventListener)
})
watch(() => props.disabled, (v) => { if (v) open.value = false })

function handleOtherOpen(e: Event) {
    const ce = e as CustomEvent<{ id: string }>
    if (!open.value) return
    if (ce.detail && ce.detail.id !== instanceId) {
        open.value = false
        emit('close')
    }
}
</script>

<style scoped>
.my-select {
    position: relative;
    min-width: 0px !important;
}

.my-select:focus {
    outline: none;
}

.my-select-trigger {
    width: auto;
    /* 由内容撑开 */
    padding: 0.42rem 0.75rem;
    border: 1px solid #c9d1d9;
    border-radius: 6px;
    background: #fff;
    color: #24292f;
    font-size: 0.95rem;
    text-align: left;
    cursor: pointer;
    display: inline-flex;
    /* inline-flex 以便宽度随内容 */
    align-items: center;
    justify-content: space-between;
    gap: .5rem;
    transition: border-color .15s, background-color .15s, box-shadow .15s;
    white-space: nowrap;
    /* 不换行 */
}

.my-select.open .my-select-trigger,
.my-select-trigger:hover {
    border-color: #0969da;
}


.my-select-trigger:disabled {
    opacity: 0.55;
    cursor: not-allowed;
}

.my-select-value {
    flex: 0 0 auto;
    /* 不强制拉伸 */
    white-space: nowrap;
}

.my-select-arrow {
    margin-left: auto;
    font-size: 0.9em;
    color: #656d76;
    display: inline-flex;
    transition: transform .18s ease;
}

.my-select-arrow.rotate {
    transform: rotate(180deg);
}

.my-select-dropdown {
    position: absolute;
    left: 0;
    top: calc(100% + 4px);
    min-width: 100%;
    /* 与触发器一致 */
    width: max-content;
    /* 允许宽度跟随最长选项，但不小于触发器 */
    background: #fff;
    border: 1px solid #d1d9e1;
    border-radius: 8px;
    box-shadow: 0 6px 18px rgba(15, 23, 42, 0.08);
    z-index: 20;
    overflow: hidden;
}

.my-select-options {
    margin: 0;
    padding: 8px;
    max-height: 220px;
    overflow-y: auto;
    scrollbar-width: thin;
    display: grid;
    gap: 4px;
}

.my-select-option {
    position: relative;
    padding: 0.5em 1em;
    cursor: pointer;
    font-size: 0.9rem;
    color: #24292f;
    display: flex;
    align-items: center;
    gap: .5rem;
    transition: background .12s, color .12s;
    white-space: nowrap;
    border-radius: 4px;
}

.my-select-option.active:not(.selected) {
    background: #F2F3F4;
}

.my-select-option.selected {
    background: #F2F3F4;
    color: #25292e;
}

.my-select-option.selected .check {
    margin-left: auto;
    font-size: .8rem;
}

.my-select-option:hover {
    background: #e6ebf1;
}

.my-select.disabled .my-select-trigger {
    opacity: 0.55;
    cursor: not-allowed;
}

/* 过渡 */
.my-select-fade-enter-active,
.my-select-fade-leave-active {
    transition: opacity .12s ease, transform .12s ease;
    transform-origin: top;
}

.my-select-fade-enter-from,
.my-select-fade-leave-to {
    opacity: 0;
    transform: scale(.98);
}

.my-select-fade-enter-to,
.my-select-fade-leave-from {
    opacity: 1;
    transform: scale(1);
}
</style>

<template>
  <TransitionGroup
    ref="container"
    :class="[`vsg--${opts.preset}`, { 'vsg-anim': !isDisabled && (initialized || opts.animateInitial) }]"
    :style="{
      '--vsg-duration': `${opts.duration}ms`,
      '--vsg-easing': opts.easing,
      '--vsg-stagger': `${opts.stagger}ms`,
    }"
    class="stack-grid-container"
    name="vsg"
    tag="div"
    @enter="onEnter"
    @leave="onLeave"
    @after-leave="onAfterLeave"
  >
    <div
      v-for="(item, key) in items"
      :key="key"
      class="stack-item"
    >
      <div class="stack-inner">
        <slot name="item" v-bind="{ item, key }"/>
      </div>
    </div>
  </TransitionGroup>
</template>

<script lang="ts" setup>
import {computed, nextTick, onMounted, onUnmounted, ref, watch} from "vue"
import type {Column, ReflowData, StackGridProps, TransitionConfig, TransitionPreset, TransitionProp} from "../types"

const props = withDefaults(defineProps<StackGridProps>(), {
  items: () => [],
  gutterWidth: 0,
  gutterHeight: 0,
  // @ts-ignore - transition is declared in ../types
  transition: "scale",
})

const emits = defineEmits<{
  (e: "updated:reflow", payload: ReflowData): void
}>()

defineExpose<{ reflow: () => void }>({ reflow })

const container = ref<HTMLElement | { $el: HTMLElement } | null>(null)
const initialized = ref(false)
let ro: ResizeObserver | null = null

const defaultConfig: TransitionConfig = {
  preset: "scale",
  duration: 450,
  easing: "cubic-bezier(0.22, 1, 0.36, 1)",
  stagger: 8,
  animateInitial: false,
}

const opts = computed<TransitionConfig>(() => {
  const t = (props as unknown as { transition?: TransitionProp }).transition
  if (t === false) {
    return {...defaultConfig, preset: "none", duration: 0, stagger: 0, animateInitial: false}
  }
  if (t === true || t == null) return {...defaultConfig}
  if (typeof t === "string") {
    const allowed: TransitionPreset[] = ["none", "fade", "scale", "slide-up", "slide-fade"]
    return {...defaultConfig, preset: allowed.includes(t as TransitionPreset) ? (t as TransitionPreset) : "scale"}
  }
  return {...defaultConfig, ...(t as Partial<TransitionConfig>)}
})

const isDisabled = computed(() => opts.value.preset === "none" || opts.value.duration === 0)

function getContainerEl(): HTMLElement | null {
  const raw = container.value as any
  if (!raw) return null
  return raw instanceof HTMLElement ? raw : (raw.$el ?? null)
}

function getContainerWidth(): number {
  const el = getContainerEl()
  return el?.clientWidth || 0
}

function calculateColumnCount(containerWidth: number, columnMinWidth: number, gutterWidth: number): number {
  return Math.max(Math.floor((containerWidth + gutterWidth) / (columnMinWidth + gutterWidth)), 1)
}

function calculateColumnWidth(containerWidth: number, columnCount: number, gutterWidth: number): number {
  return (containerWidth - gutterWidth * (columnCount - 1)) / columnCount
}

function generateBaseColumns(columnCount: number, columnWidth: number, gutterWidth: number): Column[] {
  return Array.from({length: columnCount}, (_, i) => ({
    x: i * (columnWidth + gutterWidth),
    h: 0,
  }))
}

function updateColumnData(): ReflowData {
  const containerWidth = getContainerWidth()
  const columnCount = calculateColumnCount(containerWidth, props.columnMinWidth, props.gutterWidth!)
  const columnWidth = calculateColumnWidth(containerWidth, columnCount, props.gutterWidth!)
  return {containerWidth, columnCount, columnWidth}
}

function update(): void {
  nextTick(reflow)
}

function reflow(): void {
  const {containerWidth, columnCount, columnWidth} = updateColumnData()
  let cols = generateBaseColumns(columnCount, columnWidth, props.gutterWidth!)

  emits("updated:reflow", {containerWidth, columnCount, columnWidth})

  const root = getContainerEl()
  if (!root) {
    updateContainerHeight(cols)
    return
  }

  const rawChildren = root.children ? Array.from(root.children) : []
  const children = rawChildren.filter(
    (el) => !(el as HTMLElement).classList.contains("vsg-leave-active"),
  ) as HTMLElement[]

  if (children.length === 0) {
    updateContainerHeight(cols)
    return
  }

  arrangeItems(children, cols, columnWidth)
}

function arrangeItems(children: HTMLElement[], cols: Column[], columnWidth: number): void {
  if (!children?.length || !cols?.length) return

  children.forEach((child, i) => {
    let minIdx = 0
    let minVal = Number.POSITIVE_INFINITY
    for (let c = 0; c < cols.length; c++) {
      if (cols[c].h < minVal) {
        minVal = cols[c].h
        minIdx = c
      }
    }

    child.style.width = `${columnWidth}px`
    const x = cols[minIdx].x
    const y = cols[minIdx].h
    child.style.transform = `translate3d(${x}px, ${y}px, 0)`
    child.style.setProperty("--vsg-i", String(i))
    ;(child as HTMLElement).dataset.vsgX = String(x)
    ;(child as HTMLElement).dataset.vsgY = String(y)

    cols[minIdx].h += child.offsetHeight + (props.gutterHeight ?? 0)
  })

  updateContainerHeight(cols)
}

function updateContainerHeight(cols: Column[]): void {
  const containerHeight = cols.reduce((max, col) => Math.max(max, col.h), 0)
  const el = getContainerEl()
  if (el) {
    el.style.height = `${containerHeight}px`
  }
}

function onEnter(el: Element) {
  const h = el as HTMLElement
  const prev = h.style.transition
  h.style.transition = "none"
  const x = h.dataset.vsgX
  const y = h.dataset.vsgY
  if (x != null && y != null) {
    h.style.transform = `translate3d(${x}px, ${y}px, 0)`
  }
  void h.offsetHeight
  h.style.transition = prev
}

function onLeave(el: Element) {
  (el as HTMLElement).style.pointerEvents = "none"
}

function onAfterLeave() {
  reflow()
}

watch(() => props.items, () => update(), {deep: true})

onMounted(() => {
  if (typeof ResizeObserver !== "undefined") {
    ro = new ResizeObserver(() => update())
    const el = getContainerEl()
    if (el) ro.observe(el)
  } else {
    window.addEventListener("resize", reflow)
  }
  update()
  nextTick(() => {
    initialized.value = true
  })
})

onUnmounted(() => {
  ro?.disconnect()
  window.removeEventListener?.("resize", reflow)
})
</script>

<style scoped>
.stack-grid-container {
  position: relative;
  width: 100%;
  transition: height var(--vsg-duration) var(--vsg-easing);
}

.stack-item {
  position: absolute;
  top: 0;
  left: 0;
  will-change: transform, width;
  transition-property: transform, width;
  transition-duration: var(--vsg-duration);
  transition-timing-function: var(--vsg-easing);
  transition-delay: calc(var(--vsg-i, 0) * var(--vsg-stagger, 0ms));
}

.stack-inner {
  width: 100%;
  height: 100%;
  transition: opacity var(--vsg-duration) var(--vsg-easing),
  transform var(--vsg-duration) var(--vsg-easing);
}

/* disable outer transform animation during enter so presets differ */
.vsg-enter-active.stack-item,
.vsg-enter-from.stack-item {
  transition: none !important;
}

/* no animations when disabled */
.stack-grid-container:not(.vsg-anim),
.stack-grid-container:not(.vsg-anim) .stack-item,
.stack-grid-container:not(.vsg-anim) .stack-inner {
  transition: none !important;
}

/* base enter/leave for inner */
.vsg-enter-from .stack-inner {
  opacity: 0;
}

.vsg-leave-to .stack-inner {
  opacity: 0;
}

/* presets */
.vsg--none .stack-inner {
  transition: none;
}

.vsg--none.vsg-enter-from .stack-inner,
.vsg--none.vsg-leave-to .stack-inner {
  opacity: 1;
  transform: none;
}

.vsg--fade .stack-inner {
}

.vsg--scale .vsg-enter-from .stack-inner {
  transform: scale(0.96);
}

.vsg--scale .vsg-leave-to .stack-inner {
  transform: scale(0.96);
}

.vsg--slide-up .vsg-enter-from .stack-inner {
  transform: translateY(14px);
}

.vsg--slide-up .vsg-leave-to .stack-inner {
  transform: translateY(-10px);
}

.vsg--slide-fade .vsg-enter-from .stack-inner {
  opacity: 0;
  transform: translateY(18px) scale(0.985);
}

.vsg--slide-fade .vsg-leave-to .stack-inner {
  opacity: 0;
  transform: translateY(-12px) scale(0.985);
}
</style>

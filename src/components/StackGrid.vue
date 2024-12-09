<template>
  <div ref="container" class="stack-grid-container">
    <div v-for="(item, key) in items" :key="key" class="stack-item">
      <slot name="item" v-bind="{ item, key }"/>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {nextTick, onMounted, onUnmounted, ref, watch} from 'vue'
import type {Column, ReflowData, StackGridProps} from '@/types'

const props = withDefaults(defineProps<StackGridProps>(), {
  gutterWidth: 0,
  gutterHeight: 0
})

const emits = defineEmits<{
  (event: 'updated:reflow', data: ReflowData): void
}>()

defineExpose({reflow})

const container = ref<HTMLDivElement>()

function getContainerWidth(): number {
  return container.value?.clientWidth || 0
}

function calculateColumnCount(
  containerWidth: number,
  columnMinWidth: number,
  gutterWidth: number
): number {
  return Math.max(
    Math.floor((containerWidth + gutterWidth) / (columnMinWidth + gutterWidth)),
    1
  )
}

function calculateColumnWidth(
  containerWidth: number,
  columnCount: number,
  gutterWidth: number
): number {
  return (containerWidth - gutterWidth * (columnCount - 1)) / columnCount
}

function generateBaseColumns(
  columnCount: number,
  columnWidth: number,
  gutterWidth: number
): Column[] {
  return Array.from({length: columnCount}, (_, i) => ({
    x: i * (columnWidth + gutterWidth),
    h: 0
  }))
}

function updateColumnData(): ReflowData {
  const containerWidth = getContainerWidth()
  const count = calculateColumnCount(containerWidth, props.columnMinWidth, props.gutterWidth)
  const width = calculateColumnWidth(containerWidth, count, props.gutterWidth)

  return {
    containerWidth,
    columnCount: count,
    columnWidth: width
  }
}

function update(): void {
  nextTick(reflow)
}

function reflow(): void {
  const {containerWidth, columnCount, columnWidth} = updateColumnData()
  let cols = generateBaseColumns(columnCount, columnWidth, props.gutterWidth)

  emits('updated:reflow', {containerWidth, columnCount, columnWidth})

  if (container.value && container.value.children.length) {
    arrangeItems(container.value.children, cols, columnWidth)
  }
}

function arrangeItems(
  children: HTMLCollection,
  cols: Column[],
  columnWidth: number
): void {
  if (!children || !cols || !cols.length) return

  Array.from(children).forEach((child) => {
    const {index} = cols.reduce<{ index: number; minHeight: number | null }>(
      (acc, col, idx) => {
        if (acc.minHeight === null || col.h < acc.minHeight) {
          return {index: idx, minHeight: col.h}
        }
        return acc
      },
      {index: 0, minHeight: null}
    )

    if (index === undefined || index < 0 || index >= cols.length) return

    const element = child as HTMLElement
    element.style.width = `${columnWidth}px`
    element.style.transform = `translate(${cols[index].x}px, ${cols[index].h}px)`
    cols[index].h += element.offsetHeight + props.gutterHeight
  })

  updateContainerHeight(cols)
}

function updateContainerHeight(cols: Column[]): void {
  if (!container.value) return
  const containerHeight = cols.reduce((max, col) => Math.max(max, col.h), 0)
  container.value.style.height = `${containerHeight}px`
}

watch(
  () => props.items,
  () => {
    update()
  },
  {deep: true}
)

onMounted(() => {
  window.addEventListener('resize', reflow)
  update()
})

onUnmounted(() => {
  window.removeEventListener('resize', reflow)
})
</script>

<style scoped>
.stack-grid-container {
    display: block;
    position: relative;
    width: 100%;
}

.stack-item {
    position: absolute;
    top: 0;
    left: 0;
}
</style>
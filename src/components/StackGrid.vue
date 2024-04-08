<template>
  <div class="stack-grid-container" ref="container">
    <div class="stack-item" v-for="(item, key) in items" :key="key">
      <slot name="item" v-bind="{item, key}"/>
    </div>
  </div>
</template>

<script setup>
import { nextTick, onMounted, onUnmounted, ref } from 'vue'

const props = defineProps({
  items: Array,
  columnMinWidth: Number,
  gutterWidth: {
    type: Number,
    default: 0
  },
  gutterHeight: {
    type: Number,
    default: 0
  },
})

defineExpose({ reflow })
const emits = defineEmits(['updated:reflow'])

const container = ref()

function getContainerWidth () {
  return container.value?.clientWidth || 0
}

function calculateColumnCount (containerWidth, columnMinWidth, gutterWidth) {
  return Math.max(
    Math.floor((containerWidth + gutterWidth) / (columnMinWidth + gutterWidth)),
    1
  )
}

function calculateColumnWidth (containerWidth, columnCount, gutterWidth) {
  return (containerWidth - gutterWidth * (columnCount - 1)) / columnCount
}

function generateBaseColumns (columnCount, columnWidth, gutterWidth) {
  return Array.from({ length: columnCount }, (_, i) => ({
    x: i * (columnWidth + gutterWidth),
    h: 0
  }))
}

function updateColumnData () {
  const containerWidth = getContainerWidth()
  const count = calculateColumnCount(containerWidth, props.columnMinWidth, props.gutterWidth)
  const width = calculateColumnWidth(containerWidth, count, props.gutterWidth)

  return {
    containerWidth,
    columnCount: count,
    columnWidth: width
  }
}

function update () {
  nextTick(reflow)
}

function reflow () {
  const { containerWidth, columnCount, columnWidth } = updateColumnData()
  let cols = generateBaseColumns(columnCount, columnWidth, props.gutterWidth)

  emits('updated:reflow', { containerWidth, columnCount, columnWidth })

  if (container.value && container.value.children.length) {
    arrangeItems(container.value.children, cols, columnWidth)
  }
}

function arrangeItems(children, cols, columnWidth) {
  if (!children || !cols || !cols.length) return; // Add guard clause here

  Array.from(children).forEach((child) => {
    const { index } = cols.reduce((acc, col, idx) => {
      if (acc.minHeight === null || col.h < acc.minHeight) {
        return { index: idx, minHeight: col.h };
      }
      return acc;
    }, { index: 0, minHeight: null });

    if (index === undefined || index < 0 || index >= cols.length) return; // Additional check for index

    child.style.width = `${columnWidth}px`;
    child.style.transform = `translate(${cols[index].x}px, ${cols[index].h}px)`;
    cols[index].h += child.offsetHeight + props.gutterHeight;
  });

  updateContainerHeight(cols);
}

function updateContainerHeight (cols) {
  const containerHeight = cols.reduce((max, col) => Math.max(max, col.h), 0)
  container.value.style.height = `${containerHeight}px`
}

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

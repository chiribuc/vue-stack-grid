# StackGrid for Vue 3

StackGrid is a Vue 3 component for fast, dynamic **masonry/stack** layouts. It automatically arranges items based on the container width and now supports **buttery-smooth transitions** for add/remove/reflow events.

![twitter-card](https://github.com/chiribuc/chiribuc/assets/46414598/2b34aca7-678a-495a-b9c3-40ecf43d81ae)

## Demo
See the [demo](https://vue-stack-grid.crobert.dev/) for a live example of StackGrid in action.

## Features

- **Responsive**: Automatically adapts to container width.
- **Transitions (new)**: Simple `transition` prop with presets (`fade`, `scale`, `slide-up`, `slide-fade`) or fully disabled.
- **Customizable**: Control minimum column width and horizontal/vertical gutters.
- **Slot Support**: Use the `item` slot to render anything.
- **Vue 3 Composition API**: Lightweight, GPU-friendly transforms.
- **TypeScript-ready**: Public types live in `src/types/index.ts` and ship with the package.

## Installation

```bash
npm i @crob/vue-stack-grid
# or
yarn add @crob/vue-stack-grid
```

## Usage

Basic example:

```vue
<template>
  <StackGrid
    :items="items"
    :column-min-width="160"
    :gutter-width="12"
    :gutter-height="12"
  >
    <template #item="{ item }">
      <div class="card">{{ item.title }}</div>
    </template>
  </StackGrid>
</template>

<script setup>
import StackGrid from '@crob/vue-stack-grid'
const items = [
  { id: 1, title: 'Alpha' },
  { id: 2, title: 'Beta' },
  { id: 3, title: 'Gamma' },
]
</script>
```

### With transitions

Pick a preset (simple):

```vue
<StackGrid
  :items="items"
  :column-min-width="280"
  :gutter-width="16"
  :gutter-height="16"
  transition="slide-fade"
>
  <template #item="{ item }">
    <Card :data="item" />
  </template>
</StackGrid>
```

Disable all animations:

```vue
<StackGrid
  :items="items"
  :column-min-width="280"
  transition="none"
/>
```

Fine‑tune via object:

```vue
<StackGrid
  :items="items"
  :column-min-width="300"
  :gutter-width="12"
  :gutter-height="12"
  :transition="{
    preset: 'scale',
    duration: 350,
    easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
    stagger: 12,
    animateInitial: true
  }"
/>
```

## Props

| Prop              | Type                                                      | Required | Default | Description |
|-------------------|-----------------------------------------------------------|:--------:|:-------:|-------------|
| `items`           | `any[]`                                                   |   ✅     |   —     | Items to render. Prefer stable keys (e.g. `item.id`). |
| `columnMinWidth`  | `number`                                                  |   ✅     |   —     | Minimum width for a column (in px). |
| `gutterWidth`     | `number`                                                  |         |   `0`   | Horizontal gap between columns (in px). |
| `gutterHeight`    | `number`                                                  |         |   `0`   | Vertical gap between rows (in px). |
| `transition`      | `false` \| `'none' \| 'fade' \| 'scale' \| 'slide-up' \| 'slide-fade'` \| `{ preset?, duration?, easing?, stagger?, animateInitial? }` |         | `'scale'` | Controls enter/leave/move animations. `false` behaves like `'none'` with duration `0`. |

### Transition details

- **Presets**: `'fade'`, `'scale'`, `'slide-up'`, `'slide-fade'`, or `'none'` to disable effects (movement still occurs without easing if duration > 0).
- **Object form** (partial allowed):
  - `preset`: one of presets above
  - `duration`: number in ms (default `300`)
  - `easing`: CSS timing function (default `cubic-bezier(0.22, 1, 0.36, 1)`)
  - `stagger`: number in ms per item (default `0`)
  - `animateInitial`: animate first render (default `false`)

## Events

### `updated:reflow`

Emitted after each layout pass. Payload type is `ReflowData`:

```ts
interface ReflowData {
  containerWidth: number
  columnCount: number
  columnWidth: number
}
```

Listening example:

```vue
<template>
  <StackGrid
    :items="items"
    :column-min-width="220"
    @updated:reflow="onReflow"
  />
</template>

<script setup>
function onReflow(payload) {
  console.log('reflow', payload)
}
</script>
```

## Methods

### `reflow()`

Programmatically trigger a layout recompute:

```vue
<template>
  <StackGrid ref="stack" :items="items" :column-min-width="200" />
  <button @click="stack?.reflow()">Reflow</button>
</template>

<script setup>
import { ref } from 'vue'
const stack = ref()
</script>
```

## Types

Types live in `src/types/index.ts` and are exported by the package:

```ts
export interface Column { x: number; h: number }
export interface ReflowData { containerWidth: number; columnCount: number; columnWidth: number }
export interface StackGridProps<Item = any> {
  items: Item[]
  columnMinWidth: number
  gutterWidth?: number
  gutterHeight?: number
  transition?: TransitionProp
}
export type TransitionPreset = 'none' | 'fade' | 'scale' | 'slide-up' | 'slide-fade'
export interface TransitionConfig {
  preset: TransitionPreset
  duration: number
  easing: string
  stagger: number
  animateInitial: boolean
}
export type TransitionProp = boolean | TransitionPreset | Partial<TransitionConfig>
```

## Tips

- **Keys**: For best movement/exit quality, use stable keys for your items (`:key="item.id"`).
- **Images**: If your card height depends on images, ensure images have dimensions or call `reflow()` after they load.
- **SSR/Tests**: The component gracefully falls back to `window.resize` when `ResizeObserver` is unavailable (e.g. JSDOM).

## Contributing

Issues and PRs welcome. If you’re proposing a feature, include a short rationale and, if possible, a tiny reproduction or GIF.

## License

MIT

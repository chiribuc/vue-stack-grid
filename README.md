# StackGrid for Vue 3

StackGrid is a Vue 3 component designed to make it easy and efficient to create dynamic, responsive grid layouts. It automatically arranges items based on the available container width, ensuring a visually appealing presentation on all devices.

![twitter-card](https://github.com/chiribuc/chiribuc/assets/46414598/2b34aca7-678a-495a-b9c3-40ecf43d81ae)

## Demo
See the [demo](https://vue-stack-grid.crobert.dev/) for a live example of StackGrid in action.

## Features

- **Responsive**: Automatically adjusts to the container's width.
- **Customizable**: Offers props for minimum column width, gutter width, and gutter height.
- **Slot Support**: Utilize slots to customize the content of each grid item.
- **Vue 3 Composition API**: Built with Vue 3's Composition API for better performance and readability.

## Installation

To install StackGrid, use npm or yarn:

```
npm i @crob/vue-stack-grid
```

or

```
yarn add @crob/vue-stack-grid
```

## Usage

Import StackGrid into your component and use it in your template. Provide it with the necessary props like `items`, `columnMinWidth`, `gutterWidth`, and `gutterHeight`. Use the slot `item` to customize how each item in the grid should be displayed.

```vue
<template>
  <StackGrid :items="items" :column-min-width="100" :gutter-width="10" :gutter-height="10">
    <template #item="{ item }">
      <div>{{ item }}</div>
    </template>
  </StackGrid>
</template>

<script setup>
import StackGrid from '@crob/vue-stack-grid';
const items = [...]; // your items here
</script>
```

## Props

- **items** (required): An array of items to display in the grid.
- **columnMinWidth** (required): The minimum width of each column in pixels.
- **gutterWidth**: The horizontal gap between columns in pixels. Default is `0`.
- **gutterHeight**: The vertical gap between rows in pixels. Default is `0`.

## Events

### `updated:reflow`

The `updated:reflow` event is emitted after the grid layout has been recalculated. This can occur in response to various triggers, such as a window resize or manual invocation of the reflow process. This event provides a way for parent components to react to changes in the grid layout, enabling additional custom behavior or UI updates based on the new layout state.

#### Listening to the Event

To listen to the `updated:reflow` event, attach an event listener to the `<StackGrid>` component in your template. You can then define a method within your component to handle the event.

```vue
<template>
  <StackGrid @updated:reflow="handleReflowEvent"></StackGrid>
</template>

<script setup>
import { defineComponent } from 'vue';
import StackGrid from '@crob/vue-stack-grid';

const handleReflowEvent = () => {
  console.log('Grid layout was updated.');
  // Additional logic to handle the grid update...
};
</script>
```


## Methods

### `reflow`

Triggers a reflow of the grid layout. This can be useful if you've dynamically changed the items or their sizes and need to re-calculate the layout of the grid.  
To use this method, you'll need to get a reference to the StackGrid component instance in your parent component. Here's an example of how to do this with Vue 3's Composition API:

```vue
<template>
  <StackGrid ref="stackGridRef" :items="items" :columnMinWidth="100" :gutterWidth="10" :gutterHeight="10">
    <template #item="{ item }">
      <div>{{ item }}</div>
    </template>
  </StackGrid>
  <button @click="reflowGrid">Reflow Grid</button>
</template>

<script setup>
import { ref } from 'vue';
import StackGrid from '@crob/vue-stack-grid';

const stackGridRef = ref();
const items = ref([...]); // Your items here

function reflowGrid() {
  if (stackGridRef.value) {
    stackGridRef.value.reflow();
  }
}
</script>
```

This section demonstrates how to access and call the `reflow` method exposed by the StackGrid component.

## Contributing

Contributions are welcome! If you have an idea or suggestion, please feel free to fork the repository, make your changes, and submit a pull request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

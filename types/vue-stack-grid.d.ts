// vue-stack-grid.d.ts
import type { DefineComponent } from 'vue'

declare module '@crob/vue-stack-grid' {
  interface StackGridProps<T = any> {
    items: T[]
    columnMinWidth?: number
    gutterWidth?: number
    gutterHeight?: number
  }

  interface StackGridSlots<T = any> {
    item: (props: { item: T; key: number }) => any
  }

  const StackGrid: DefineComponent<StackGridProps<any>, {}, {}, {}, {}, {}, StackGridSlots<any>>

  export default StackGrid
}

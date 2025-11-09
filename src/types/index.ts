export interface Column {
  x: number
  h: number
}

export interface ReflowData {
  containerWidth: number
  columnCount: number
  columnWidth: number
}

export interface StackGridProps<Item = any> {
  items: Item[]
  columnMinWidth: number
  gutterWidth?: number
  gutterHeight?: number
  /**
   * Transition setup:
   * - false → no animations
   * - 'none' | 'fade' | 'scale' | 'slide-up' | 'slide-fade' → preset
   * - object → fine-grained control
   */
  transition?: TransitionProp
}

export type TransitionPreset = "none" | "fade" | "scale" | "slide-up" | "slide-fade"

export interface TransitionConfig {
  preset: TransitionPreset
  duration: number       // ms
  easing: string         // CSS timing-function
  stagger: number        // ms per-item delay
  animateInitial: boolean
}

export type TransitionProp =
  | boolean
  | TransitionPreset
  | Partial<TransitionConfig>

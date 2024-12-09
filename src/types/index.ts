export interface Column {
  x: number
  h: number
}

export interface ReflowData {
  containerWidth: number
  columnCount: number
  columnWidth: number
}

export interface StackGridProps {
  items: any[]
  columnMinWidth: number
  gutterWidth?: number
  gutterHeight?: number
}
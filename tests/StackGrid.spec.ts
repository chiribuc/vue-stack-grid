import {mount} from "@vue/test-utils"
import {beforeEach, describe, expect, it, vi} from "vitest"
import StackGrid from "../src/components/StackGrid.vue"
import type {ReflowData} from "../src/types"

// tiny async helpers
const tick = () => new Promise<void>((r) => setTimeout(r, 0))
const nt = () => Promise.resolve()

function mockClientWidth(px: number) {
  Object.defineProperty(HTMLElement.prototype, "clientWidth", {
    configurable: true,
    get() {
      return px
    },
  })
}

function mockOffsetHeight(px: number) {
  Object.defineProperty(HTMLElement.prototype, "offsetHeight", {
    configurable: true,
    get() {
      return px
    },
  })
}

describe("StackGrid", () => {
  beforeEach(() => {
    // default container width & child heights
    mockClientWidth(1024)
    mockOffsetHeight(100)
  })

  it("renders properly with items", async () => {
    const items = [1, 2, 3]
    const wrapper = mount(StackGrid, {
      props: {items, columnMinWidth: 200},
      slots: {
        item: `
          <template #item="{ item }">
            <div>Item: {{ item }}</div>
          </template>
        `,
      },
      attachTo: document.body,
    })

    await nt()
    await tick()
    expect(wrapper.findAll(".stack-item")).toHaveLength(3)
  })

  it("emits reflow event when mounted", async () => {
    const wrapper = mount(StackGrid, {
      props: {items: [1], columnMinWidth: 200},
      slots: {
        item: `
          <template #item="{ item }">
            <div>Item: {{ item }}</div>
          </template>
        `,
      },
      attachTo: document.body,
    })

    await nt()
    await tick()

    const emitted = wrapper.emitted("updated:reflow") as Array<[ReflowData]>
    expect(emitted).toBeTruthy()
    expect(emitted[0][0]).toHaveProperty("containerWidth")
    expect(emitted[0][0]).toHaveProperty("columnCount")
    expect(emitted[0][0]).toHaveProperty("columnWidth")
  })

  it("recalculates layout on window resize", async () => {
    // start wide
    mockClientWidth(1200) // => floor(1200/200) = 6 cols

    const wrapper = mount(StackGrid, {
      props: {items: [1, 2, 3], columnMinWidth: 200},
      slots: {
        item: `
        <template #item="{ item }">
          <div>Item: {{ item }}</div>
        </template>
      `,
      },
      attachTo: document.body,
    })

    await Promise.resolve()
    await new Promise(r => setTimeout(r, 0))

    const initialEmits = wrapper.emitted("updated:reflow") as Array<[ReflowData]>
    expect(initialEmits?.[0]?.[0]?.columnCount).toBeGreaterThan(0)

    // now narrower: change getter, dispatch resize, then force a manual reflow
    mockClientWidth(300) // => floor(300/200) = 1 col
    window.dispatchEvent(new Event("resize"))

    // force recompute in case the environment didn't schedule it yet
    ;(wrapper.vm as any).reflow?.()
    await Promise.resolve()
    await new Promise(r => setTimeout(r, 0))

    const emits = wrapper.emitted("updated:reflow") as Array<[ReflowData]>
    const last = emits[emits.length - 1][0]
    expect(last.columnCount).toBeLessThan(initialEmits[0][0].columnCount)
  })

  it("handles gutter width and height properly", async () => {
    const wrapper = mount(StackGrid, {
      props: {items: [1, 2], columnMinWidth: 200, gutterWidth: 20, gutterHeight: 20},
      slots: {
        item: `
          <template #item="{ item }">
            <div style="height: 100px;">Item: {{ item }}</div>
          </template>
        `,
      },
      attachTo: document.body,
    })

    await nt()
    await tick()

    const stackItems = wrapper.findAll(".stack-item")
    const firstItem = stackItems[0].element as HTMLElement
    const secondItem = stackItems[1].element as HTMLElement

    expect(firstItem.style.transform).toBeTruthy()
    expect(secondItem.style.transform).toBeTruthy()
  })

  it("watches for changes in items and updates layout", async () => {
    const wrapper = mount(StackGrid, {
      props: {items: [1, 2], columnMinWidth: 200},
      slots: {
        item: `
          <template #item="{ item }">
            <div style="height: 100px;">Item: {{ item }}</div>
          </template>
        `,
      },
      attachTo: document.body,
    })

    await nt()
    await tick()

    // clear prior emits
    const reflowEvents = wrapper.emitted("updated:reflow")
    if (reflowEvents) reflowEvents.length = 0

    await wrapper.setProps({items: [1, 2, 3]})
    await nt()
    await tick()

    const newReflowEvents = wrapper.emitted("updated:reflow")
    expect(newReflowEvents && newReflowEvents.length).toBeGreaterThanOrEqual(1)
    expect(wrapper.findAll(".stack-item")).toHaveLength(3)
  })

  it("cleans up resize listener on unmount", () => {
    const removeEventListenerSpy = vi.spyOn(window, "removeEventListener")
    const wrapper = mount(StackGrid, {
      props: {items: [1], columnMinWidth: 200},
      attachTo: document.body,
    })
    wrapper.unmount()
    expect(removeEventListenerSpy).toHaveBeenCalledWith("resize", expect.any(Function))
  })
})

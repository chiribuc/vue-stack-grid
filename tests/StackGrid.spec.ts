import {mount} from '@vue/test-utils'
import StackGrid from '../src/components/StackGrid.vue'
import {beforeEach, describe, expect, it, vi} from 'vitest'
import type {ReflowData} from '../src/types'

describe('StackGrid', () => {
  beforeEach(() => {
    // Reset and mock DOM measurements
    vi.spyOn(Element.prototype, 'clientWidth', 'get').mockImplementation(() => 1024)

    Object.defineProperty(HTMLElement.prototype, 'offsetHeight', {
      configurable: true,
      value: 100
    })
  })

  it('renders properly with items', () => {
    const items = [1, 2, 3]
    const wrapper = mount(StackGrid, {
      props: {
        items,
        columnMinWidth: 200
      },
      slots: {
        item: `
          <template #item="{ item }">
            <div>Item: {{ item }}</div>
          </template>
        `
      }
    })

    expect(wrapper.findAll('.stack-item')).toHaveLength(3)
  })

  it('emits reflow event when mounted', async () => {
    const wrapper = mount(StackGrid, {
      props: {
        items: [1],
        columnMinWidth: 200
      },
      slots: {
        item: `
          <template #item="{ item }">
            <div>Item: {{ item }}</div>
          </template>
        `
      }
    })

    await wrapper.vm.$nextTick()
    const emitted = wrapper.emitted('updated:reflow') as Array<[ReflowData]>
    expect(emitted).toBeTruthy()
    expect(emitted[0][0]).toHaveProperty('containerWidth')
    expect(emitted[0][0]).toHaveProperty('columnCount')
    expect(emitted[0][0]).toHaveProperty('columnWidth')
  })

  it('recalculates layout on window resize', async () => {
    // Start with a wider container
    vi.spyOn(Element.prototype, 'clientWidth', 'get').mockImplementation(() => 1000)

    const wrapper = mount(StackGrid, {
      props: {
        items: [1, 2, 3],
        columnMinWidth: 200
      },
      slots: {
        item: `
          <template #item="{ item }">
            <div>Item: {{ item }}</div>
          </template>
        `
      }
    })

    await wrapper.vm.$nextTick()
    const initialEmit = wrapper.emitted('updated:reflow') as Array<[ReflowData]>

    // Now simulate a narrower container
    vi.spyOn(Element.prototype, 'clientWidth', 'get').mockImplementation(() => 300)
    window.dispatchEvent(new Event('resize'))

    await wrapper.vm.$nextTick()
    await new Promise(resolve => setTimeout(resolve, 0))

    const resizeEmit = wrapper.emitted('updated:reflow') as Array<[ReflowData]>
    expect(resizeEmit[resizeEmit.length - 1][0].columnCount)
      .toBeLessThan(initialEmit[0][0].columnCount)
  })

  it('handles gutter width and height properly', async () => {
    const wrapper = mount(StackGrid, {
      props: {
        items: [1, 2],
        columnMinWidth: 200,
        gutterWidth: 20,
        gutterHeight: 20
      },
      slots: {
        item: `
          <template #item="{ item }">
            <div>Item: {{ item }}</div>
          </template>
        `
      }
    })

    await wrapper.vm.$nextTick()
    const stackItems = wrapper.findAll('.stack-item')
    const firstItem = stackItems[0].element as HTMLElement
    const secondItem = stackItems[1].element as HTMLElement

    expect(firstItem.style.transform).toBeTruthy()
    expect(secondItem.style.transform).toBeTruthy()
  })

  it('watches for changes in items and updates layout', async () => {
    const wrapper = mount(StackGrid, {
      props: {
        items: [1, 2],
        columnMinWidth: 200,
      },
      slots: {
        item: `
        <template #item="{ item }">
          <div>Item: {{ item }}</div>
        </template>
      `,
      },
    });

    await wrapper.vm.$nextTick();

    // Clear the 'updated:reflow' events before the test
    const reflowEvents = wrapper.emitted('updated:reflow');
    if (reflowEvents) {
      reflowEvents.length = 0;
    }

    await wrapper.setProps({ items: [1, 2, 3] });
    await wrapper.vm.$nextTick();

    const newReflowEvents = wrapper.emitted('updated:reflow');
    if (newReflowEvents) {
      expect(newReflowEvents.length).toBeGreaterThanOrEqual(1);
    } else {
      expect(newReflowEvents).toBeDefined();
    }

    expect(wrapper.findAll('.stack-item')).toHaveLength(3);
  });

  it('cleans up resize listener on unmount', () => {
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener')
    const wrapper = mount(StackGrid, {
      props: {
        items: [1],
        columnMinWidth: 200
      }
    })

    wrapper.unmount()
    expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function))
  })
})
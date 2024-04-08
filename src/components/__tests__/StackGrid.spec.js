import { mount } from '@vue/test-utils';
import StackGrid from '../StackGrid.vue';

describe('StackGrid', () => {
    it('renders correctly', () => {
        const wrapper = mount(StackGrid);
        expect(wrapper.exists()).toBe(true);
    });

    it('renders the correct DOM structure', () => {
        const items = [{ id: 1 }, { id: 2 }, { id: 3 }];
        const wrapper = mount(StackGrid, {
            props: {
                items,
            },
        });

        // Check if the correct number of items are rendered
        expect(wrapper.findAll('.stack-item')).toHaveLength(items.length);
    });

    it('adds and removes window resize event listener', async () => {
        const addEventListenerSpy = jest.spyOn(window, 'addEventListener');
        const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');

        const wrapper = mount(StackGrid);
        expect(addEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));

        wrapper.unmount();
        expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));

        addEventListenerSpy.mockRestore();
        removeEventListenerSpy.mockRestore();
    });
});

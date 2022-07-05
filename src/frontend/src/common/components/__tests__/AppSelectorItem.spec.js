import { mount } from "@vue/test-utils";
import AppSelectorItem from "@/common/components/AppSelectorItem";

describe("AppSelectorItem", () => {
  const slots = { default: "content" };
  const listeners = { changeSelectedItem: null };
  const propsData = {
    item: {
      value: "testValue",
      isChecked: true,
    },
    inputName: "testName",
  };

  let wrapper;
  const createComponent = (options) => {
    wrapper = mount(AppSelectorItem, options);
  };

  afterEach(() => {
    wrapper.destroy();
  });

  it("renders out the slot content", () => {
    createComponent({ propsData, slots });
    expect(wrapper.html()).toContain(slots.default);
  });

  // тут доделать, сейчас не работает
  it("raises changeSelectedItem event on click", async () => {
    createComponent({ listeners });
    await wrapper.trigger("click");
    expect(listeners.changeSelectedItem).toHaveBeenCalled();
  });
});

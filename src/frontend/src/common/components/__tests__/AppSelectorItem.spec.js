import { mount } from "@vue/test-utils";
import AppSelectorItem from "@/common/components/AppSelectorItem";

describe("AppSelectorItem", () => {
  const slots = { default: "content" };
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

  it("emits changeSelectedItem event when radio button value changed", async () => {
    createComponent({ propsData });
    let input = wrapper.find("input");
    await input.trigger("change");
    expect(wrapper.emitted("changeSelectedItem")).toBeTruthy();
  });
});

import { shallowMount } from "@vue/test-utils";
import AppRadioButton from "@/common/components/AppRadioButton";

describe("AppRadioButton", () => {
  const slots = { default: "content" };
  const propsData = {
    value: "testValue",
    isChecked: false,
    inputName: "testName",
  };

  let wrapper;
  const createComponent = (options) => {
    wrapper = shallowMount(AppRadioButton, options);
  };

  afterEach(() => {
    wrapper.destroy();
  });

  it("sets the initial model value", () => {
    createComponent({ propsData });
    expect(wrapper.find("input").element.value).toBe(propsData.value);
  });

  it("emits change event on click and changes the value to the opposite", async () => {
    createComponent({ propsData });
    await wrapper.trigger("click");
    expect(wrapper.emitted().change).toBeTruthy();
    expect(wrapper.find("input").element.value).toBeTruthy();
  });

  it("input isn't checked if prop isChecked is false", () => {
    createComponent({ propsData });
    expect(wrapper.find("input").element.checked).toBeFalsy();
  });

  it("input is checked if prop isChecked is true", () => {
    propsData.isChecked = true;
    createComponent({ propsData });
    expect(wrapper.find("input").element.checked).toBeTruthy();
  });

  it("input name is prop inputName", () => {
    createComponent({ propsData });
    let input = wrapper.find("input");
    expect(input.attributes("name")).toBe(propsData.inputName);
  });

  it("renders out the slot content", () => {
    createComponent({ propsData, slots });
    expect(wrapper.html()).toContain(slots.default);
  });
});

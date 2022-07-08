import { shallowMount } from "@vue/test-utils";
import AppRadioButton from "@/common/components/AppRadioButton";

describe("AppRadioButton", () => {
  const slots = { default: "content" };
  const defaultPropsData = {
    value: "testValue",
    isChecked: false,
    inputName: "testName",
  };

  const getPropsData = (params) => {
    return {
      propsData: {
        ...defaultPropsData,
        ...params
      }
    }
  };

  let wrapper;
  const createComponent = (options) => {
    wrapper = shallowMount(AppRadioButton, options);
  };

  afterEach(() => {
    wrapper.destroy();
  });

  it("sets the initial model value", () => {
    createComponent(getPropsData());
    expect(wrapper.find("input").element.value).toBe(defaultPropsData.value);
  });

  it("emits change event on click and changes the value to the opposite", async () => {
    createComponent(getPropsData());
    await wrapper.trigger("click");
    expect(wrapper.emitted().change).toBeTruthy();
    expect(wrapper.find("input").element.value).toBeTruthy();
  });

  it("input isn't checked if prop isChecked is false", () => {
    createComponent(getPropsData());
    expect(wrapper.find("input").element.checked).toBeFalsy();
  });

  it("input is checked if prop isChecked is true", () => {
    createComponent(getPropsData({ isChecked: true }));
    expect(wrapper.find("input").element.checked).toBeTruthy();
  });

  it("input name is prop inputName", () => {
    createComponent(getPropsData());
    let input = wrapper.find("input");
    expect(input.attributes("name")).toBe(defaultPropsData.inputName);
  });

  it("renders out the slot content", () => {
    createComponent({ ...getPropsData(), slots });
    expect(wrapper.html()).toContain(slots.default);
  });
});

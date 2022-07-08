import { shallowMount } from "@vue/test-utils";
import AppInput from "@/common/components/AppInput";

describe("AppInput", () => {
  const defaultPropsData = {
    value: "testValue",
    name: "testName",
    type: "text",
    placeholder: "Test",
    errorText: "Error",
    required: true,
    disabled: false,
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
    wrapper = shallowMount(AppInput, options);
  };

  afterEach(() => {
    wrapper.destroy();
  });

  it("sets the initial model value", () => {
    createComponent(getPropsData());
    expect(wrapper.find("input").element.value).toBe(defaultPropsData.value);
  });

  it("emits input event when typing", async () => {
    createComponent(getPropsData());
    let input = wrapper.find("input");
    await input.trigger("input");
    expect(wrapper.emitted().input).toBeTruthy();
  });

  it("emits the current input value when typing", async () => {
    createComponent(getPropsData());
    let input = wrapper.find("input");
    input.element.value = "test";
    await input.trigger("input");
    expect(wrapper.emitted().input[0][0]).toEqual("test");
  });

  it("emits change event with the current input value", async () => {
    createComponent(getPropsData());
    let input = wrapper.find("input");
    input.element.value = "test";
    await input.trigger("change");
    expect(wrapper.emitted().change[0][0]).toEqual("test");
  });

  it("input name is prop name", () => {
    createComponent(getPropsData());
    let input = wrapper.find("input");
    expect(input.attributes("name")).toBe(defaultPropsData.name);
  });

  it("input type is prop type", () => {
    createComponent(getPropsData());
    let input = wrapper.find("input");
    expect(input.attributes("type")).toBe(defaultPropsData.type);
  });

  it("input placeholder is prop placeholder", () => {
    createComponent(getPropsData());
    let input = wrapper.find("input");
    expect(input.attributes("placeholder")).toBe(defaultPropsData.placeholder);
  });

  it("has error class if error text has been passed in prop", () => {
    createComponent(getPropsData());
    let input = wrapper.find("input");
    expect(input.attributes("class")).toContain("text-field__input--error");
  });

  it("has error message if error text has been passed in prop", () => {
    createComponent(getPropsData());
    expect(wrapper.html()).toContain("span");
  });

  it("does not have error message if error text hasn't been passed in prop", () => {
    createComponent(getPropsData({ errorText: "" }));
    expect(wrapper.html()).not.toContain("span");
  });

  it("isn't disabled if prop disabled is false", () => {
    createComponent(getPropsData());
    let input = wrapper.find("input");
    expect(input.attributes("disabled")).toBeUndefined();
  });

  it("is disabled if prop disabled is true", () => {
    createComponent(getPropsData({ disabled: true }));
    let input = wrapper.find("input");
    expect(input.attributes("disabled")).toBe("disabled");
  });
});

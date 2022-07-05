import { shallowMount } from "@vue/test-utils";
import AppInput from "@/common/components/AppInput";

describe("AppInput", () => {
  const errorClass = "text-field__input--error";
  const propsData = {
    value: "testValue",
    name: "testName",
    type: "text",
    placeholder: "Test",
    errorText: "Error",
    required: true,
    disabled: false,
  };

  let wrapper;
  const createComponent = (options) => {
    wrapper = shallowMount(AppInput, options);
  };

  afterEach(() => {
    wrapper.destroy();
  });

  it("sets the initial model value", () => {
    createComponent({ propsData });
    expect(wrapper.find("input").element.value).toBe(propsData.value);
  });

  it("emits an input event when typing", async () => {
    createComponent({ propsData });
    let input = wrapper.find("input");
    await input.trigger("input");
    expect(wrapper.emitted().input).toBeTruthy();
  });

  it("emits the current input value when typing", async () => {
    createComponent({ propsData });
    let input = wrapper.find("input");
    input.element.value = "test";
    await input.trigger("input");
    expect(wrapper.emitted().input[0][0]).toEqual("test");
  });

  it("input name is prop name", () => {
    createComponent({ propsData });
    let input = wrapper.find("input");
    expect(input.attributes("name")).toBe(propsData.name);
  });

  it("input type is prop type", () => {
    createComponent({ propsData });
    let input = wrapper.find("input");
    expect(input.attributes("type")).toBe(propsData.type);
  });

  it("input placeholder is prop placeholder", () => {
    createComponent({ propsData });
    let input = wrapper.find("input");
    expect(input.attributes("placeholder")).toBe(propsData.placeholder);
  });

  it("has error class if error text has been passed in prop", () => {
    createComponent({ propsData });
    let input = wrapper.find("input");
    expect(input.attributes("class")).toContain(errorClass);
  });

  it("has error message if error text has been passed in prop", () => {
    createComponent({ propsData });
    expect(wrapper.html()).toContain("span");
  });

  it("does not have error message if error text hasn't been passed in prop", () => {
    propsData.errorText = "";
    createComponent({ propsData });
    expect(wrapper.html()).not.toContain("span");
  });

  it("isn't disabled if prop disabled is false", () => {
    createComponent({ propsData });
    let input = wrapper.find("input");
    expect(input.attributes("disabled")).toBeUndefined();
  });

  // если будет время разберись, почему если не мутировать propsData а делать так
  // createComponent({ ...propsData, disabled: true }) появляются ворнинги
  // [Vue warn]: Missing required prop: "value"
  // и тесты фейлятся
  // в текущей версии проблема, что переписывается исходный объект и если тесты поменять местами, то они сломаются
  it("is disabled if prop disabled is true", () => {
    propsData.disabled = true;
    createComponent({ propsData });
    let input = wrapper.find("input");
    expect(input.attributes("disabled")).toBe("disabled");
  });
});

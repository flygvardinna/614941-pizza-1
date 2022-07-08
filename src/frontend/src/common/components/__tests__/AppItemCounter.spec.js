import { shallowMount } from "@vue/test-utils";
import AppItemCounter from "@/common/components/AppItemCounter";

describe("AppItemCounter", () => {
  const defaultPropsData = {
    value: 1,
    minValue: 0,
    maxValue: 2,
    isOrangeBtn: true,
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
    wrapper = shallowMount(AppItemCounter, options);
  };

  afterEach(() => {
    wrapper.destroy();
  });

  it("sets the initial value", () => {
    createComponent(getPropsData());
    expect(wrapper.find("input").element.value).toBe("1");
  });

  it("emits changeItemValue event and incremented input value when plus button clicked", async () => {
    createComponent(getPropsData());
    const plusButton = wrapper.find(".counter__button--plus");
    await plusButton.trigger("click");
    expect(wrapper.emitted("changeItemValue")[0][0]).toBe(2);
  });

  it("emits changeItemValue event and decremented input value when minus button clicked", async () => {
    createComponent(getPropsData());
    const plusButton = wrapper.find(".counter__button--minus");
    await plusButton.trigger("click");
    expect(wrapper.emitted("changeItemValue")[0][0]).toBe(0);
  });

  it("plus button is disabled when value is equal to max value", () => {
    createComponent(getPropsData({ value: 2 }));
    const plusButton = wrapper.find(".counter__button--plus");
    expect(plusButton.attributes("disabled")).toBe("disabled");
  });

  it("minus button is disabled when value is equal to min value", () => {
    createComponent(getPropsData({ value: 0 }));
    const minusButton = wrapper.find(".counter__button--minus");
    expect(minusButton.attributes("disabled")).toBe("disabled");
  });

  it("plus button has orange color if prop isOrangeBtn is true", () => {
    createComponent(getPropsData());
    expect(wrapper.find(".counter__button--plus").classes()).toContain(
      "counter__button--orange"
    );
  });

  it("plus button has default styles if prop isOrangeBtn is false", () => {
    createComponent(getPropsData({ isOrangeBtn: false }));
    expect(
      wrapper.find(".counter__button--plus").classes("counter__button--orange")
    ).toBeFalsy();
  });
});

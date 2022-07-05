import { shallowMount } from "@vue/test-utils";
import AppItemCounter from "@/common/components/AppItemCounter";

describe("AppItemCounter", () => {
  const propsData = {
    value: 1,
    minValue: 0,
    maxValue: 2,
    isOrangeBtn: true,
  };

  let wrapper;
  const createComponent = (options) => {
    wrapper = shallowMount(AppItemCounter, options);
  };

  afterEach(() => {
    wrapper.destroy();
  });

  it("sets the initial value", () => {
    createComponent({ propsData });
    expect(wrapper.find("input").element.value).toBe(
      propsData.value.toString()
    );
  });

  it("emits incremented input value when plus button clicked", async () => {
    createComponent({ propsData });
    const plusButton = wrapper.find(".counter__button--plus");
    await plusButton.trigger("click");
    expect(wrapper.emitted("changeItemValue")[0]).toEqual([
      propsData.value + 1,
    ]);
  });

  it("emits decremented input value when minus button clicked", async () => {
    createComponent({ propsData });
    const plusButton = wrapper.find(".counter__button--minus");
    await plusButton.trigger("click");
    expect(wrapper.emitted("changeItemValue")[0]).toEqual([
      propsData.value - 1,
    ]);
  });

  it("plus button is disabled when value is equal to max value", () => {
    propsData.value = 2;
    createComponent({ propsData });
    const plusButton = wrapper.find(".counter__button--plus");
    expect(plusButton.attributes("disabled")).toBe("disabled");
  });

  it("minus button is disabled when value is equal to min value", () => {
    propsData.value = 0;
    createComponent({ propsData });
    const minusButton = wrapper.find(".counter__button--minus");
    expect(minusButton.attributes("disabled")).toBe("disabled");
  });

  it("plus button has orange color if prop isOrangeBtn is true", () => {
    createComponent({ propsData });
    expect(wrapper.find(".counter__button--plus").classes()).toContain(
      "counter__button--orange"
    );
  });

  it("plus button has default styles if prop isOrangeBtn is false", () => {
    propsData.isOrangeBtn = false;
    createComponent({ propsData });
    expect(
      wrapper.find(".counter__button--plus").classes("counter__button--orange")
    ).toBeFalsy();
  });
});

import { shallowMount } from "@vue/test-utils";
import AppLayoutProfile from "@/layouts/AppLayoutProfile";

const slots = { default: "content" };

describe("AppLayoutProfile", () => {
  let wrapper;
  const createComponent = (options) => {
    wrapper = shallowMount(AppLayoutProfile, options);
  };

  afterEach(() => {
    wrapper.destroy();
  });

  it("is rendered", () => {
    createComponent({ slots });
    expect(wrapper.exists()).toBeTruthy();
  });

  it("renders out the slot content", () => {
    createComponent({ slots });
    expect(wrapper.html()).toContain(slots.default);
  });
});

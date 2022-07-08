import { shallowMount } from "@vue/test-utils";
import AppLayout from "@/layouts/AppLayout";

describe("AppLayout", () => {
  const mocks = {
    $route: {
      meta: {
        layout: null,
      },
    },
  };

  let wrapper;
  const createComponent = (options) => {
    wrapper = shallowMount(AppLayout, options);
  };

  afterEach(() => {
    wrapper.destroy();
  });

  it("is rendered", () => {
    createComponent({ mocks });
    expect(wrapper.exists()).toBeTruthy();
  });
});

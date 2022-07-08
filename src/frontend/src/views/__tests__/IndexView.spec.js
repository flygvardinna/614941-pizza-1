import { shallowMount } from "@vue/test-utils";
import IndexView from "@/views/IndexView";

describe("IndexView", () => {
  const stubs = ["router-view"];

  let wrapper;
  const createComponent = (options) => {
    wrapper = shallowMount(IndexView, options);
  };

  afterEach(() => {
    wrapper.destroy();
  });

  it("is rendered", () => {
    createComponent({ stubs });
    expect(wrapper.exists()).toBeTruthy();
  });
});

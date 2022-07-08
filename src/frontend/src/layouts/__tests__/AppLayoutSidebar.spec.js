import { shallowMount } from "@vue/test-utils";
import AppLayoutSidebar from "@/layouts/AppLayoutSidebar";

describe("AppLayoutSidebar", () => {
  let wrapper;
  const createComponent = (options) => {
    wrapper = shallowMount(AppLayoutSidebar, options);
  };

  const stubs = ["router-link"];

  afterEach(() => {
    wrapper.destroy();
  });

  it("is rendered", () => {
    createComponent({ stubs });
    expect(wrapper.exists()).toBeTruthy();
  });

  it("renders Orders page link", async () => {
    createComponent({ stubs });
    expect(wrapper.find('[data-test="orders-link"]')).toBeTruthy();
  });

  it("renders Profile page link", async () => {
    createComponent({ stubs });
    expect(wrapper.find('[data-test="profile-link"]')).toBeTruthy();
  });
});

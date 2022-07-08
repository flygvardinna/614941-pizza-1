import { shallowMount } from "@vue/test-utils";
import CartOrderPopup from "@/modules/cart/components/CartOrderPopup";

describe("CartOrderPopup", () => {
  let wrapper;
  const createComponent = (options) => {
    wrapper = shallowMount(CartOrderPopup, options);
  };

  afterEach(() => {
    wrapper.destroy();
  });

  it("is rendered", () => {
    createComponent();
    expect(wrapper.exists()).toBeTruthy();
  });

  it("emits close event when close button clicked", async () => {
    createComponent();
    let closeBtn = wrapper.find('[data-test="close-btn"]');
    await closeBtn.trigger("click");
    expect(wrapper.emitted("close")).toBeTruthy();
  });

  it("emits close event when popup button clicked", async () => {
    createComponent();
    let popupBtn = wrapper.find('[data-test="popup__button"]');
    await popupBtn.trigger("click");
    expect(wrapper.emitted("close")).toBeTruthy();
  });
});

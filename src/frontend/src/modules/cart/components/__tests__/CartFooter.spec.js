import { shallowMount, createLocalVue } from "@vue/test-utils";
import Vuex from "vuex";
import { generateMockStore } from "@/store/mocks";
import CartFooter from "@/modules/cart/components/CartFooter";

const localVue = createLocalVue();
localVue.use(Vuex);

describe("CartFooter", () => {
  const mocks = {
    $router: {
      push: jest.fn(),
    },
  };

  let store;
  let wrapper;
  const createComponent = (options) => {
    wrapper = shallowMount(CartFooter, options);
  };

  beforeEach(() => {
    store = generateMockStore();
  });

  afterEach(() => {
    wrapper.destroy();
  });

  it("is rendered", () => {
    createComponent({ localVue, store, mocks });
    expect(wrapper.exists()).toBeTruthy();
  });

  it("redirects to Builder page on button click", async () => {
    createComponent({ localVue, store, mocks });
    const goToBuilderBtn = wrapper.find('[data-test="builder-page-link"]');
    await goToBuilderBtn.trigger("click");
    expect(mocks.$router.push).toHaveBeenCalledWith("/");
  });
});

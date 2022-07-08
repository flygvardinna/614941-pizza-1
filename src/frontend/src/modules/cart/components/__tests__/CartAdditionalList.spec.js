import { mount, createLocalVue } from "@vue/test-utils";
import Vuex from "vuex";
import { generateMockStore, setAdditionalItems } from "@/store/mocks";
import CartAdditionalList from "@/modules/cart/components/CartAdditionalList";

const localVue = createLocalVue();
localVue.use(Vuex);

describe("CartAdditionalList", () => {
  let actions;
  let store;
  let wrapper;
  const createComponent = (options) => {
    wrapper = mount(CartAdditionalList, options);
  };

  beforeEach(() => {
    actions = {
      Cart: {
        changeAdditionalItemQuantity: jest.fn(),
      },
    };

    store = generateMockStore(actions);
    setAdditionalItems(store);
  });

  afterEach(() => {
    wrapper.destroy();
  });

  it("is rendered", () => {
    createComponent({ localVue, store });
    expect(wrapper.exists()).toBeTruthy();
  });

  it("changes additional item quantity on counter click", async () => {
    createComponent({ localVue, store });
    const counter = wrapper.find('[data-test="additional-list-counter"]');
    await counter.vm.$emit("changeItemValue");
    expect(actions.Cart.changeAdditionalItemQuantity).toHaveBeenCalled();
  });
});

import { shallowMount, createLocalVue } from "@vue/test-utils";
import Vuex from "vuex";
import { generateMockStore, setPizzaItems } from "@/store/mocks";
import CartProductList from "@/modules/cart/components/CartProductList";
import AppItemCounter from "@/common/components/AppItemCounter";

const localVue = createLocalVue();
localVue.use(Vuex);

describe("CartProductList", () => {
  const mocks = {
    $router: {
      push: jest.fn(),
    },
  };

  const stubs = { AppItemCounter };

  let actions;
  let store;
  let wrapper;
  const createComponent = (options) => {
    wrapper = shallowMount(CartProductList, options);
  };

  beforeEach(() => {
    actions = {
      Builder: {
        editPizza: jest.fn(),
      },
      Cart: {
        changeItemQuantity: jest.fn(),
        deleteItem: jest.fn(),
      },
    };

    store = generateMockStore(actions);
    setPizzaItems(store);
  });

  afterEach(() => {
    wrapper.destroy();
  });

  it("is rendered", () => {
    createComponent({ localVue, store, mocks, stubs });
    expect(wrapper.exists()).toBeTruthy();
  });

  it("changes pizza quantity on counter click if new quantity is more than 1", async () => {
    createComponent({ localVue, store, mocks, stubs });
    const counter = wrapper.find('[data-test="cart-list-counter"]');
    await counter.vm.$emit("changeItemValue", 2);
    expect(actions.Cart.changeItemQuantity).toHaveBeenCalled();
  });

  it("deletes pizza on counter click if new quantity is 0", async () => {
    createComponent({ localVue, store, mocks, stubs });
    const counter = wrapper.find('[data-test="cart-list-counter"]');
    await counter.vm.$emit("changeItemValue", 0);
    expect(actions.Cart.deleteItem).toHaveBeenCalled();
  });

  it("set pizza to builder on edit button clicked and redirects to index page", async () => {
    createComponent({ localVue, store, mocks, stubs });
    const editBtn = wrapper.find('[data-test="cart-list-edit"]');
    await editBtn.trigger("click");
    expect(actions.Builder.editPizza).toHaveBeenCalled();
    expect(mocks.$router.push).toHaveBeenCalledWith("/");
  });
});

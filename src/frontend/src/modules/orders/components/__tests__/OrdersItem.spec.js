import { createLocalVue, shallowMount } from "@vue/test-utils";
import OrdersItem from "@/modules/orders/components/OrdersItem";
import {
  generateMockStore,
  setDough,
  setSauces,
  setSizes,
  setIngredients,
  setAdditionalItems,
} from "@/store/mocks";
import Vuex from "vuex";

const localVue = createLocalVue();
localVue.use(Vuex);

describe("OrdersItem", () => {
  const mocks = {
    $router: {
      push: jest.fn(),
    },
  };

  const propsData = {
    order: {
      id: 1,
      userId: "1",
      phone: "",
      addressId: null,
      orderMisc: [{ id: 1, miscId: 1, orderId: 1, quantity: 0 }],
      orderPizzas: [
        {
          id: 1,
          name: "Pizza name",
          doughId: 1,
          sauceId: 1,
          sizeId: 1,
          ingredients: [
            { id: 1, ingredientId: 1, pizzaId: 1, quantity: 1 },
            { id: 2, ingredientId: 2, pizzaId: 1, quantity: 1 },
          ],
          quantity: 1,
          orderId: 1,
        },
      ],
    },
  };

  let actions;
  let store;
  let wrapper;
  const createComponent = (options) => {
    wrapper = shallowMount(OrdersItem, options);
  };

  beforeEach(() => {
    actions = {
      Cart: {
        addItem: jest.fn(),
        changeAdditionalItemQuantity: jest.fn(),
      },
      Orders: {
        deleteOrder: jest.fn(),
      },
    };

    store = generateMockStore(actions);
    setDough(store);
    setSizes(store);
    setSauces(store);
    setIngredients(store);
    setAdditionalItems(store);
  });

  afterEach(() => {
    wrapper.destroy();
  });

  it("is rendered", () => {
    createComponent({ localVue, store, mocks, propsData });
    expect(wrapper.exists()).toBeTruthy();
  });

  it("deletes order on delete button click", async () => {
    createComponent({ localVue, store, mocks, propsData });
    const deleteBtn = wrapper.find('[data-test="delete-btn"]');
    await deleteBtn.trigger("click");
    expect(actions.Orders.deleteOrder).toHaveBeenCalledWith(
      expect.any(Object), // The Vuex context
      propsData.order.id
    );
  });

  it("adds items to cart on repeat button click", async () => {
    createComponent({ localVue, store, mocks, propsData });
    const repeatBtn = wrapper.find('[data-test="repeat-btn"]');
    await repeatBtn.trigger("click");
    expect(actions.Cart.addItem).toHaveBeenCalled();
    expect(actions.Cart.changeAdditionalItemQuantity).toHaveBeenCalled();
  });

  it("redirects to Cart page on repeat button click", async () => {
    createComponent({ localVue, store, mocks, propsData });
    const repeatBtn = wrapper.find('[data-test="repeat-btn"]');
    await repeatBtn.trigger("click");
    expect(mocks.$router.push).toHaveBeenCalledWith({
      name: "Cart",
      params: { addressId: null },
    });
  });
});

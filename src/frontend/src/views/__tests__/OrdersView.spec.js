import { shallowMount, createLocalVue } from "@vue/test-utils";
import { generateMockStore, setOrders } from "@/store/mocks";
import Vuex from "vuex";
import OrdersView from "@/views/OrdersView";

const localVue = createLocalVue();
localVue.use(Vuex);

describe("OrdersView", () => {
  const mocks = {
    $router: {
      push: jest.fn(),
    },
  };

  let actions;
  let store;
  let wrapper;
  const createComponent = (options) => {
    wrapper = shallowMount(OrdersView, options);
  };

  beforeEach(() => {
    actions = {
      Cart: {
        fetchAdditionalItems: jest.fn(),
      },
      Orders: {
        fetchOrders: jest.fn(),
      },
    };

    store = generateMockStore(actions);
  });

  afterEach(() => {
    wrapper.destroy();
  });

  it("calls vuex actions to fetch orders and additional items when mounted", async () => {
    createComponent({ localVue, store });
    await wrapper.vm.$nextTick();

    expect(actions.Cart.fetchAdditionalItems).toHaveBeenCalled();
    expect(actions.Orders.fetchOrders).toHaveBeenCalled();
  });

  it("displays message if orders list is empty", () => {
    createComponent({ localVue, store, mocks });
    const message = wrapper.find('[data-test="orders-empty"]');
    const ordersList = wrapper.find('[data-test="orders-list"]');
    expect(message.exists()).toBeTruthy();
    expect(ordersList.exists()).toBeFalsy();
  });

  it("displays orders list if orders exist", () => {
    setOrders(store);
    createComponent({ localVue, store, mocks });
    const ordersList = wrapper.find('[data-test="orders-list"]');
    const orderComponent = wrapper.find('[data-test="order-item"]');
    expect(ordersList.exists()).toBeTruthy();
    expect(orderComponent.exists()).toBeTruthy();
  });
});

import { shallowMount, createLocalVue } from "@vue/test-utils";
import { generateMockStore, setPizzaItems } from "@/store/mocks";
import $validator from "@/common/mixins/validator";
import Vuex from "vuex";
import CartView from "@/views/CartView";

const localVue = createLocalVue();
localVue.use(Vuex);

const emptyAddress = {
  id: null,
  street: "",
  building: "",
  flat: "",
  comment: "",
};

const testAddress = {
  id: null,
  street: "Зеленая",
  building: "1",
  flat: "1",
  comment: "Не звоните",
};

describe("CartView", () => {
  const mocks = {
    $router: {
      push: jest.fn(),
    },
    $route: {
      params: { addressId: null },
    },
    $validator,
  };

  let actions;
  let store;
  let wrapper;
  const createComponent = (options) => {
    wrapper = shallowMount(CartView, options);
  };

  beforeEach(() => {
    actions = {
      Orders: {
        createOrder: jest.fn(),
      },
    };

    store = generateMockStore(actions);
  });

  afterEach(() => {
    wrapper.destroy();
  });

  it("displays message if cart is empty", () => {
    createComponent({ localVue, store, mocks });
    const message = wrapper.find('[data-test="cart-empty"]');
    const cartItems = wrapper.find('[data-test="cart-items"]');
    expect(message.exists()).toBeTruthy();
    expect(cartItems.exists()).toBeFalsy();
  });

  it("displays cart items and cart footer if cart isn't empty", () => {
    setPizzaItems(store);
    createComponent({ localVue, store, mocks });
    const cartItems = wrapper.find('[data-test="cart-items"]');
    const cartFooter = wrapper.find('[data-test="cart-footer"]');
    expect(cartItems.exists()).toBeTruthy();
    expect(cartFooter.exists()).toBeTruthy();
  });

  it("validation mixin has been called on form submit, invalid form isn't submitted", async () => {
    setPizzaItems(store);
    createComponent({ localVue, store, mocks });
    const spyValidateFields = jest.spyOn(wrapper.vm, "$validateFields");
    const addressForm = wrapper.find('[data-test="address-form"]');
    addressForm.vm.$emit("setAddress", { phone: "", address: emptyAddress });
    await wrapper.vm.$nextTick();

    await wrapper.find('[data-test="order-form"]').trigger("submit");
    expect(spyValidateFields).toHaveBeenCalled();
    expect(actions.Orders.createOrder).not.toHaveBeenCalled();
  });

  it("makes new order when valid form is submitted and displays success popup", async () => {
    setPizzaItems(store);
    createComponent({ localVue, store, mocks });
    const addressForm = wrapper.find('[data-test="address-form"]');
    addressForm.vm.$emit("setAddress", { phone: "", address: testAddress });
    await wrapper.vm.$nextTick();

    await wrapper.find('[data-test="order-form"]').trigger("submit");
    expect(actions.Orders.createOrder).toHaveBeenCalled();
    await wrapper.vm.$nextTick();

    expect(wrapper.find('[data-test="success-popup"]').exists()).toBeTruthy();
  });

  it("success popup isn't displayed after it has been closed", async () => {
    setPizzaItems(store);
    createComponent({ localVue, store, mocks });
    const addressForm = wrapper.find('[data-test="address-form"]');
    addressForm.vm.$emit("setAddress", { phone: "", address: testAddress });
    await wrapper.vm.$nextTick();

    await wrapper.find('[data-test="order-form"]').trigger("submit");
    await wrapper.vm.$nextTick();
    const successPopup = wrapper.find('[data-test="success-popup"]');
    successPopup.vm.$emit("close");
    await wrapper.vm.$nextTick();

    expect(successPopup.exists()).toBeFalsy();
  });
});

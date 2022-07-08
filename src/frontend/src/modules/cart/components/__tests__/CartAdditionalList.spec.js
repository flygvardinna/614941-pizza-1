import { mount, createLocalVue } from "@vue/test-utils";
import Vuex from "vuex";
import { generateMockStore, setAdditionalItems } from "@/store/mocks";
import CartAdditionalList from "@/modules/cart/components/CartAdditionalList";

const localVue = createLocalVue();
localVue.use(Vuex);

describe("CartAdditionalList", () => {
  let store;
  let wrapper;
  const createComponent = (options) => {
    wrapper = mount(CartAdditionalList, options);
  };

  beforeEach(() => {
    store = generateMockStore();
    setAdditionalItems(store);
  });

  afterEach(() => {
    wrapper.destroy();
  });

  it("is rendered", () => {
    createComponent({ localVue, store });
    expect(wrapper.exists()).toBeTruthy();
  });

  it("changes item quantity on counter click", async () => {
    createComponent({ localVue, store });
    const spyOnAction = jest.spyOn(wrapper.vm, "changeItemQuantity");
    const counter = wrapper.find('[data-test="additional-list-counter"]');
    const inputValue = parseInt(counter.find("input").element.value);
    await counter.vm.$emit("changeItemValue", inputValue + 1);
    expect(spyOnAction).toHaveBeenCalled();
  });
});

import { mount, createLocalVue } from "@vue/test-utils";
import Vuex from "vuex";
import {
  generateMockStore,
  setDough,
  setPizzaName,
  setSauces,
  setSizes,
} from "@/store/mocks";
import { SET_ENTITY } from "@/store/mutation-types";
import pizzaData from "@/static/pizza";
import BuilderPriceCounter from "@/modules/builder/components/BuilderPriceCounter";

const localVue = createLocalVue();
localVue.use(Vuex);

const setIngredients = (store) => {
  store.commit(SET_ENTITY, {
    module: "Builder",
    entity: "ingredients",
    value: pizzaData.ingredients.map((ingredient) => {
      return {
        ...ingredient,
        value: "mushrooms",
        quantity: 1,
      };
    }),
  });
};

describe("BuilderPriceCounter", () => {
  let actions;
  let store;
  let wrapper;
  const createComponent = (options) => {
    wrapper = mount(BuilderPriceCounter, options);
  };

  beforeEach(() => {
    actions = {
      Cart: {
        addItem: jest.fn(),
      },
      Builder: {
        resetBuilderState: jest.fn(),
        fetchPizzaParts: jest.fn(),
      },
    };

    store = generateMockStore(actions);
  });

  afterEach(() => {
    wrapper.destroy();
  });

  it("when pizza name is unset and no ingredients selected the button is disabled", () => {
    createComponent({ localVue, store });
    const addToCartBtn = wrapper.find('[data-test="add-to-cart-btn"]');
    expect(addToCartBtn.attributes("disabled")).toBe("disabled");
  });

  it("when pizza name is set but no ingredients selected the button is disabled", () => {
    setIngredients(store);
    createComponent({ localVue, store });
    const addToCartBtn = wrapper.find('[data-test="add-to-cart-btn"]');
    expect(addToCartBtn.attributes("disabled")).toBe("disabled");
  });

  it("when pizza name is unset but ingredients selected the button is disabled", () => {
    setIngredients(store);
    createComponent({ localVue, store });
    const addToCartBtn = wrapper.find('[data-test="add-to-cart-btn"]');
    expect(addToCartBtn.attributes("disabled")).toBe("disabled");
  });

  it("when pizza name is set and ingredients selected the button is enabled", () => {
    setPizzaName(store);
    setIngredients(store);
    createComponent({ localVue, store });
    const addToCartBtn = wrapper.find('[data-test="add-to-cart-btn"]');
    expect(addToCartBtn.attributes("disabled")).toBeUndefined();
  });

  it("displays current pizza price", async () => {
    setDough(store);
    setSizes(store);
    setSauces(store);
    setIngredients(store);
    createComponent({ localVue, store });
    expect(wrapper.html()).toContain(
      `${store.getters["Builder/pizzaPrice"]} ₽`
    );
  });

  it("adds pizza to cart when the button clicked, then resets builder state", async () => {
    setPizzaName(store);
    setDough(store);
    setSizes(store);
    setSauces(store);
    setIngredients(store);
    createComponent({ localVue, store });
    const addToCartBtn = wrapper.find('[data-test="add-to-cart-btn"]');
    await addToCartBtn.trigger("click");
    expect(actions.Cart.addItem).toHaveBeenCalled();
    expect(actions.Builder.resetBuilderState).toHaveBeenCalled();
    expect(actions.Builder.fetchPizzaParts).toHaveBeenCalled();
  });
});

import { shallowMount, createLocalVue } from "@vue/test-utils";
import {
  generateMockStore,
  setDough,
  setSizes,
  setSauces,
  setIngredients,
} from "@/store/mocks";
import Vuex from "vuex";
import PizzaItem from "@/common/components/PizzaItem";

const localVue = createLocalVue();
localVue.use(Vuex);

describe("PizzaItem", () => {
  const propsData = {
    pizza: {
      id: "1",
      name: "Pizza name",
      doughId: 1,
      sauceId: 1,
      sizeId: 1,
      ingredients: [
        { ingredientId: 1, quantity: 1 },
        { ingredientId: 2, quantity: 1 },
      ],
    },
  };

  let store;
  let wrapper;
  const createComponent = (options) => {
    wrapper = shallowMount(PizzaItem, options);
  };

  beforeEach(() => {
    store = generateMockStore();
    setDough(store);
    setSizes(store);
    setSauces(store);
    setIngredients(store);
  });

  afterEach(() => {
    wrapper.destroy();
  });

  it("renders out pizza name", () => {
    createComponent({ localVue, store, propsData });
    expect(wrapper.html()).toContain(propsData.pizza.name);
  });

  it("renders out correct size and dough description", () => {
    createComponent({ localVue, store, propsData });
    expect(wrapper.html()).toContain("23 см, на тонком тесте");
  });

  it("renders out correct sauce description", () => {
    createComponent({ localVue, store, propsData });
    expect(wrapper.html()).toContain("Соус: томатный");
  });

  it("renders out correct ingredients list", () => {
    createComponent({ localVue, store, propsData });
    expect(wrapper.html()).toContain("Начинка: грибы, чеддер");
  });
});

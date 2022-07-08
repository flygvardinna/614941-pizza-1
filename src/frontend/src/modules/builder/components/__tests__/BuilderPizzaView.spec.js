import { mount, createLocalVue } from "@vue/test-utils";
import Vuex from "vuex";
import { generateMockStore, setPizzaName } from "@/store/mocks";
import { SET_ENTITY } from "@/store/mutation-types";
import BuilderPizzaView from "@/modules/builder/components/BuilderPizzaView";
import pizzaData from "@/static/pizza.json";

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
        quantity: 3,
      };
    }),
  });
};

const testIngredient = {
  ...pizzaData.ingredients[0],
  value: "mushrooms",
  quantity: 0,
};

describe("BuilderPizzaView", () => {
  let store;
  let wrapper;
  const createComponent = (options) => {
    wrapper = mount(BuilderPizzaView, options);
  };

  beforeEach(() => {
    store = generateMockStore();
  });

  afterEach(() => {
    wrapper.destroy();
  });

  it("renders input that displays current pizza name", () => {
    setPizzaName(store);
    createComponent({ localVue, store });
    expect(wrapper.find("input").element.value).toBe("testPizzaName");
  });

  it("sets pizza name when typing in input", async () => {
    createComponent({ localVue, store });
    const spyOnAction = jest.spyOn(wrapper.vm, "setPizzaName");
    let input = wrapper.find("input");
    input.element.value = "test";
    await input.trigger("input");
    expect(spyOnAction).toHaveBeenCalled();
  });

  it("adds ingredient to pizza on drop event", () => {
    createComponent({ localVue, store });
    const spyOnAction = jest.spyOn(wrapper.vm, "changeIngredientQuantity");
    const pizzaWrapper = wrapper.find('[data-test="pizza-wrapper"]');
    pizzaWrapper.vm.$emit("drop", testIngredient);
    expect(spyOnAction).toHaveBeenCalledWith({
      ...testIngredient,
      quantity: 1,
    });
  });

  it("renders ingredients if there are selected ingredients", () => {
    setIngredients(store);
    createComponent({ localVue, store });
    const ingredient = wrapper.find(".pizza__filling");
    expect(ingredient.exists()).toBeTruthy();
  });

  it("renders specific classes if there are ingredients with quantity > 1", () => {
    setIngredients(store);
    createComponent({ localVue, store });
    const secondIngredient = wrapper.find(".pizza__filling--second");
    const thirdIngredient = wrapper.find(".pizza__filling--third");
    expect(secondIngredient.exists()).toBeTruthy();
    expect(thirdIngredient.exists()).toBeTruthy();
  });
});

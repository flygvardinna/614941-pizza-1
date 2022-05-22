import { cloneDeep } from "lodash";
import {
  SET_ENTITY,
  UPDATE_ENTITY,
  RESET_BUILDER_STATE,
} from "@/store/mutation-types";
import { capitalize, findSelectedItem } from "@/common/helpers";

const module = capitalize("builder");

const initialState = () => ({
  dough: [],
  sauces: [],
  sizes: [],
  ingredients: [],
  pizzaName: "",
  pizzaId: null,
});

export default {
  namespaced: true,
  state: initialState(),
  getters: {
    // тут важный вопрос, когда выкидывать все лишнее
    // уже тут (и тогда надо переписать геттер pizzaPrice
    // или уже потом при формировании заказа
    // важно, чтоб было удобно изменять пиццу (там все ок, но поменять newValue для теста итд на id)
    // думаю что лучше на этапе заказа
    // но с другой стороны много лишней инфы в корзине получается
    // мы используем метод update для additionalItem и ingredientId
    // вот там для универсальности должно оставаться id вместо ingredientId
    currentPizza({ dough, sauces, sizes, ingredients, pizzaName, pizzaId }) {
      return {
        dough: findSelectedItem(dough),
        sauce: findSelectedItem(sauces),
        size: findSelectedItem(sizes),
        ingredients: ingredients.filter((item) => item.quantity > 0),
        name: pizzaName,
        id: pizzaId,
        quantity: 1,
      };
    },
    pizzaPrice(state, getters) {
      const ingredientsPrices = getters.currentPizza.ingredients.map(
        (item) => item.price * item.quantity
      );
      const ingredientsSum = ingredientsPrices.reduce((a, b) => a + b, 0);
      return (
        (getters.currentPizza.dough.price +
          getters.currentPizza.sauce.price +
          ingredientsSum) *
        getters.currentPizza.size.multiplier
      );
    },
  },
  mutations: {
    [RESET_BUILDER_STATE](state) {
      Object.assign(state, initialState());
    },
  },
  actions: {
    resetBuilderState({ commit }) {
      commit(RESET_BUILDER_STATE);
    },
    async fetchPizzaParts({ commit }) {
      const dough = await this.$api.builder.fetchDough();
      const sauces = await this.$api.builder.fetchSauces();
      // const sizes = await this.$api.builder.fetchDetail("sizes", Size);
      const sizes = await this.$api.builder.fetchSizes();
      const ingredients = await this.$api.builder.fetchIngredients();
      // console.log("ready ingredients", ingredients);

      commit(
        SET_ENTITY,
        {
          module,
          entity: "dough",
          value: dough,
        },
        { root: true }
      );
      commit(
        SET_ENTITY,
        {
          module,
          entity: "sauces",
          value: sauces,
        },
        { root: true }
      );
      commit(
        SET_ENTITY,
        {
          module,
          entity: "sizes",
          value: sizes,
        },
        { root: true }
      );
      commit(
        SET_ENTITY,
        {
          module,
          entity: "ingredients",
          value: ingredients,
        },
        { root: true }
      );
    },
    setPizzaName({ commit }, name) {
      commit(
        SET_ENTITY,
        {
          module,
          entity: "pizzaName",
          value: name,
        },
        { root: true }
      );
    },
    setPizzaId({ commit }, id) {
      commit(
        SET_ENTITY,
        {
          module,
          entity: "pizzaId",
          value: id,
        },
        { root: true }
      );
    },
    changeSelectedItem({ state, commit }, { newValue, itemName }) {
      const data = cloneDeep(state[itemName]);

      data.find((el) => el.isChecked).isChecked = false;
      data.find((el) => el.value === newValue).isChecked = true;

      commit(
        SET_ENTITY,
        {
          module,
          entity: itemName,
          value: data,
        },
        { root: true }
      );
    },
    changeIngredientQuantity({ commit }, ingredient) {
      commit(
        UPDATE_ENTITY,
        {
          module,
          entity: "ingredients",
          value: ingredient,
        },
        { root: true }
      );
    },
  },
};

import { cloneDeep } from "lodash";
import {
  SET_ENTITY,
  UPDATE_ENTITY,
  RESET_BUILDER_STATE,
} from "@/store/mutation-types";
import pizza from "@/static/pizza.json";
import {
  capitalize,
  normalizeDetail,
  normalizeIngredients,
  findSelectedItem,
} from "@/common/helpers";
import { Dough, Sauce, Size, Ingredient } from "@/common/constants";

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
    currentPizza({ dough, sauces, sizes, ingredients, pizzaName, pizzaId }) {
      return {
        dough: findSelectedItem(dough),
        sauce: findSelectedItem(sauces),
        size: findSelectedItem(sizes),
        ingredients: ingredients.filter((item) => item.value > 0),
        name: pizzaName,
        id: pizzaId,
        value: 1,
      };
    },
    pizzaPrice(state, getters) {
      const ingredientsPrices = getters.currentPizza.ingredients.map(
        (item) => item.price * item.value
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
      commit(RESET_BUILDER_STATE, { root: true });
    },
    fetchPizzaParts({ commit }) {
      const dough = pizza.dough.map((item) => normalizeDetail(Dough, item));
      const sauces = pizza.sauces.map((item) => normalizeDetail(Sauce, item));
      const sizes = pizza.sizes.map((item) => normalizeDetail(Size, item));
      const ingredients = pizza.ingredients.map((item) =>
        normalizeIngredients(Ingredient, item)
      );
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
    changeIngredientValue({ commit }, ingredient) {
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

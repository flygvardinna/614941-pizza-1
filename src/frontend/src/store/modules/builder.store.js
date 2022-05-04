import { cloneDeep } from "lodash";
import {
  SET_ENTITY,
  RESET_BUILDER_STATE,
  //UPDATE_ENTITY
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
  // вместо того, чтоб экспортить мутацию, сделать метод, где она будет выызваться и экспортить его?
  mutations: {
    [RESET_BUILDER_STATE](state) {
      Object.assign(state, initialState());
    },
  },
  actions: {
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
      // const data = state[itemName];
      // не надо cloneDeep вроде
      data.find((el) => el.isChecked).isChecked = false;
      data.find((el) => el.value === newValue).isChecked = true;

      commit(
        // тут можно заменить на update но тогда надо передавать не весь список data а один элемент с новым значением
        // но передавать надо новую сущность с уже измененным checked
        // а мы тут меняем сразу две сущности - одной добавляем, другой убираем - не пойдет
        // ПОКА ОСТАВЬ ТАК, ПОТОМ МОЖЕТ ПЕРЕДЕЛАЮ
        SET_ENTITY,
        {
          module,
          entity: itemName,
          value: data,
        },
        { root: true }
      );
    },
    changeIngredientValue({ state, commit }, { name, value }) {
      const data = cloneDeep(state.ingredients);
      // const data = state.ingredients;
      // не надо cloneDeep вроде ? на всякий пока оставлю
      // потом спросить наставника или может сама уже пойму
      // в 3м модуле же обновляла прям так
      // но там и не было хранилища
      // в updateTick в vueWork мы не изменяем объект, а глубоко копируем через
      data.find((item) => item.name === name).value = value;

      commit(
        SET_ENTITY,
        // тут тоже
        // придется передавать весь ингредиент с новым значением value тогда
        // здесь как раз идеально переписать на UPDATE
        {
          module,
          entity: "ingredients",
          value: data,
        },
        { root: true }
      );
    },
  },
};

import { cloneDeep } from "lodash";
import { SET_ENTITY } from "@/store/mutation-types";
import pizza from "@/static/pizza.json";
import {
  capitalize,
  normalizeDetail,
  normalizeIngredients,
  findSelectedItem,
} from "@/common/helpers";
import { Dough, Sauce, Size, Ingredient } from "@/common/constants";

const module = capitalize("builder");

export default {
  namespaced: true,
  state: {
    dough: [],
    sauces: [],
    sizes: [],
    ingredients: [],
    selectedDough: null,
    selectedSauce: null,
    selectedSize: null,
    selectedIngredients: [],
    pizzaName: "",
    //cartItems: [],
    //totalPrice: 0,
    //newPizza: null,
    // мб текущую пиццу надо хранить в сторе? и чтоб в методе addToCart она клалась в корзину сама
    // и в ней же, в текущей пицце (геттер), хранить selectedDough итд?
  },
  getters: {
    selectedDough({ dough }) {
      return findSelectedItem(dough);
    },
    selectedSauce({ sauces }) {
      return findSelectedItem(sauces);
    },
    selectedSize({ sizes }) {
      return findSelectedItem(sizes);
    },
    selectedIngredients({ ingredients }) {
      return ingredients.filter((item) => item.value > 0);
    },
    pizzaPrice(state, getters) {
      const ingredientsPrices = getters.selectedIngredients.map(
        (item) => item.price * item.value
      );
      const ingredientsSum = ingredientsPrices.reduce((a, b) => a + b, 0);
      return (
        (getters.selectedDough.price +
          getters.selectedSauce.price +
          ingredientsSum) *
        getters.selectedSize.multiplier
      );
    },
    /*totalPrice({ cartItems }) {
      const pizzaPrices = cartItems.map((item) => item.price);
      return pizzaPrices.length ? pizzaPrices.reduce((a, b) => a + b, 0) : 0;
    },*/
  },
  actions: {
    /*setCartItems({ commit }) {
      const data = getCartItems();
      commit(
        SET_ENTITY,
        {
          module,
          entity: "cartItems",
          value: data,
        },
        { root: true }
      );
    },*/
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
    /*setNewPizza(
      { state, commit },
      selectedDough,
      selectedSauce,
      selectedSize,
      selectedIngredients,
      pizzaPrice
    ) {
      const data = {
        dough: selectedDough,
        sauce: selectedSauce,
        size: selectedSize,
        ingredients: selectedIngredients,
        name: state.pizzaName,
        price: pizzaPrice,
      };

      commit(
        SET_ENTITY,
        {
          module,
          entity: "newPizza",
          value: data,
        },
        { root: true }
      );
    },*/
    /*addToCart({ state, getters, commit, dispatch }) {
      const newPizza = {
        dough: getters.selectedDough,
        sauce: getters.selectedSauce,
        size: getters.selectedSize,
        ingredients: getters.selectedIngredients,
        name: state.pizzaName,
        price: getters.pizzaPrice,
        value: 1,
      };

      commit(
        ADD_ENTITY,
        {
          module,
          entity: "cartItems",
          value: newPizza,
        },
        { root: true }
      );
      console.log("all pizzas", state.cartItems);
      setCartItemsToLS(state.cartItems);
      //dispatch("updateTotalPrice", state.totalPrice);
      dispatch("setPizzaName", "");
    },*/
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
    changeIngredientValue({ state, commit }, { name, value }) {
      const data = cloneDeep(state.ingredients);
      data.find((item) => item.name === name).value = value;

      commit(
        SET_ENTITY,
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

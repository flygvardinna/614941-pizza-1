import { SET_ENTITY, ADD_ENTITY } from "@/store/mutation-types";
import { capitalize } from "@/common/helpers";
import pizza from "@/static/pizza.json";
import {
  normalizeDetail,
  normalizeIngredients,
  getCartItems,
  setCartItems,
  findSelectedItem,
} from "@/common/helpers";
import {
  //MAX_INGREDIENT_VALUE,
  Dough,
  Sauce,
  Size,
  Ingredient,
} from "@/common/constants";

//const entity = "builder";
const module = capitalize("builder");
/*const namespace = { entity, module };*/

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
    pizzaPrice: 0,
    //newPizza: null,
    // текущую пиццу надо хранить в сторе и чтоб в методе addToCart она клалась в корзину сама
    // и в ней же, в текущей пицце (геттер), хранить selectedDough итд?
    cartItems: [],
    totalPrice: 0,
  },
  getters: {
    //или это в state? видимо надо хранить в state
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
    pizzaPrice(state) {
      const ingredientsPrices = state.selectedIngredients.map(
        (item) => item.price * item.value
      );
      const ingredientsSum = ingredientsPrices.reduce((a, b) => a + b, 0);
      return (
        (state.selectedDough.price +
          state.selectedSauce.price +
          ingredientsSum) *
        state.selectedSize.multiplier
      );
    },
    // сделать сеттер setTotalPrice?
    // у нас уже есть updateTotalPrice - как-то его модифицировать?
    totalPrice({ cartItems }) {
      const pizzaPrices = cartItems.map((item) => item.price);
      return pizzaPrices.length ? pizzaPrices.reduce((a, b) => a + b, 0) : 0;
    },
  },
  actions: {
    setDough({ commit }) {
      const data = pizza.dough.map((item) => normalizeDetail(Dough, item));
      commit(
        SET_ENTITY,
        {
          module,
          entity: "dough",
          value: data,
        },
        { root: true }
      );
    },
    setSauces({ commit }) {
      const data = pizza.sauces.map((item) => normalizeDetail(Sauce, item));
      commit(
        SET_ENTITY,
        {
          module,
          entity: "sauces",
          value: data,
        },
        { root: true }
      );
    },
    setSizes({ commit }) {
      const data = pizza.sizes.map((item) => normalizeDetail(Size, item));
      commit(
        SET_ENTITY,
        {
          module,
          entity: "sizes",
          value: data,
        },
        { root: true }
      );
    },
    setIngredients({ commit }) {
      const data = pizza.ingredients.map((item) =>
        normalizeIngredients(Ingredient, item)
      );
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
    // или это все-таки в геттерах?
    /*setSelectedDough({ state, commit }) {
      const data = findSelectedItem(state.dough);
      commit(
        SET_ENTITY,
        {
          module,
          entity: "selectedDough",
          value: data,
        },
        { root: true }
      );
    },
    setSelectedSauce({ state, commit }) {
      const data = findSelectedItem(state.sauces);
      commit(
        SET_ENTITY,
        {
          module,
          entity: "selectedSauce",
          value: data,
        },
        { root: true }
      );
    },
    setSelectedSize({ state, commit }) {
      const data = findSelectedItem(state.sizes);
      commit(
        SET_ENTITY,
        {
          module,
          entity: "selectedSize",
          value: data,
        },
        { root: true }
      );
    },
    setSelectedIngredients({ state, commit }) {
      const data = state.ingredients.filter((item) => item.value > 0);
      commit(
        SET_ENTITY,
        {
          module,
          entity: "selectedIngredients",
          value: data,
        },
        { root: true }
      );
    },*/
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
    setCartItems({ commit }) {
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
    },
    /*updateTotalPrice({ commit }, totalPrice) {
      commit(
        SET_ENTITY,
        {
          module,
          entity: "totalPrice",
          value: totalPrice,
        },
        { root: true }
      );
    },*/
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
    addToCart({ state, getters, commit, dispatch }) {
      const newPizza = {
        dough: state.selectedDough,
        sauce: state.selectedSauce,
        size: state.selectedSize,
        ingredients: state.selectedIngredients,
        name: state.pizzaName,
        price: getters.pizzaPrice,
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
      setCartItems(state.cartItems);
      dispatch("updateTotalPrice", state.totalPrice);
      dispatch("setPizzaName", "");

      /*commit(
        SET_ENTITY,
        {
          module,
          entity: "pizzaName",
          value: "",
        },
        { root: true }
      );*/
    },
    changeSelectedItem({ state, commit }, { newValue, itemName }) {
      const data = state[itemName];
      // тут не надо ли cloneDeep ?
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
      const data = state.ingredients;
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
    // или это не надо и условие проверяй в методе компонента и оттуда вызывай changeIngredientValue?
    /*addIngredient({ dispatch }, ingredient) {
      if (ingredient.value !== MAX_INGREDIENT_VALUE) {
        dispatch("changeIngredientValue", {
          name: ingredient.name,
          value: ingredient.value + 1,
        });
      }
    },*/
  },
};

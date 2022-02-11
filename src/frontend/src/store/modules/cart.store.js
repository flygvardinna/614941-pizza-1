//import { cloneDeep } from "lodash";
import { SET_ENTITY, ADD_ENTITY } from "@/store/mutation-types";
import { capitalize } from "@/common/helpers";
import { getCartItems, setCartItems } from "@/common/helpers";

const module = capitalize("cart");

export default {
  namespaced: true,
  state: {
    cartItems: [],
    totalPrice: 0,
  },
  getters: {
    totalPrice({ cartItems }) {
      const pizzaPrices = cartItems.map((item) => item.price);
      return pizzaPrices.length ? pizzaPrices.reduce((a, b) => a + b, 0) : 0;
    },
  },
  actions: {
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
    addToCart({ state, commit, dispatch, rootGetters }) {
      const newPizza = {
        dough: rootGetters.selectedDough,
        sauce: rootGetters.selectedSauce,
        size: rootGetters.selectedSize,
        ingredients: rootGetters.selectedIngredients,
        name: rootGetters.pizzaName,
        price: rootGetters.pizzaPrice,
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
      setCartItems(state.cartItems);
      //dispatch("updateTotalPrice", state.totalPrice);
      dispatch("Builder/setPizzaName", "");
    },
    /*changeIngredientValue({ state, commit }, { name, value }) {
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
    },*/
  },
};

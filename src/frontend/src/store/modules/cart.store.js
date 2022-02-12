//import { cloneDeep } from "lodash";
import { SET_ENTITY, ADD_ENTITY } from "@/store/mutation-types";
import { capitalize, getCartItems, setCartItemsToLS } from "@/common/helpers";

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
    addToCart({ state, commit, dispatch, rootState, rootGetters }) {
      const newPizza = {
        dough: rootGetters["Builder/selectedDough"],
        sauce: rootGetters["Builder/selectedSauce"],
        size: rootGetters["Builder/selectedSize"],
        ingredients: rootGetters["Builder/selectedIngredients"],
        name: rootState.Builder.pizzaName,
        price: rootGetters["Builder/pizzaPrice"],
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
        // Для запуска действий или совершения мутаций в глобальном пространстве имён нужно
        // добавить { root: true } 3-м аргументом в dispatch и commit.
        // где не глобальное, можно убрать, получается?
      );
      console.log("all pizzas", state.cartItems);
      setCartItemsToLS(state.cartItems);
      //dispatch("updateTotalPrice", state.totalPrice);
      dispatch("Builder/setPizzaName", "", { root: true });
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

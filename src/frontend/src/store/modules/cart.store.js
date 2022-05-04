import {
  SET_ENTITY,
  ADD_ENTITY,
  UPDATE_ENTITY,
  DELETE_ENTITY,
  //RESET_BUILDER_STATE,
  RESET_CART_STATE,
} from "@/store/mutation-types";
import additionalItems from "@/static/misc.json";
import {
  capitalize,
  getCartItems,
  normalizeAdditionalItems,
  setCartItemsToLS,
  createUUIDv4,
} from "@/common/helpers";

const module = capitalize("cart");

const initialState = () => ({
  pizzaItems: [],
  additionalItems: [],
  totalPrice: 0,
});

export default {
  namespaced: true,
  state: initialState(),
  getters: {
    totalPrice({ pizzaItems, additionalItems }) {
      const pizzaPrices = pizzaItems.map((item) => item.price * item.value);
      const additionalItemsPrices = additionalItems.map(
        (item) => item.price * item.value
      );
      const allPrices = pizzaPrices.concat(additionalItemsPrices);
      return allPrices.length ? allPrices.reduce((a, b) => a + b, 0) : 0;
    },
  },
  mutations: {
    [RESET_CART_STATE](state) {
      Object.assign(state, initialState());
    },
  },
  actions: {
    fetchAdditionalItems({ commit }) {
      const items = additionalItems.map((item) =>
        normalizeAdditionalItems(item)
      );
      commit(
        SET_ENTITY,
        {
          module,
          entity: "additionalItems",
          value: items,
        },
        { root: true }
      );
    },
    setCartItems({ commit }) {
      const pizzaItems = getCartItems("pizzaItems");
      const additionalItems = getCartItems("additionalItems");
      commit(
        SET_ENTITY,
        {
          module,
          entity: "pizzaItems",
          value: pizzaItems,
        },
        { root: true }
      );
      commit(
        SET_ENTITY,
        {
          module,
          entity: "additionalItems",
          value: additionalItems,
        },
        { root: true }
      );
    },
    addToCart({ state, commit, dispatch, rootState, rootGetters }) {
      const currentPizza = {
        dough: rootGetters["Builder/selectedDough"],
        sauce: rootGetters["Builder/selectedSauce"],
        size: rootGetters["Builder/selectedSize"],
        ingredients: rootGetters["Builder/selectedIngredients"],
        name: rootState.Builder.pizzaName,
        price: rootGetters["Builder/pizzaPrice"],
        value: 1,
        id: rootState.Builder.pizzaId ?? createUUIDv4(),
      };

      if (rootState.Builder.pizzaId !== null) {
        commit(
          UPDATE_ENTITY,
          {
            module,
            entity: "pizzaItems",
            value: currentPizza,
          },
          { root: true }
        );
      } else {
        commit(
          ADD_ENTITY,
          {
            module,
            entity: "pizzaItems",
            value: currentPizza,
          },
          { root: true }
          // Для запуска действий или совершения мутаций в глобальном пространстве имён нужно
          // добавить { root: true } 3-м аргументом в dispatch и commit.
          // где не глобальное, можно убрать, получается?
          // в vueWork это остается везде
        );
      }
      console.log("all pizzas", state.pizzaItems);
      setCartItemsToLS("pizzaItems", state.pizzaItems);
      // commit(RESET_BUILDER_STATE, { root: true });
      // вернись к этому позже
      // скорей всего нужен метод в Builder, который вызывает эту мутацию
      dispatch("Builder/setPizzaName", "", { root: true });
      dispatch("Builder/setPizzaId", null, { root: true });
      this.$router.push({ name: "IndexHome" });
    },
    /*removeFromCart({ state, commit }, pizzaName) {
      const data = cloneDeep(state.cartItems);
      data.find((item) => item.name === name).value = value;

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
    changeItemValue({ state, commit }, value) {
      commit(
        UPDATE_ENTITY,
        {
          module,
          entity: "pizzaItems",
          value: value,
        },
        { root: true }
      );
      console.log("items after change", state.pizzaItems);
      setCartItemsToLS("pizzaItems", state.pizzaItems);
    },
    // убрать отдельный метод ?
    // ОБА МЕТОДА МОЖНО СОЕДИНИИТЬ В ОДИН, ЕСЛИ ПЕРЕДАВАТЬ ИМЯ ДЛЯ ENTITY
    changeAdditionalItemValue({ state, commit }, value) {
      commit(
        UPDATE_ENTITY,
        {
          module,
          entity: "additionalItems",
          value: value,
        },
        { root: true }
      );
      setCartItemsToLS("additionalItems", state.additionalItems);
    },
    deleteItem({ state, commit }, id) {
      commit(
        DELETE_ENTITY,
        {
          module,
          entity: "pizzaItems",
          id,
        },
        { root: true }
      );
      console.log("items after delete", state.pizzaItems);
      setCartItemsToLS("pizzaItems", state.pizzaItems);
    },
  },
};

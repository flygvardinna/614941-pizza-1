import {
  SET_ENTITY,
  ADD_ENTITY,
  UPDATE_ENTITY,
  DELETE_ENTITY,
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
    resetCartState({ commit }) {
      commit(RESET_CART_STATE, { root: true });
    },
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
    addItem({ state, commit, rootState, rootGetters }) {
      const pizzaId = rootState.Builder.pizzaId;
      const pizza = {
        ...rootGetters["Builder/currentPizza"],
        price: rootGetters["Builder/pizzaPrice"],
        id: pizzaId ?? createUUIDv4(),
      };
      const mutationName = pizzaId !== null ? UPDATE_ENTITY : ADD_ENTITY;

      commit(
        mutationName,
        {
          module,
          entity: "pizzaItems",
          value: pizza,
        },
        { root: true }
      );

      setCartItemsToLS("pizzaItems", state.pizzaItems);
    },
    changeItemValue({ state, commit }, item) {
      commit(
        UPDATE_ENTITY,
        {
          module,
          entity: "pizzaItems",
          value: item,
        },
        { root: true }
      );
      setCartItemsToLS("pizzaItems", state.pizzaItems);
    },
    changeAdditionalItemValue({ state, commit }, item) {
      commit(
        UPDATE_ENTITY,
        {
          module,
          entity: "additionalItems",
          value: item,
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
      setCartItemsToLS("pizzaItems", state.pizzaItems);
    },
  },
};

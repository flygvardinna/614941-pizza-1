import {
  SET_ENTITY,
  ADD_ENTITY,
  UPDATE_ENTITY,
  DELETE_ENTITY,
  RESET_CART_STATE,
} from "@/store/mutation-types";
import {
  capitalize,
  normalizeAdditionalItems,
  getCartItemsFromLS,
  setCartItemsToLS,
  clearCartItemsFromLS,
  createUUIDv4,
  getOrderPrice,
} from "@/common/helpers";

const module = capitalize("cart");

const initialState = () => ({
  pizzaItems: [],
  additionalItems: [],
});

export default {
  namespaced: true,
  state: initialState(),

  getters: {
    totalPrice(state) {
      return getOrderPrice(state.pizzaItems, state.additionalItems);
    },
  },

  mutations: {
    [RESET_CART_STATE](state) {
      Object.assign(state, initialState());
    },
  },

  actions: {
    resetCartState({ commit }) {
      commit(RESET_CART_STATE);
      clearCartItemsFromLS("pizzaItems");
      clearCartItemsFromLS("additionalItems");
    },

    async fetchAdditionalItems({ commit }) {
      const data = await this.$api.misc.query();
      const items = data.map((item) => normalizeAdditionalItems(item));

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

    setCartItemsFromLS({ commit }) {
      const pizzaItems = getCartItemsFromLS("pizzaItems");
      const additionalItems = getCartItemsFromLS("additionalItems");

      if (pizzaItems.length > 0) {
        commit(
          SET_ENTITY,
          {
            module,
            entity: "pizzaItems",
            value: pizzaItems,
          },
          { root: true }
        );
      }

      if (additionalItems.length > 0) {
        commit(
          SET_ENTITY,
          {
            module,
            entity: "additionalItems",
            value: additionalItems,
          },
          { root: true }
        );
      }
    },

    addItem({ state, commit }, pizza) {
      const mutation = pizza.id ? UPDATE_ENTITY : ADD_ENTITY;

      commit(
        mutation,
        {
          module,
          entity: "pizzaItems",
          value: pizza.id ? pizza : { ...pizza, id: createUUIDv4() },
        },
        { root: true }
      );

      setCartItemsToLS("pizzaItems", state.pizzaItems);
    },

    changeItemQuantity({ state, commit }, item) {
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

    changeAdditionalItemQuantity({ state, commit }, item) {
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

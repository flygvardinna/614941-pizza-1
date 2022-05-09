import {
  SET_ENTITY,
  ADD_ENTITY,
  UPDATE_ENTITY,
  DELETE_ENTITY,
  RESET_CART_STATE,
} from "@/store/mutation-types";
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
});

export default {
  namespaced: true,
  state: initialState(),
  getters: {
    totalPrice({ pizzaItems, additionalItems }) {
      const pizzaPrices = pizzaItems.map((item) => item.price * item.quantity);
      const additionalItemsPrices = additionalItems.map(
        (item) => item.price * item.quantity
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
      commit(RESET_CART_STATE);
    },
    async fetchAdditionalItems({ commit }) {
      const data = await this.$api.misc.query();
      const items = data.map((item) => normalizeAdditionalItems(item));
      // пока пусть тут остается, но надо тоже в api вынести вообще
      // тут бы как-то переписать, чтоб не заводить 2 переменные
      // но когда просто изменяю data в итоге нормалайз не произойдет
      // видимо потому что const нельзя изменять
      // если сделать let data - тоже не поможет
      // кажется тут надо что-то типа .then обработка промисов, но тоже пока некраиво все выглядело и не работало
      // подумай

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
        // по api цену и id пиццы отправлять не надо
        // id нужен мне только чтоб работать с пиццами в корзине - изменять/удалять
        // в инфе о заказе у пиццы потом будет id, но уже какой-то другой

        // можно делать как в примере в api
        // Форматирование данных перед отправкой на сервер (убираем лишнее)
        //  _createRequest(task) {
        //  const { ticks, comments, status, timeStatus, user, ...request } = task;
        //  return request;
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

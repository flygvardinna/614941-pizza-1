import { SET_ENTITY, ADD_ENTITY, DELETE_ENTITY } from "@/store/mutation-types";
import { capitalize } from "@/common/helpers";

const entity = "orders";
const module = capitalize(entity);
const namespace = { entity, module };

export default {
  namespaced: true,
  state: {
    orders: [],
  },
  /*getters: {
    totalPrice({ pizzaItems, additionalItems }) {
      const pizzaPrices = pizzaItems.map((item) => item.price * item.quantity);
      const additionalItemsPrices = additionalItems.map(
        (item) => item.price * item.quantity
      );
      const allPrices = pizzaPrices.concat(additionalItemsPrices);
      return allPrices.length ? allPrices.reduce((a, b) => a + b, 0) : 0;
    },
  },*/
  actions: {
    async fetchOrders({ commit }) {
      const orders = await this.$api.orders.query();

      commit(
        SET_ENTITY,
        {
          ...namespace,
          value: orders,
        },
        { root: true }
      );
    },
    async createOrder({ commit }, order) {
      const data = await this.$api.orders.post(order);

      // вроде должно быть такое, только я хз, зачем мне это хранить
      commit(
        ADD_ENTITY,
        {
          ...namespace,
          value: data,
        },
        { root: true }
      );
    },
    /*setCartItems({ commit }) {
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
    },*/
    /*deleteItem({ state, commit }, id) {
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
    },*/
  },
};

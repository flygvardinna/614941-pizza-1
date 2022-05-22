import { SET_ENTITY, ADD_ENTITY, DELETE_ENTITY } from "@/store/mutation-types";
import { formatPizzas, formatMisc } from "@/common/helpers";
import { cloneDeep } from "lodash";
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
      console.log("orders from api", orders);

      /*const dough = rootState.Builder.dough;
      const sauces = rootState.Builder.sauces;
      const sizes = rootState.Builder.sizes;
      const ingredients = rootState.Builder.ingredients;*/

      /*const normalizedOrders = () => {
        return orders.map((order) => {
          const pizzas = order.orderPizzas.map((pizza) => {
            return {
              ingredientId: ingredient.id,
              quantity: ingredient.quantity,
            };
          });
          const misc = pizza.ingredients.map((ingredient) => {
            return {
              ingredientId: ingredient.id,
              quantity: ingredient.quantity,
            };
          });
          const totalPrice = pizza.ingredients.map((ingredient) => {
            return {
              ingredientId: ingredient.id,
              quantity: ingredient.quantity,
            };
          });
          return {
            ...order,
            orderPizzas: pizzas,
            orderMisc: misc,
            totalPrice,
          };
        });
      };*/

      commit(
        SET_ENTITY,
        {
          ...namespace,
          value: orders,
        },
        { root: true }
      );
    },
    async createOrder({ commit, rootState }, { phone, address }) {
      const pizzasCopy = cloneDeep(rootState.Cart.pizzaItems);
      const miscCopy = cloneDeep(rootState.Cart.additionalItems);

      const order = {
        userId: rootState.Auth.user.id,
        phone,
        // но в форме можно ввести другой телефон
        // разберись с этим - что-то писали в чате про телефон
        address,
        pizzas: formatPizzas(pizzasCopy),
        misc: formatMisc(miscCopy),
      };

      console.log("order itself", order);
      const data = await this.$api.orders.post(order);
      console.log("order data", data);

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
    async deleteOrder({ commit }, id) {
      await this.$api.orders.delete(id);

      commit(
        DELETE_ENTITY,
        {
          ...namespace,
          id,
        },
        { root: true }
      );
    },
  },
};

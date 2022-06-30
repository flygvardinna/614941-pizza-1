import { SET_ENTITY, DELETE_ENTITY } from "@/store/mutation-types";
import { capitalize } from "@/common/helpers";

const entity = "orders";
const module = capitalize(entity);
const namespace = { entity, module };

export default {
  namespaced: true,
  state: {
    orders: [],
  },

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

    async createOrder(context, order) {
      await this.$api.orders.post(order);
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

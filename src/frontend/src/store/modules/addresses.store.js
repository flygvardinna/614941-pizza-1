import {
  SET_ENTITY,
  ADD_ENTITY,
  UPDATE_ENTITY,
  DELETE_ENTITY,
} from "@/store/mutation-types";
import { capitalize } from "@/common/helpers";
// import { cloneDeep } from "lodash";

const entity = "addresses";
const module = capitalize(entity);
const namespace = { entity, module };

export default {
  namespaced: true,
  state: {
    addresses: [],
  },
  actions: {
    async fetchAddresses({ commit }) {
      const addresses = await this.$api.addresses.query();
      /*const addresses = data.map((address) => {
        return {
          ...address,
          isFormOpened: false,
        };
      });*/
      //console.log("addresses from api", addresses);

      commit(
        SET_ENTITY,
        {
          ...namespace,
          value: addresses,
        },
        { root: true }
      );
    },
    async addAddress({ commit }, address) {
      const data = await this.$api.addresses.post(address);
      // data отличается от address тем, что там добавится id
      // не знаю зачем сохряняем в state но в columns так же

      commit(
        ADD_ENTITY,
        {
          ...namespace,
          value: data,
        },
        { root: true }
      );
    },
    async editAddress({ commit }, address) {
      await this.$api.addresses.put(address);

      // не знаю, зачем сохранять это в state
      // но в vuework в tasks и в columns тоже сохраняем
      commit(
        UPDATE_ENTITY,
        {
          ...namespace,
          value: address,
        },
        { root: true }
      );
    },
    async deleteAddress({ commit }, id) {
      await this.$api.addresses.delete(id);

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

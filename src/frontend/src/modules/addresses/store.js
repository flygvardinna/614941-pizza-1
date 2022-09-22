import {
  SET_ENTITY,
  ADD_ENTITY,
  UPDATE_ENTITY,
  DELETE_ENTITY,
  RESET_ADDRESSES_STATE,
} from "@/store/mutation-types";
import { capitalize } from "@/common/helpers";

const entity = "addresses";
const module = capitalize(entity);
const namespace = { entity, module };

const initialState = () => ({
  addresses: [],
});

export default {
  namespaced: true,
  state: initialState(),

  mutations: {
    [RESET_ADDRESSES_STATE](state) {
      Object.assign(state, initialState());
    },
  },

  actions: {
    resetAddressesState({ commit }) {
      commit(RESET_ADDRESSES_STATE);
    },
    async fetchAddresses({ commit }) {
      const addresses = await this.$api.addresses.query();

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

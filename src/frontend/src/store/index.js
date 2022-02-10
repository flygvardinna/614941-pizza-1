import Vue from "vue";
import Vuex from "vuex";
import modules from "@/store/modules";
import {
  //ADD_NOTIFICATION,
  //DELETE_NOTIFICATION,
  SET_ENTITY,
  ADD_ENTITY,
} from "@/store/mutation-types";
import jsonUser from "@/static/user.json";

Vue.use(Vuex);

const state = () => ({
  userData: null,
  //totalPrice: 0, должна быть в корзине
});

const actions = {
  async init({ dispatch }) {
    dispatch("fetchUser");
    dispatch("Builder/setDough");
    dispatch("Builder/setSauces");
    dispatch("Builder/setSizes");
    dispatch("Builder/setIngredients");
    dispatch("Builder/setCartItems");
  },
  fetchUser({ commit }) {
    const user = jsonUser; // TODO: Add api call
    commit(SET_ENTITY, { module: null, entity: "userData", value: user });
  },
};

const mutations = {
  /*[ADD_NOTIFICATION](state, notification) {
    state.notifications = [...state.notifications, notification];
  },
  [DELETE_NOTIFICATION](state, id) {
    state.notifications = state.notifications.filter(
      notification => notification.id !== id
    );
  },*/
  [SET_ENTITY](state, { module, entity, value }) {
    module ? (state[module][entity] = value) : (state[entity] = value);
  },
  [ADD_ENTITY](state, { module, entity, value }) {
    if (module) {
      state[module][entity] = [...state[module][entity], value];
    } else {
      state[entity] = [...state[entity], value];
    }
  },
  // пригодится добавлять пиццы в корзину
};

export default new Vuex.Store({
  state,
  actions,
  mutations,
  modules,
});

import { SET_ENTITY } from "@/store/mutation-types";

export default {
  namespaced: true,
  state: {
    isAuthenticated: false,
    // isAuthenticated мне, возможно, тоже не нужно
    // рассмотри подробнее зачем это во vueWork
    // по идее это заменеятся пустым user
    // но может есть какие-то нюансы
    user: null,
  },
  getters: {
    // проверь нужно ли мне
    // используется так в vuework
    // v-if="getUserAttribute('isAdmin')"
    // показываем кнопку только администратору
    getUserAttribute: (state) => (attr) => state.user ? state.user[attr] : "",
  },
  actions: {
    async login({ dispatch }, credentials) {
      const data = await this.$api.auth.login(credentials);
      this.$jwt.saveToken(data.token);
      this.$api.auth.setAuthHeader();
      dispatch("getMe");
    },
    async logout({ commit }, sendRequest = true) {
      if (sendRequest) {
        await this.$api.auth.logout();
      }
      this.$jwt.destroyToken();
      this.$api.auth.setAuthHeader();
      commit(
        SET_ENTITY,
        { module: "Auth", entity: "isAuthenticated", value: false },
        { root: true }
      );
      commit(
        SET_ENTITY,
        { module: "Auth", entity: "user", value: null },
        { root: true }
      );
    },
    async getMe({ commit, dispatch }) {
      try {
        const data = await this.$api.auth.getMe();
        commit(
          SET_ENTITY,
          { module: "Auth", entity: "isAuthenticated", value: true },
          { root: true }
        );
        commit(
          SET_ENTITY,
          { module: "Auth", entity: "user", value: data },
          { root: true }
        );
      } catch {
        // Note: in case of not proper login, i.e. token is expired
        dispatch("logout", false);
      }
    },
  },
};

import {
  SET_ENTITY,
  UPDATE_ENTITY,
  EDIT_PIZZA,
  RESET_BUILDER_STATE,
} from "@/store/mutation-types";
import { capitalize, changeCheckedItem } from "@/common/helpers";

const module = capitalize("builder");

const initialState = () => ({
  dough: [],
  sauces: [],
  sizes: [],
  ingredients: [],
  pizzaName: "",
  pizzaId: null,
  pizzaQuantity: 1,
});

export default {
  namespaced: true,
  state: initialState(),

  getters: {
    isPizzaDataLoading(state) {
      return (
        !state.dough.length ||
        !state.sauces.length ||
        !state.sizes.length ||
        !state.ingredients.length
      );
    },

    selectedDough(state) {
      return state.dough.find((item) => item.isChecked);
    },

    selectedSauce(state) {
      return state.sauces.find((item) => item.isChecked);
    },

    selectedSize(state) {
      return state.sizes.find((item) => item.isChecked);
    },

    selectedIngredients(state) {
      return state.ingredients.filter((item) => item.quantity > 0);
    },

    doughPrice(state, getters) {
      return getters.selectedDough.price;
    },

    saucePrice(state, getters) {
      return getters.selectedSauce.price;
    },

    ingredientsPrice(state, getters) {
      return getters.selectedIngredients
        .map((item) => item.price * item.quantity)
        .reduce((a, b) => a + b, 0);
    },

    pizzaPrice(state, getters) {
      return (getters.doughPrice + getters.saucePrice + getters.ingredientsPrice) * getters.selectedSize.multiplier;
    },

    currentPizza(state, getters) {
      return {
        doughId: getters.selectedDough.id,
        sauceId: getters.selectedSauce.id,
        sizeId: getters.selectedSize.id,
        ingredients: getters.selectedIngredients.map((ingredient) => {
          return {
            ingredientId: ingredient.id,
            quantity: ingredient.quantity,
          };
        }),
        name: state.pizzaName,
        id: state.pizzaId,
        quantity: state.pizzaQuantity,
        price: getters.pizzaPrice,
      };
    },
  },

  mutations: {
    [RESET_BUILDER_STATE](state) {
      Object.assign(state, initialState());
    },

    [EDIT_PIZZA](state, newState) {
      Object.assign(state, newState());
    },
  },

  actions: {
    resetBuilderState({ commit }) {
      commit(RESET_BUILDER_STATE);
    },

    async fetchPizzaParts({ commit }) {
      const dough = await this.$api.builder.fetchDough();
      const sauces = await this.$api.builder.fetchSauces();
      const sizes = await this.$api.builder.fetchSizes();
      const ingredients = await this.$api.builder.fetchIngredients();

      commit(
        SET_ENTITY,
        {
          module,
          entity: "dough",
          value: dough,
        },
        { root: true }
      );
      commit(
        SET_ENTITY,
        {
          module,
          entity: "sauces",
          value: sauces,
        },
        { root: true }
      );
      commit(
        SET_ENTITY,
        {
          module,
          entity: "sizes",
          value: sizes,
        },
        { root: true }
      );
      commit(
        SET_ENTITY,
        {
          module,
          entity: "ingredients",
          value: ingredients,
        },
        { root: true }
      );
    },

    setPizzaName({ commit }, name) {
      commit(
        SET_ENTITY,
        {
          module,
          entity: "pizzaName",
          value: name,
        },
        { root: true }
      );
    },

    changeSelectedItem({ state, commit }, { id, itemName }) {
      const data = changeCheckedItem(state[itemName], id);

      commit(
        SET_ENTITY,
        {
          module,
          entity: itemName,
          value: data,
        },
        { root: true }
      );
    },

    changeIngredientQuantity({ commit }, ingredient) {
      commit(
        UPDATE_ENTITY,
        {
          module,
          entity: "ingredients",
          value: ingredient,
        },
        { root: true }
      );
    },

    editPizza({ state, commit }, pizza) {
      const newState = () => {
        return {
          dough: changeCheckedItem(state.dough, pizza.doughId),
          sauces: changeCheckedItem(state.sauces, pizza.sauceId),
          sizes: changeCheckedItem(state.sizes, pizza.sizeId),
          ingredients: state.ingredients.map((ingredient) => {
            const item = pizza.ingredients.find(
              (item) => item.ingredientId === ingredient.id
            );

            return {
              ...ingredient,
              quantity: item ? item.quantity : 0,
            };
          }),
          pizzaName: pizza.name,
          pizzaId: pizza.id,
          pizzaQuantity: pizza.quantity,
        };
      };

      commit(EDIT_PIZZA, newState);
    },
  },
};

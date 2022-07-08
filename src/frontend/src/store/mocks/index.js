import { cloneDeep } from "lodash";

import { mutations } from "@/store";
import modules from "@/store/modules";
import Vuex from "vuex";
import VuexPlugins from "@/plugins/vuexPlugins";
import { SET_ENTITY } from "@/store/mutation-types";
import pizzaData from "@/static/pizza.json";
import miscData from "@/static/misc.json";
import user from "@/static/user";
import { normalizeAdditionalItems } from "@/common/helpers";

const initState = () => ({
  notifications: [],
});

export const generateMockStore = (actions) => {
  const modulesCopy = cloneDeep(modules);
  if (actions) {
    Object.entries(actions).forEach(([module, actions]) => {
      modulesCopy[module] = { ...modulesCopy[module], actions };
    });
  }

  return new Vuex.Store({
    state: initState(),
    mutations,
    modules: modulesCopy,
    plugins: [VuexPlugins],
  });
};

export const setDough = (store) => {
  store.commit(SET_ENTITY, {
    module: "Builder",
    entity: "dough",
    value: pizzaData.dough.map((dough, index) => {
      return {
        ...dough,
        value: "light",
        isChecked: index === 0,
      };
    }),
  });
};

export const setSizes = (store) => {
  store.commit(SET_ENTITY, {
    module: "Builder",
    entity: "sizes",
    value: pizzaData.sizes.map((size, index) => {
      return {
        ...size,
        value: "small",
        isChecked: index === 0,
      };
    }),
  });
};

export const setSauces = (store) => {
  store.commit(SET_ENTITY, {
    module: "Builder",
    entity: "sauces",
    value: pizzaData.sauces.map((sauce, index) => {
      return {
        ...sauce,
        value: "tomato",
        isChecked: index === 0,
      };
    }),
  });
};

export const setIngredients = (store) => {
  store.commit(SET_ENTITY, {
    module: "Builder",
    entity: "ingredients",
    value: pizzaData.ingredients.map((ingredient) => {
      return {
        ...ingredient,
        value: "mushrooms",
        quantity: 0,
      };
    }),
  });
};

export const setPizzaName = (store) => {
  store.commit(SET_ENTITY, {
    module: "Builder",
    entity: "pizzaName",
    value: "testPizzaName",
  });
};

export const setPizzaItems = (store) => {
  store.commit(SET_ENTITY, {
    module: "Cart",
    entity: "pizzaItems",
    value: [
      {
        id: "1",
        name: "Pizza name",
        doughId: 1,
        sauceId: 1,
        sizeId: 1,
        ingredients: [
          { ingredientId: 1, quantity: 1 },
          { ingredientId: 2, quantity: 1 },
        ],
        price: 545,
        quantity: 1,
      },
    ],
  });
};

export const setAdditionalItems = (store) => {
  store.commit(SET_ENTITY, {
    module: "Cart",
    entity: "additionalItems",
    value: miscData.map((item) => normalizeAdditionalItems(item)),
  });
};

export const setAddresses = (store) => {
  store.commit(SET_ENTITY, {
    module: "Addresses",
    entity: "addresses",
    value: [
      {
        id: 1,
        name: "Домик",
        userId: "1",
        street: "Зеленая",
        building: "1",
        flat: "1",
        comment: "Не звоните",
      },
    ],
  });
};

export const setOrders = (store) => {
  store.commit(SET_ENTITY, {
    module: "Orders",
    entity: "orders",
    value: [
      {
        id: 1,
        userId: "1",
        phone: "+777 777 777",
        addressId: 1,
        orderAddress: {
          id: 1,
          name: "Домик",
          userId: "1",
          street: "Зеленая",
          building: "1",
          flat: "1",
          comment: "",
        },
        orderMisc: [{ id: 1, miscId: 1, orderId: 1, quantity: 0 }],
        orderPizzas: [
          {
            id: 1,
            name: "Pizza name",
            doughId: 1,
            sauceId: 1,
            sizeId: 1,
            ingredients: [
              { id: 1, ingredientId: 1, pizzaId: 1, quantity: 1 },
              { id: 2, ingredientId: 2, pizzaId: 1, quantity: 1 },
            ],
            quantity: 1,
            orderId: 1,
          },
        ],
      },
    ],
  });
};

export const setUser = (store) => {
  store.commit(SET_ENTITY, {
    module: "Auth",
    entity: "user",
    value: user,
  });
};

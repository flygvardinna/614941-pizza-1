import resources from "@/common/enums/resources";
import {
  AuthApiService,
  CrudApiService,
  ReadOnlyApiService,
  BuilderApiService,
} from "@/services/api.service";

export const setAuth = (store) => {
  store.$api.auth.setAuthHeader();
  store.dispatch("Auth/getMe");
};

/*export const getPizzaPartNameById = (list, id) => {
  const item = list.find((item) => item.id == id);
  return item.name;
};
// также был вариант в чате от настнавника
// Попробуйте создать объект мапу, где id будет ключ, а значение будет название
// И вот так обращаться там где надо использовать название IngrainedMap[ingradientId]

export const getPizzaPartPriceById = (list, id) => {
  const item = list.find((item) => item.id == id);
  return item.price;
};

export const getMultiplierById = (list, id) => {
  const item = list.find((item) => item.id == id);
  return item.multiplier;
};*/

/*export const normalizeDetail = (detail, item) => {
  return {
    ...item,
    value: detail[item.name],
    isChecked: item.id === 1,
  };
};

export const normalizeIngredients = (list, item) => {
  return {
    ...item,
    englishName: list[item.name],
    value: 0,
  };
};*/

export const normalizeAdditionalItems = (item) => {
  return {
    ...item,
    quantity: 0,
  };
};

export const formatPizzas = (pizzas) => {
  return pizzas.map((pizza) => {
    const ingredients = pizza.ingredients.map((ingredient) => {
      return {
        ingredientId: ingredient.id,
        quantity: ingredient.quantity,
      };
    });
    return {
      name: pizza.name,
      quantity: pizza.quantity,
      doughId: pizza.dough.id,
      sauceId: pizza.sauce.id,
      sizeId: pizza.size.id,
      ingredients,
    };
  });
};

export const formatMisc = (misc) => {
  return misc.map((item) => {
    return {
      miscId: item.id,
      quantity: item.quantity,
    };
    // здесь не надо отбирать только те misc, где больше 1, тк иначе ошибка 422 unprocessable
    // уточни у наставника, это ок?
  });
};

export const getCartItems = (keyName) => {
  const items = localStorage.getItem(keyName);
  if (items) {
    return JSON.parse(items);
  }
  return [];
};

export const setCartItemsToLS = (keyName, items) => {
  localStorage.setItem(keyName, JSON.stringify(items));
};

export const capitalize = (string) =>
  `${string.charAt(0).toUpperCase()}${string.slice(1)}`;

export const findSelectedItem = (items) => {
  return items.find((item) => item.isChecked);
};

export const createUUIDv4 = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export const createResources = (notifier) => {
  return {
    [resources.AUTH]: new AuthApiService(notifier),
    [resources.BUILDER]: new BuilderApiService(notifier),
    [resources.MISC]: new ReadOnlyApiService(resources.MISC, notifier),
    [resources.ADDRESSES]: new CrudApiService(resources.ADDRESSES, notifier),
    [resources.ORDERS]: new CrudApiService(resources.ORDERS, notifier),
  };
};

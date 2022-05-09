import resources from "@/common/enums/resources";
import {
  AuthApiService,
  CrudApiService,
  ReadOnlyApiService,
  BuilderApiService,
} from "@/services/api.service";

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

/*export const cleanPizzas = (pizzas) => {
  return pizzas.map((pizza) => {
    const { price, id, ...request } = pizza;
    pizza.ingredients.map((ingredient) => {
      const { price, id, ...ingredient } = ingredient;
      return ingredient;
    })
    return request;
  });
};*/

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

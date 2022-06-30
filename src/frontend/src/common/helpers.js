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

export const getImageSources = (src) => {
  const getDefaultSrc = (src) =>
    `${src.replace(".jpg", "@2x.jpg")} 2x, ${src.replace(
      ".jpg",
      "@4x.jpg"
    )} 4x`;

  const getWebPSrc = (src) =>
    `${src.replace(".jpg", ".webp")} 1x, ${src.replace(
      ".jpg",
      "@2x.webp"
    )} 2x, ${src.replace(".jpg", "@4x.webp")} 4x`;

  return {
    webpSrcset: getWebPSrc(src),
    srcset: getDefaultSrc(src),
  };
};

export const getOrderPrice = (pizzas, misc) => {
  const pizzaPrices = pizzas.map((pizza) => pizza.price * pizza.quantity);
  const miscPrices = misc.map((misc) => misc.price * misc.quantity);
  const allPrices = [...pizzaPrices, ...miscPrices];

  return allPrices.length ? allPrices.reduce((a, b) => a + b, 0) : 0;
};

export const normalizeAdditionalItems = (item) => {
  return {
    ...item,
    quantity: 0,
  };
};

export const getCartItemsFromLS = (keyName) => {
  const items = localStorage.getItem(keyName);

  return items ? JSON.parse(items) : [];
};

export const setCartItemsToLS = (keyName, items) => {
  localStorage.setItem(keyName, JSON.stringify(items));
};

export const clearCartItemsFromLS = (keyName) => {
  localStorage.removeItem(keyName);
};

export const capitalize = (string) =>
  `${string.charAt(0).toUpperCase()}${string.slice(1)}`;

export const getItemById = (list, id) => {
  return list.find((item) => item.id === id);
};

export const changeCheckedItem = (list, id) => {
  list.slice().forEach((item) => (item.isChecked = item.id === id));

  return list;
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

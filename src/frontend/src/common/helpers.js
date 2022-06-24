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
    // eslint-disable-next-line no-unused-vars
    //const { id, price, orderId, ...formattedPizza } = pizza;
    //return formattedPizza;
    // вариант с убиранием не годится, так как там при клике на Повторить надо еще для ингредиентов убирать поля id и pizzaId
    // либо это можно убирать на этапе this.addItem в OrdersItem когда добавляем эти пиццы в корзину
    // это ок, убирать все здесь на этапе отправления заказа
    return {
      name: pizza.name,
      quantity: pizza.quantity,
      doughId: pizza.doughId,
      sauceId: pizza.sauceId,
      sizeId: pizza.sizeId,
      ingredients: pizza.ingredients.map((ingredient) => {
        return {
          ingredientId: ingredient.ingredientId,
          quantity: ingredient.quantity,
        };
      }),
    };
    // тут теперь осталось только убрать лишнее поле id перед отправкой на сервер
    // убираем лишнее как тут
    // https://up.htmlacademy.ru/vue/1/module/5/item/2
    // не очень хорошо, что приходится suppress es-lint, но и формировать новый объект, как было - избыточно
    // внести это исключение из правил eslint в конифг?
  });
};

export const formatMisc = (misc) => {
  return misc.map((item) => {
    return {
      miscId: item.id,
      quantity: item.quantity,
    };
    // здесь не надо отбирать только те misc, где больше 0, тк иначе ошибка 422 unprocessable
  });
};

export const capitalize = (string) =>
  `${string.charAt(0).toUpperCase()}${string.slice(1)}`;

export const findSelectedItem = (items) => {
  return items.find((item) => item.isChecked);
};

export const getPizzaPartById = (list, id) => {
  return list.find((item) => item.id === id);
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

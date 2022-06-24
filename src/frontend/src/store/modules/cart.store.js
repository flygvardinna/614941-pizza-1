import {
  SET_ENTITY,
  ADD_ENTITY,
  UPDATE_ENTITY,
  DELETE_ENTITY,
  RESET_CART_STATE,
} from "@/store/mutation-types";
import {
  capitalize,
  normalizeAdditionalItems,
  createUUIDv4,
} from "@/common/helpers";

const module = capitalize("cart");

const initialState = () => ({
  pizzaItems: [],
  additionalItems: [],
});

export default {
  namespaced: true,
  state: initialState(),
  getters: {
    totalPrice({ pizzaItems, additionalItems }) {
      const pizzaPrices = pizzaItems.map((item) => item.price * item.quantity);
      const additionalItemsPrices = additionalItems.map(
        (item) => item.price * item.quantity
      );
      const allPrices = pizzaPrices.concat(additionalItemsPrices);
      return allPrices.length ? allPrices.reduce((a, b) => a + b, 0) : 0;
    },
  },
  mutations: {
    [RESET_CART_STATE](state) {
      Object.assign(state, initialState());
    },
  },
  actions: {
    resetCartState({ commit }) {
      console.log("im resetting cart state");
      commit(RESET_CART_STATE);
    },
    async fetchAdditionalItems({ commit }) {
      const data = await this.$api.misc.query();
      const items = data.map((item) => normalizeAdditionalItems(item));
      // пока пусть тут остается, но надо тоже в api вынести вообще
      // тут бы как-то переписать, чтоб не заводить 2 переменные
      // но когда просто изменяю data в итоге нормалайз не произойдет
      // видимо потому что const нельзя изменять
      // если сделать let data - тоже не поможет
      // кажется тут надо что-то типа .then обработка промисов, но тоже пока некраиво все выглядело и не работало
      // подумай

      commit(
        SET_ENTITY,
        {
          module,
          entity: "additionalItems",
          value: items,
        },
        { root: true }
      );
    },
    addItem({ state, commit }, pizza) {
      console.log("pizza when added in store", pizza);
      //const pizzaId = rootState.Builder.pizzaId;
      const newPizza = {
        //...rootGetters["Builder/currentPizza"],
        // НАЧНИ ОТСЮДА
        // здесь нужно все переделать, тк когда переходим из истории заказов и добавляем выбранные пиццы в корзину
        // там есть только doughId итд, а не просто dough
        // соответственно в pizzaItems будут лежать айдишники, а не полные объекты
        // pizzaItems в этом контексте используется только в списке товаров в корзине и там как раз я использую pizza.dough
        // вместо pizza.doughId - а мне как раз надо было переписать на использование айдишников, чтоб был единый компонент
        // pizzaItem с одинаковыми методами!
        // доделай эту часть, с повторением заказа, доделай роутинг (закрыть страницы от неавторизованных)
        /*dough: pizza.dough,
        sauce: pizza.sauce,
        size: pizza.size,
        ingredients: pizza.ingredients,
        name: pizza.name,
        quantity: pizza.quantity,
        price: rootGetters["Builder/pizzaPrice"],
         */
        ...pizza,
        id: pizza.id ?? createUUIDv4(),
        // c price придется переписать и вычислять в корзине?
        // тк если из истории заказов берем, то там не current pizza price уже

        // по api цену и id пиццы отправлять не надо
        // id нужен мне только чтоб работать с пиццами в корзине - изменять/удалять
        // в инфе о заказе у пиццы потом будет id, но уже какой-то другой

        // можно делать как в примере в api
        // Форматирование данных перед отправкой на сервер (убираем лишнее)
        //  _createRequest(task) {
        //  const { ticks, comments, status, timeStatus, user, ...request } = task;
        //  return request;
      };
      console.log("current pizza items in store", state.pizzaItems);
      // пока закомменчу - не будет нормально работать Изменить тогда, позже разобраться
      const mutationName =
        pizza.orderId === undefined && pizza.id !== null
          ? UPDATE_ENTITY
          : ADD_ENTITY;
      // работает идеально, когда добавляем через Повторить orderId есть
      // но когда после Изменить нажмем Готовить его уже не будет
      // так как там this.getCurrentPizza не включит orderId
      // и как раз вызовет Update

      // видимо надо смотреть что если прям отдельно передали id то редактируем
      // либо можно не добавлять id пиццам в корзине (убрать createUUIDv4) и смотреть если id нет то редактируем
      // но как мы тогда будем искать для UPDATE_ENTITY ведь там как раз нужен id
      // и как будем без id удалять пиццы из корзины?
      // нет, убрать id не пойдет
      // можно смотреть на orderId - у пицц в корзине его нет !
      // старый вариант - неправильно, так как когда повторяем заказ то в сторе ничего нет,
      // а id у пиццы есть и я пытаюсь обновить то, чего нет

      commit(
        mutationName,
        {
          module,
          entity: "pizzaItems",
          value: newPizza,
        },
        { root: true }
      );
    },
    changeItemQuantity({ commit }, item) {
      commit(
        UPDATE_ENTITY,
        {
          module,
          entity: "pizzaItems",
          value: item,
        },
        { root: true }
      );
    },
    changeAdditionalItemQuantity({ commit }, item) {
      commit(
        UPDATE_ENTITY,
        {
          module,
          entity: "additionalItems",
          value: item,
        },
        { root: true }
      );
    },
    deleteItem({ commit }, id) {
      commit(
        DELETE_ENTITY,
        {
          module,
          entity: "pizzaItems",
          id,
        },
        { root: true }
      );
    },
  },
};

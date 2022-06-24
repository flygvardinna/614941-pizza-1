<template>
  <div>
    <div class="order__wrapper">
      <div class="order__number">
        <b>Заказ #{{ order.id }}</b>
      </div>

      <div class="order__sum">
        <span>Сумма заказа: {{ getOrderPrice(order) }} ₽</span>
      </div>

      <div class="order__button">
        <button
          type="button"
          class="button button--border"
          @click="deleteOrder(order.id)"
        >
          Удалить
        </button>
      </div>
      <div class="order__button">
        <button type="button" class="button" @click="repeatOrder(order)">
          Повторить
        </button>
      </div>
    </div>

    <ul class="order__list">
      <li
        v-for="pizza in order.orderPizzas"
        :key="pizza.id"
        class="order__item"
      >
        <PizzaItem :pizza="pizza" />

        <p class="order__price">{{ displayPizzaPrice(pizza) }} ₽</p>
      </li>
    </ul>

    <ul class="order__additional">
      <li v-for="misc in order.orderMisc" :key="misc.id">
        <img
          :src="getMiscItemById(misc.miscId).image"
          width="20"
          height="30"
          :alt="getMiscItemById(misc.miscId).name"
        />
        <p>
          <span>{{ getMiscItemById(misc.miscId).name }}</span>
          <b>{{ misc.quantity }}х{{ getMiscItemById(misc.miscId).price }} ₽</b>
        </p>
      </li>
    </ul>

    <p class="order__address">Адрес доставки: {{ getAddressName(order) }}</p>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import PizzaItem from "@/common/components/PizzaItem";
import { getPizzaPartById } from "@/common/helpers";

export default {
  name: "OrdersItem",
  components: { PizzaItem },
  props: {
    order: {
      type: Object,
      required: true,
    },
  },
  computed: {
    ...mapState("Builder", ["dough", "sauces", "sizes", "ingredients"]),
    ...mapState("Cart", ["additionalItems"]),
  },
  methods: {
    ...mapActions("Cart", [
      "addItem",
      "changeAdditionalItemQuantity",
      "resetCartState",
    ]),
    ...mapActions("Orders", ["deleteOrder"]),
    displayPizzaPrice(pizza) {
      const price = this.getPizzaPrice(pizza);
      return pizza.quantity > 1 ? `${pizza.quantity}х${price}` : price;
    },
    getPizzaPrice({ doughId, sizeId, sauceId, ingredients }) {
      // сейчас по 2 раза массивы перебираю, отдельно чтоб вытащить имя и цену
      // или все-таки нормализировать и добавлять это все к свойствам пиццы
      // или будет 2 раза?
      // и бесяче, что как будто дублируем расчет из блока builder но объединить в одмн метод нельзя
      // либо там тоже сохранять только id и этим универсальным методом потом считать
      // хотя это неудобно
      const doughPrice = getPizzaPartById(this.dough, doughId).price;
      const saucePrice = getPizzaPartById(this.sauces, sauceId).price;
      const ingredientsPrices = ingredients.map(
        (ingredient) =>
          getPizzaPartById(this.ingredients, ingredient.ingredientId).price *
          ingredient.quantity
      );
      const ingredientsSum = ingredientsPrices.reduce((a, b) => a + b, 0);
      const multiplier = getPizzaPartById(this.sizes, sizeId).multiplier;

      return (doughPrice + saucePrice + ingredientsSum) * multiplier;
    },
    getAddressName({ orderAddress }) {
      return orderAddress ? orderAddress.name : "Самовывоз";
    },
    getOrderPrice(order) {
      const pizzasSum = order.orderPizzas
        .map((pizza) => {
          return this.getPizzaPrice(pizza) * pizza.quantity;
        })
        .reduce((a, b) => a + b, 0);
      // даже с async/await возвращает 0[object Promise][object Promise]0 ₽

      const miscSum = order.orderMisc
        .map((misc) => {
          return this.getMiscItemById(misc.miscId).price * misc.quantity;
        })
        .reduce((a, b) => a + b, 0);

      return pizzasSum + miscSum;
    },
    getMiscItemById(miscId) {
      return this.additionalItems.find((item) => item.id === miscId);
    },
    repeatOrder(order) {
      // при нажатии на кнопку «Повторить» — все данные заказа добавляются в корзину, происходит переход на страницу корзины
      // непонятно, если корзина была непустая, очищать ее или добавлять к текущим товарам товары заказа
      // логичнее так, но спроси наставника
      // ну просто добавь resetCartState тогда
      // сейчас если корзина непустая просто добавляет туда новые товары и меняет миск
      // адрес пока не выставляет

      // должен ли и адрес подставляться или только пицца и миск?
      console.log("going to cart", order);
      //this.resetCartState();
      order.orderPizzas.forEach((pizza) => {
        this.addItem({
          ...pizza,
          price: this.getPizzaPrice(pizza),
        });
      });
      // нужна ли проверка что order.orderMisc непустое? если ничего не добавили, приходит ли там с бека что-то?
      // да, сейчас всегда приходит что quantity = 0
      // НАЧНИ ТУТ
      order.orderMisc.forEach((misc) => {
        const item = this.additionalItems.find(
          (item) => item.id === misc.miscId
        );
        this.changeAdditionalItemQuantity({ ...item, quantity: misc.quantity });
      });
      // misc тоже надо подставлять - там не совпадает формат данных
      // только id и quantity а исходно есть еще name, image, price
      // но можно тогда передавать id и увеличивать quantity для штуки с таким id
      // тогда копировать item через find можно уже в самом action а передавать только id и новое количество
      // но пусть уже так
      this.$router.push({
        name: "Cart",
        params: {
          addressId: order.orderAddress ? order.orderAddress.id : null,
        },
      });
      // думаю, и адрес тоже надо подставлять?
    },
  },
};
</script>

<style lang="scss" scoped></style>

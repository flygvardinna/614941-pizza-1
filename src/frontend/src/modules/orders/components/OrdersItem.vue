<template>
  <div>
    <div class="order__wrapper">
      <div class="order__number">
        <b>Заказ #{{ order.id }}</b>
      </div>

      <div class="order__sum">
        <span>Сумма заказа: {{ orderPrice }} ₽</span>
      </div>

      <div class="order__button">
        <button
          type="button"
          class="button button--border"
          data-test="delete-btn"
          @click="deleteOrder(order.id)"
        >
          Удалить
        </button>
      </div>
      <div class="order__button">
        <button
          type="button"
          class="button"
          data-test="repeat-btn"
          @click="repeatOrder"
        >
          Повторить
        </button>
      </div>
    </div>

    <ul class="order__list">
      <li
        v-for="pizza in pizzas"
        :key="pizza.id"
        class="order__item"
      >
        <PizzaItem :pizza="pizza" />

        <p class="order__price">
          {{ displayPizzaPrice(pizza) }} ₽
        </p>
      </li>
    </ul>

    <ul class="order__additional">
      <OrdersAdditionalItem
        v-for="item in misc"
        :key="item.id"
        :item="item"
      />
    </ul>

    <p class="order__address">
      Адрес доставки: {{ address }}
    </p>
  </div>
</template>

<script>
import { mapActions, mapState, mapGetters } from "vuex";
import PizzaItem from "@/common/components/PizzaItem";
import OrdersAdditionalItem from "./OrdersAdditionalItem";
import { getItemById, getOrderPrice } from "@/common/helpers";

export default {
  name: "OrdersItem",
  components: { PizzaItem, OrdersAdditionalItem },

  props: {
    order: {
      type: Object,
      required: true,
    },
  },

  computed: {
    ...mapState("Builder", ["dough", "sauces", "sizes", "ingredients"]),
    ...mapState("Cart", ["additionalItems"]),
    ...mapGetters("Builder", ["isPizzaDataLoading"]),

    address() {
      return this.order.orderAddress
        ? this.order.orderAddress.name
        : "Самовывоз";
    },

    pizzas() {
      if (this.isPizzaDataLoading) {
        return [];
      }

      return this.order.orderPizzas.map((pizza) => {
        return { ...pizza, price: this.getPizzaPrice(pizza) };
      });
    },

    misc() {
      return this.order.orderMisc.map((misc) => {
        return {
          ...getItemById(this.additionalItems, misc.miscId),
          quantity: misc.quantity,
        };
      });
    },

    orderPrice() {
      return getOrderPrice(this.pizzas, this.misc);
    },
  },

  methods: {
    ...mapActions("Cart", ["addItem", "changeAdditionalItemQuantity"]),
    ...mapActions("Orders", ["deleteOrder"]),

    displayPizzaPrice(pizza) {
      return pizza.quantity > 1
        ? `${pizza.quantity}х${pizza.price}`
        : pizza.price;
    },

    getPizzaPrice(pizza) {
      const doughPrice = getItemById(this.dough, pizza.doughId).price;
      const saucePrice = getItemById(this.sauces, pizza.sauceId).price;
      const multiplier = getItemById(this.sizes, pizza.sizeId).multiplier;
      const ingredientsSum = pizza.ingredients
        .map(
          (ingredient) =>
            getItemById(this.ingredients, ingredient.ingredientId).price *
            ingredient.quantity
        )
        .reduce((a, b) => a + b, 0);

      return (doughPrice + saucePrice + ingredientsSum) * multiplier;
    },

    repeatOrder() {
      this.pizzas.forEach((pizza) => {
        this.addItem({ ...pizza, id: null });
      });

      this.misc.forEach((misc) => {
        this.changeAdditionalItemQuantity(misc);
      });

      this.$router.push({
        name: "Cart",
        params: {
          addressId: this.order.orderAddress
            ? this.order.orderAddress.id
            : null,
        },
      });
    },
  },
};
</script>

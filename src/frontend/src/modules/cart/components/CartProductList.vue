<template>
  <ul class="cart-list sheet">
    <li v-for="pizza in pizzaItems" :key="pizza.id" class="cart-list__item">
      <div class="product cart-list__product">
        <img
          src="@/assets/img/product.svg"
          class="product__img"
          width="56"
          height="56"
          :alt="`${pizza.name}`"
        />
        <div class="product__text">
          <h2>{{ pizza.name }}</h2>
          <ul>
            <li>
              {{
                getSizeAndDoughDescription(pizza.size.name, pizza.dough.name)
              }}
            </li>
            <li>Соус: {{ pizza.sauce.name.toLowerCase() }}</li>
            <li>Начинка: {{ getIngredientsList(pizza.ingredients) }}</li>
          </ul>
        </div>
      </div>

      <ItemCounter
        class="cart-list__counter"
        :value="pizza.value"
        :isOrangeBtn="true"
        :minValue="minPizzaValue"
        :maxValue="maxPizzaValue"
        @changeItemValue="
          changePizzaQuantity({
            value: $event,
            pizza,
          })
        "
      />

      <div class="cart-list__price">
        <b>{{ calculatePizzaPrice(pizza) }} ₽</b>
      </div>

      <div class="cart-list__button">
        <button
          type="button"
          class="cart-list__edit"
          @click="goToPizzaBuilder(pizza)"
        >
          Изменить
        </button>
      </div>
    </li>
  </ul>
</template>

<script>
import { MIN_CART_ITEM_VALUE, MAX_CART_ITEM_VALUE } from "@/common/constants";
import { mapActions, mapState } from "vuex";
import ItemCounter from "@/common/components/ItemCounter";

export default {
  name: "CartProductList",
  components: { ItemCounter },
  computed: {
    ...mapState("Cart", ["pizzaItems"]),
    minPizzaValue() {
      return MIN_CART_ITEM_VALUE;
    },
    maxPizzaValue() {
      return MAX_CART_ITEM_VALUE;
    },
  },
  methods: {
    ...mapActions("Cart", ["changeItemValue", "deleteItem"]),
    ...mapActions("Builder", [
      "changeSelectedItem",
      "changeIngredientValue",
      "setPizzaName",
      "setPizzaId",
    ]),
    getSizeAndDoughDescription(size, dough) {
      const doughName = dough === "Толстое" ? "толстом" : "тонком";
      return `${size}, на ${doughName} тесте`;
    },
    getIngredientsList(ingredients) {
      return ingredients.map((item) => item.name.toLowerCase()).join(", ");
    },
    calculatePizzaPrice(pizza) {
      return pizza.price * pizza.value;
    },
    changePizzaQuantity({ pizza, value }) {
      if (value === 0) {
        this.deleteItem(pizza.id);
      } else {
        this.changeItemValue({ ...pizza, value });
      }
    },
    goToPizzaBuilder(pizza) {
      this.setPizzaName(pizza.name);
      this.setPizzaId(pizza.id);

      this.changeSelectedItem({
        newValue: pizza.dough.value,
        itemName: "dough",
      });
      this.changeSelectedItem({
        newValue: pizza.size.value,
        itemName: "sizes",
      });
      this.changeSelectedItem({
        newValue: pizza.sauce.value,
        itemName: "sauces",
      });

      pizza.ingredients.forEach((ingredient) => {
        this.changeIngredientValue(ingredient);
      });

      this.$router.push({ name: "IndexHome" });
    },
  },
};
</script>

<style lang="scss" scoped></style>

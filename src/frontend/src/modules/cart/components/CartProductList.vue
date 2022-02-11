<template>
  <ul class="cart-list sheet">
    <li v-for="pizza in cartItems" :key="pizza.name" class="cart-list__item">
      <div class="product cart-list__product">
        <img
          src="@/assets/img/product.svg"
          class="product__img"
          width="56"
          height="56"
          alt="Капричоза"
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
        @changeItemValue="
          changeIngredientValue({
            value: $event,
            name: ingredient.name,
          })
        "
      />

      <div class="cart-list__price">
        <b>{{ pizza.price }} ₽</b>
      </div>

      <div class="cart-list__button">
        <button type="button" class="cart-list__edit">Изменить</button>
      </div>
    </li>
  </ul>
</template>

<script>
import { mapState } from "vuex";
import ItemCounter from "@/common/components/ItemCounter";

export default {
  name: "CartProductList",
  components: { ItemCounter },
  computed: {
    ...mapState("Cart", ["cartItems"]),
  },
  methods: {
    getSizeAndDoughDescription(size, dough) {
      const doughName = dough === "Толстое" ? "толстом" : "тонком";
      return `${size}, на ${doughName} тесте`;
    },
    getIngredientsList(ingredients) {
      return ingredients.map((item) => item.name.toLowerCase()).join(", ");
    },
  },
};
</script>

<style lang="scss" scoped></style>

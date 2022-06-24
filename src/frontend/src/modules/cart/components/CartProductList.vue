<template>
  <ul class="cart-list sheet">
    <li v-for="pizza in pizzaItems" :key="pizza.id" class="cart-list__item">
      <PizzaItem class="cart-list__product" :pizza="pizza" />

      <ItemCounter
        class="cart-list__counter"
        :value="pizza.quantity"
        :isOrangeBtn="true"
        :minValue="minPizzaValue"
        :maxValue="maxPizzaValue"
        @changeItemValue="
          changePizzaQuantity({
            quantity: $event,
            pizza,
          })
        "
      />

      <div class="cart-list__price">
        <b>{{ getPizzaPrice(pizza) }} ₽</b>
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
// в alt картинки заменить на :alt="pizza.name"
import { MIN_CART_ITEM_VALUE, MAX_CART_ITEM_VALUE } from "@/common/constants";
import { mapActions, mapState } from "vuex";
import ItemCounter from "@/common/components/ItemCounter";
import PizzaItem from "@/common/components/PizzaItem";

export default {
  name: "CartProductList",
  components: { ItemCounter, PizzaItem },
  computed: {
    ...mapState("Builder", ["dough", "sauces", "sizes", "ingredients"]),
    ...mapState("Cart", ["pizzaItems"]),
    minPizzaValue() {
      return MIN_CART_ITEM_VALUE;
    },
    maxPizzaValue() {
      return MAX_CART_ITEM_VALUE;
    },
  },
  /*mounted() {
    console.log("pizza items", this.pizzaItems);
  },*/
  methods: {
    ...mapActions("Cart", ["changeItemQuantity", "deleteItem"]),
    ...mapActions("Builder", [
      "changeSelectedItem",
      "changeIngredientQuantity",
      "setPizzaName",
      "setPizzaQuantity",
      "setPizzaId",
    ]),
    /*getSizeAndDoughDescription(size, dough) {
      const doughName = dough === "Толстое" ? "толстом" : "тонком";
      return `${size}, на ${doughName} тесте`;
    },
    getIngredientsList(ingredients) {
      return ingredients.map((item) => item.name.toLowerCase()).join(", ");
    },*/
    getPizzaPrice(pizza) {
      return pizza.price * pizza.quantity;
    },
    changePizzaQuantity({ pizza, quantity }) {
      if (quantity === 0) {
        this.deleteItem(pizza.id);
      } else {
        this.changeItemQuantity({ ...pizza, quantity });
      }
    },
    goToPizzaBuilder(pizza) {
      this.setPizzaName(pizza.name);
      this.setPizzaId(pizza.id);
      this.setPizzaQuantity(pizza.quantity);

      this.changeSelectedItem({
        // тут подумай, тут никак нельзя проще сделать?
        // newValue: pizza.dough.value,
        newValue: this.getPizzaPartById(this.dough, pizza.doughId).value,
        itemName: "dough",
      });
      this.changeSelectedItem({
        //newValue: pizza.size.value,
        newValue: this.getPizzaPartById(this.sizes, pizza.sizeId).value,
        itemName: "sizes",
      });
      this.changeSelectedItem({
        //newValue: pizza.sauce.value,
        newValue: this.getPizzaPartById(this.sauces, pizza.sauceId).value,
        itemName: "sauces",
      });

      pizza.ingredients.forEach((ingredient) => {
        const ingredientCopy = this.ingredients
          .slice()
          .find((item) => item.id === ingredient.ingredientId);
        this.changeIngredientQuantity({
          ...ingredientCopy,
          quantity: ingredient.quantity,
        });
      });

      this.$router.push({ name: "IndexHome" });
    },
    // тоже заменить на хелпер
    getPizzaPartById(list, id) {
      return list.find((item) => item.id === id);
    },
  },
};
</script>

<style lang="scss" scoped></style>

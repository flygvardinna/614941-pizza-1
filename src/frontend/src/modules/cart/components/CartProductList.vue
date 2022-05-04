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
import { RESET_BUILDER_STATE } from "@/store/mutation-types";
import { mapActions, mapState, mapMutations } from "vuex";
import ItemCounter from "@/common/components/ItemCounter";
import { cloneDeep } from "lodash";

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
      "fetchPizzaParts",
      "changeSelectedItem",
      "changeIngredientValue",
      "setPizzaName",
      "setPizzaId",
    ]),
    ...mapMutations("Builder", {
      resetBuilderState: RESET_BUILDER_STATE,
    }),
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
        const data = cloneDeep(pizza);
        data.value = value;
        this.changeItemValue(data);
      }
    },
    goToPizzaBuilder(pizza) {
      // можно передавать в роут id
      // в билдере находить по id такую пиццу в корзине
      // брать из роута id и подставлять нужные параметры
      console.log(pizza);
      this.resetBuilderState();
      this.fetchPizzaParts();
      // тут все ок, тк по дефолту там все пустое
      // подумай как сделать чтоб по дефолту было не пустое, а selected
      // пока что пусть будет через вызов fetchPizzaParts
      // пока все работает идеально
      // НО ВОЗМОЖНО СТОИТ ЭМИТИТЬ ЭТО ВСЕ НА УРОВЕНЬ ВЫШЕ В CART.VUE
      // так как там все это тоже импортится

      this.setPizzaName(pizza.name);
      this.setPizzaId(pizza.id);
      // id пиццы для редактирования передавать в параметрах роута!
      // не надо хранить его в state
      // в vuework подобным образом сделано, когда кликаем по карточке
      // она открывается для редактирования и там тоже в роуте id!

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

      console.log("current pizza ingredients", pizza.ingredients);
      pizza.ingredients.forEach((ingredient) => {
        this.changeIngredientValue({
          value: ingredient.value,
          name: ingredient.name,
        });
      });
      // остальные ингредиенты должны при этом становиться по нулям
      // тогда в selectedIngredients мб надо сохранять все и нулевые тоже?
      // а уже в getIngredientsList находить те, где value > 0?
      // но если найти способ после добавления пиццы возвращать все в исходное состояние, то такой проблемы не будет?
      // здесь тоже можно все очищать до дефолтного сперва, чтоб не выставлять нули в остальные ингредиенты

      // ПОДСТАВЛЯТЬ ИНГРЕДИЕНТЫ
      // ДЛЯ ЭТОГО ПОМЕНЯТЬ МЕТОД ОБНОВИТЬ ИНГРЕДИЕНТЫ? ЧТОБ ОБНОВЛЯТЬ ПО ОДНОМУ
      // И ДЛЯ КАЖДОГО ВЫЗВАТЬ ЭТОТ ACTION
      // тут надо как-то сделать, чтоб не новая пицца добавлялась в корзину, а изменялась та, что уже есть - работать с id
      this.$router.push({ name: "IndexHome" });
      // this.$router.push({ name: "EditPizza", params: { id: pizza.id } });
      // вынести названия роутов в константы
    },
  },
};
</script>

<style lang="scss" scoped></style>

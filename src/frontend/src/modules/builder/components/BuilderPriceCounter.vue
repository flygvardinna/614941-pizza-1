<template>
  <div class="content__result">
    <p>Итого: {{ pizzaPrice }} ₽</p>
    <button
      type="button"
      class="button"
      :disabled="isBtnDisabled"
      @click="addToCart"
    >
      Готовьте!
    </button>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";

export default {
  name: "BuilderPriceCounter",
  /*data() {
    return {
      currentPizza: {},
    };
  },*/
  computed: {
    ...mapState("Builder", ["pizzaName", "ingredients"]),
    ...mapGetters("Builder", ["pizzaPrice"]),
    // "currentPizza" из геттеров вытащила - пока не используется
    isBtnDisabled() {
      const selectedIngredients = this.ingredients.filter(
        (item) => item.quantity > 0
      );
      // можно это вынести в геттеры builder store
      //return !this.currentPizza.ingredients.length || !this.pizzaName;
      return !selectedIngredients.length || !this.pizzaName;
    },
    /*pizzaPrice() {
      const pizza = this.getCurrentPizza();
      // здесь вместо пиццы промис!
      // можно разделить чтоб getCurrentPizza это одно,
      // а currentPizzaPrice можно как и раньше вычислять через геттер в сторе
      console.log("my pizza", pizza);
      const price = this.getPizzaPrice(pizza);
      console.log("pizza price", price);
      return price;
    },*/
    /*currentPizza() {
      return this.getCurrentPizza();
    },*/
  },
  /*beforeMount() {
    // ЭТО ПОКА НЕ НАДО - в isBtnDisabled решила пока вместо currentPizza вычислять ингредиенты снова
    // почему тут возвращается Promise вместо пиццы?
    // потому что actions всегда возвращают промис - сталкивалась в нгсе
    // должен быть просто метод стора? или геттер?
    // мб по этой же причине криво работало в pizzaView
    // но там вроде мне все это уже и не нужно
    this.currentPizza = this.getCurrentPizza();
  },*/
  methods: {
    ...mapActions("Builder", [
      "resetBuilderState",
      "fetchPizzaParts",
      "getCurrentPizza",
      //"getPizzaPrice",
    ]),
    ...mapActions("Cart", ["addItem"]),
    async addToCart() {
      const pizza = await this.getCurrentPizza();
      console.log("pizza that i will add", pizza);
      this.addItem(pizza);
      /*this.addItem({
        ...pizza,
        // в price оказывается промис, с await все нормально
        // но зачем каждый раз отдельно считать price если его можно вычислять внутри this.getCurrentPizza
        price: await this.getPizzaPrice(pizza),
      });*/
      console.log("reset state");
      this.resetBuilderState();
      this.fetchPizzaParts();
      void this.$router.push({ name: "IndexHome" });
      // у меня сейчас можно добавить пиццу с пробелом вместо названия - пофиксить!
    },
  },
};
</script>

<style lang="scss" scoped></style>

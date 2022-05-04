<template>
  <div class="content">
    <form action="#" method="post" class="layout-form">
      <main class="content cart">
        <div class="container">
          <div class="cart__title">
            <h1 class="title title--big">Корзина</h1>
          </div>

          <div v-if="isCartEmpty" class="sheet cart__empty">
            <p>В корзине нет ни одного товара</p>
          </div>

          <div v-else>
            <CartProductList />

            <CartAdditionalList />

            <CartOrderForm />
          </div>
        </div>
      </main>

      <CartFooter
        v-if="!isCartEmpty"
        @moreBtnClicked="goToBuilderPage"
        @submitBtnClicked="showDialog($event)"
      />
    </form>
    <div class="popup" v-if="isOrderPopupDisplayed">
      <a class="close" @click="finishOrder">
        <span class="visually-hidden">Закрыть попап</span>
      </a>
      <div class="popup__title">
        <h2 class="title">Спасибо за заказ</h2>
      </div>
      <p>Мы начали готовить Ваш заказ, скоро привезём его вам ;)</p>
      <div class="popup__button">
        <a class="button" @click="finishOrder">Отлично, я жду!</a>
      </div>
    </div>
  </div>
</template>

<script>
import { RESET_BUILDER_STATE, RESET_CART_STATE } from "@/store/mutation-types";
import { mapActions, mapMutations, mapState } from "vuex";
import CartProductList from "@/modules/cart/components/CartProductList";
import CartAdditionalList from "@/modules/cart/components/CartAdditionalList";
import CartOrderForm from "@/modules/cart/components/CartOrderForm";
import CartFooter from "@/modules/cart/components/CartFooter";

export default {
  name: "Cart",
  components: {
    CartProductList,
    CartAdditionalList,
    CartOrderForm,
    CartFooter,
  },
  data: () => ({
    isOrderPopupDisplayed: false,
  }),
  computed: {
    ...mapState("Cart", ["pizzaItems", "additionalItems"]),
    ...mapState("Auth", ["user"]),
    isCartEmpty() {
      return this.pizzaItems.length === 0;
    },
  },
  mounted() {
    // для очистки стора
    // localStorage.clear();
    //this.fetchAdditionalItems();
    //this.setCartItems();
    if (this.additionalItems.length === 0 || this.pizzaItems.length === 0) {
      // проверять количество пицц надо для того, чтоб если пицц нет, то стор с additionalItems очищался
      // так как дополнительное можно заказать только вместе с пиццей
      this.fetchAdditionalItems();
    }
    console.log("cart items", this.pizzaItems);
  },
  // НАЧНИ ТУТ
  // fetchAdditionalItems надо делать не в index.js, а в корзине?
  // но смотри что спрашивали в чате. Чтоб не поломалось сохранение этих айтемов
  // если сходили в конструктор обратно и вернулись в корзину
  methods: {
    ...mapActions("Builder", ["fetchPizzaParts"]),
    ...mapActions("Cart", ["fetchAdditionalItems", "setCartItems"]),
    ...mapMutations("Builder", {
      resetBuilderState: RESET_BUILDER_STATE,
    }),
    ...mapMutations("Cart", {
      resetCartState: RESET_CART_STATE,
    }),
    goToBuilderPage() {
      this.$router.push({ name: "IndexHome" });
      this.resetBuilderState();
      this.fetchPizzaParts();
    },
    showDialog(event) {
      event.preventDefault();
      this.isOrderPopupDisplayed = true;
    },
    finishOrder() {
      this.isOrderPopupDisplayed = false;
      if (this.user) {
        this.$router.push({ name: "Orders" });
      } else {
        this.$router.push({ name: "IndexHome" });
        // сейчас здесь само очищается, но написано в ТЗ
        // Очистить состояния конструктора и корзины (Vuex)

        // аналог clickOutside нужен/не нужен?
      }
      this.resetBuilderState();
      this.resetCartState();
      this.fetchPizzaParts();
      this.fetchAdditionalItems();
      // последнее нужно для того, чтоб после сброса при переходе в корзину выводились доп товары
      // потом может переедет куда-то
      // сейчас это первый раз вызывается в index.js
      // возможно, должно вызываться при mounted в корзине
    },
  },
};
</script>

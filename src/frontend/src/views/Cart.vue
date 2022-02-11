<template>
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

    <CartFooter v-if="!isCartEmpty" />
  </form>
</template>

<script>
import { mapState } from "vuex";
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
  computed: {
    ...mapState("Builder", ["cartItems"]),
    isCartEmpty() {
      return this.cartItems.length === 0;
    },
  },
  mounted() {
    // для очистки стора
    //localStorage.clear();
    console.log("cart items", this.cartItems);
  },
};
</script>

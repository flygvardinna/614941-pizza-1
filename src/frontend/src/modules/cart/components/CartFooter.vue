<template>
  <section class="footer">
    <div class="footer__more">
      <router-link to="/" class="button button--border button--arrow">
        Хочу еще одну
      </router-link>
    </div>
    <p class="footer__text">
      Перейти к конструктору<br />чтоб собрать ещё одну пиццу
    </p>
    <div class="footer__price">
      <b>Итого: {{ totalPrice }} ₽</b>
    </div>

    <div class="footer__submit">
      <button type="submit" class="button">Оформить заказ</button>
    </div>
  </section>
</template>

<script>
import { mapGetters } from "vuex";
//import SelectorItem from "@/common/components/SelectorItem";

export default {
  name: "CartFooter",
  /*components: { SelectorItem },*/
  computed: {
    ...mapGetters("Cart", ["totalPrice"]),
  },
  /*methods: {
    ...mapActions("Builder", ["changeSelectedItem"]),
  },*/
};
</script>

<style lang="scss" scoped></style>

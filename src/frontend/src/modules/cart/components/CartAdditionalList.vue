<template>
  <div class="cart__additional">
    <ul class="additional-list">
      <li
        v-for="item in additionalItems"
        :key="item.id"
        class="additional-list__item sheet"
      >
        <p class="additional-list__description">
          <img width="39" height="60" :src="item.image" :alt="item.name" />
          <span>{{ item.name }}</span>
        </p>

        <div class="additional-list__wrapper">
          <AppItemCounter
            class="additional-list__counter"
            :value="item.quantity"
            :is-orange-btn="true"
            :min-value="minItemValue"
            :max-value="maxItemValue"
            @changeItemValue="
              changeItemQuantity({
                quantity: $event,
                item,
              })
            "
          />

          <div class="additional-list__price">
            <b>{{ calculateItemPrice(item) }} ₽</b>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { MIN_CART_ITEM_VALUE, MAX_CART_ITEM_VALUE } from "@/common/constants";
import { mapActions, mapState } from "vuex";
import AppItemCounter from "@/common/components/AppItemCounter";

export default {
  name: "CartAdditionalList",
  components: { AppItemCounter },

  computed: {
    ...mapState("Cart", ["additionalItems"]),

    minItemValue() {
      return MIN_CART_ITEM_VALUE;
    },

    maxItemValue() {
      return MAX_CART_ITEM_VALUE;
    },
  },

  methods: {
    ...mapActions("Cart", ["changeAdditionalItemQuantity"]),

    calculateItemPrice(item) {
      return item.quantity > 0 ? item.price * item.quantity : item.price;
    },

    changeItemQuantity({ item, quantity }) {
      this.changeAdditionalItemQuantity({ ...item, quantity });
    },
  },
};
</script>

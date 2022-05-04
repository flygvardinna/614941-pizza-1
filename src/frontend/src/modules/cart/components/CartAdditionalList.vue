<template>
  <div class="cart__additional">
    <ul class="additional-list">
      <li
        v-for="item in additionalItems"
        :key="item.id"
        class="additional-list__item sheet"
      >
        <p class="additional-list__description">
          <img
            width="39"
            height="60"
            :src="`${item.image}`"
            :alt="`${item.name}`"
          />
          <span>{{ item.name }}</span>
        </p>

        <div class="additional-list__wrapper">
          <ItemCounter
            class="additional-list__counter"
            :value="item.value"
            :isOrangeBtn="true"
            :minValue="minItemValue"
            :maxValue="maxItemValue"
            @changeItemValue="
              changeItemQuantity({
                value: $event,
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
import ItemCounter from "@/common/components/ItemCounter";
import { cloneDeep } from "lodash";

export default {
  name: "CartAdditionalList",
  components: { ItemCounter },
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
    ...mapActions("Cart", ["changeAdditionalItemValue"]),
    calculateItemPrice(item) {
      return item.value > 0 ? item.price * item.value : item.price;
    },
    changeItemQuantity({ item, value }) {
      const data = cloneDeep(item);
      data.value = value;
      this.changeAdditionalItemValue(data);
    },
  },
};
</script>

<style lang="scss" scoped></style>

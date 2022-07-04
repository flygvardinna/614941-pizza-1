<template>
  <li>
    <img :src="item.image" width="20" height="30" :alt="item.name" />
    <p>
      <span>{{ item.name }}</span>
      <b>{{ item.quantity }}х{{ item.price }} ₽</b>
    </p>
  </li>
</template>

<script>
export default {
  name: "OrdersAdditionalItem",

  props: {
    item: {
      type: Object,
      required: true,
    },
  },
};
</script>

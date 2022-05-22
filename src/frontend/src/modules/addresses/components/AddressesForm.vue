<template>
  <form class="address-form address-form--opened sheet">
    <div class="address-form__header">
      <b>Адрес №{{ addressId }}</b>
    </div>

    <div class="address-form__wrapper">
      <div class="address-form__input">
        <label class="input">
          <span>Название адреса*</span>
          <input
            v-model="address.name"
            type="text"
            name="addr-name"
            placeholder="Введите название адреса"
            required
          />
        </label>
      </div>
      <div class="address-form__input address-form__input--size--normal">
        <label class="input">
          <span>Улица*</span>
          <input
            v-model="address.street"
            type="text"
            name="addr-street"
            placeholder="Введите название улицы"
            required
          />
        </label>
      </div>
      <div class="address-form__input address-form__input--size--small">
        <label class="input">
          <span>Дом*</span>
          <input
            v-model="address.building"
            type="text"
            name="addr-house"
            placeholder="Введите номер дома"
            required
          />
        </label>
      </div>
      <div class="address-form__input address-form__input--size--small">
        <label class="input">
          <span>Квартира</span>
          <input
            v-model="address.flat"
            type="text"
            name="addr-apartment"
            placeholder="Введите № квартиры"
          />
        </label>
      </div>
      <div class="address-form__input">
        <label class="input">
          <span>Комментарий</span>
          <input
            v-model="address.comment"
            type="text"
            name="addr-comment"
            placeholder="Введите комментарий"
          />
        </label>
      </div>
    </div>

    <div class="address-form__buttons">
      <button
        v-if="!isNewAddress"
        type="button"
        class="button button--transparent"
        @click="deleteAddress(address.id)"
      >
        Удалить
      </button>
      <button type="submit" class="button" @click="saveAddress">
        Сохранить
      </button>
    </div>
  </form>
</template>

<script>
// для нового адреса надо ли выводить заголовок Адрес № если номера мы пока не знаем и не узнаем
// пока выводится "Адрес №" и пустота
// можно выводить там просто "Адрес", без номера?
import { mapActions } from "vuex";

export default {
  name: "AddressesForm",
  // не хватает v-model мб?
  props: {
    address: {
      type: Object,
      required: true,
    },
    nextId: {
      type: Number,
      default: 0,
    },
  },
  computed: {
    isNewAddress() {
      return this.address.id === null;
    },
    addressId() {
      return this.address.id ?? this.nextId;
    },
  },
  methods: {
    ...mapActions("Addresses", ["addAddress", "editAddress", "deleteAddress"]),
    saveAddress() {
      console.log("is new address", this.isNewAddress);
      if (this.isNewAddress) {
        this.addAddress(this.address);
      } else {
        this.editAddress(this.address);
      }
      //this.$emit("closeForm", this.address.id);
    },
  },
};
</script>

<style lang="scss" scoped></style>

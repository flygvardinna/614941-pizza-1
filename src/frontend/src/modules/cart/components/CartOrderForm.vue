<template>
  <div class="cart__form">
    <div class="cart-form">
      <label class="cart-form__select">
        <span class="cart-form__label">Получение заказа:</span>

        <select
          name="test"
          class="select"
          @change="changeAddress($event.target.value)"
        >
          <option value="pickup">Заберу сам</option>
          <option value="newAddress">Новый адрес</option>
          <option
            v-for="address in addresses"
            :key="address.id"
            :value="address.id"
          >
            {{ address.name }}
          </option>
        </select>
      </label>

      <label class="input input--big-label">
        <span>Контактный телефон:</span>
        <input
          type="text"
          name="tel"
          placeholder="+7 999-999-99-99"
          :value="userPhone"
          @change="setOrderAddress"
        />
      </label>

      <div v-if="isAddressFormDisplayed" class="cart-form__address">
        <span class="cart-form__label">{{ addressFormName }}:</span>

        <div class="cart-form__input">
          <label class="input">
            <span>Улица*</span>
            <input
              type="text"
              name="street"
              required
              :value="street"
              :readonly="isAddressReadonly"
              @change="setOrderAddress"
            />
          </label>
        </div>

        <div class="cart-form__input cart-form__input--small">
          <label class="input">
            <span>Дом*</span>
            <input
              type="text"
              name="building"
              required
              :value="building"
              :readonly="isAddressReadonly"
              @change="setOrderAddress"
            />
          </label>
        </div>

        <div class="cart-form__input cart-form__input--small">
          <label class="input">
            <span>Квартира</span>
            <input
              type="text"
              name="flat"
              :value="flat"
              :readonly="isAddressReadonly"
              @change="setOrderAddress"
            />
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";

export default {
  name: "CartOrderForm",
  data: () => ({
    deliveryOption: "pickup",
    id: null,
    phone: "",
    street: "",
    building: "",
    flat: "",
    comment: "",
    addressFormName: "Новый адрес",
  }),
  computed: {
    ...mapState("Auth", ["user"]),
    ...mapState("Addresses", ["addresses"]),
    isAddressFormDisplayed() {
      return this.deliveryOption !== "pickup";
    },
    isAddressReadonly() {
      return this.deliveryOption !== "newAddress";
    },
    userPhone() {
      return this.user ? this.user.phone : this.phone;
      // сделай валидацию поля с телефоном?
    },
  },
  async mounted() {
    if (this.user !== null) {
      await this.fetchAddresses();
      console.log("addresses from cart", this.addresses);
    }
  },
  methods: {
    ...mapActions("Addresses", ["fetchAddresses"]),
    changeAddress(value) {
      this.deliveryOption = value;

      if (value === "newAddress") {
        this.id = null;
        this.street = "";
        this.building = "";
        this.flat = "";
        this.comment = "";
        this.addressFormName = "Новый адрес";
      } else if (value !== "pickup") {
        const address = this.addresses.find((address) => address.id == +value);

        this.id = address.id;
        this.street = address.street;
        this.building = address.building;
        this.flat = address.flat;
        this.comment = address.comment;
        this.addressFormName = "Адрес";
      }

      this.setOrderAddress();
    },
    setOrderAddress() {
      this.$emit("setAddress", {
        phone: this.phone,
        address: {
          id: this.id,
          street: this.street,
          building: this.building,
          flat: this.flat,
          comment: this.comment,
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>

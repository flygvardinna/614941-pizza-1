<template>
  <form
    class="address-form address-form--opened sheet"
    @submit.prevent="saveAddress"
  >
    <div class="address-form__header">
      <b>{{ formTitle }}</b>
    </div>

    <div class="address-form__wrapper">
      <div class="address-form__input">
        <label class="input">
          <span>Название адреса*</span>
          <AppInput
            v-model="name"
            type="text"
            name="addr-name"
            placeholder="Введите название адреса"
            :error-text="validations.name.error"
          />
        </label>
      </div>
      <div class="address-form__input address-form__input--size--normal">
        <label class="input">
          <span>Улица*</span>
          <AppInput
            v-model="street"
            type="text"
            name="addr-street"
            placeholder="Введите название улицы"
            :error-text="validations.street.error"
          />
        </label>
      </div>
      <div class="address-form__input address-form__input--size--small">
        <label class="input">
          <span>Дом*</span>
          <AppInput
            v-model="building"
            type="text"
            name="addr-house"
            placeholder="Введите номер дома"
            :error-text="validations.building.error"
          />
        </label>
      </div>
      <div class="address-form__input address-form__input--size--small">
        <label class="input">
          <span>Квартира</span>
          <AppInput
            v-model="flat"
            type="text"
            name="addr-apartment"
            placeholder="Введите № квартиры"
          />
        </label>
      </div>
      <div class="address-form__input">
        <label class="input">
          <span>Комментарий</span>
          <AppInput
            v-model="comment"
            type="text"
            name="addr-comment"
            placeholder="Введите комментарий"
          />
        </label>
      </div>
    </div>

    <div class="address-form__buttons">
      <button
        v-if="isAddressEdited"
        type="button"
        class="button button--transparent"
        data-test="delete-button"
        @click="deleteAddress(address.id)"
      >
        Удалить
      </button>
      <button
        type="submit"
        class="button"
      >
        Сохранить
      </button>
    </div>
  </form>
</template>

<script>
import AppInput from "@/common/components/AppInput";
import { validator } from "@/common/mixins";
import { mapActions } from "vuex";

export default {
  name: "ProfileAddressForm",
  components: { AppInput },
  mixins: [validator],

  props: {
    address: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      name: "",
      street: "",
      building: "",
      flat: "",
      comment: "",
      validations: {
        name: {
          error: "",
          rules: ["required"],
        },
        street: {
          error: "",
          rules: ["required"],
        },
        building: {
          error: "",
          rules: ["required"],
        },
      },
    };
  },

  computed: {
    isAddressEdited() {
      return !!this.address.id;
    },

    formTitle() {
      return this.address.id ? `Адрес №${this.address.id}` : "Новый адрес";
    },
  },

  watch: {
    name() {
      this.$clearValidationError("name");
    },

    street() {
      this.$clearValidationError("street");
    },

    building() {
      this.$clearValidationError("building");
    },
  },

  mounted() {
    if (this.isAddressEdited) {
      this.name = this.address.name;
      this.street = this.address.street;
      this.building = this.address.building;
      this.flat = this.address.flat;
      this.comment = this.address.comment;
    }
  },

  methods: {
    ...mapActions("Addresses", ["addAddress", "editAddress", "deleteAddress"]),

    async saveAddress() {
      if (
        !this.$validateFields(
          {
            name: this.name,
            street: this.street,
            building: this.building,
          },
          this.validations
        )
      ) {
        return;
      }

      const address = {
        ...this.address,
        name: this.name,
        street: this.street,
        building: this.building,
        flat: this.flat,
        comment: this.comment,
      };

      if (this.isAddressEdited) {
        await this.editAddress(address);
      } else {
        await this.addAddress(address);
      }

      this.$emit("close");
    },
  },
};
</script>

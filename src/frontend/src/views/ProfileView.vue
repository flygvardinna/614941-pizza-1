<template>
  <div class="layout__content">
    <div class="layout__title">
      <h1 class="title title--big">Мои данные</h1>
    </div>

    <ProfileUserBlock />

    <div v-for="address in addresses" :key="address.id" class="layout__address">
      <ProfileAddressForm
        v-if="address.id === editableAddressId"
        :address="address"
        data-test="address-form"
        @close="closeEditForm"
      />

      <div v-else class="sheet address-form" data-test="address-card">
        <div class="address-form__header">
          <b>Адрес №{{ address.id }}. {{ address.name }}</b>
          <div class="address-form__edit">
            <button
              type="button"
              class="icon"
              data-test="edit-address-button"
              @click="openFormToEdit(address.id)"
            >
              <span class="visually-hidden">Изменить адрес</span>
            </button>
          </div>
        </div>
        <p>{{ getAddress(address) }}</p>
        <small>{{ address.comment }}</small>
      </div>
    </div>

    <div v-if="isNewAddressFormDisplayed" class="layout__address">
      <ProfileAddressForm
        :address="newAddressData"
        data-test="new-address-form"
        @close="closeNewAddressForm"
      />
    </div>

    <div class="layout__button">
      <button
        type="button"
        class="button button--border"
        data-test="add-address-button"
        @click="openNewAddressForm"
      >
        Добавить новый адрес
      </button>
    </div>
  </div>
</template>

<script>
import ProfileUserBlock from "@/modules/profile/components/ProfileUserBlock";
import ProfileAddressForm from "@/modules/profile/components/ProfileAddressForm";
import { mapActions, mapState } from "vuex";

export default {
  name: "ProfileView",
  components: {
    ProfileAddressForm,
    ProfileUserBlock,
  },

  data() {
    return {
      isNewAddressFormDisplayed: false,
      editableAddressId: null,
    };
  },

  computed: {
    ...mapState("Auth", ["user"]),
    ...mapState("Addresses", ["addresses"]),

    newAddressData() {
      return {
        id: null,
        name: "",
        street: "",
        building: "",
        flat: "",
        comment: "",
        userId: this.user.id,
      };
    },
  },

  async mounted() {
    await this.fetchAddresses();
  },

  methods: {
    ...mapActions("Addresses", ["fetchAddresses"]),

    getAddress(address) {
      return `${address.street}, ${address.building}${
        address.flat ? ", " + address.flat : ""
      }`;
    },

    openFormToEdit(id) {
      this.isNewAddressFormDisplayed = false;
      this.editableAddressId = id;
    },

    openNewAddressForm() {
      this.editableAddressId = null;
      this.isNewAddressFormDisplayed = true;
    },

    closeEditForm() {
      this.editableAddressId = null;
    },

    closeNewAddressForm() {
      this.isNewAddressFormDisplayed = false;
    },
  },
};
</script>

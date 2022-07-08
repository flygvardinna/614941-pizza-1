import { createLocalVue, mount } from "@vue/test-utils";
import ProfileAddressForm from "@/modules/profile/components/ProfileAddressForm";
import { generateMockStore } from "@/store/mocks";
import Vuex from "vuex";

const localVue = createLocalVue();
localVue.use(Vuex);

const newAddress = {
  id: null,
  name: "",
  street: "",
  building: "",
  flat: "",
  comment: "",
  userId: "1",
};

const existedAddress = {
  id: 1,
  name: "Домик",
  street: "Зеленая",
  building: "1",
  flat: "1",
  comment: "Не звоните",
  userId: "1",
};

describe("ProfileAddressForm", () => {
  let actions;
  let store;
  let wrapper;
  const createComponent = (options) => {
    wrapper = mount(ProfileAddressForm, options);
  };

  beforeEach(() => {
    actions = {
      Addresses: {
        addAddress: jest.fn(),
        editAddress: jest.fn(),
        deleteAddress: jest.fn(),
      },
    };

    store = generateMockStore(actions);
  });

  afterEach(() => {
    wrapper.destroy();
  });

  it("is rendered", () => {
    createComponent({
      localVue,
      store,
      propsData: { address: existedAddress },
    });
    expect(wrapper.exists()).toBeTruthy();
  });

  it("sets news address data values (empty strings) to inputs", async () => {
    createComponent({
      localVue,
      store,
      propsData: { address: newAddress },
    });

    expect(wrapper.find('input[name="addr-name"]').element.value).toBe(
      newAddress.name
    );
    expect(wrapper.find('input[name="addr-street"]').element.value).toBe(
      newAddress.street
    );
    expect(wrapper.find('input[name="addr-house"]').element.value).toBe(
      newAddress.building
    );
    expect(wrapper.find('input[name="addr-apartment"]').element.value).toBe(
      newAddress.flat
    );
    expect(wrapper.find('input[name="addr-comment"]').element.value).toBe(
      newAddress.comment
    );
  });

  it("sets existed address data values to inputs", async () => {
    createComponent({
      localVue,
      store,
      propsData: { address: existedAddress },
    });

    // lets child components rerender, because parent component's data is changed while it's mounted
    await wrapper.vm.$nextTick();

    expect(wrapper.find('input[name="addr-name"]').element.value).toBe(
      existedAddress.name
    );
    expect(wrapper.find('input[name="addr-street"]').element.value).toBe(
      existedAddress.street
    );
    expect(wrapper.find('input[name="addr-house"]').element.value).toBe(
      existedAddress.building
    );
    expect(wrapper.find('input[name="addr-apartment"]').element.value).toBe(
      existedAddress.flat
    );
    expect(wrapper.find('input[name="addr-comment"]').element.value).toBe(
      existedAddress.comment
    );
  });

  it("delete address button is displayed if address existed", () => {
    createComponent({
      localVue,
      store,
      propsData: { address: existedAddress },
    });

    const deleteBtn = wrapper.find('[data-test="delete-button"]');
    expect(deleteBtn.exists()).toBeTruthy();
  });

  it("delete address button isn't displayed if address is new", () => {
    createComponent({ localVue, store, propsData: { address: newAddress } });
    const deleteBtn = wrapper.find('[data-test="delete-button"]');
    expect(deleteBtn.exists()).toBeFalsy();
  });

  it("deletes address on delete button click", async () => {
    createComponent({
      localVue,
      store,
      propsData: { address: existedAddress },
    });

    await wrapper.vm.$nextTick();

    const deleteBtn = wrapper.find('[data-test="delete-button"]');
    await deleteBtn.trigger("click");
    expect(actions.Addresses.deleteAddress).toHaveBeenCalledWith(
      expect.any(Object), // The Vuex context
      existedAddress.id
    );
  });

  it("validation mixin has been called on form submit, invalid form isn't submitted", async () => {
    createComponent({ localVue, store, propsData: { address: newAddress } });
    const spyValidateFields = jest.spyOn(wrapper.vm, "$validateFields");
    await wrapper.find("form").trigger("submit");
    expect(spyValidateFields).toHaveBeenCalled();
    expect(actions.Addresses.addAddress).not.toHaveBeenCalled();
  });

  it("adds address on submit button click if address is new and form fields are valid", async () => {
    createComponent({ localVue, store, propsData: { address: newAddress } });
    const nameInput = wrapper.find('input[name="addr-name"]');
    const streetInput = wrapper.find('input[name="addr-street"]');
    const buildingInput = wrapper.find('input[name="addr-house"]');

    nameInput.element.value = "Работа";
    await nameInput.trigger("input");
    streetInput.element.value = "Пушкина";
    await streetInput.trigger("input");
    buildingInput.element.value = "2";
    await buildingInput.trigger("input");
    await wrapper.find("form").trigger("submit");

    expect(actions.Addresses.addAddress).toHaveBeenCalledWith(
      expect.any(Object), // The Vuex context
      {
        ...newAddress,
        name: "Работа",
        street: "Пушкина",
        building: "2",
      }
    );
  });

  it("edits address on submit button click if address existed and form fields are valid", async () => {
    createComponent({
      localVue,
      store,
      propsData: { address: existedAddress },
    });

    await wrapper.find("form").trigger("submit");
    expect(actions.Addresses.editAddress).toHaveBeenCalledWith(
      expect.any(Object), // The Vuex context
      existedAddress
    );
  });
});

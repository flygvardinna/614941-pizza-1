import { shallowMount, createLocalVue } from "@vue/test-utils";
import { generateMockStore, setAddresses, setUser } from "@/store/mocks";
import Vuex from "vuex";
import ProfileView from "@/views/ProfileView";

const localVue = createLocalVue();
localVue.use(Vuex);

describe("ProfileView", () => {
  let actions;
  let store;
  let wrapper;
  const createComponent = (options) => {
    wrapper = shallowMount(ProfileView, options);
  };

  beforeEach(() => {
    actions = {
      Addresses: {
        fetchAddresses: jest.fn(),
      },
    };

    store = generateMockStore(actions);
    setUser(store);
    setAddresses(store);
  });

  afterEach(() => {
    wrapper.destroy();
  });

  it("calls vuex action to fetch addresses when mounted", async () => {
    createComponent({ localVue, store });
    await wrapper.vm.$nextTick();

    expect(actions.Addresses.fetchAddresses).toHaveBeenCalled();
  });

  it("displays address card (not form) for each existing address", () => {
    createComponent({ localVue, store });
    expect(wrapper.find('[data-test="address-card"]').exists()).toBeTruthy();
    expect(wrapper.find('[data-test="address-form"]').exists()).toBeFalsy();
  });

  it("replaces address card to form when edit address button clicked", async () => {
    createComponent({ localVue, store });
    const editBtn = wrapper.find('[data-test="edit-address-button"]');
    await editBtn.trigger("click");
    expect(wrapper.find('[data-test="address-form"]').exists()).toBeTruthy();
    expect(wrapper.find('[data-test="address-card"]').exists()).toBeFalsy();
  });

  it("closes address form on close event", async () => {
    createComponent({ localVue, store });
    const editBtn = wrapper.find('[data-test="edit-address-button"]');
    await editBtn.trigger("click");
    const addressForm = wrapper.find('[data-test="address-form"]');
    addressForm.vm.$emit("close");
    await wrapper.vm.$nextTick();

    expect(addressForm.exists()).toBeFalsy();
  });

  it("displays news address form when add address button clicked", async () => {
    createComponent({ localVue, store });
    const addBtn = wrapper.find('[data-test="add-address-button"]');
    await addBtn.trigger("click");
    const newAddressForm = wrapper.find('[data-test="new-address-form"]');

    expect(newAddressForm.exists()).toBeTruthy();
  });

  it("closes new address form on close event", async () => {
    createComponent({ localVue, store });
    const addBtn = wrapper.find('[data-test="add-address-button"]');
    await addBtn.trigger("click");
    const newAddressForm = wrapper.find('[data-test="new-address-form"]');
    newAddressForm.vm.$emit("close");
    await wrapper.vm.$nextTick();

    expect(newAddressForm.exists()).toBeFalsy();
  });
});

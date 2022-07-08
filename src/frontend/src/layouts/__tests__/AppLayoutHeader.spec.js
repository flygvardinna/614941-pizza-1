import { createLocalVue, mount } from "@vue/test-utils";
import Vuex from "vuex";
import {
  generateMockStore,
  setUser,
  setPizzaItems,
  setAdditionalItems,
} from "@/store/mocks";
import AppLayoutHeader from "@/layouts/AppLayoutHeader";

const localVue = createLocalVue();
localVue.use(Vuex);

describe("AppLayoutHeader", () => {
  const mocks = {
    $router: {
      push: jest.fn(),
    },
  };

  const stubs = ["router-link"];

  let actions;
  let store;
  let wrapper;
  const createComponent = (options) => {
    wrapper = mount(AppLayoutHeader, options);
  };

  beforeEach(() => {
    actions = {
      Auth: {
        logout: jest.fn(),
      },
    };

    store = generateMockStore(actions);
    setPizzaItems(store);
    setAdditionalItems(store);
  });

  afterEach(() => {
    wrapper.destroy();
  });

  it("renders Cart page link that displays total price", async () => {
    createComponent({ localVue, store, mocks, stubs });
    const cartLink = wrapper.find('[data-test="cart-link"]');
    expect(cartLink.exists()).toBeTruthy();
    expect(cartLink.html()).toContain(`${store.getters["Cart/totalPrice"]} ₽`);
  });

  it("renders login link if user isn't authenticated", async () => {
    createComponent({ localVue, store, mocks, stubs });
    const loginLink = wrapper.find('[data-test="login-link"]');
    expect(loginLink.exists()).toBeTruthy();
  });

  it("renders logout link if user is authenticated", async () => {
    setUser(store);
    createComponent({ localVue, store, mocks, stubs });
    const logoutLink = wrapper.find('[data-test="logout-link"]');
    expect(logoutLink.exists()).toBeTruthy();
  });

  it("calls logout on logout link click and redirects to Login page", async () => {
    setUser(store);
    createComponent({ localVue, store, mocks, stubs });
    const logoutLink = wrapper.find('[data-test="logout-link"]');
    await logoutLink.trigger("click");
    expect(actions.Auth.logout).toHaveBeenCalled();
    expect(mocks.$router.push).toHaveBeenCalledWith("/login");
  });

  it("renders Profile page link with user avatar if user is authenticated", async () => {
    setUser(store);
    createComponent({ localVue, store, mocks, stubs });
    const profileLink = wrapper.find('[data-test="profile-link"]');
    expect(profileLink.exists()).toBeTruthy();
    expect(profileLink.find("img").exists()).toBeTruthy();
  });
});

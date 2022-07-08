import { createLocalVue, mount } from "@vue/test-utils";
import ProfileUserBlock from "@/modules/profile/components/ProfileUserBlock";
import { generateMockStore, setUser } from "@/store/mocks";
import Vuex from "vuex";

const localVue = createLocalVue();
localVue.use(Vuex);

describe("ProfileUserBlock", () => {
  let store;
  let wrapper;
  const createComponent = (options) => {
    wrapper = mount(ProfileUserBlock, options);
  };

  beforeEach(() => {
    store = generateMockStore();
    setUser(store);
  });

  afterEach(() => {
    wrapper.destroy();
  });

  it("is rendered", () => {
    createComponent({ localVue, store });
    expect(wrapper.exists()).toBeTruthy();
  });

  it("renders out user avatar", () => {
    createComponent({ localVue, store });
    const avatar = wrapper.find('[data-test="user-avatar"]');
    expect(avatar.exists()).toBeTruthy();
  });

  it("renders out user name", () => {
    createComponent({ localVue, store });
    expect(wrapper.html()).toContain("Вася Пупкин");
  });

  it("renders out user phone", () => {
    createComponent({ localVue, store });
    expect(wrapper.html()).toContain("+777 777 777");
  });
});

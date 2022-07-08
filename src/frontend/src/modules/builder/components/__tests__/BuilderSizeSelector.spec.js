import { mount, createLocalVue } from "@vue/test-utils";
import Vuex from "vuex";
import { generateMockStore, setSizes } from "@/store/mocks";
import BuilderSizeSelector from "@/modules/builder/components/BuilderSizeSelector";

const localVue = createLocalVue();
localVue.use(Vuex);

describe("BuilderSizeSelector", () => {
  let store;
  let wrapper;
  const createComponent = (options) => {
    wrapper = mount(BuilderSizeSelector, options);
  };

  beforeEach(() => {
    store = generateMockStore();
    setSizes(store);
  });

  afterEach(() => {
    wrapper.destroy();
  });

  it("renders size name for size item", async () => {
    createComponent({ localVue, store });
    expect(wrapper.html()).toContain("23 см");
  });

  it("changes selected size on on size selector click", async () => {
    createComponent({ localVue, store });
    const spyOnAction = jest.spyOn(wrapper.vm, "changeSelectedItem");
    const selector = wrapper.find('input[name="diameter"]');
    await selector.trigger("change");
    expect(spyOnAction).toHaveBeenCalledWith({
      id: 1,
      itemName: "sizes",
    });
  });
});

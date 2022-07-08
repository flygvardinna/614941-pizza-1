<template>
  <div class="content__ingredients">
    <div class="sheet">
      <h2 class="title title--small sheet__title">Выберите ингредиенты</h2>

      <div class="sheet__content ingredients">
        <div class="ingredients__sauce">
          <p>Основной соус:</p>

          <AppSelectorItem
            v-for="sauce in sauces"
            :key="sauce.id"
            :item="sauce"
            :input-name="'sauce'"
            class="radio ingredients__input"
            data-test="sauce-input"
            @changeSelectedItem="
              changeSelectedItem({
                id: sauce.id,
                itemName: 'sauces',
              })
            "
          >
            <span>{{ sauce.name }}</span>
          </AppSelectorItem>
        </div>

        <div class="ingredients__filling">
          <p>Начинка:</p>

          <ul class="ingredients__list">
            <li
              v-for="ingredient in ingredients"
              :key="ingredient.id"
              class="ingredients__item"
              data-test="ingredients-item"
            >
              <AppDrop data-test="app-drop" @drop="$emit('drop', ingredient)">
                <AppDrag
                  :transfer-data="ingredient"
                  :is-draggable="checkIsIngredientDraggable(ingredient)"
                >
                  <span class="filling" :class="`filling--${ingredient.value}`">
                    {{ ingredient.name }}
                  </span>
                </AppDrag>
              </AppDrop>
              <AppItemCounter
                class="ingredients__counter"
                :value="ingredient.quantity"
                :min-value="minIngredientValue"
                :max-value="maxIngredientValue"
                data-test="ingredients-counter"
                @changeItemValue="
                  changeIngredientQuantity({
                    ...ingredient,
                    quantity: $event,
                  })
                "
              />
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { MIN_INGREDIENT_VALUE, MAX_INGREDIENT_VALUE } from "@/common/constants";
import { mapState, mapActions } from "vuex";
import AppDrag from "@/common/components/AppDrag";
import AppDrop from "@/common/components/AppDrop";
import AppSelectorItem from "@/common/components/AppSelectorItem";
import AppItemCounter from "@/common/components/AppItemCounter";

export default {
  name: "BuilderIngredientsSelector",
  components: { AppDrag, AppDrop, AppSelectorItem, AppItemCounter },

  computed: {
    ...mapState("Builder", ["sauces", "ingredients"]),

    minIngredientValue() {
      return MIN_INGREDIENT_VALUE;
    },

    maxIngredientValue() {
      return MAX_INGREDIENT_VALUE;
    },
  },

  methods: {
    ...mapActions("Builder", [
      "changeSelectedItem",
      "changeIngredientQuantity",
    ]),

    checkIsIngredientDraggable(ingredient) {
      return ingredient.quantity < this.maxIngredientValue;
    },
  },
};
</script>

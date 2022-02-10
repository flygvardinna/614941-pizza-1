<template>
  <div class="content__ingredients">
    <div class="sheet">
      <h2 class="title title--small sheet__title">Выберите ингредиенты</h2>

      <div class="sheet__content ingredients">
        <div class="ingredients__sauce">
          <p>Основной соус:</p>

          <SelectorItem
            v-for="sauce in sauces"
            :item="sauce"
            :key="sauce.id"
            :isChecked="sauce.isChecked"
            :inputName="'sauce'"
            :className="'radio ingredients__input'"
            @changeSelectedItem="
              changeSelectedItem({
                newValue: $event.target.value,
                itemName: 'sauces',
              })
            "
          >
            <span>{{ sauce.name }}</span>
          </SelectorItem>
        </div>

        <div class="ingredients__filling">
          <p>Начинка:</p>

          <ul class="ingredients__list">
            <li
              v-for="ingredient in ingredients"
              :key="ingredient.id"
              class="ingredients__item"
            >
              <AppDrop @drop="$emit('drop', ingredient)">
                <AppDrag
                  :transfer-data="ingredient"
                  :isDraggable="checkIsIngredientDraggable(ingredient)"
                >
                  <span
                    class="filling"
                    :class="`filling--${ingredient.englishName}`"
                  >
                    {{ ingredient.name }}
                  </span>
                </AppDrag>
              </AppDrop>
              <ItemCounter
                :value="ingredient.value"
                @changeIngredientValue="
                  changeIngredientValue({
                    value: $event,
                    name: ingredient.name,
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
import { MAX_INGREDIENT_VALUE } from "@/common/constants";
import { mapState, mapActions } from "vuex";
import AppDrag from "@/common/components/AppDrag";
import AppDrop from "@/common/components/AppDrop";
import SelectorItem from "@/common/components/SelectorItem";
import ItemCounter from "@/common/components/ItemCounter";

export default {
  name: "BuilderIngredientsSelector",
  components: { AppDrag, AppDrop, SelectorItem, ItemCounter },
  computed: {
    ...mapState("Builder", ["sauces", "ingredients"]),
  },
  /*props: {
    sauces: {
      type: Array,
      required: true,
    },
    ingredients: {
      type: Array,
      required: true,
    },
  },*/
  methods: {
    ...mapActions("Builder", ["changeSelectedItem", "changeIngredientValue"]),
    checkIsIngredientDraggable(ingredient) {
      return ingredient.value < MAX_INGREDIENT_VALUE;
    },
  },
};
</script>

<style lang="scss" scoped></style>

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
            :itemName="'ingredients'"
            @changeSelectedItem="
              $emit('changeSelectedItem', {
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
              @click="$emit('click', ingredient.id)"
            >
              <AppDrop @drop="$emit('drop', ingredient)">
                <AppDrag :transfer-data="ingredient">
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
                  $emit('changeIngredientValue', {
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
import AppDrag from "@/common/components/AppDrag";
import AppDrop from "@/common/components/AppDrop";
import SelectorItem from "@/common/components/SelectorItem";
import ItemCounter from "@/common/components/ItemCounter";

export default {
  name: "BuilderIngredientsSelector",
  components: { AppDrag, AppDrop, SelectorItem, ItemCounter },
  props: {
    sauces: {
      type: Array,
      required: true,
    },
    ingredients: {
      type: Array,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped></style>

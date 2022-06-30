<template>
  <picture>
    <source type="image/webp" :srcset="imageSources.webpSrcset" />
    <img
      :src="src"
      :srcset="imageSources.srcset"
      :alt="alt"
      :width="width"
      :height="height"
    />
  </picture>
</template>

<script>
import { getImageSources } from "@/common/helpers";

export default {
  name: "AppPicture",

  props: {
    src: {
      type: String,
      required: true,
    },

    alt: {
      type: String,
      required: true,
    },

    width: {
      type: Number,
      required: true,
    },

    height: {
      type: Number,
      required: true,
    },
  },

  computed: {
    imageSources() {
      return getImageSources(this.src);
    },
  },
};
</script>

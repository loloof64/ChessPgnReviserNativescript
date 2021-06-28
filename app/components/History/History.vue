<template>
  <FlexBoxLayout flexDirection="column" :width="width" :height="height">
      <history-zone :items="items"/>
  </FlexBoxLayout>
</template>

<script>
import { reactive } from "@vue/composition-api";
import HistoryZone from "./HistoryZone.vue";
export default {
  props: {
    width: {
      type: Number,
      required: true,
    },
    height: {
      type: Number,
      required: true,
    },
  },
  setup() {
    const items = reactive([
      {
        text: "1.",
      },
      {
        text: "Nf3",
      },
      {
        text: "Nc6",
      },
      {
        text: "2.",
      },
      {
        text: "e4",
      },
      {
        text: "d5",
      },
      {
        text: "1.",
      },
      {
        text: "Nf3",
      },
      {
        text: "Nc6",
      },
      {
        text: "2.",
      },
      {
        text: "e4",
      },
      {
        text: "d5",
      },
      {
        text: "1.",
      },
      {
        text: "Nf3",
      },
      {
        text: "Nc6",
      },
      {
        text: "2.",
      },
      {
        text: "e4",
      },
      {
        text: "d5",
      },
      {
        text: "1.",
      },
      {
        text: "Nf3",
      },
      {
        text: "Nc6",
      },
      {
        text: "2.",
      },
      {
        text: "e4",
      },
      {
        text: "d5",
      },
      {
        text: "1.",
      },
      {
        text: "Nf3",
      },
      {
        text: "Nc6",
      },
      {
        text: "2.",
      },
      {
        text: "e4",
      },
      {
        text: "d5",
      },
      {
        text: "1.",
      },
      {
        text: "Nf3",
      },
      {
        text: "Nc6",
      },
      {
        text: "2.",
      },
      {
        text: "e4",
      },
      {
        text: "d5",
      },
      {
        text: "1.",
      },
      {
        text: "Nf3",
      },
      {
        text: "Nc6",
      },
      {
        text: "2.",
      },
      {
        text: "e4",
      },
      {
        text: "d5",
      },
      {
        text: "1.",
      },
      {
        text: "Nf3",
      },
      {
        text: "Nc6",
      },
      {
        text: "2.",
      },
      {
        text: "e4",
      },
      {
        text: "d5",
      },
      {
        text: "1.",
      },
      {
        text: "Nf3",
      },
      {
        text: "Nc6",
      },
      {
        text: "2.",
      },
      {
        text: "e4",
      },
      {
        text: "d5",
      },
      {
        text: "1.",
      },
      {
        text: "Nf3",
      },
      {
        text: "Nc6",
      },
      {
        text: "2.",
      },
      {
        text: "e4",
      },
      {
        text: "d5",
      },
      {
        text: "1.",
      },
      {
        text: "Nf3",
      },
      {
        text: "Nc6",
      },
      {
        text: "2.",
      },
      {
        text: "e4",
      },
      {
        text: "d5",
      },
      {
        text: "1.",
      },
      {
        text: "Nf3",
      },
      {
        text: "Nc6",
      },
      {
        text: "2.",
      },
      {
        text: "e4",
      },
      {
        text: "d5",
      },
      {
        text: "1.",
      },
      {
        text: "Nf3",
      },
      {
        text: "Nc6",
      },
      {
        text: "2.",
      },
      {
        text: "e4",
      },
      {
        text: "d5",
      },
      {
        text: "1.",
      },
      {
        text: "Nf3",
      },
      {
        text: "Nc6",
      },
      {
        text: "2.",
      },
      {
        text: "e4",
      },
      {
        text: "d5",
      },
      {
        text: "1.",
      },
      {
        text: "Nf3",
      },
      {
        text: "Nc6",
      },
      {
        text: "2.",
      },
      {
        text: "e4",
      },
      {
        text: "d5",
      },
      {
        text: "1.",
      },
      {
        text: "Nf3",
      },
      {
        text: "Nc6",
      },
      {
        text: "2.",
      },
      {
        text: "e4",
      },
      {
        text: "d5",
      },
      {
        text: "1.",
      },
      {
        text: "Nf3",
      },
      {
        text: "Nc6",
      },
      {
        text: "2.",
      },
      {
        text: "e4",
      },
      {
        text: "d5",
      },
      {
        text: "1.",
      },
      {
        text: "Nf3",
      },
      {
        text: "Nc6",
      },
      {
        text: "2.",
      },
      {
        text: "e4",
      },
      {
        text: "d5",
      },
      {
        text: "1.",
      },
      {
        text: "Nf3",
      },
      {
        text: "Nc6",
      },
      {
        text: "2.",
      },
      {
        text: "e4",
      },
      {
        text: "d5",
      },
      {
        text: "1.",
      },
      {
        text: "Nf3",
      },
      {
        text: "Nc6",
      },
      {
        text: "2.",
      },
      {
        text: "e4",
      },
      {
        text: "d5",
      },
    ]);

    return { items };
  },
  components: {
    HistoryZone,
  },
};
</script>

<style scoped>
FlexBoxLayout {
  background-color: burlywood;
}
</style>
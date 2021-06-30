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
      
    ]);

    function clear() {
        items.splice(0, items.length);
    }

    function addMove({moveFan, fenAfterMove}) {
        items.push({
            text: moveFan,
            fenAfterMove,
        });
    }

    return { items, addMove, clear };
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
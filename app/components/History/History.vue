<template>
  <FlexBoxLayout flexDirection="column" :width="width" :height="height">
    <history-zone
      :items="items"
      @position-request="handlePositionRequest"
      :selectedIndex="selectedIndex"
    />
  </FlexBoxLayout>
</template>

<script>
import { reactive, ref } from "@vue/composition-api";
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
  setup(props, context) {
    const items = reactive([]);

    const whiteMove = ref(true);
    const moveNumber = ref(1);

    const selectedIndex = ref(-1);

    function moveNumberString(num, whiteMove) {
      return `${num}.${whiteMove ? "" : ".."}`;
    }

    function newGame() {
      whiteMove.value = true;
      moveNumber.value = 1;
      selectedIndex.value = -1;
      items.splice(0, items.length);

      items.push({
        text: moveNumberString(moveNumber.value, whiteMove.value),
      });
    }

    function addMove({ moveFan, fenAfterMove, lastMoveArrow }) {
      items.push({
        text: moveFan,
        fenAfterMove,
        lastMoveArrow,
      });
      whiteMove.value = !whiteMove.value;

      if (whiteMove.value) {
        moveNumber.value += 1;
        items.push({
          text: moveNumberString(moveNumber.value, whiteMove.value),
        });
      }
    }

    function handlePositionRequest(item) {
      context.emit("position-request", item);
    }

    function handlePositionSelectedOnBoard(index) {
      selectedIndex.value = index;
    }

    return {
      items,
      addMove,
      newGame,
      handlePositionRequest,
      handlePositionSelectedOnBoard,
      selectedIndex,
    };
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
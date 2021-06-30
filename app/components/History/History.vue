<template>
  <FlexBoxLayout
    id="root"
    flexDirection="column"
    :width="width"
    :height="height"
    justifyContent="flex-start"
  >
    <history-buttons
      :width="width"
      :height="height * 0.2"
      @gotoFirst="gotoFirstRequest"
      @gotoPrevious="gotoPreviousRequest"
      @gotoNext="gotoNextRequest"
      @gotoLast="gotoLastRequest"
    />
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
import HistoryButtons from "./HistoryButtons.vue";

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

    function gotoFirstRequest() {}

    function gotoPreviousRequest() {
      const firstMoveIndex = 1;
      if (selectedIndex.value > firstMoveIndex) {
        selectedIndex.value -= 1;
        let currentItem = items[selectedIndex.value];
        while (!currentItem.fenAfterMove) {
          selectedIndex.value -= 1;
          currentItem = items[selectedIndex.value];
          if (selectedIndex.value < firstMoveIndex) {
            //TODO goto first
            return;
          }
        }
        context.emit("position-request", {
          ...currentItem,
          index: selectedIndex.value,
        });
      }
      else if (selectedIndex.value === -1) {
        //TODO goto first
      }
    }

    function gotoNextRequest() {}

    function gotoLastRequest() {}

    return {
      items,
      addMove,
      newGame,
      handlePositionRequest,
      handlePositionSelectedOnBoard,
      selectedIndex,
      gotoFirstRequest,
      gotoPreviousRequest,
      gotoNextRequest,
      gotoLastRequest,
    };
  },
  components: {
    HistoryZone,
    HistoryButtons,
  },
};
</script>

<style scoped>
#root {
  background-color: burlywood;
}
</style>
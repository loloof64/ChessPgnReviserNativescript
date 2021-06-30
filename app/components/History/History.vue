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
import { DEFAULT_FEN } from "../Chessboard/ChessBoardLogic";

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
    startFen: {
      type: String,
      default: DEFAULT_FEN,
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

    function gotoFirstRequest() {
      context.emit("position-request", {
        fenAfterMove: props.startFen,
      });
    }

    function gotoPreviousRequest() {
      const firstMoveIndex = 1;
      let tempIndex = selectedIndex.value || -1;
      if (tempIndex > firstMoveIndex) {
        tempIndex -= 1;
        let currentItem = items[tempIndex];
        while (!currentItem.fenAfterMove) {
          tempIndex -= 1;
          currentItem = items[tempIndex];
          if (tempIndex < firstMoveIndex) {
            context.emit("position-request", {
              fenAfterMove: props.startFen,
            });
            return;
          }
        }
        context.emit("position-request", {
          ...currentItem,
          index: tempIndex,
        });
      } else {
        context.emit("position-request", {
          fenAfterMove: props.startFen,
        });
      }
    }

    function gotoNextRequest() {
      // If we just have the first number, nothing to do.
      if (items.length < 2) return;
      let tempIndex = selectedIndex.value || -1;
      if (tempIndex < items.length - 1) {
        tempIndex += 1;
        let currentItem = items[tempIndex];
        while (!currentItem?.fenAfterMove) {
          tempIndex += 1;
          currentItem = items[tempIndex];
          if (tempIndex >= items.length - 1) break;
        }

        // We may need to get backward if the result node is not affordable.
        while (!currentItem?.fenAfterMove) {
          tempIndex -= 1;
          currentItem = items[tempIndex];
        }
        context.emit("position-request", {
          ...currentItem,
          index: tempIndex,
        });
      }
    }

    function gotoLastRequest() {
      // If we just have the first number, nothing to do.
      if (items.length < 2) return;
      let tempIndex = items.length - 1;
      let currentItem = items[tempIndex];
      // We may need to get backward if the result node is not affordable.
      while (!currentItem?.fenAfterMove) {
        tempIndex -= 1;
        currentItem = items[tempIndex];
      }
      context.emit("position-request", {
        ...currentItem,
        index: tempIndex,
      });
    }

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
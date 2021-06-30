<template>
  <Page>
    <ActionBar>
      <Label text="Home" />
      <ActionItem
        @tap="newGame"
        icon="res://start"
        android.position="actionBar"
      />
      <ActionItem
        @tap="reverseBoard"
        icon="res://reverse"
        android.position="actionBar"
      />

      <ActionItem
        @tap="stopGame"
        icon="res://stop"
        android.position="actionBar" 
      />
    </ActionBar>

    <FlexBoxLayout
      :flexDirection="mainZoneDirection"
      justifyContent="flex-start"
      alignItems="center"
    >
      <chess-board
        ref="board"
        :size="boardSize"
        :reversed="boardReversed"
        @checkmate="handleCheckmate"
        @stalemate="handleStalemate"
        @threeFoldRepetition="handleThreeFoldRepetition"
        @insufficientMaterial="handleInsufficientMaterial"
        @fityMovesDraw="handleFiftyMovesDraw"
        @move-done="handleMoveDone"
      />
      <history ref="history" :width="historyWidth" :height="historyHeight" @position-request="handlePositionRequest" />
    </FlexBoxLayout>
  </Page>
</template>

<script>
import { ref, onMounted } from "@vue/composition-api";
import ChessBoard from "./Chessboard/Chessboard.vue";
import History from "./History/History.vue";
import { Screen, Application } from "@nativescript/core";
export default {
  setup() {
    const board = ref();
    const history = ref();
    const boardSize = ref(0);
    const boardReversed = ref(false);
    const mainZoneDirection = ref("column");
    const historyWidth = ref(0);
    const historyHeight = ref(0);

    function updateBoardSize() {
      const screenWidthDip = Screen.mainScreen.widthDIPs;
      const screenHeightDip = Screen.mainScreen.heightDIPs;
      const sizeFactor = Application.orientation() === "portrait" ? 0.9 : 0.6;
      boardSize.value = Math.floor(
        Math.min(screenWidthDip, screenHeightDip) * sizeFactor
      );
    }

    function updateMainZoneDirection() {
      const newOrientation =
        Application.orientation() === "portrait" ? "column" : "row";
      mainZoneDirection.value = newOrientation;
    }

    function updateHistorySize() {
      const isPortrait = Application.orientation() === "portrait";
      const screenWidthDip = Screen.mainScreen.widthDIPs;
      const screenHeightDip = Screen.mainScreen.heightDIPs;

      const maxDimension =
        screenWidthDip > screenHeightDip ? screenWidthDip : screenHeightDip;

      historyWidth.value = isPortrait
        ? boardSize.value
        : (maxDimension - boardSize.value) * 0.9;
      historyHeight.value = isPortrait
        ? (maxDimension - boardSize.value) * 0.6
        : boardSize.value;
    }

    function newGame() {
      history.value.newGame();
      board.value.newGame();
    }

    function reverseBoard() {
      boardReversed.value = !boardReversed.value;
    }

    function handleCheckmate(whiteTurnBeforeMove) {
      const side = whiteTurnBeforeMove ? "White" : "Black";
      alert(`${side} has won by checkmate !`);
    }

    function handleStalemate() {
      alert("Draw by stalemate !");
    }

    function handleThreeFoldRepetition() {
      alert("Draw by three-fold repetition !");
    }

    function handleInsufficientMaterial() {
      alert("Draw by insufficient material !");
    }

    function handleFiftyMovesDraw() {
      alert("Draw by the 50 moves rule !");
    }

    function handleMoveDone({ moveFan, fenAfterMove, lastMoveArrow }) {
      history.value.addMove({ moveFan, fenAfterMove, lastMoveArrow });
    }

    function handlePositionRequest(item) {
      board.value.positionRequest(item);
    }

    function stopGame() {
      board.value.stopGame();
    }

    Application.on(Application.orientationChangedEvent, () => {
      updateMainZoneDirection();
      updateBoardSize();
      updateHistorySize();
    });

    onMounted(() => {
      updateMainZoneDirection();
      updateBoardSize();
      updateHistorySize();
    });

    return {
      boardSize,
      boardReversed,
      reverseBoard,
      newGame,
      board,
      history,
      handleCheckmate,
      handleStalemate,
      handleThreeFoldRepetition,
      handleInsufficientMaterial,
      handleFiftyMovesDraw,
      handleMoveDone,
      mainZoneDirection,
      historyWidth,
      historyHeight,
      handlePositionRequest,
      stopGame,
    };
  },
  components: {
    ChessBoard,
    History,
  },
};
</script>

<style scoped lang="scss">
@import "@nativescript/theme/scss/variables/blue";

// Custom styles

ActionBar {
  background-color: blue;
}

ActionBar > Label {
  color: white;
}
</style>

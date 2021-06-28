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
    </ActionBar>

    <GridLayout>
      <chess-board
        ref="board"
        :size="boardSize"
        :reversed="boardReversed"
        @checkmate="handleCheckmate"
        @stalemate="handleStalemate"
        @threeFoldRepetition="handleThreeFoldRepetition"
        @insufficientMaterial="handleInsufficientMaterial"
        @fityMovesDraw="handleFiftyMovesDraw"
      />
    </GridLayout>
  </Page>
</template>

<script>
import { ref, onMounted } from "@vue/composition-api";
import ChessBoard from "./Chessboard/Chessboard.vue";
import { Screen, Application } from "@nativescript/core";
export default {
  setup() {
    const board = ref();
    const boardSize = ref(0);
    const boardReversed = ref(false);

    function updateBoardSize() {
      const screenWidthDip = Screen.mainScreen.widthDIPs;
      const screenHeightDip = Screen.mainScreen.heightDIPs;
      const sizeFactor = Application.orientation() === "portrait" ? 0.9 : 0.6;
      boardSize.value = Math.floor(
        Math.min(screenWidthDip, screenHeightDip) * sizeFactor
      );
    }

    function newGame() {
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

    Application.on(Application.orientationChangedEvent, () => {
      updateBoardSize();
    });

    onMounted(() => {
      updateBoardSize();
    });

    return {
      boardSize,
      boardReversed,
      reverseBoard,
      newGame,
      board,
      handleCheckmate,
      handleStalemate,
      handleThreeFoldRepetition,
      handleInsufficientMaterial,
      handleFiftyMovesDraw,
    };
  },
  components: {
    ChessBoard,
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

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
        @position-selected="handlePositionSelected"
      />
      <history
        ref="history"
        :startFen="startFen"
        :width="historyWidth"
        :height="historyHeight"
        @position-request="handlePositionRequest"
      />
    </FlexBoxLayout>
  </Page>
</template>

<script>
import { ref, onMounted } from "@vue/composition-api";
import ChessBoard from "./Chessboard/Chessboard.vue";
import History from "./History/History.vue";
import { Screen, Application } from "@nativescript/core";
import { DEFAULT_FEN, EMPTY_POSITION_FEN } from './Chessboard/ChessBoardLogic';
export default {
  setup() {
    const board = ref();
    const history = ref();
    const boardSize = ref(0);
    const boardReversed = ref(false);
    const mainZoneDirection = ref("column");
    const historyWidth = ref(0);
    const historyHeight = ref(0);
    const startFen = ref(DEFAULT_FEN);

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

    function doStartNewGame() {
      startFen.value = DEFAULT_FEN;
      history.value.newGame();
      board.value.newGame();
    }

    async function newGame() {
      if (board.value.fen() === EMPTY_POSITION_FEN) {
        doStartNewGame();
        return;
      }
      const confirmed = await confirm('Do you really want to cancel current game and start a new one ?');
      if (confirmed) doStartNewGame();
    }

    function reverseBoard() {
      boardReversed.value = !boardReversed.value;
    }

    function handleCheckmate(whiteTurnBeforeMove) {
      const side = whiteTurnBeforeMove ? "White" : "Black";
      history.value.gotoLastRequest();
      alert(`${side} has won by checkmate !`);
    }

    function handleStalemate() {
      history.value.gotoLastRequest();
      alert("Draw by stalemate !");
    }

    function handleThreeFoldRepetition() {
      history.value.gotoLastRequest();
      alert("Draw by three-fold repetition !");
    }

    function handleInsufficientMaterial() {
      history.value.gotoLastRequest();
      alert("Draw by insufficient material !");
    }

    function handleFiftyMovesDraw() {
      history.value.gotoLastRequest();
      alert("Draw by the 50 moves rule !");
    }

    function handleMoveDone({ moveFan, fenAfterMove, lastMoveArrow }) {
      history.value.addMove({ moveFan, fenAfterMove, lastMoveArrow });
    }

    function handlePositionRequest(item) {
      board.value.positionRequest(item);
    }

    function handlePositionSelected(index) {
      history.value.handlePositionSelectedOnBoard(index);
    }

    async function stopGame() {
      if (!board.value.gameIsInProgress()) return;
      const confirmed = await confirm(
        "Do you really want to stop current game and start a new one ?"
      );
      if (confirmed) {
        board.value.stopGame();
        history.value.gotoLastRequest();
      }
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
      handlePositionSelected,
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

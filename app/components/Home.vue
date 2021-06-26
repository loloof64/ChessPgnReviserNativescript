<template>
  <Page>
    <ActionBar>
      <Label text="Home" />
      <ActionItem @tap="reverseBoard"
        icon="res://reverse"  android.position="actionBar" />
    </ActionBar>

    <GridLayout>
      <chess-board :size="boardSize" :reversed="boardReversed" />
    </GridLayout>
  </Page>
</template>

<script>
import { ref, onMounted } from "@vue/composition-api";
import ChessBoard from "./Chessboard/Chessboard.vue";
import { Screen, Application } from "@nativescript/core";
export default {
  setup() {

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

    function reverseBoard() {
      boardReversed.value = ! boardReversed.value;
    }

    Application.on(Application.orientationChangedEvent, () => {
      updateBoardSize();
    });

    onMounted(() => {
      updateBoardSize();
    });

    return { boardSize, boardReversed, reverseBoard };
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

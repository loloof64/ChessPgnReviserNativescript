<template>
  <Page>
    <ActionBar>
      <Label text="Home" />
    </ActionBar>

    <GridLayout>
      <chess-board :size="boardSize" :key="randomKey" />
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

    function updateBoardSize() {
      const screenWidthDip = Screen.mainScreen.widthDIPs;
      const screenHeightDip = Screen.mainScreen.heightDIPs;
      const sizeFactor = Application.orientation() === "portrait" ? 0.9 : 0.6;
      boardSize.value = Math.floor(
        Math.min(screenWidthDip, screenHeightDip) * sizeFactor
      );
    }

    Application.on(Application.orientationChangedEvent, () => {
      updateBoardSize();
    });

    onMounted(() => {
      updateBoardSize();
    });

    return { boardSize };
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

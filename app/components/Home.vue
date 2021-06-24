<template>
  <Page>
    <ActionBar>
      <Label text="Home" />
    </ActionBar>

    <GridLayout>
     <chess-board size="200" />
    </GridLayout>
  </Page>
</template>

<script>
import { computed } from "@vue/composition-api";
import ChessBoard from './Chessboard/Chessboard.vue';
export default {
  setup() {
    const message = computed(() => "Blank {N}-Vue app");
    return {message};
  },
  components: {
      ChessBoard,
  }
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

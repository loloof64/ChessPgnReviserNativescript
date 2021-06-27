<template>
  <FlexBoxLayout
    id="root"
    backgroundColor="#ABCCCCCC"
    :width="size"
    :height="size"
  >
    <SVGImage
      class="button"
      :src="queenImage"
      :width="imagesSize()"
      :height="imagesSize()"
      @tap="selectQueen"
    />

    <SVGImage
      class="button"
      :src="rookImage"
      :width="imagesSize()"
      :height="imagesSize()"
      @tap="selectRook"
    />

    <SVGImage
      class="button"
      :src="bishopImage"
      :width="imagesSize()"
      :height="imagesSize()"
      @tap="selectBishop"
    />

    <SVGImage
      class="button"
      :src="knightImage"
      :width="imagesSize()"
      :height="imagesSize()"
      @tap="selectKnight"
    />
  </FlexBoxLayout>
</template>

<script>
import { ref, onMounted, watch } from "@vue/composition-api";
export default {
  props: {
    size: {
      type: Number,
      default: "50",
    },
    whiteTurn: {
      type: Boolean,
      required: true,
    },
  },
  setup(props, context) {
    const queenImage = ref("");
    const rookImage = ref("");
    const bishopImage = ref("");
    const knightImage = ref("");

    function imagesSize() {
      return props.size * 0.2;
    }

    function updatePiecesImages() {
      queenImage.value = props.whiteTurn
        ? "~/components/Chessboard/vectors/wq.svg"
        : "~/components/Chessboard/vectors/bq.svg";
      rookImage.value = props.whiteTurn
        ? "~/components/Chessboard/vectors/wr.svg"
        : "~/components/Chessboard/vectors/br.svg";
      bishopImage.value = props.whiteTurn
        ? "~/components/Chessboard/vectors/wb.svg"
        : "~/components/Chessboard/vectors/bb.svg";
      knightImage.value = props.whiteTurn
        ? "~/components/Chessboard/vectors/wn.svg"
        : "~/components/Chessboard/vectors/bn.svg";
    }

    function selectQueen() {
      context.emit("selection", "q");
    }

    function selectRook() {
      context.emit("selection", "r");
    }

    function selectBishop() {
      context.emit("selection", "b");
    }

    function selectKnight() {
      context.emit("selection", "n");
    }

    onMounted(updatePiecesImages);
    watch(() => props.whiteTurn, updatePiecesImages);

    return {
      queenImage,
      rookImage,
      bishopImage,
      knightImage,
      imagesSize,
      selectQueen,
      selectRook,
      selectBishop,
      selectKnight,
    };
  },
};
</script>

<style scoped>
#root {
  flex-direction: row;
  justify-content: space-around;
}

.button {
  border: 1px solid black;
}
</style>
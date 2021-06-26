<template>
  <AbsoluteLayout
    :backgroundColor="backgroundColor"
    :width="size"
    :height="size"
  >
    <Label
      v-for="coordData in coordinates"
      :key="coordData.key"
      :text="coordData.text"
      :fontSize="coordinatesSize"
      :left="coordData.left"
      :top="coordData.top"
      :color="coordinatesColor"
      fontWeight="bold"
    />
    <Label
      v-for="cellData in cells"
      :key="cellData.key"
      text=""
      :left="cellData.left"
      :top="cellData.top"
      :width="cellsSize"
      :height="cellsSize"
      :backgroundColor="cellData.color"
    />

    <SVGImage
      v-for="piece in pieces"
      :key="piece.key"
      :src="piece.pieceRef"
      :left="piece.left"
      :top="piece.top"
      :width="cellsSize"
      :height="cellsSize"
      @pan="onPan"
    />

    <Label
      text=""
      :backgroundColor="whiteTurn ? 'white' : 'black'"
      :left="playerTurnLocation"
      :top="playerTurnLocation"
      :width="playerTurnSize"
      :height="playerTurnSize"
      :borderRadius="playerTurnRadius"
    />
  </AbsoluteLayout>
</template>

<script>
import { computed, ref, onMounted, watch } from "@vue/composition-api";
import Chess from "chess.js";

export default {
  props: {
    size: {
      type: Number,
      default: "50",
    },
    backgroundColor: {
      type: String,
      default: "#89f",
    },
    coordinatesColor: {
      type: String,
      default: "#fd0",
    },
    whiteCellsColor: {
      type: String,
      default: "#fda",
    },
    blackCellsColor: {
      type: String,
      default: "#d94",
    },
    reversed: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const coordinates = ref([]);
    const cells = ref([]);
    const pieces = ref([]);
    const chessLogic = ref(new Chess());
    const dndActive = ref(false);
    const prevDeltaX = ref(0);
    const prevDeltaY = ref(0);
    const dndOriginX = ref(0);
    const dndOriginY = ref(0);

    const cellsSize = computed(function () {
      return Math.floor((props.size * 1.0) / 9.0);
    });

    const coordinatesSize = computed(function () {
      return Math.floor(cellsSize.value * 0.5);
    });

    const whiteTurn = computed(function () {
      return chessLogic.value.turn() === "w";
    });

    const playerTurnLocation = computed(function () {
      return Math.floor(cellsSize.value * 8.5);
    });

    const playerTurnSize = computed(function () {
      return Math.floor(cellsSize.value * 0.4);
    });

    const playerTurnRadius = computed(function () {
      return Math.floor(cellsSize.value * 0.2);
    });

    function updateCoordinates() {
      coordinates.value.splice(0, coordinates.value.length);

      [0, 1, 2, 3, 4, 5, 6, 7].forEach((colIndex) => {
        const text = String.fromCharCode(
          "A".charCodeAt(0) + (props.reversed ? 7 - colIndex : colIndex)
        );
        const left = Math.floor(cellsSize.value * (0.85 + colIndex));
        const t1 = Math.floor(cellsSize.value * -0.17);
        const t2 = Math.floor(cellsSize.value * 8.33);

        const keyTop = `file_coord_top_${colIndex}`;
        const keyBottom = `file_coord_bottom_${colIndex}`;

        coordinates.value.push({
          text,
          left,
          top: t1,
          key: keyTop,
        });
        coordinates.value.push({
          text,
          left,
          top: t2,
          key: keyBottom,
        });
      });

      [0, 1, 2, 3, 4, 5, 6, 7].forEach((rowIndex) => {
        const text = String.fromCharCode(
          "8".charCodeAt(0) - (props.reversed ? 7 - rowIndex : rowIndex)
        );
        const top = Math.floor(cellsSize.value * (0.65 + rowIndex));
        const l1 = Math.floor(cellsSize.value * 0.1);
        const l2 = Math.floor(cellsSize.value * 8.6);

        const keyLeft = `rank_coord_left_${rowIndex}`;
        const keyRight = `rank_coord_right_${rowIndex}`;

        coordinates.value.push({
          text,
          left: l1,
          top,
          key: keyLeft,
        });
        coordinates.value.push({
          text,
          left: l2,
          top,
          key: keyRight,
        });
      });
    }

    function updateCells() {
      cells.value.splice(0, cells.value.length);

      [0, 1, 2, 3, 4, 5, 6, 7].forEach((rowIndex) => {
        [0, 1, 2, 3, 4, 5, 6, 7].forEach((colIndex) => {
          const left = Math.floor(cellsSize.value * (0.5 + colIndex));
          const top = Math.floor(cellsSize.value * (0.5 + rowIndex));
          const isWhiteCell = (rowIndex + colIndex) % 2 == 0;
          const color = isWhiteCell
            ? props.whiteCellsColor
            : props.blackCellsColor;
          const key = `cell_${rowIndex}${colIndex}`;

          cells.value.push({
            left,
            top,
            color,
            key,
          });
        });
      });
    }

    function updatePieces() {
      let newValues = [];

      [0, 1, 2, 3, 4, 5, 6, 7].forEach((rowIndex) => {
        [0, 1, 2, 3, 4, 5, 6, 7].forEach((colIndex) => {
          const file = props.reversed ? 7 - colIndex : colIndex;
          const rank = props.reversed ? rowIndex : 7 - rowIndex;
          const cellAsAlgebraic = cellCoordinatesToAlgebraic({
            file,
            rank,
          });
          const cellValue = chessLogic.value.get(cellAsAlgebraic);
          const cellHasAPiece = cellValue !== null;

          if (cellHasAPiece) {
            const pieceRef = `~/components/Chessboard/vectors/${cellValue.color}${cellValue.type}.svg`;
            const left = Math.floor(cellsSize.value * (0.5 + colIndex));
            const top = Math.floor(cellsSize.value * (0.5 + rowIndex));
            const key = `piece_${rowIndex}${colIndex}`;

            newValues.push({
              pieceRef,
              left,
              top,
              key,
            });
          }
        });
      });

      pieces.value = newValues;
    }

    function repaintAll() {
      updateCoordinates();
      updateCells();
      updatePieces();
    }

    function cellCoordinatesToAlgebraic({ file, rank }) {
      return (
        String.fromCharCode("a".charCodeAt(0) + file) +
        String.fromCharCode("1".charCodeAt(0) + rank)
      );
    }

    function onPan(event) {
      const origin = event.object;

      const panState = event.state;
      const isDown = panState === 1;
      const isPanning = panState === 2;
      const isUp = panState === 3;

      if (isDown) {
        dndOriginX.value = origin.get("left");
        dndOriginY.value = origin.get("top");
        prevDeltaX.value = event.deltaX;
        prevDeltaY.value = event.deltaY;
        dndActive.value = true;
      } else if (isPanning) {
        if (!dndActive.value) return;

        const effectiveDeltaX = event.deltaX - prevDeltaX;
        const effectiveDeltaY = event.deltaY - prevDeltaY;

        origin.set("left", origin.get("left") + effectiveDeltaX);
        origin.set("top", origin.get("top") + effectiveDeltaY);

        const newX = origin.get("left");
        const newY = origin.get("top");

        const tooFarLeft = newX < cellsSize.value * 0.3;
        const tooFarRight = newX > cellsSize.value * 7.7;

        const tooFarTop = newY < cellsSize.value * 0.3;
        const tooFarBottom = newY > cellsSize.value * 7.7;

        if (tooFarLeft || tooFarRight || tooFarTop || tooFarBottom) {
          // cancel drag and drop
          origin.set("left", dndOriginX);
          origin.set("top", dndOriginY);
          dndActive = false;
        } else {
          prevDeltaX = event.deltaX;
          prevDeltaY = event.deltaY;
        }
      } else if (isUp) {
        // cancel drag and drop
        origin.set("left", dndOriginX);
        origin.set("top", dndOriginY);
        dndActive = false;
      }
    }

    onMounted(repaintAll);

    watch(() => props.reversed, repaintAll);
    watch(() => props.size, repaintAll);

    return {
      coordinates,
      cells,
      pieces,
      chessLogic,
      dndActive,
      prevDeltaX,
      prevDeltaY,
      dndOriginX,
      dndOriginY,
      onPan,
      coordinatesSize,
      whiteTurn,
      playerTurnLocation,
      playerTurnSize,
      playerTurnRadius,
      cellsSize,
    };
  },
};
</script>

<style scoped>
</style>
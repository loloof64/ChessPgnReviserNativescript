<template>
  <AbsoluteLayout
    :backgroundColor="backgroundColor"
    :width="size"
    :height="size"
  >
    <Label
      v-for="coordData in $data.$_coordinates"
      :key="coordData.key"
      :text="coordData.text"
      :fontSize="$_coordinatesSize"
      :left="coordData.left"
      :top="coordData.top"
      :color="coordinatesColor"
      fontWeight="bold"
    />
    <Label
      v-for="cellData in $data.$_cells"
      :key="cellData.key"
      text=""
      :left="cellData.left"
      :top="cellData.top"
      :width="$_cellsSize"
      :height="$_cellsSize"
      :backgroundColor="cellData.color"
    />

    <SVGView
      v-for="piece in $data.$_pieces"
      :key="piece.key"
      :src="piece.ref"
      :left="piece.left"
      :top="piece.top"
      :width="$_cellsSize"
      :height="$_cellsSize"
      @pan="$_onPan($event)"
    />

    <Label
      text=""
      :backgroundColor="$_whiteTurn ? 'white' : 'black'"
      :left="$_playerTurnLocation"
      :top="$_playerTurnLocation"
      :width="$_playerTurnSize"
      :height="$_playerTurnSize"
      :borderRadius="$_playerTurnRadius"
    />
  </AbsoluteLayout>
</template>

<script>
import * as Chess from "chess.js";

export default {
  mounted() {
    this.$_repaintAll();
  },
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
  data: function () {
    return {
      $_coordinates: [],
      $_cells: [],
      $_pieces: [],
      $_chessLogic: new Chess(),
      $_dndActive: false,
      $_prevDeltaX: 0,
      $_prevDeltaY: 0,
      $_dndOriginX: 0,
      $_dndOriginY: 0,
    };
  },
  methods: {
    $_updateCoordinates() {
      let newValues = [];

      [0, 1, 2, 3, 4, 5, 6, 7].forEach((colIndex) => {
        const text = String.fromCharCode(
          "A".charCodeAt(0) + (this.reversed ? 7 - colIndex : colIndex)
        );
        const left = Math.floor(this.$_cellsSize * (0.85 + colIndex));
        const t1 = Math.floor(this.$_cellsSize * -0.17);
        const t2 = Math.floor(this.$_cellsSize * 8.33);

        const keyTop = `file_coord_top_${colIndex}`;
        const keyBottom = `file_coord_bottom_${colIndex}`;

        newValues.push({
          text,
          left,
          top: t1,
          key: keyTop,
        });
        newValues.push({
          text,
          left,
          top: t2,
          key: keyBottom,
        });
      });

      [0, 1, 2, 3, 4, 5, 6, 7].forEach((rowIndex) => {
        const text = String.fromCharCode(
          "8".charCodeAt(0) - (this.reversed ? 7 - rowIndex : rowIndex)
        );
        const top = Math.floor(this.$_cellsSize * (0.65 + rowIndex));
        const l1 = Math.floor(this.$_cellsSize * 0.1);
        const l2 = Math.floor(this.$_cellsSize * 8.6);

        const keyLeft = `rank_coord_left_${rowIndex}`;
        const keyRight = `rank_coord_right_${rowIndex}`;

        newValues.push({
          text,
          left: l1,
          top,
          key: keyLeft,
        });
        newValues.push({
          text,
          left: l2,
          top,
          key: keyRight,
        });
      });

      this.$data.$_coordinates = newValues;
    },
    $_updateCells() {
      let newValues = [];

      [0, 1, 2, 3, 4, 5, 6, 7].forEach((rowIndex) => {
        [0, 1, 2, 3, 4, 5, 6, 7].forEach((colIndex) => {
          const left = Math.floor(this.$_cellsSize * (0.5 + colIndex));
          const top = Math.floor(this.$_cellsSize * (0.5 + rowIndex));
          const isWhiteCell = (rowIndex + colIndex) % 2 == 0;
          const color = isWhiteCell
            ? this.whiteCellsColor
            : this.blackCellsColor;
          const key = `cell_${rowIndex}${colIndex}`;

          newValues.push({
            left,
            top,
            color,
            key,
          });
        });
      });

      this.$data.$_cells = newValues;
    },
    $_updatePieces() {
      let newValues = [];

      [0, 1, 2, 3, 4, 5, 6, 7].forEach((rowIndex) => {
        [0, 1, 2, 3, 4, 5, 6, 7].forEach((colIndex) => {
          const file = this.reversed ? 7 - colIndex : colIndex;
          const rank = this.reversed ? rowIndex : 7 - rowIndex;
          const cellAsAlgebraic = this.$_cellCoordinatesToAlgebraic({
            file,
            rank,
          });
          const cellValue = this.$data.$_chessLogic.get(cellAsAlgebraic);
          const cellHasAPiece = cellValue !== null;

          if (cellHasAPiece) {
            const ref = `~/components/Chessboard/vectors/${cellValue.color}${cellValue.type}.svg`;
            const left = Math.floor(this.$_cellsSize * (0.5 + colIndex));
            const top = Math.floor(this.$_cellsSize * (0.5 + rowIndex));
            const key = `piece_${rowIndex}${colIndex}`;

            newValues.push({
              ref,
              left,
              top,
              key,
            });
          }
        });
      });

      this.$data.$_pieces = newValues;
    },
    $_repaintAll() {
      this.$_updateCoordinates();
      this.$_updateCells();
      this.$_updatePieces();
    },
    $_cellCoordinatesToAlgebraic({ file, rank }) {
      return (
        String.fromCharCode("a".charCodeAt(0) + file) +
        String.fromCharCode("1".charCodeAt(0) + rank)
      );
    },
    $_onPan(event) {
      const origin = event.object;

      const panState = event.state;
      const isDown = panState === 1;
      const isPanning = panState === 2;
      const isUp = panState === 3;

      if (isDown) {
        this.$data.$_dndOriginX = origin.get("left");
        this.$data.$_dndOriginY = origin.get("top");
        this.$data.$_prevDeltaX = event.deltaX;
        this.$data.$_prevDeltaY = event.deltaY;
        this.$data.$_dndActive = true;
      } else if (isPanning) {
        if (!this.$data.$_dndActive) return;

        const effectiveDeltaX = event.deltaX - this.$data.$_prevDeltaX;
        const effectiveDeltaY = event.deltaY - this.$data.$_prevDeltaY;

        origin.set("left", origin.get("left") + effectiveDeltaX);
        origin.set("top", origin.get("top") + effectiveDeltaY);

        const newX = origin.get("left");
        const newY = origin.get("top");

        const tooFarLeft = newX < this.$_cellsSize * 0.3;
        const tooFarRight = newX > this.$_cellsSize * 7.7;

        const tooFarTop = newY < this.$_cellsSize * 0.3;
        const tooFarBottom = newY > this.$_cellsSize * 7.7;

        if (tooFarLeft || tooFarRight || tooFarTop || tooFarBottom) {
          // cancel drag and drop
          origin.set("left", this.$data.$_dndOriginX);
          origin.set("top", this.$data.$_dndOriginY);
          this.$data.$_dndActive = false;
        } else {
          this.$data.$_prevDeltaX = event.deltaX;
          this.$data.$_prevDeltaY = event.deltaY;
        }
      } else if (isUp) {
        // cancel drag and drop
        origin.set("left", this.$data.$_dndOriginX);
        origin.set("top", this.$data.$_dndOriginY);
        this.$data.$_dndActive = false;
      }
    },
  },
  computed: {
    $_cellsSize: function () {
      return Math.floor((this.size * 1.0) / 9.0);
    },
    $_coordinatesSize: function () {
      return Math.floor(this.$_cellsSize * 0.5);
    },
    $_whiteTurn: function () {
      return this.$data.$_chessLogic.turn() === "w";
    },
    $_playerTurnLocation: function () {
      return Math.floor(this.$_cellsSize * 8.5);
    },
    $_playerTurnSize: function () {
      return Math.floor(this.$_cellsSize * 0.4);
    },
    $_playerTurnRadius: function () {
      return Math.floor(this.$_cellsSize * 0.2);
    },
  },
  watch: {
    reversed: {
      handler: function () {
        this.$_repaintAll();
      },
    },
    size: {
      handler: function () {
        this.$_repaintAll();
      },
    },
  },
};
</script>

<style scoped>
</style>
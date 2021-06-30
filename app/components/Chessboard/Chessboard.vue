<template>
  <GridLayout columns="auto" rows="auto">
    <AbsoluteLayout
      :backgroundColor="backgroundColor"
      :width="size"
      :height="size"
      col="0"
      row="0"
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

      <Label
        text=""
        :backgroundColor="whiteTurn() ? 'white' : 'black'"
        :left="playerTurnLocation"
        :top="playerTurnLocation"
        :width="playerTurnSize"
        :height="playerTurnSize"
        :borderRadius="playerTurnRadius"
      />
    </AbsoluteLayout>

    <CanvasView
      ref="arrowZone"
      :width="size"
      :height="size"
      @draw="drawArrow"
      col="0"
      row="0"
    />

    <AbsoluteLayout
      :backgroundColor="transparent"
      :width="size"
      :height="size"
      col="0"
      row="0"
    >
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
    </AbsoluteLayout>

    <promotion-dialog
      col="0"
      row="0"
      v-show="promotionDialogActive"
      :size="size"
      :whiteTurn="whiteTurn()"
      left="0px"
      top="0px"
      @selection="commitPendingPromotion"
      @cancelation="cancelPendingPromotion"
    />
  </GridLayout>
</template>

<script>
import { createRect, Paint, Style } from "@nativescript-community/ui-canvas";
import { Color } from "@nativescript/core";
const ChessBoardLogic = require("./ChessBoardLogic");
import PromotionDialog from "./PromotionDialog.vue";

export default {
  props: {
    size: {
      type: Number,
      default: 50,
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
    dragDropOriginCellColor: {
      type: String,
      default: "#b22c2c",
    },
    dragDropTargetCellColor: {
      type: String,
      default: "#17b231",
    },
    dragDropHelperCellColor: {
      type: String,
      default: "#c700ff",
    },
    reversed: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    PromotionDialog,
  },
  data() {
    const logic = new ChessBoardLogic.default();
    return {
      coordinates: [],
      cells: [],
      pieces: [],
      chessLogic: logic,
      prevDeltaX: 0,
      prevDeltaY: 0,
      dndFromFile: -1000,
      dndFromRank: -1000,
      dndToFile: -1000,
      dndToRank: -1000,
      dndActive: false,
      promotionDialogActive: false,
      gameInProgress: false,
      lastMoveArrow: {
        fromFile: -10,
        fromRank: -10,
        toFile: -10,
        toRank: -10,
      },
      pendingMovedPiece: undefined,
    };
  },
  methods: {
    newGame: function () {
      const DEFAULT_FEN =
        "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
      this.lastMoveArrow = {
        fromFile: -10,
        fromRank: -10,
        toFile: -10,
        toRank: -10,
      };
      this.chessLogic = new ChessBoardLogic.default(DEFAULT_FEN);
      this.gameInProgress = true;
      this.repaintAll();
    },
    drawArrow: function ({ canvas }) {
      const paint = new Paint();
      paint.setColor(new Color("transparent"));
      paint.setStyle(Style.FILL);
      canvas.drawRect(createRect(0, 0, this.size, this.size), paint);

      if (!this.lastMoveArrow) return;
      paint.strokeWidth = this.cellsSize * 0.2;
      paint.setColor(new Color("lightblue"));

      const realOriginCol = this.reversed
        ? 7 - this.lastMoveArrow.fromFile
        : this.lastMoveArrow.fromFile;
      const realOriginRow = this.reversed
        ? this.lastMoveArrow.fromRank
        : 7 - this.lastMoveArrow.fromRank;
      const realDestCol = this.reversed
        ? 7 - this.lastMoveArrow.toFile
        : this.lastMoveArrow.toFile;
      const realDestRow = this.reversed
        ? this.lastMoveArrow.toRank
        : 7 - this.lastMoveArrow.toRank;
      const baseStartX = this.cellsSize * (1.0 + realOriginCol);
      const baseStartY = this.cellsSize * (1.0 + realOriginRow);
      const baseStopX = this.cellsSize * (1.0 + realDestCol);
      const baseStopY = this.cellsSize * (1.0 + realDestRow);
      const deltaX = baseStopX - baseStartX;
      const deltaY = baseStopY - baseStartY;
      const baseLineAngleRad = Math.atan2(deltaY, deltaX);
      const edge1AngleRad = baseLineAngleRad + 2.618;
      const edge2AngleRad = baseLineAngleRad + 3.665;
      const edge1StartX = baseStopX;
      const edge1StartY = baseStopY;
      const edge1StopX =
        baseStopX + this.cellsSize * Math.cos(edge1AngleRad) * 0.6;
      const edge1StopY =
        baseStopY + this.cellsSize * Math.sin(edge1AngleRad) * 0.6;

      const edge2StartX = baseStopX;
      const edge2StartY = baseStopY;
      const edge2StopX =
        baseStopX + this.cellsSize * Math.cos(edge2AngleRad) * 0.6;
      const edge2StopY =
        baseStopY + this.cellsSize * Math.sin(edge2AngleRad) * 0.6;

      canvas.drawLine(baseStartX, baseStartY, baseStopX, baseStopY, paint);
      canvas.drawLine(edge1StartX, edge1StartY, edge1StopX, edge1StopY, paint);
      canvas.drawLine(edge2StartX, edge2StartY, edge2StopX, edge2StopY, paint);
    },
    updateCoordinates: function () {
      this.coordinates.splice(0, this.coordinates.length);

      [0, 1, 2, 3, 4, 5, 6, 7].forEach((colIndex) => {
        const text = String.fromCharCode(
          "A".charCodeAt(0) + (this.reversed ? 7 - colIndex : colIndex)
        );
        const left = Math.floor(this.cellsSize * (0.85 + colIndex));
        const t1 = Math.floor(this.cellsSize * -0.17);
        const t2 = Math.floor(this.cellsSize * 8.33);

        const keyTop = `file_coord_top_${colIndex}`;
        const keyBottom = `file_coord_bottom_${colIndex}`;

        this.coordinates.push({
          text,
          left,
          top: t1,
          key: keyTop,
        });
        this.coordinates.push({
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
        const top = Math.floor(this.cellsSize * (0.65 + rowIndex));
        const l1 = Math.floor(this.cellsSize * 0.1);
        const l2 = Math.floor(this.cellsSize * 8.6);

        const keyLeft = `rank_coord_left_${rowIndex}`;
        const keyRight = `rank_coord_right_${rowIndex}`;

        this.coordinates.push({
          text,
          left: l1,
          top,
          key: keyLeft,
        });
        this.coordinates.push({
          text,
          left: l2,
          top,
          key: keyRight,
        });
      });
    },
    updateCells: function () {
      this.cells.splice(0, this.cells.length);

      [0, 1, 2, 3, 4, 5, 6, 7].forEach((rowIndex) => {
        [0, 1, 2, 3, 4, 5, 6, 7].forEach((colIndex) => {
          const left = Math.floor(this.cellsSize * (0.5 + colIndex));
          const top = Math.floor(this.cellsSize * (0.5 + rowIndex));
          const isWhiteCell = (rowIndex + colIndex) % 2 == 0;

          const file = this.reversed ? 7 - colIndex : colIndex;
          const rank = this.reversed ? rowIndex : 7 - rowIndex;

          const isDndOriginCell =
            file === this.dndFromFile && rank === this.dndFromRank;
          const isDndTargetCell =
            file === this.dndToFile && rank === this.dndToRank;
          const isDndHelperCell =
            file === this.dndToFile || rank === this.dndToRank;
          let color = isWhiteCell ? this.whiteCellsColor : this.blackCellsColor;
          if (isDndHelperCell) color = this.dragDropHelperCellColor;
          if (isDndOriginCell) color = this.dragDropOriginCellColor;
          if (isDndTargetCell) color = this.dragDropTargetCellColor;

          const key = `cell_${rowIndex}${colIndex}`;

          this.cells.push({
            left,
            top,
            color,
            key,
          });
        });
      });
    },
    updatePieces: function () {
      this.pieces.splice(0, this.pieces.length);

      [0, 1, 2, 3, 4, 5, 6, 7].forEach((rowIndex) => {
        [0, 1, 2, 3, 4, 5, 6, 7].forEach((colIndex) => {
          const file = this.reversed ? 7 - colIndex : colIndex;
          const rank = this.reversed ? rowIndex : 7 - rowIndex;
          const cellAsAlgebraic = this.chessLogic.cellCoordinatesToAlgebraic({
            file,
            rank,
          });
          const cellValue = this.chessLogic.getValueAtCell(cellAsAlgebraic);
          const cellHasAPiece = cellValue !== null;

          if (cellHasAPiece) {
            const pieceRef = `~/components/Chessboard/vectors/${cellValue.color}${cellValue.type}.svg`;
            const left = Math.floor(this.cellsSize * (0.5 + colIndex));
            const top = Math.floor(this.cellsSize * (0.5 + rowIndex));
            const key = `piece_${rowIndex}${colIndex}`;

            this.pieces.push({
              pieceRef,
              left,
              top,
              key,
            });
          }
        });
      });
    },

    repaintAll: function () {
      this.updateCoordinates();
      this.updateCells();
      this.updatePieces();
      this.$refs.arrowZone?.nativeView.redraw();
    },

    cancelDragAndDrop: function (moveObject) {
      moveObject.translateX = 0;
      moveObject.translateY = 0;
      this.dndFromFile = -1000;
      this.dndFromRank = -1000;
      this.dndToFile = -1000;
      this.dndToRank = -1000;
      this.prevDeltaX = 0;
      this.prevDeltaY = 0;
      this.dndActive = false;
      this.repaintAll();
    },

    emitGameFinishedIfPossible: function () {
      if (this.chessLogic.isCheckmate) {
        const whiteTurnBeforeMove = !this.chessLogic.isWhiteTurn;
        this.gameInProgress = false;
        this.$emit("checkmate", whiteTurnBeforeMove);
      } else if (this.chessLogic.isStalemate) {
        this.gameInProgress = false;
        this.$emit("stalemate");
      } else if (this.chessLogic.isInThreeFoldRepetition) {
        this.gameInProgress = false;
        this.$emit("threeFoldRepetition");
      } else if (this.chessLogic.isInsufficientMaterial) {
        this.gameInProgress = false;
        this.$emit("insufficientMaterial");
      } else if (this.chessLogic.isFiftyMovesDraw) {
        this.gameInProgress = false;
        this.$emit("fityMovesDraw");
      }
    },

    getColFromX: function (x) {
      return Math.floor(x / this.cellsSize);
    },

    getRowFromY: function (y) {
      return Math.floor(y / this.cellsSize);
    },

    onPan: function (event) {
      if (!this.gameInProgress) return;
      if (this.promotionDialogActive) return;

      const origin = event.object;

      const panState = event.state;
      const isDown = panState === 1;
      const isPanning = panState === 2;
      const isUp = panState === 3;

      if (isDown) {
        this.prevDeltaX = 0;
        this.prevDeltaY = 0;

        const col = this.getColFromX(origin.left);
        const row = this.getRowFromY(origin.top);

        const file = this.reversed ? 7 - col : col;
        const rank = this.reversed ? row : 7 - row;

        const cellAlgebraic = this.chessLogic.cellCoordinatesToAlgebraic({
          file,
          rank,
        });

        if (!this.chessLogic.isPlayerInTurnPieceAtCell(cellAlgebraic)) return;

        this.dndFromFile = file;
        this.dndFromRank = rank;
        this.dndActive = true;
        this.repaintAll();
      } else if (isPanning) {
        if (!this.dndActive) return;
        origin.translateX += event.deltaX - this.prevDeltaX;
        origin.translateY += event.deltaY - this.prevDeltaY;

        const newX = origin.left + origin.translateX;
        const newY = origin.top + origin.translateY;

        const col = this.getColFromX(newX);
        const row = this.getColFromX(newY);

        const file = this.reversed ? 7 - col : col;
        const rank = this.reversed ? row : 7 - row;

        this.dndToFile = file;
        this.dndToRank = rank;

        const tooFarLeft = newX < this.cellsSize * 0.3;
        const tooFarRight = newX > this.cellsSize * 7.7;

        const tooFarTop = newY < this.cellsSize * 0.3;
        const tooFarBottom = newY > this.cellsSize * 7.7;

        if (tooFarLeft || tooFarRight || tooFarTop || tooFarBottom) {
          this.cancelDragAndDrop(origin);
          return;
        }

        this.prevDeltaX = event.deltaX;
        this.prevDeltaY = event.deltaY;

        this.updateCells();
      } else if (isUp) {
        if (!this.dndActive) return;
        const x = origin.left + origin.translateX;
        const y = origin.top + origin.translateY;

        const fromCol = this.getColFromX(origin.left);
        const fromRow = this.getRowFromY(origin.top);
        const fromFile = this.reversed ? 7 - fromCol : fromCol;
        const fromRank = this.reversed ? fromRow : 7 - fromRow;

        const toCol = this.getColFromX(x);
        const toRow = this.getRowFromY(y);
        const toFile = this.reversed ? 7 - toCol : toCol;
        const toRank = this.reversed ? toRow : 7 - toRow;

        this.dndToFile = toFile;
        this.dndToRank = toRank;

        const fromAlgebraic = this.chessLogic.cellCoordinatesToAlgebraic({
          file: fromFile,
          rank: fromRank,
        });
        const toAlgebraic = this.chessLogic.cellCoordinatesToAlgebraic({
          file: toFile,
          rank: toRank,
        });
        const validMove = this.chessLogic.isLegalMove({
          fromAlgebraic,
          toAlgebraic,
        });

        if (!validMove) {
          this.cancelDragAndDrop(origin);
          return;
        }

        const isPromotion = this.chessLogic.isPromotionMove({
          fromAlgebraic,
          toAlgebraic,
        });
        if (isPromotion) {
          this.pendingMovedPiece = origin;
          this.promotionDialogActive = true;
        } else {
          const moveData = this.chessLogic.makeMove({
            fromAlgebraic,
            toAlgebraic,
            promotionFen: null,
          });
          this.lastMoveArrow = {
            fromFile: this.dndFromFile,
            fromRank: this.dndFromRank,
            toFile: this.dndToFile,
            toRank: this.dndToRank,
          };
          this.cancelDragAndDrop(origin);
          this.$emit("move-done", {
            moveFan: this.chessLogic.convertSanToFan({
              moveSan: moveData.san,
              whiteMove: !this.chessLogic.isWhiteTurn,
            }),
            whiteMove: !this.chessLogic.isWhiteTurn,
            fenAfterMove: this.chessLogic.fen,
            lastMoveArrow: this.lastMoveArrow,
          });
          this.repaintAll();
          this.emitGameFinishedIfPossible();
        }
      }
    },
    whiteTurn: function () {
      return this.chessLogic.isWhiteTurn;
    },

    commitPendingPromotion: function (promotionFen) {
      const fromAlgebraic = this.chessLogic.cellCoordinatesToAlgebraic({
        file: this.dndFromFile,
        rank: this.dndFromRank,
      });
      const toAlgebraic = this.chessLogic.cellCoordinatesToAlgebraic({
        file: this.dndToFile,
        rank: this.dndToRank,
      });
      const moveData = this.chessLogic.makeMove({
        fromAlgebraic,
        toAlgebraic,
        promotionFen: promotionFen,
      });

      this.lastMoveArrow = {
        fromFile: this.dndFromFile,
        fromRank: this.dndFromRank,
        toFile: this.dndToFile,
        toRank: this.dndToRank,
      };

      this.promotionDialogActive = false;
      this.cancelDragAndDrop(this.pendingMovedPiece);
      this.pendingMovedPiece = undefined;

      this.$emit("move-done", {
        moveFan: this.chessLogic.convertSanToFan({
          moveSan: moveData.san,
          whiteMove: !this.chessLogic.isWhiteTurn,
        }),
        fenAfterMove: this.chessLogic.fen,
        lastMoveArrow: this.lastMoveArrow,
      });

      this.emitGameFinishedIfPossible();
    },

    cancelPendingPromotion: function () {
      this.promotionDialogActive = false;
      this.cancelDragAndDrop(this.pendingMovedPiece);
      this.pendingMovedPiece = undefined;
    },

    positionRequest: function(item) {
      if (this.gameInProgress) return;
      this.chessLogic.load(item.fenAfterMove);
      this.lastMoveArrow = item.lastMoveArrow;
      this.repaintAll();
      this.$emit('position-selected', item.index);
    },

    stopGame: function() {
      if (this.promotionDialogActive) return;
      this.gameInProgress = false;
      this.repaintAll();
      alert('Game stopped !');
    },

    gameIsInProgress: function() {
      return this.gameInProgress;
    },
    fen: function() {
      return this.chessLogic.fen;
    }
  },

  computed: {
    cellsSize: function () {
      return Math.floor((this.size * 1.0) / 9.0);
    },

    coordinatesSize: function () {
      return Math.floor(this.cellsSize * 0.5);
    },

    playerTurnLocation: function () {
      return Math.floor(this.cellsSize * 8.5);
    },

    playerTurnSize: function () {
      return Math.floor(this.cellsSize * 0.4);
    },

    playerTurnRadius: function () {
      return Math.floor(this.cellsSize * 0.2);
    },
  },
  watch: {
    reversed: function () {
      if (!this.promotionDialogActive) {
        this.repaintAll();
      }
    },
    size: function () {
      this.repaintAll();
    },
  },
  mounted: function () {
    this.repaintAll();
  },
};
</script>

<style scoped>
</style>
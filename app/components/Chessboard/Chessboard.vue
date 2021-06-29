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
      v-if="lastMoveArrow"
      :width="width"
      :height="height"
      @draw="drawArrow"
      ref="arrowZone"
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
      v-if="promotionDialogActive"
      :size="size"
      :whiteTurn="whiteTurn()"
      left="0px"
      top="0px"
      @selection="commitPendingPromotion"
    />
  </GridLayout>
</template>

<script>
import { computed, ref, onMounted, watch } from "@vue/composition-api";
import { createRect, Paint, Style } from "@nativescript-community/ui-canvas";
import { Color } from "@nativescript/core";
import ChessBoardLogic from "./ChessBoardLogic";
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
  setup(props, context) {
    const coordinates = ref([]);
    const cells = ref([]);
    const pieces = ref([]);
    const chessLogic = ref(new ChessBoardLogic());
    const prevDeltaX = ref(0);
    const prevDeltaY = ref(0);
    const dndFromFile = ref(-1000);
    const dndFromRank = ref(-1000);
    const dndToFile = ref(-1000);
    const dndToRank = ref(-1000);
    const dndActive = ref(false);
    const promotionDialogActive = ref(false);
    const gameInProgress = ref(false);
    const lastMoveArrow = ref(undefined);
    const arrowZone = ref();
    let pendingMovedPiece = undefined;

    const cellsSize = computed(function () {
      return Math.floor((props.size * 1.0) / 9.0);
    });

    const coordinatesSize = computed(function () {
      return Math.floor(cellsSize.value * 0.5);
    });

    function whiteTurn() {
      return chessLogic.value.isWhiteTurn;
    }

    const playerTurnLocation = computed(function () {
      return Math.floor(cellsSize.value * 8.5);
    });

    const playerTurnSize = computed(function () {
      return Math.floor(cellsSize.value * 0.4);
    });

    const playerTurnRadius = computed(function () {
      return Math.floor(cellsSize.value * 0.2);
    });

    function newGame() {
      const DEFAULT_FEN =
        "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
      lastMoveArrow.value = undefined;
      chessLogic.value = new ChessBoardLogic(DEFAULT_FEN);
      gameInProgress.value = true;
      repaintAll();
    }

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

          const file = props.reversed ? 7 - colIndex : colIndex;
          const rank = props.reversed ? rowIndex : 7 - rowIndex;

          const isDndOriginCell =
            file === dndFromFile.value && rank === dndFromRank.value;
          const isDndTargetCell =
            file === dndToFile.value && rank === dndToRank.value;
          const isDndHelperCell =
            file === dndToFile.value || rank === dndToRank.value;
          let color = isWhiteCell
            ? props.whiteCellsColor
            : props.blackCellsColor;
          if (isDndHelperCell) color = props.dragDropHelperCellColor;
          if (isDndOriginCell) color = props.dragDropOriginCellColor;
          if (isDndTargetCell) color = props.dragDropTargetCellColor;

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
          const cellAsAlgebraic = ChessBoardLogic.cellCoordinatesToAlgebraic({
            file,
            rank,
          });
          const cellValue = chessLogic.value.getValueAtCell(cellAsAlgebraic);
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
      if (arrowZone.value?.nativeView) arrowZone.value.nativeView.redraw();
    }

    function cancelDragAndDrop(moveObject) {
      moveObject.translateX = 0;
      moveObject.translateY = 0;
      dndFromFile.value = -1000;
      dndFromRank.value = -1000;
      dndToFile.value = -1000;
      dndToRank.value = -1000;
      prevDeltaX.value = 0;
      prevDeltaY.value = 0;
      dndActive.value = false;
      repaintAll();
    }

    function getColFromX(x) {
      return Math.floor(x / cellsSize.value);
    }

    function getRowFromY(y) {
      return Math.floor(y / cellsSize.value);
    }

    function emitGameFinishedIfPossible() {
      if (chessLogic.value.isCheckmate) {
        const whiteTurnBeforeMove = !chessLogic.value.isWhiteTurn;
        gameInProgress.value = false;
        context.emit("checkmate", whiteTurnBeforeMove);
      } else if (chessLogic.value.isStalemate) {
        gameInProgress.value = false;
        context.emit("stalemate");
      } else if (chessLogic.value.isInThreeFoldRepetition) {
        gameInProgress.value = false;
        context.emit("threeFoldRepetition");
      } else if (chessLogic.value.isInsufficientMaterial) {
        gameInProgress.value = false;
        context.emit("insufficientMaterial");
      } else if (chessLogic.value.isFiftyMovesDraw) {
        gameInProgress.value = false;
        context.emit("fityMovesDraw");
      }
    }

    function onPan(event) {
      if (!gameInProgress.value) return;
      if (promotionDialogActive.value) return;

      const origin = event.object;

      const panState = event.state;
      const isDown = panState === 1;
      const isPanning = panState === 2;
      const isUp = panState === 3;

      if (isDown) {
        prevDeltaX.value = 0;
        prevDeltaY.value = 0;

        const col = getColFromX(origin.left);
        const row = getRowFromY(origin.top);

        const file = props.reversed ? 7 - col : col;
        const rank = props.reversed ? row : 7 - row;

        const cellAlgebraic = ChessBoardLogic.cellCoordinatesToAlgebraic({
          file,
          rank,
        });

        if (!chessLogic.value.isPlayerInTurnPieceAtCell(cellAlgebraic)) return;

        dndFromFile.value = file;
        dndFromRank.value = rank;
        dndActive.value = true;
        repaintAll();
      } else if (isPanning) {
        if (!dndActive.value) return;
        origin.translateX += event.deltaX - prevDeltaX.value;
        origin.translateY += event.deltaY - prevDeltaY.value;

        const newX = origin.left + origin.translateX;
        const newY = origin.top + origin.translateY;

        const col = getColFromX(newX);
        const row = getColFromX(newY);

        const file = props.reversed ? 7 - col : col;
        const rank = props.reversed ? row : 7 - row;

        dndToFile.value = file;
        dndToRank.value = rank;

        const tooFarLeft = newX < cellsSize.value * 0.3;
        const tooFarRight = newX > cellsSize.value * 7.7;

        const tooFarTop = newY < cellsSize.value * 0.3;
        const tooFarBottom = newY > cellsSize.value * 7.7;

        if (tooFarLeft || tooFarRight || tooFarTop || tooFarBottom) {
          cancelDragAndDrop(origin);
          return;
        }

        prevDeltaX.value = event.deltaX;
        prevDeltaY.value = event.deltaY;

        updateCells();
      } else if (isUp) {
        if (!dndActive.value) return;
        const x = origin.left + origin.translateX;
        const y = origin.top + origin.translateY;

        const fromCol = getColFromX(origin.left);
        const fromRow = getRowFromY(origin.top);
        const fromFile = props.reversed ? 7 - fromCol : fromCol;
        const fromRank = props.reversed ? fromRow : 7 - fromRow;

        const toCol = getColFromX(x);
        const toRow = getRowFromY(y);
        const toFile = props.reversed ? 7 - toCol : toCol;
        const toRank = props.reversed ? toRow : 7 - toRow;

        dndToFile.value = toFile;
        dndToRank.value = toRank;

        const fromAlgebraic = ChessBoardLogic.cellCoordinatesToAlgebraic({
          file: fromFile,
          rank: fromRank,
        });
        const toAlgebraic = ChessBoardLogic.cellCoordinatesToAlgebraic({
          file: toFile,
          rank: toRank,
        });
        const validMove = chessLogic.value.isLegalMove({
          fromAlgebraic,
          toAlgebraic,
        });

        if (!validMove) {
          cancelDragAndDrop(origin);
          return;
        }

        const isPromotion = chessLogic.value.isPromotionMove({
          fromAlgebraic,
          toAlgebraic,
        });
        if (isPromotion) {
          pendingMovedPiece = origin;
          promotionDialogActive.value = true;
        } else {
          const moveData = chessLogic.value.makeMove({
            fromAlgebraic,
            toAlgebraic,
            promotionFen: null,
          });
          lastMoveArrow.value = {
            fromFile: dndFromFile.value,
            fromRank: dndFromRank.value,
            toFile: dndToFile.value,
            toRank: dndToRank.value,
          };
          cancelDragAndDrop(origin);
          context.emit("move-done", {
            moveFan: ChessBoardLogic.convertSanToFan({
              moveSan: moveData.san,
              whiteMove: !chessLogic.value.isWhiteTurn,
            }),
            whiteMove: !chessLogic.value.isWhiteTurn,
          });
          repaintAll();
          emitGameFinishedIfPossible();
        }
      }
    }

    function commitPendingPromotion(promotionFen) {
      const fromAlgebraic = ChessBoardLogic.cellCoordinatesToAlgebraic({
        file: dndFromFile.value,
        rank: dndFromRank.value,
      });
      const toAlgebraic = ChessBoardLogic.cellCoordinatesToAlgebraic({
        file: dndToFile.value,
        rank: dndToRank.value,
      });
      const moveData = chessLogic.value.makeMove({
        fromAlgebraic,
        toAlgebraic,
        promotionFen: promotionFen,
      });

      lastMoveArrow.value = {
        fromFile: dndFromFile.value,
        fromRank: dndFromRank.value,
        toFile: dndToFile.value,
        toRank: dndToRank.value,
      };

      promotionDialogActive.value = false;
      cancelDragAndDrop(pendingMovedPiece);
      pendingMovedPiece = undefined;

      context.emit("move-done", {
        moveFan: ChessBoardLogic.convertSanToFan({
          moveSan: moveData.san,
          whiteMove: !chessLogic.value.isWhiteTurn,
        }),
      });

      emitGameFinishedIfPossible();
    }

    function drawArrow({ canvas }) {
      const paint = new Paint();
      paint.setColor(new Color("transparent"));
      paint.setStyle(Style.FILL);
      canvas.drawRect(createRect(0, 0, props.size, props.size), paint);
      
      if (!lastMoveArrow.value) return;
      paint.strokeWidth = cellsSize.value * 0.2;
      paint.setColor(new Color("lightblue"));

      const realOriginCol = props.reversed
        ? 7 - lastMoveArrow.value.fromFile
        : lastMoveArrow.value.fromFile;
      const realOriginRow = props.reversed
        ? lastMoveArrow.value.fromRank
        : 7 - lastMoveArrow.value.fromRank;
      const realDestCol = props.reversed
        ? 7 - lastMoveArrow.value.toFile
        : lastMoveArrow.value.toFile;
      const realDestRow = props.reversed
        ? lastMoveArrow.value.toRank
        : 7 - lastMoveArrow.value.toRank;
      const baseStartX = cellsSize.value * (1.0 + realOriginCol);
      const baseStartY = cellsSize.value * (1.0 + realOriginRow);
      const baseStopX = cellsSize.value * (1.0 + realDestCol);
      const baseStopY = cellsSize.value * (1.0 + realDestRow);
      const deltaX = baseStopX - baseStartX;
      const deltaY = baseStopY - baseStartY;
      const baseLineAngleRad = Math.atan2(deltaY, deltaX);
      const edge1AngleRad = baseLineAngleRad + 2.618;
      const edge2AngleRad = baseLineAngleRad + 3.665;
      const edge1StartX = baseStopX;
      const edge1StartY = baseStopY;
      const edge1StopX =
        baseStopX + cellsSize.value * Math.cos(edge1AngleRad) * 0.6;
      const edge1StopY =
        baseStopY + cellsSize.value * Math.sin(edge1AngleRad) * 0.6;

      const edge2StartX = baseStopX;
      const edge2StartY = baseStopY;
      const edge2StopX =
        baseStopX + cellsSize.value * Math.cos(edge2AngleRad) * 0.6;
      const edge2StopY =
        baseStopY + cellsSize.value * Math.sin(edge2AngleRad) * 0.6;

      canvas.drawLine(baseStartX, baseStartY, baseStopX, baseStopY, paint);
      canvas.drawLine(edge1StartX, edge1StartY, edge1StopX, edge1StopY, paint);
      canvas.drawLine(edge2StartX, edge2StartY, edge2StopX, edge2StopY, paint);
    }

    onMounted(repaintAll);

    watch(() => props.reversed, repaintAll);
    watch(() => props.size, repaintAll);

    return {
      coordinates,
      cells,
      pieces,
      chessLogic,
      prevDeltaX,
      prevDeltaY,
      onPan,
      coordinatesSize,
      whiteTurn,
      playerTurnLocation,
      playerTurnSize,
      playerTurnRadius,
      cellsSize,
      newGame,
      promotionDialogActive,
      commitPendingPromotion,
      drawArrow,
      lastMoveArrow,
      arrowZone,
    };
  },
};
</script>

<style scoped>
</style>
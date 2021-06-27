import Chess from "chess.js";

export default class ChessBoardLogic {
    logic = new Chess();

    get isWhiteTurn() {
        return this.logic.value.turn() === 'w';
    }

    getValueAtCell(cellAlgebraic) {
        return this.logic.get(cellAlgebraic);
    }

    static cellCoordinatesToAlgebraic({ file, rank }) {
        return (
          String.fromCharCode("a".charCodeAt(0) + file) +
          String.fromCharCode("1".charCodeAt(0) + rank)
        );
      }
}
import Chess from "chess.js";

export default class ChessBoardLogic {
  logic = new Chess();

  static cellCoordinatesToAlgebraic({ file, rank }) {
    return (
      String.fromCharCode("a".charCodeAt(0) + file) +
      String.fromCharCode("1".charCodeAt(0) + rank)
    );
  }

  get isWhiteTurn() {
    return this.logic.turn() === "w";
  }

  getValueAtCell(cellAlgebraic) {
    return this.logic.get(cellAlgebraic);
  }

  isLegalMove({ fromAlgebraic, toAlgebraic }) {
    const logicClone = new Chess(this.logic.fen());
    const result = logicClone.move({ from: fromAlgebraic, to: toAlgebraic });
    return result !== null;
  }

  makeMove({ fromAlgebraic, toAlgebraic, promotionFen }) {
    if (promotionFen) {
      const promotionFenLowercase = promotionFen?.toLowerCase();
      const result = this.logic.move({
        from: fromAlgebraic,
        to: toAlgebraic,
        promotion: promotionFenLowercase
      });
      return result;
    } else {
      const result = this.logic.move({
        from: fromAlgebraic,
        to: toAlgebraic
      });
      return result;
    }
  }
}

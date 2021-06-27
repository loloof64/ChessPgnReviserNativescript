import Chess from "chess.js";

export default class ChessBoardLogic {
  logic = new Chess();

  static cellCoordinatesToAlgebraic({ file, rank }) {
    return (
      String.fromCharCode("a".charCodeAt(0) + file) +
      String.fromCharCode("1".charCodeAt(0) + rank)
    );
  }

  static coordinatesFromAlgebraic(cellAlgebraic) {
    const file = cellAlgebraic.charCodeAt(0) - "a".charCodeAt(0);
    const rank = cellAlgebraic.charCodeAt(1) - "1".charCodeAt(0);

    return { file, rank };
  }

  get isWhiteTurn() {
    return this.logic.turn() === "w";
  }

  isPlayerInTurnPieceAtCell(cellAlgebraic) {
    return this.logic.get(cellAlgebraic)?.color === this.logic.turn();
  }

  getValueAtCell(cellAlgebraic) {
    return this.logic.get(cellAlgebraic);
  }

  isPromotionMove({ fromAlgebraic, toAlgebraic }) {
    if (!this.isLegalMove({ fromAlgebraic, toAlgebraic })) return;
    const piece = this.getValueAtCell(fromAlgebraic);
    if (piece?.type != "p") return;
    const { rank: fromRank } = ChessBoardLogic.coordinatesFromAlgebraic(
      fromAlgebraic
    );
    const { rank: toRank } = ChessBoardLogic.coordinatesFromAlgebraic(
      toAlgebraic
    );

    return (
      (this.isWhiteTurn && fromRank === 6 && toRank === 7) ||
      (!this.isWhiteTurn &&
        fromRank === 1 &&
        toRank === (this.isWhiteTurn && fromRank === 6 && toRank === 0))
    );
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

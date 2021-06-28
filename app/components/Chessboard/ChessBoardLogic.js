import Chess from "chess.js";

const EMPTY_POSITION_FEN = "8/8/8/8/8/8/8/8 w - - 0 1";

export default class ChessBoardLogic {
  
  constructor(positionFen = EMPTY_POSITION_FEN) {
    this.logic = new Chess(positionFen);
  }

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
    if (!this.isLegalMove({ fromAlgebraic, toAlgebraic })) return false;
    const pieceType = this.getValueAtCell(fromAlgebraic)?.type;
    if (pieceType !== "p") return false;
    const { rank: fromRank } = ChessBoardLogic.coordinatesFromAlgebraic(
      fromAlgebraic
    );
    const { rank: toRank } = ChessBoardLogic.coordinatesFromAlgebraic(
      toAlgebraic
    );

    return (
      (this.isWhiteTurn && fromRank === 6 && toRank === 7) ||
      (!this.isWhiteTurn && fromRank === 1 && toRank === 0)
    );
  }

  isLegalMove({ fromAlgebraic, toAlgebraic }) {
    const logicClone = new Chess(this.logic.fen());
    const result = logicClone.move({
      from: fromAlgebraic,
      to: toAlgebraic,
      promotion: "q"
    });
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

  get isCheckmate() {
    return this.logic.in_checkmate();
  }

  get isStalemate() {
    return this.logic.in_stalemate();
  }

  get isInThreeFoldRepetition() {
    return this.logic.in_threefold_repetition();
  }

  get isInsufficientMaterial() {
    return this.logic.insufficient_material();
  }

  get isFiftyMovesDraw() {
    return !this.logic.insufficient_material() && this.logic.in_draw();
  }
}

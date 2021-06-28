import Chess from "chess.js";

const EMPTY_POSITION_FEN = "8/8/8/8/8/8/8/8 w - - 0 1";
const PIECES_CHARS = [
  "P",
  "N",
  "B",
  "R",
  "Q",
  "K",
  "p",
  "n",
  "b",
  "r",
  "q",
  "k"
];

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

  static convertSanToFan({ moveSan, whiteMove }) {
    let moveFan = moveSan;
    const firstPieceIndex = moveFan.indexOf(elt =>
      PIECES_CHARS.includes(elt)
    );
    if (firstPieceIndex >= 0) {
      const firstPart = moveFan.substring(0, firstPieceIndex);
      let middlePart;
      const lastPart = moveFan.substring(firstPieceIndex + 1);
      const charToConvert = moveFan.charAt(firstPieceIndex).toLowerCase();

      switch (charToConvert) {
        case "k":
          middlePart = whiteMove ? "\u2654" : "\u265a";
          break;
        case "q":
          middlePart = whiteMove ? "\u2655" : "\u265b";
          break;
        case "r":
          middlePart = whiteMove ? "\u2656" : "\u265c";
          break;
        case "b":
          middlePart = whiteMove ? "\u2657" : "\u265d";
          break;
        case "n":
          middlePart = whiteMove ? "\u2658" : "\u265e";
          break;
        default:
          throw "Not a recognized piece " + charToConvert + " !";
      }

      moveFan = firstPart + middlePart + lastPart;
    }
    return moveFan;
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

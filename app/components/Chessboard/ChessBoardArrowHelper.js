const radToDeg = 57.2958;

export default class ChessBoardArrowHelper {
  static getArrowBaseDataForMove({ moveData, boardReversed, cellSize }) {
    const { ax, ay, bx, by } = ChessBoardArrowHelper.getArrowCoordinatesForMove(
      {
        moveData,
        boardReversed,
        cellSize
      }
    );
    const halfThickness = cellSize * 0.08;

    const realAx = ax - halfThickness;
    const realAy = ay;
    const realBx = bx - halfThickness;
    const realBy = by;

    const vectX = realBx - realAx;
    const vectY = realBy - realAy;

    const angleRad = Math.atan2(vectY, vectX) - Math.PI / 2.0;
    const length = Math.sqrt(vectX * vectX + vectY * vectY);
    const angleDeg = angleRad * radToDeg;

    const left = realAx;
    const top = realAy;
    const width = 2 * halfThickness;
    const height = length;
    

    return {
      angleDeg,
      left,
      top,
      width,
      height,
    };
  }

  static getArrowLeftDataForMove({ moveData, boardReversed, cellSize }) {
    const { ax, ay, bx, by } = ChessBoardArrowHelper.getArrowCoordinatesForMove(
      {
        moveData,
        boardReversed,
        cellSize
      }
    );
    const halfThickness = cellSize * 0.08;

    const realAx = ax - halfThickness;
    const realAy = ay;
    const realBx = bx - halfThickness;
    const realBy = by;

    const vectX = realBx - realAx;
    const vectY = realBy - realAy;

    const angleRad =
      Math.atan2(vectY, vectX) - Math.PI / 2.0 - (3.5 * Math.PI) / 4.0;
    const angleDeg = angleRad * radToDeg;
    const length = Math.sqrt(vectX * vectX + vectY * vectY) * 0.4;

    const left = realBx;
    const top = realBy;
    const width = 2 * halfThickness;
    const height = length;

    return {
      angleDeg,
      left,
      top,
      width,
      height,
    };
  }

  static getArrowRightDataForMove({ moveData, boardReversed, cellSize }) {
    const { ax, ay, bx, by } = ChessBoardArrowHelper.getArrowCoordinatesForMove(
      {
        moveData,
        boardReversed,
        cellSize
      }
    );
    const halfThickness = cellSize * 0.08;

    const realAx = ax - halfThickness;
    const realAy = ay;
    const realBx = bx - halfThickness;
    const realBy = by;

    const vectX = realBx - realAx;
    const vectY = realBy - realAy;

    const angleRad =
      Math.atan2(vectY, vectX) - Math.PI / 2.0 + (3.5 * Math.PI) / 4.0;
    const angleDeg = angleRad * radToDeg;
    const length = Math.sqrt(vectX * vectX + vectY * vectY) * 0.4;

    const left = realBx;
    const top = realBy;
    const width = 2 * halfThickness;
    const height = length;

    return {
      angleDeg,
      left,
      top,
      width,
      height,
    };
  }

  static getArrowCoordinatesForMove({ moveData, boardReversed, cellSize }) {
    const fromCol = boardReversed ? 7 - moveData.fromFile : moveData.fromFile;
    const fromRow = boardReversed ? moveData.fromRank : 7 - moveData.fromRank;
    const toCol = boardReversed ? 7 - moveData.toFile : moveData.toFile;
    const toRow = boardReversed ? moveData.toRank : 7 - moveData.toRank;

    const ax = cellSize * (fromCol + 1.0);
    const ay = cellSize * (fromRow + 1.0);
    const bx = cellSize * (toCol + 1.0);
    const by = cellSize * (toRow + 1.0);

    return { ax, ay, bx, by };
  }
}

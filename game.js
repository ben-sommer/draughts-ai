/*
Board locations are represented by arrays of length 2

-- Index 0 --
0 - empty
1 - player 1
2 - player 2

-- Index 1 --
false - regular
true - king
*/

exports.DraughtsGame = class DraughtsGame {
  constructor() {
    this.setup();
  }

  setup() {
    const alternatingOne = Array(8)
      .fill(null)
      .map((x, i) => [i % 2, false]);

    const alternatingTwo = Array(8)
      .fill(null)
      .map((x, i) => [(i % 2) * 2, false]);

    const empty = Array(8).fill([0, false]);

    this.board = [
      [...alternatingOne],
      [...alternatingOne.slice().reverse()],
      [...alternatingOne],
      [...empty],
      [...empty],
      [...alternatingTwo.slice().reverse()],
      [...alternatingTwo],
      [...alternatingTwo.slice().reverse()],
    ];
  }

  showBoard() {
    const p1 = "⬤";
    const p2 = "⭘";

    const output =
      "      0    1    2    3    4    5    6    7\n" +
      "    ┏━━━━┳━━━━┳━━━━┳━━━━┳━━━━┳━━━━┳━━━━┳━━━━┓\n" +
      this.board
        .map(
          (row, i) =>
            " " +
            i +
            "  ┃ " +
            row
              .map((x) => (x[0] === 1 ? p1 : x[0] === 2 ? p2 : " "))
              .join("  ┃ ") +
            "  ┃"
        )
        .join("\n    ┣━━━━╋━━━━╋━━━━╋━━━━╋━━━━╋━━━━╋━━━━╋━━━━┫\n") +
      "\n    ┗━━━━┻━━━━┻━━━━┻━━━━┻━━━━┻━━━━┻━━━━┻━━━━┛";

    console.log(output);
  }

  getPossibleMoves(player) {
    let possibleMoves = [];

    this.board.forEach((row, rowIndex) => {
      row.forEach((location, locationIndex) => {
        if (location[0] === player) {
          const possibleMovesForLocation = this.getPossibleMovesForLocation(
            rowIndex,
            locationIndex
          );
          possibleMoves.push(...possibleMovesForLocation);
        }
      });
    });

    return possibleMoves;
  }

  getPossibleMovesForLocation(rowIndex, locationIndex) {
    let possibleMoves = [];

    const location = this.board[rowIndex][locationIndex];

    this.getPossibleMovesForRegular(rowIndex, locationIndex, possibleMoves);

    const possibleMovesForLocation = [
      ...(location[1] || player === 2
        ? [
            [rowIndex - 1, locationIndex - 1],
            [rowIndex - 1, locationIndex + 1],
          ]
        : []),
      ...(location[1] || player === 1
        ? [
            [rowIndex + 1, locationIndex - 1],
            [rowIndex + 1, locationIndex + 1],
          ]
        : []),
    ];

    possibleMovesForLocation.forEach(([newRowIndex, newLocationIndex]) => {
      if (
        this.isValidMove(rowIndex, locationIndex, newRowIndex, newLocationIndex)
      ) {
        possibleMoves.push([
          [rowIndex, locationIndex],
          [newRowIndex, newLocationIndex],
        ]);
      }
    });

    return possibleMoves;
  }

  isValidMove(rowIndex, locationIndex, newRowIndex, newLocationIndex, player) {
    if (
      newRowIndex < 0 ||
      newRowIndex > 7 ||
      newLocationIndex < 0 ||
      newLocationIndex > 7 ||
      rowIndex < 0 ||
      rowIndex > 7 ||
      locationIndex < 0 ||
      locationIndex > 7
    ) {
      return false;
    }

    const location = this.board[rowIndex][locationIndex];

    if (location[0] !== player) {
      return false;
    }

    const newLocation = this.board[newRowIndex][newLocationIndex];

    if (newLocation[0] !== 0) {
      return false;
    }

    if (
      Math.abs(rowIndex - newRowIndex) === 2 &&
      Math.abs(locationIndex - newLocationIndex) === 2
    ) {
      const possibleMovesForLocation = [
        ...(location[1] || player === 2
          ? [
              [rowIndex - 2, locationIndex - 2],
              [rowIndex - 2, locationIndex + 2],
            ]
          : []),
        ...(location[1] || player === 1
          ? [
              [rowIndex + 2, locationIndex - 2],
              [rowIndex + 2, locationIndex + 2],
            ]
          : []),
      ];

      if (
        !possibleMovesForLocation.filter(
          (x) => x[0] === newRowIndex && x[1] === newLocationIndex
        ).length
      ) {
        return false;
      }

      const midRowIndex = (rowIndex + newRowIndex) / 2;
      const midLocationIndex = (locationIndex + newLocationIndex) / 2;

      const midLocation = this.board[midRowIndex][midLocationIndex];

      if (midLocation[0] === player || midLocation[0] === 0) {
        return false;
      }

      return true;
    } else {
      const possibleMovesForLocation = [
        ...(location[1] || player === 2
          ? [
              [rowIndex - 1, locationIndex - 1],
              [rowIndex - 1, locationIndex + 1],
            ]
          : []),
        ...(location[1] || player === 1
          ? [
              [rowIndex + 1, locationIndex - 1],
              [rowIndex + 1, locationIndex + 1],
            ]
          : []),
      ];

      if (
        !possibleMovesForLocation.filter(
          (x) => x[0] === newRowIndex && x[1] === newLocationIndex
        ).length
      ) {
        return false;
      }

      if (
        Math.abs(rowIndex - newRowIndex) !== 1 ||
        Math.abs(locationIndex - newLocationIndex) !== 1
      ) {
        return false;
      }

      return true;
    }
  }

  move(rowIndex, locationIndex, newRowIndex, newLocationIndex, player) {
    if (
      !this.isValidMove(
        rowIndex,
        locationIndex,
        newRowIndex,
        newLocationIndex,
        player
      )
    ) {
      return false;
    }

    if (
      Math.abs(rowIndex - newRowIndex) === 2 &&
      Math.abs(locationIndex - newLocationIndex) === 2
    ) {
      this.board[newRowIndex][newLocationIndex] =
        this.board[rowIndex][locationIndex];
      this.board[rowIndex][locationIndex] = [0, false];
      this.board[(rowIndex + newRowIndex) / 2][
        (locationIndex + newLocationIndex) / 2
      ] = [0, false];
    } else {
      this.board[newRowIndex][newLocationIndex] =
        this.board[rowIndex][locationIndex];
      this.board[rowIndex][locationIndex] = [0, false];
    }
    return true;
  }
};

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
  constructor(board, score, turn) {
    this.score = score !== undefined ? score : [0, 0]; // [player 1, player 2] number of captured counters
    this.turn = turn !== undefined ? turn : 1; // 1 or 2
    this.multipleCapture = false;
    this.multipleCapturePoint = [0, 0];

    const alternatingOne = Array(8)
      .fill(null)
      .map((x, i) => [i % 2, false]);

    const alternatingTwo = Array(8)
      .fill(null)
      .map((x, i) => [(i % 2) * 2, false]);

    const empty = Array(8).fill([0, false]);

    this.board =
      board !== undefined
        ? board
        : [
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

  get evaluation() {
    return this.score[0] - this.score[1];
  }

  get isGameOver() {
    return (
      (this.getPossibleMoves(1).length === 0 && this.turn == 1) ||
      (his.getPossibleMoves(2).length === 0 && this.turn == 2)
    );
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
            locationIndex,
            player
          );
          possibleMoves.push(...possibleMovesForLocation);
        }
      });
    });

    return possibleMoves;
  }

  getPossibleMovesForLocation(rowIndex, locationIndex, player) {
    let possibleMoves = [];

    const location = this.board[rowIndex][locationIndex];

    const possibleMovesForLocation = [
      ...(location[1] || player === 2
        ? [
            [rowIndex - 1, locationIndex - 1],
            [rowIndex - 1, locationIndex + 1],
            [rowIndex - 2, locationIndex - 2],
            [rowIndex - 2, locationIndex + 2],
          ]
        : []),
      ...(location[1] || player === 1
        ? [
            [rowIndex + 1, locationIndex - 1],
            [rowIndex + 1, locationIndex + 1],
            [rowIndex + 2, locationIndex - 2],
            [rowIndex + 2, locationIndex + 2],
          ]
        : []),
    ];

    possibleMovesForLocation.forEach(([newRowIndex, newLocationIndex]) => {
      if (
        this.isValidMove(
          rowIndex,
          locationIndex,
          newRowIndex,
          newLocationIndex,
          player
        )
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

    if (player !== this.turn) {
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
      this.multipleCapture &&
      (this.multipleCapturePoint[0] != rowIndex ||
        this.multipleCapturePoint[1] != locationIndex)
    ) {
      return false;
    }

    if (
      Math.abs(rowIndex - newRowIndex) === 2 &&
      Math.abs(locationIndex - newLocationIndex) === 2
    ) {
      const possibleMovesForLocation = [
        ...(location[1] || player === 2
          ? [
              [rowIndex - 1, locationIndex - 1],
              [rowIndex - 1, locationIndex + 1],
              [rowIndex - 2, locationIndex - 2],
              [rowIndex - 2, locationIndex + 2],
            ]
          : []),
        ...(location[1] || player === 1
          ? [
              [rowIndex + 1, locationIndex - 1],
              [rowIndex + 1, locationIndex + 1],
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
              [rowIndex - 2, locationIndex - 2],
              [rowIndex - 2, locationIndex + 2],
            ]
          : []),
        ...(location[1] || player === 1
          ? [
              [rowIndex + 1, locationIndex - 1],
              [rowIndex + 1, locationIndex + 1],
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

      this.score[player - 1] += 1;

      const nextMoves = this.getPossibleMoves(player).filter(
        (x) =>
          Math.abs(x[0][0] - x[1][0]) === 2 && Math.abs(x[0][1] - x[1][1]) === 2
      );

      if (nextMoves.length === 0) {
        this.turn = 3 - player;
        this.multipleCapture = false;
      } else {
        this.multipleCapture = true;
        this.multipleCapturePoint = [newRowIndex, newLocationIndex];
      }
    } else {
      this.board[newRowIndex][newLocationIndex] =
        this.board[rowIndex][locationIndex];
      this.board[rowIndex][locationIndex] = [0, false];
      this.turn = 3 - player;
      this.multipleCapture = false;
    }
    return true;
  }

  copy() {
    return new DraughtsGame(this.board, this.score, this.turn);
  }

  minimax(depth, player) {
    // Player 1 is the maximising player
    if (depth == 0 || this.isGameOver) return this.evaluation;

    if (player == 1) {
      let maxEval = -Infinity;
      const moves = this.getPossibleMoves(player);
      for (const move of moves) {
        const newGame = this.copy();
        newGame.move(move[0][0], move[0][1], move[1][0], move[1][1], player);
        return Math.max(maxEval, newGame.minimax());
      }
    }
  }
};

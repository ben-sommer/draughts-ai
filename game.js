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
      alternatingOne,
      alternatingOne.slice().reverse(),
      alternatingOne,
      empty,
      empty,
      alternatingTwo.slice().reverse(),
      alternatingTwo,
      alternatingTwo.slice().reverse(),
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

};

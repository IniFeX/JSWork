import store from "@/store";

export function getValidAttacks(index, board) {
  const moves = [];
  const direction =
    board[index].checkerColor === "white-checker" ? -1 : 1;
  const potentialAttacks = [
    index + direction * 14,
    index + direction * 18,
    index + direction * -14,
    index + direction * -18,
  ];
  potentialAttacks.forEach((move) => {
    if (isValidMove(index, move, board)) {
      moves.push(move);
    }
  });

  return moves;
}

export function getValidMoves(index, board) {
  const moves = [];
  const direction =
    board[index].checkerColor === "white-checker" ? -1 : 1;
  const potentialMoves = [index + direction * 7, index + direction * 9];
  const potentialAttacks = [
    index + direction * 14,
    index + direction * 18,
    index + direction * -14,
    index + direction * -18,
  ];
  potentialAttacks.forEach((move) => {
    if (isValidMove(index, move, board)) {
      moves.push(move);
    }
  });

  if (moves.length <= 0) {
    potentialMoves.forEach((move) => {
      if (isValidMove(index, move, board)) {
        moves.push(move);
      }
    });
  }

  return moves;
}

export function isValidMove(startIndex, endIndex, board) {
  if (endIndex < 0 || endIndex >= 64) return false;
  if (board[endIndex].hasChecker) return false;

  const rowDiff = Math.floor(endIndex / 8) - Math.floor(startIndex / 8);
  const colDiff = (endIndex % 8) - (startIndex % 8);
  const direction =
    board[startIndex].checkerColor === "white-checker" ? -1 : 1;
  if (
    Math.abs(rowDiff) === 1 &&
    Math.abs(colDiff) === 1
    // && rowDiff === direction
  ) {
    return true;
  } else if (Math.abs(rowDiff) === 2 && Math.abs(colDiff) === 2) {
    const middleIndex = (endIndex + startIndex) / 2;
    if (
      board[middleIndex].hasChecker &&
      board[middleIndex].checkerColor !==
      board[startIndex].checkerColor
    ) {
      return true;
    }
  }
  return false;
}

function isValidQueenMove(startIndex, endIndex, board, isAttack) {
  if (endIndex < 0 || endIndex >= 64) return false;
  if (board[endIndex].hasChecker) return false;

  let desiredColor;
  if (store.state.currentPlayer === "white-checker"){
    desiredColor = "black-checker";
  }
  else{
    desiredColor = "white-checker";
  }

  const rowDiff = Math.floor(endIndex / 8) - Math.floor(startIndex / 8);
  const colDiff = (endIndex % 8) - (startIndex % 8);

  if (Math.abs(rowDiff) === Math.abs(colDiff)) {
    const rowDirection = rowDiff > 0 ? 1 : -1;
    const colDirection = colDiff > 0 ? 1 : -1;

    let currentRow = Math.floor(startIndex / 8) + rowDirection;
    let currentCol = startIndex % 8 + colDirection;
    let blackCheckerCount = 0;

    while (currentRow !== Math.floor(endIndex / 8) && currentCol !== endIndex % 8) {
      const currentIndex = currentRow * 8 + currentCol;
      if (board[currentIndex].hasChecker) {
        if (board[currentIndex].checkerColor === desiredColor) {
          blackCheckerCount++;
        } else {
          return false;
        }
      }
      currentRow += rowDirection;
      currentCol += colDirection;
    }

    if (blackCheckerCount === 1 && isAttack) {
      return true;
    } else if (blackCheckerCount === 0 && !isAttack) {
      return true;
    }
  }

  return false;
}

export function isUnderAttack(board, isQueen) {
  const blackCheckers = [];
  const whiteCheckers = [];
  const whiteQueen = [];
  const blackQueen = [];
  for (let i = 0; i < board.length; i++) {
    if (board[i].checkerColor === "black-checker" && board[i].hasChecker) {
      blackCheckers.push(board[i]);
      if (board[i].isQueen) {
        blackQueen.push(board[i]);
      }
    } else if (board[i].checkerColor === "white-checker" && board[i].hasChecker) {
      whiteCheckers.push(board[i]);
      if (board[i].isQueen) {
        whiteQueen.push(board[i]);
      }
    }
  }

  // console.log(whiteQueen);
  // console.log(`Black Queens: ${blackQueen}`);

  let validBlackCheckers = [];
  let validWhiteCheckers = [];
  const validQueenBlackCheckers = [];
  const validQueenWhiteCheckers = [];

  for (let i = 0; i < blackCheckers.length; i++) {
    if (getValidAttacks(blackCheckers[i].index, board).length > 0) {
      validBlackCheckers.push(blackCheckers[i].index);
    }
  }
  for (let i = 0; i < whiteCheckers.length; i++) {
    if (getValidAttacks(whiteCheckers[i].index, board).length > 0) {
      validWhiteCheckers.push(whiteCheckers[i].index);
    }
  }
  console.log("quen chec from unser atac: ");
  // console.log(blackQueen)
  for (let i = 0; i < blackQueen.length; i++) {
    if (getValidQueenAttack(blackQueen[i].index, board).length > 0) {
      validQueenBlackCheckers.push(blackQueen[i].index);
    }
  }
  for (let i = 0; i < whiteQueen.length; i++) {
    if (getValidQueenAttack(whiteQueen[i].index, board).length > 0) {
      validQueenWhiteCheckers.push(whiteQueen[i].index);
    }
  }
  console.log(validWhiteCheckers)
  console.log(validBlackCheckers)
  validBlackCheckers = validBlackCheckers.concat(validQueenWhiteCheckers);
  validWhiteCheckers = validWhiteCheckers.concat(validQueenBlackCheckers);


  console.log(validBlackCheckers);
  console.log(validWhiteCheckers);

  // console.log(validWhiteCheckers)

  return [validBlackCheckers, validWhiteCheckers];
}

export function getValidQueenMoves(index, board) {
  const moves = [];

  const potentialQueenMoves = [];
  const potentialDirections = [7, 9, -7, -9]
  let poten = [];
  for (let i = 1; i <= 6; i++) {
    // const leftUpDir = 7;
    // const rightUpDir = 9;
    // const leftDownDir = -7;
    // const rightDownDir = -9;
    // // const
    for (let dir of potentialDirections) {
      potentialQueenMoves.push(index + dir * i);
      poten.push(dir * i)
    }
  }

  potentialQueenMoves.forEach((move) => {
    if (isValidQueenMove(index, move, board, true)) {
      moves.push(move);
    }
  });

  if (moves.length <= 0) {
    potentialQueenMoves.forEach((move) => {
      if (isValidQueenMove(index, move, board, false)) {
        moves.push(move);
      }
    });
  }
  // console.log(moves)
  // console.log("index: " + index)
  return moves;
}
export function getValidQueenAttack(index, board) {
  const moves = [];

  const potentialQueenMoves = [];
  const potentialDirections = [7, 9, -7, -9]
  let poten = [];
  for (let i = 1; i <= 6; i++) {
    // const leftUpDir = 7;
    // const rightUpDir = 9;
    // const leftDownDir = -7;
    // const rightDownDir = -9;
    // // const
    for (let dir of potentialDirections) {
      potentialQueenMoves.push(index + dir * i);
      poten.push(dir * i)
    }
  }

  potentialQueenMoves.forEach((move) => {
    if (isValidQueenMove(index, move, board, true)) {
      moves.push(move);
    }
  });
  // console.log(moves)
  // console.log("index: " + index)
  return moves;
}
export function convert(index) {
  const id = [Math.floor(index / 8), index % 8];
  return id;
}
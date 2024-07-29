export class Rules {
    constructor(board) {
      this.board = board;
    }
    checkWin() {}
  
    isCorrect() {}
  
    getAvailableMove(checkers, state) {
      const color = state === "firstClick" ? checkers.color : checkers[0].color;
      const direction = color === "white" ? -1 : 1;
  
      return state === "noClick"
        ? this.getAvailableMove_NoClick(checkers, direction)
        : this.getAvailableMove_FirstClick(checkers, direction);
    }
  
    getAvailableMove_NoClick(checkers, direction) {
      return checkers.reduce((availableMove, checker) => {
        const [i, j] = checker.positions;
        const newI = i + direction;
        const moves = [
          [newI, j + 1],
          [newI, j - 1]
        ].filter(([x, y]) => x >= 0 && x < 8 && y >= 0 && y < 8 && !this.board.cells[x][y].checker);
  
        return availableMove.concat(moves.map(([x, y]) => [x - direction, j]));
      }, []);
    }
    
    getAvailableMove_FirstClick(checker, direction) {
      const [i, j] = checker.positions;
      const newI = i + direction;
      const moves = [
        [newI, j + 1],
        [newI, j - 1]
      ].filter(([x, y]) => x >= 0 && x < 8 && y >= 0 && y < 8 && !this.board.cells[x][y].checker);
  
      return moves;
    }
  
    // checkIfUnderAttack(checkers) {
    //   return checkers.some(checker => {
    //     const possibleMoves = this.getPossibleAttacks(checker);
    //     return possibleMoves;
    //   });
    // }
  
    getPossibleAttacks(checker, state) {
      const [i, j] = checker.positions;
      const directions = [
        [1, 1], [1, -1], [-1, 1], [-1, -1]
      ];
      let possibleAttacks = [];
  
      for (let [dx, dy] of directions) {
        const newI = i + dx * 2;
        const newJ = j + dy * 2;
        const middleI = i + dx;
        const middleJ = j + dy;
  
        if (this.isValidPosition(newI, newJ) &&
            this.board.cells[middleI][middleJ].checker &&
            this.board.cells[middleI][middleJ].checker.color !== checker.color &&
            !this.board.cells[newI][newJ].checker) {
          if(state === "noClick") possibleAttacks.push([i,j]);    
          else if(state === "firstClick") possibleAttacks.push([newI, newJ]);
          else if(state === "secondClick") possibleAttacks.push([middleI, middleJ]);
        }
      }
      //console.log(possibleAttacks);
      if(possibleAttacks.length > 0) return possibleAttacks;
    }
  
    isValidPosition(x, y) {
      return x >= 0 && x < 8 && y >= 0 && y < 8;
    }
  
}
  
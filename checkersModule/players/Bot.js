import { Rules } from "../rules/Rules.js";
import { CommonChecker } from "../checker/CommonChecker.js";

export class Bot {
  constructor(blackCheckers, rules) {
    this.blackCheckers = blackCheckers;
    this.rules = rules;
    this.clickStates = {
      noClick: "noClick",
      firstClick: "firstClick",
      secondClick: "secondClick",
    };
    this.currentState = this.clickStates.noClick;
  }

  beat(underAttack) {
    const randomMoveIndex = Math.floor(Math.random() * underAttack.length);
    const [i, j] = underAttack[randomMoveIndex];
    const checker = this.blackCheckers.find(
      (c) => c.positions[0] === i && c.positions[1] === j
    );

    const getPossibleAttack = this.rules.getPossibleAttacks(
      checker,
      "firstClick"
    );
    const randomPossibleAttackIndex = Math.floor(
      Math.random() * getPossibleAttack.length
    );
    const [newI, newJ] = getPossibleAttack[randomPossibleAttackIndex];

    const defeatedWhiteChecker = [(i + newI) / 2, (j + newJ) / 2];

    checker.positions = [newI, newJ];
    console.log(checker);
    this.rules.board.cells[i][j].checker = false;
    this.rules.board.cells[newI][newJ].checker = checker;

    const oldField = document.getElementById(`field_${i}_${j}`);
    const checkerElement = document.getElementById(`checker_${i}_${j}`);
    oldField.removeChild(checkerElement);

    const newField = document.getElementById(`field_${newI}_${newJ}`);
    checkerElement.id = `checker_${newI}_${newJ}`;
    newField.appendChild(checkerElement);

    const whiteElem = document.getElementById(
      `checker_${defeatedWhiteChecker[0]}_${defeatedWhiteChecker[1]}`
    );
    const whiteField = document.getElementById(
      `field_${defeatedWhiteChecker[0]}_${defeatedWhiteChecker[1]}`
    );
    whiteField.removeChild(whiteElem);

    return defeatedWhiteChecker;
  }

  beatRec(i, j) {
    const checker = this.blackCheckers.find(
      (c) => c.positions[0] === i && c.positions[1] === j
    );

    const getPossibleAttack = this.rules.getPossibleAttacks(
      checker,
      "firstClick"
    );
    const randomPossibleAttackIndex = Math.floor(
      Math.random() * getPossibleAttack.length
    );
    const [newI, newJ] = getPossibleAttack[randomPossibleAttackIndex];

    const defeatedWhiteChecker = [(i + newI) / 2, (j + newJ) / 2];

    checker.positions = [newI, newJ];
    console.log(checker);
    this.rules.board.cells[i][j].checker = false;
    this.rules.board.cells[newI][newJ].checker = checker;

    const oldField = document.getElementById(`field_${i}_${j}`);
    const checkerElement = document.getElementById(`checker_${i}_${j}`);
    oldField.removeChild(checkerElement);

    const newField = document.getElementById(`field_${newI}_${newJ}`);
    checkerElement.id = `checker_${newI}_${newJ}`;
    newField.appendChild(checkerElement);

    const whiteElem = document.getElementById(
      `checker_${defeatedWhiteChecker[0]}_${defeatedWhiteChecker[1]}`
    );
    const whiteField = document.getElementById(
      `field_${defeatedWhiteChecker[0]}_${defeatedWhiteChecker[1]}`
    );
    whiteField.removeChild(whiteElem);

    let check = this.rules.getPossibleAttacks(checker, "firstClick");
    console.log(checker);
    if (check) {
      return this.beatRec(newI, newJ);
    } else return defeatedWhiteChecker;
  }

  move() {
    // let checkAttack = false;
    // for(let state in this.clickStates){
    //   let underAttack = this.rules.getPossibleAttacks(this.blackCheckers, state);
    //   if(underAttack) checkAttack = true;
    // }
    //let underAttack = this.rules.getPossibleAttacks(this.blackCheckers, "noClick");
    let underAttack = [];
    for (let checker of this.blackCheckers) {
      let move = this.rules.getPossibleAttacks(checker, "noClick");
      if (move) underAttack = underAttack.concat(move);
    }

    if (underAttack.length > 0) {
      let whitePos = this.beat(underAttack);
      return whitePos;
    }
    console.log("move");
    const availableMoves = this.rules.getAvailableMove(
      this.blackCheckers,
      "noClick"
    );
    const randomMoveIndex = Math.floor(Math.random() * availableMoves.length);
    const [i, j] = availableMoves[randomMoveIndex];

    const checker = this.blackCheckers.find(
      (c) => c.positions[0] === i && c.positions[1] === j
    );

    const moves = this.rules.getAvailableMove_FirstClick(checker, 1);
    const [newI, newJ] = moves[Math.floor(Math.random() * moves.length)];

    checker.positions = [newI, newJ];
    this.rules.board.cells[i][j].checker = false;
    this.rules.board.cells[newI][newJ].checker = checker;

    const oldField = document.getElementById(`field_${i}_${j}`);
    const checkerElement = document.getElementById(`checker_${i}_${j}`);
    oldField.removeChild(checkerElement);

    const newField = document.getElementById(`field_${newI}_${newJ}`);
    checkerElement.id = `checker_${newI}_${newJ}`;
    newField.appendChild(checkerElement);
  }
}

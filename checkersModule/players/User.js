import { Rules } from "../rules/Rules.js";
import { CommonChecker } from "../checker/CommonChecker.js";
import { convert } from "../helpers/convert.js";

export class User {
  constructor(whiteCheckers, rules) {
    this.whiteCheckers = whiteCheckers;
    this.rules = rules;
    this.clickStates = {
      noClick: "noClick",
      firstClick: "firstClick",
      secondClick: "secondClick",
    };
    this.currentState = this.clickStates.noClick;
  }

  beat(state, checker, clickPositions) {
    let underAttack = [];

    switch (state) {
      case this.clickStates.noClick:
        for (let checker of this.whiteCheckers) {
          let move = this.rules.getPossibleAttacks(checker, this.currentState);
          //console.log(move);
          if (move) underAttack = underAttack.concat(move);
        }
        // console.log(underAttack);
        if (underAttack.length > 0) {
          // console.log('if');
          this.highlight(underAttack, this.clickStates.noClick);
          return underAttack;
        }
        break;
      case this.clickStates.firstClick:
        let move = this.rules.getPossibleAttacks(checker, this.currentState);
        if (move) underAttack = underAttack.concat(move);
        if (underAttack.length > 0) {
          this.highlight(underAttack, this.clickStates.firstClick);
        }
        return underAttack;
        break;
      case this.clickStates.secondClick:
        const averagePos = [
          (clickPositions[0] + checker.positions[0]) / 2,
          (clickPositions[1] + checker.positions[1]) / 2,
        ];
        console.log("Черная шашка находится в: \n");
        // console.log(averagePos);

        let field, checker2;
        const currentBlackChecker = new CommonChecker("black", averagePos);
        // console.log(currentBlackChecker.positions);
        // console.log(this.rules.board.cells[averagePos[0]][averagePos[1]].checker.positions);
        for (let i = 0; i < this.rules.board.cells.length; i++) {
          for (let j = 0; j < this.rules.board.cells.length; j++) {
            if (
              this.rules.board.cells[i][j].checker &&
              currentBlackChecker.positions[0] ===
                this.rules.board.cells[i][j].checker.positions[0] &&
              currentBlackChecker.positions[1] ===
                this.rules.board.cells[i][j].checker.positions[1]
            ) {
              // console.log("Succes");
              this.rules.board.cells[i][j].checker = false;
              field = document.getElementById(`field_${i}_${j}`);
              checker2 = document.getElementById(`checker_${i}_${j}`);
              field.removeChild(checker2);
            }
          }
        }
        return averagePos;
        break;
      default:
        break;
    }
  }

  move() {
    return new Promise((resolve) => {
      const fields = document.getElementById("fields");
      let availableMove = this.rules.getAvailableMove(
        this.whiteCheckers,
        this.currentState
      );
      let availableMove2;
      let currentChecker;
      // console.log(availableMove);
      this.highlight(availableMove, this.currentState);
      let availableMoveAttack = this.beat(this.currentState);
      if (availableMoveAttack) {
        availableMove = availableMoveAttack;
      }
      const handleClick = (event) => {
        let target = event.target;
        let clickPositions = convert(target, "index");
        if (!clickPositions) return;

        switch (this.currentState) {
          case this.clickStates.noClick:
            let check = availableMove.some(
              (one) =>
                one[0] === clickPositions[0] && one[1] === clickPositions[1]
            );
            if (!check) return;

            this.currentState = this.clickStates.firstClick;
            currentChecker = this.whiteCheckers.find(
              (item) =>
                item.positions[0] === clickPositions[0] &&
                item.positions[1] === clickPositions[1]
            );

            if (availableMoveAttack) {
              availableMove2 = this.beat(this.currentState, currentChecker);
              return;
            }

            availableMove2 = this.rules.getAvailableMove(
              currentChecker,
              this.currentState
            );
            this.highlight(availableMove2, this.currentState);
            break;

          case this.clickStates.firstClick:
            let check2 = availableMove2.some(
              (one) =>
                one[0] === clickPositions[0] && one[1] === clickPositions[1]
            );
            if (!check2) return;

            this.currentState = this.clickStates.secondClick;

            let blackCheckerPosition;
            if (availableMoveAttack) {
              blackCheckerPosition = this.beat(
                this.currentState,
                currentChecker,
                clickPositions
              );
            }
            this.updateBoard(currentChecker, clickPositions);

            this.currentState = this.clickStates.noClick;

            fields.removeEventListener("click", handleClick);
            resolve(blackCheckerPosition);
            break;
          default:
            break;
        }
      };

      fields.addEventListener("click", handleClick);
    });
  }

  updateBoard(currentChecker, clickPositions) {
    let desiredChecker = currentChecker;
    desiredChecker.positions[0] = clickPositions[0];
    desiredChecker.positions[1] = clickPositions[1];

    for (let i = 0; i < this.whiteCheckers.length; i++) {
      if (currentChecker === this.whiteCheckers[i]) {
        this.whiteCheckers[i].positions[0] = clickPositions[0];
        this.whiteCheckers[i].positions[1] = clickPositions[1];
      }
    }

    let field, fieldDesired, checker;
    let pos;
    for (let i = 0; i < this.rules.board.cells.length; i++) {
      for (let j = 0; j < this.rules.board.cells.length; j++) {
        if (currentChecker === this.rules.board.cells[i][j].checker) {
          this.rules.board.cells[i][j].checker = false;
          field = document.getElementById(`field_${i}_${j}`);
          checker = document.getElementById(`checker_${i}_${j}`);
          field.removeChild(checker);
        }
        if (i === clickPositions[0] && j === clickPositions[1]) {
          this.rules.board.cells[i][j].checker = desiredChecker;
          fieldDesired = document.getElementById(`field_${i}_${j}`);
          pos = [i, j];
        }
      }
    }
    checker.id = `checker_${pos[0]}_${pos[1]}`;
    fieldDesired.appendChild(checker);
  }

  highlight(moves, state) {
    // console.log(fields);
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        const elem = document.getElementById(`field_${i}_${j}`);
        if (elem.style.backgroundColor === "aqua") {
          elem.style.backgroundColor = "gray";
        }
      }
    }
    switch (state) {
      case this.clickStates.noClick:
        let field;
        for (let i = 0; i < moves.length; i++) {
          field = moves[i];
          const elem = document.getElementById(`field_${field[0]}_${field[1]}`);
          elem.style.backgroundColor = "aqua";
        }
        break;
      // Проверить необходимость второго кейса
      case this.clickStates.firstClick:
        let fieldss;
        for (let i = 0; i < moves.length; i++) {
          fieldss = moves[i];
          const elem = document.getElementById(
            `field_${fieldss[0]}_${fieldss[1]}`
          );
          elem.style.backgroundColor = "aqua";
        }

        break;
      default:
        break;
    }
  }
}

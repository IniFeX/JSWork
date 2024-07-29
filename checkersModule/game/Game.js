import { Board } from "../board/Board.js";
import { Rules } from "../rules/Rules.js";
import { User } from "../players/User.js";
import { Bot } from "../players/Bot.js";
import { Cell } from "../board/Cell.js";
import { CommonChecker } from "../checker/CommonChecker.js";
import { convert } from "../helpers/convert.js";

export class Game {
  constructor() {
    this.board = null;
    this.user = null;
    this.bot = null;
    this.rules = null;
    this.gameState = {
      user: "user",
      bot: "bot",
    };
    this.currentState = this.gameState.user;
  }

  startGame() {
    this.generate()
      .then(() => this.nextMove())
      .catch((error) => console.error("Error initializing game:", error));
  }

  nextMove() {
    //console.log("nextMove");
    this.user
      .move()
      .then((pos) => {
        let desiredBlack;
        if (pos) {
          console.log(pos);
          desiredBlack = this.bot.blackCheckers.find(
            (item) =>
              item.positions[0] === pos[0] && item.positions[1] === pos[1]
          );

          for (let i = 0; i < this.bot.blackCheckers.length; i++) {
            if (desiredBlack === this.bot.blackCheckers[i]) {
              //console.log("succes2");
              this.bot.blackCheckers.splice(i, 1);
            }
          }
        }

        let whitePos = this.bot.move();
        if (whitePos) {
          let desiredWhite;
          console.log(whitePos);
          desiredWhite = this.user.whiteCheckers.find(
            (item) =>
              item.positions[0] === whitePos[0] &&
              item.positions[1] === whitePos[1]
          );

          for (let i = 0; i < this.user.whiteCheckers.length; i++) {
            if (desiredWhite === this.user.whiteCheckers[i]) {
              //console.log("succes2");
              this.rules.board.cells[whitePos[0]][whitePos[1]].checker = false;
              this.user.whiteCheckers.splice(i, 1);
            }
          }
        }
        this.nextMove();
      })
      .catch((error) => {
        console.error("Ошибка во время хода:", error);
      });
  }

  generate() {
    return new Promise((resolve, reject) => {
      document.addEventListener("DOMContentLoaded", () => {
        const fields = document.getElementById("fields");
        if (!fields) {
          reject(new Error("Элемент 'fields' не найден"));
          return;
        }

        const whiteCheckers = [];
        const blackCheckers = [];
        const cells = [];

        for (let i = 0; i < 8; i++) {
          const row = document.createElement("div");
          row.id = `row_${i}`;
          row.className = "row";
          fields.append(row);

          const rows = [];
          for (let j = 0; j < 8; j++) {
            const field = document.createElement("div");
            const checker = document.createElement("div");
            field.id = `field_${i}_${j}`;
            field.className = "field";
            row.append(field);

            const cell = new Cell([i, j], false);

            if ((i % 2 === 0 && j % 2 !== 0) || (i % 2 !== 0 && j % 2 === 0)) {
              field.style.backgroundColor = "gray";
              if (i < 3 || i > 4) {
                checker.id = `checker_${i}_${j}`;
                checker.className = "checker";
                checker.style.backgroundColor = i < 3 ? "black" : "white";
                const commonChecker = new CommonChecker(
                  i < 3 ? "black" : "white",
                  [i, j]
                );
                if (i < 3) blackCheckers.push(commonChecker);
                else whiteCheckers.push(commonChecker);
                cell.checker = commonChecker;
                field.append(checker);
              }
            }

            rows.push(cell);
          }
          cells.push(rows);
        }

        const board = new Board(cells);
        const rules = new Rules(board);
        this.rules = rules;
        this.board = board;
        this.user = new User(whiteCheckers, rules);
        this.bot = new Bot(blackCheckers, rules);

        console.log("Инициализация завершена");
        resolve();
      });
    });
  }
}

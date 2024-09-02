<template>
  <div
    :class="['checker', pieceColor, { selected: isSelected }]"
    @mousedown="selectChecker"
  ></div>
</template>

<script>
export default {
  props: {
    board: Array,
    pieceColor: String,
    isSelected: Boolean,
    pieceIndex: Number,
  },
  methods: {
    isUnderAttack() {
      const blackCheckers = [];
      const whiteCheckers = [];
      for (let i = 0; i < this.board.length; i++) {
        if (
          this.board[i].checkerColor === "black-checker" &&
          this.board[i].hasChecker
        ) {
          blackCheckers.push(this.board[i]);
        } else if (
          this.board[i].checkerColor === "white-checker" &&
          this.board[i].hasChecker
        ) {
          whiteCheckers.push(this.board[i]);
        }
      }

      const validBlackCheckers = [];
      const validWhiteCheckers = [];

      for (let i = 0; i < blackCheckers.length; i++) {
        if (this.getValidAttacks(blackCheckers[i].index).length > 0) {
          validBlackCheckers.push(blackCheckers[i].index);
        }
      }
      for (let i = 0; i < whiteCheckers.length; i++) {
        if (this.getValidAttacks(whiteCheckers[i].index).length > 0) {
          //validWhiteCheckers = validWhiteCheckers.concat()
          validWhiteCheckers.push(whiteCheckers[i].index);
        }
      }

      // console.log(validBlackCheckers);
      // console.log(validWhiteCheckers);
      return [validBlackCheckers, validWhiteCheckers];
    },

    getValidAttacks(index) {
      const moves = [];
      const direction =
        this.board[index].checkerColor === "white-checker" ? -1 : 1;
      const potentialAttacks = [
        index + direction * 14,
        index + direction * 18,
        index + direction * -14,
        index + direction * -18,
      ];
      potentialAttacks.forEach((move) => {
        if (this.isValidMove(index, move)) {
          moves.push(move);
        }
      });

      return moves;
    },
    isValidMove(startIndex, endIndex) {
      if (endIndex < 0 || endIndex >= 64) return false;
      if (this.board[endIndex].hasChecker) return false;

      const rowDiff = Math.floor(endIndex / 8) - Math.floor(startIndex / 8);
      const colDiff = (endIndex % 8) - (startIndex % 8);
      const direction =
        this.board[startIndex].checkerColor === "white-checker" ? -1 : 1;
      if (
        Math.abs(rowDiff) === 1 &&
        Math.abs(colDiff) === 1
        // && rowDiff === direction
      ) {
        return true;
      } else if (Math.abs(rowDiff) === 2 && Math.abs(colDiff) === 2) {
        const middleIndex = (endIndex + startIndex) / 2;
        if (
          this.board[middleIndex].hasChecker &&
          this.board[middleIndex].checkerColor !==
          this.board[startIndex].checkerColor
        ) {
          return true;
        }
      }
      return false;
    },

    getValidMoves(index) {
      const moves = [];
      const direction =
        this.board[index].checkerColor === "white-checker" ? -1 : 1;
      const potentialMoves = [index + direction * 7, index + direction * 9];
      const potentialAttacks = [
        index + direction * 14,
        index + direction * 18,
        index + direction * -14,
        index + direction * -18,
      ];
      potentialAttacks.forEach((move) => {
        if (this.isValidMove(index, move)) {
          moves.push(move);
        }
      });

      if (moves.length <= 0) {
        potentialMoves.forEach((move) => {
          if (this.isValidMove(index, move)) {
            moves.push(move);
          }
        });
      }

      return moves;
    },


    selectChecker() {
      let index = this.pieceIndex;
      const [validBlackCheckers, validWhiteCheckers] = this.isUnderAttack();
      // console.log(this.board)
      // console.log(this.selectedChecker);
      //let test = [index];
      //console.log(test);
      //console.log(validWhiteCheckers.includes(index));

      switch (this.$store.state.currentPlayer) {
        case "white-checker":
          if (
            validWhiteCheckers.length > 0 &&
            !validWhiteCheckers.includes(index)
          ) {
            return;
          }
          break;
        case "black-checker":
          if (
            validBlackCheckers.length > 0 &&
            !validBlackCheckers.includes(index)
          ) {
            return;
          }
          break;
        default:
          break;
      }
      let selectedChecker;
      let validMoves = [];
      if (
        this.board[index].hasChecker &&
        this.board[index].checkerColor === this.$store.state.currentPlayer
        // && this.board[index].checkerColor === "white-checker"
        //&& validWhiteCheckers.includes(index) && validWhiteCheckers.length > 0
      ) {
        selectedChecker = index;
        // console.log(this.isSelected);
        // console.log("selected:" + this.selectedChecker);
        // let selChecker = this.board.find((item) => item.index === index);
        // selChecker.id[0] = 3;

        validMoves = this.getValidMoves(index);

      } else {
        selectedChecker = null;
        validMoves = [];
      }
      console.log("true")
      this.$emit("selectPiece", validMoves, selectedChecker);
    },
  },
};
</script>

<style>
.checker {
  width: 60px;
  height: 60px;
  border-radius: 50%;
}

.black-checker {
  background-color: black;
}

.white-checker {
  background-color: white;
  border: 1px solid black;
}

.checker.selected {
  outline: 2px solid blue;
}
</style>

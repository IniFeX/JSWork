<template>
  <div
    :class="['checker', pieceColor, { selected: isSelected }]"
    @mousedown="selectChecker"
  >
<!--    <div class="circle"></div>-->
  </div>
</template>

<script>
import {getValidAttacks, getValidMoves, isValidMove, isUnderAttack, getValidQueenMoves} from "@/rules/rules.js"

export default {
  props: {
    board: Array,
    pieceColor: String,
    isSelected: Boolean,
    pieceIndex: Number,
    isQueen: Boolean,
  },
  methods: {

    selectChecker() {

      let index = this.pieceIndex;
      const [validBlackCheckers, validWhiteCheckers]
        = isUnderAttack(this.board);

      switch (this.$store.state.currentPlayer) {
        case "white-checker":
          if (
            validWhiteCheckers.length > 0 && !validWhiteCheckers.includes(index)
          ) {
            return;
          }
          break;
        case "black-checker":
          if (
            validBlackCheckers.length > 0 && !validBlackCheckers.includes(index)
          ) {
            return;
          }
          break;
        default:
          break;
      }
      let selectedChecker = null;
      let validMoves = [];
      const mode = this.$store.state.currentMode;

      if (
        this.board[index].hasChecker &&
        this.board[index].checkerColor === this.$store.state.currentPlayer
        // && this.board[index].checkerColor === "white-checker"
        //&& validWhiteCheckers.includes(index) && validWhiteCheckers.length > 0
      ) {
        if(mode === "bot" && this.board[index].checkerColor === "black-checker") {
          return;
        }
        selectedChecker = index;
        // console.log(this.isSelected);
        // console.log("selected:" + this.selectedChecker);
        // let selChecker = this.board.find((item) => item.index === index);
        // selChecker.id[0] = 3;

        validMoves = getValidQueenMoves(index, this.board);
        // console.log(validMoves)
      } else {
        selectedChecker = null;
        validMoves = [];
      }
      console.log("from queen " + this.isQueen)
      this.$store.commit('changeValidMoves', validMoves)
      this.$store.commit('changeSelectedChecker', selectedChecker);
      //return [validMoves, selectedChecker];
    },
  },
};
</script>

<style scoped>
.checker {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  position: relative;
  box-shadow: 0 0 0 5px red;
}

.black-checker {
  background-color: black;
}

.white-checker {
  background-color: white;
  /*border: 1px solid black;*/
}

.checker.selected {
  outline: 2px solid blue;
  outline-offset: 5px;
}
</style>

<template>
  <div
    :class="['checker', pieceColor, { selected: isSelected }]"
    @mousedown="selectChecker"
  >
<!--    <div class="circle"></div>-->
  </div>
</template>

<script>
import {getValidAttacks, getValidMoves, isValidMove, isUnderAttack} from "@/rules/rules.js"

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
          if (validWhiteCheckers.length > 0 && !validWhiteCheckers.includes(index)) {
            return;
          }
          break;
        case "black-checker":
          if (validBlackCheckers.length > 0 && !validBlackCheckers.includes(index)) {
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

        validMoves = getValidMoves(index, this.board);

      } else {
        selectedChecker = null;
        validMoves = [];
      }
      console.log(`valid moves: ${validMoves}`)
      // console.log("from checker " + this.isQueen)
      this.$store.commit('changeSelectedChecker', selectedChecker);
      this.$store.commit('changeValidMoves', validMoves);
      // this.$emit("select", {validMoves, selectedChecker});
      //return [validMoves, selectedChecker];
    },
  },
};
</script>

<style scoped>
.checker {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  position: relative;
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

<template>
  <div
    :class="['cell', cellColor, { highlight: isHighlighted }]"
    @click="moveChecker"
  >
    <template v-if="hasChecker">
      <Checker
        v-if="!isQueen"
        :board="board"
        :pieceColor="checkerColor"
        :isSelected="isSelected"
        :pieceIndex="cellIndex"
        :isQueen="isQueen"

      />
      <QueenChecker
        v-if="isQueen"
        :board="board"
        :pieceColor="checkerColor"
        :isSelected="isSelected"
        :pieceIndex="cellIndex"
        :isQueen="isQueen"

      />
    </template>
  </div>
</template>

<script>
import Checker from "@/components/Checker.vue";
import QueenChecker from "@/components/QueenChecker.vue";
import {getValidAttacks} from "@/rules/rules";

export default {
  components: {
    Checker,
    QueenChecker,
  },
  props: {
    board: Array,
    cellColor: String,
    hasChecker: Boolean,
    checkerColor: String,
    isSelected: Boolean,
    isHighlighted: Boolean,
    cellIndex: Number,
    isQueen: Boolean,
  },
  methods: {

    moveChecker() {
      let index = this.cellIndex;
      let currentMove = [];
      let isBite = false;
      let checkQueen;

      if(this.$store.state.selectedChecker !== null) {
        checkQueen = this.board[this.$store.state.selectedChecker].isQueen;
      }
      // console.log("isQueen: " + checkQueen)
      if (this.$store.state.selectedChecker !== null
        && this.$store.state.validMoves.includes(index)) {

        // console.log("move:" + index);
        currentMove.push(this.$store.state.currentPlayer,
          this.$store.state.selectedChecker, index);

        this.board[index].hasChecker = true;
        this.board[index].checkerColor =
          this.board[this.$store.state.selectedChecker].checkerColor;
        if(checkQueen) this.board[index].isQueen = true;

        this.board[this.$store.state.selectedChecker].hasChecker = false;
        this.board[this.$store.state.selectedChecker].checkerColor = null;
        this.board[this.$store.state.selectedChecker].isQueen = false;

        const rowDiff = Math.floor( index / 8)
          - Math.floor(this.$store.state.selectedChecker / 8);
        const colDiff = (index % 8) - (this.$store.state.selectedChecker % 8);

        if (
          Math.abs(
            Math.floor(index / 8) - Math.floor(this.$store.state.selectedChecker / 8)
          ) === 2
        ) {
          isBite = true;
          const middleIndex = (index + this.$store.state.selectedChecker) / 2;
          this.board[middleIndex].hasChecker = false;
          this.board[middleIndex].isQueen = false;
          this.board[middleIndex].checkerColor = null;

        }
        else if(
          Math.abs(rowDiff) === Math.abs(colDiff)
          && Math.abs(rowDiff) > 2 && Math.abs(colDiff) > 2
        ) {
          isBite = true;

          const startRow = Math.floor(this.$store.state.selectedChecker / 8);
          const startCol = this.$store.state.selectedChecker % 8;
          const endRow = Math.floor(index / 8);
          const endCol = index % 8;

          let cellsBetween = [];

          for (let i = Math.min(startRow, endRow) + 1; i < Math.max(startRow, endRow); i++) {
            for (let j = Math.min(startCol, endCol) + 1; j < Math.max(startCol, endCol); j++) {
              const indexDes = i*8 + j;
              cellsBetween.push(indexDes);
            }
          }

          for(let cell of cellsBetween) {
            console.log(cell);
            this.board[cell].hasChecker = false;
            this.board[cell].isQueen = false;
            this.board[cell].checkerColor = null;
          }

          // const middleIndex = (index + this.$store.state.selectedChecker) / 2;
          // this.board[middleIndex].hasChecker = false;
          // this.board[middleIndex].isQueen = false;
          // this.board[middleIndex].checkerColor = null;
        }

        this.$store.commit('changeSelectedChecker', null);

        this.$store.commit('changeValidMoves', [])
        // console.log("cur" + currentMove);
        this.$store.commit('changeValidMoves', getValidAttacks(index, this.board)) ;
        let changeState = true;
        if (this.$store.state.validMoves.length > 0 && isBite) {
          changeState = false;
        }
        this.$store.commit('changeValidMoves', [])

        if(changeState) {
          this.$store.commit('changeState');
        }
        this.$emit('move', currentMove)
      }
    },

  },
  watch: {
    hasChecker(newValue) {
      if(this.cellIndex < 8 && newValue && this.checkerColor === "white-checker") {
        this.board[this.cellIndex].isQueen = true;
      }
      else if(this.cellIndex > 55 && newValue && this.checkerColor === "black-checker") {
        this.board[this.cellIndex].isQueen = true;
      }
    }
  }
};
</script>

<style scoped>
.cell {
  width: 70px;
  height: 70px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.cell.white {
  background-color: #fff;
}

.cell.black {
  background-color: #808080; 
}

.cell.highlight {
  background-color: yellow; 
}
</style>

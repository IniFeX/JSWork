<template>
  <div class="board">
    <div
      v-for="(row, rowIndex) in board"
      :key="rowIndex"
      class="row"
    >
      <Cell
        v-for="(cell, colIndex) in row"
        :key="colIndex"
        :row="rowIndex"
        :col="colIndex"
        :piece="cell"
        @selectPiece="selectPiece"
      />
    </div>
  </div>
</template>

<script>
import Cell from './Cell.vue';

export default {
  components: {
    Cell,
  },
  data() {
    return {
      board: [
        [null, 'black', null, 'black', null, 'black', null, 'black'],
        ['black', null, 'black', null, 'black', null, 'black', null],
        [null, 'black', null, 'black', null, 'black', null, 'black'],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        ['white', null, 'white', null, 'white', null, 'white', null],
        [null, 'white', null, 'white', null, 'white', null, 'white'],
        ['white', null, 'white', null, 'white', null, 'white', null],
      ],
      selectedPiece: null,
    };
  },
  methods: {
    selectPiece(row, col) {
      if (this.selectedPiece) {
        this.movePiece(row, col);
      } else if (this.board[row][col]) {
        this.selectedPiece = { row, col };
      }
    },
    movePiece(newRow, newCol) {
      const { row, col } = this.selectedPiece;
      if (this.isValidMove(newRow, newCol)) {
        this.board[newRow][newCol] = this.board[row][col];
        this.board[row][col] = null;
        this.selectedPiece = null;
      }
    },
    isValidMove(newRow, newCol) {
      return (
        Math.abs(newRow - this.selectedPiece.row) === 1 &&
        Math.abs(newCol - this.selectedPiece.col) === 1 &&
        !this.board[newRow][newCol]
      );
    },
  },
};
</script>

<style scoped>
.board {
  display: grid;
  grid-template-columns: repeat(8, 50px);
  grid-template-rows: repeat(8, 50px);
}
.row {
  display: contents;
}
</style>
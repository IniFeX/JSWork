<template>
  <div
    :class="['cell', cellColor, { highlight: isHighlighted }]"
    @click="movePiece"
  >
    <Checker
      v-if="hasChecker"
      :board="board"
      :pieceColor="checkerColor"
      :isSelected="isSelected"
      :pieceIndex="cellIndex"
      @select="selectPiece"
    />
  </div>
</template>

<script>
import Checker from "./Checker.vue";

export default {
  components: {
    Checker,
  },
  props: {
    board: Array,
    cellColor: String,
    hasChecker: Boolean,
    checkerColor: String,
    isSelected: Boolean,
    isHighlighted: Boolean,
    cellIndex: Number,
  },
  methods: {
    movePiece() {
      this.$emit("move", this.cellIndex);
    },
    selectPiece(validMoves, selectedChecker) {
      // console.log(values[0], values[1]);
      this.$emit("select", validMoves, selectedChecker);
    },


  },
};
</script>

<style>
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

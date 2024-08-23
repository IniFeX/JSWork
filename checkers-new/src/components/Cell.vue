<template>
  <div
    class="cell"
    :class="{ black: (row + col) % 2 !== 0, white: (row + col) % 2 === 0 }"
    @click="$emit('selectPiece', row, col)"
  >
    <div v-if="piece" :class="['piece', piece]"></div>
  </div>
</template>

<script>
export default {
  props: {
    row: Number,
    col: Number,
    piece: String,
  },
};
</script>

<style scoped>
.cell {
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.black {
  background-color: #769656;
}

.white {
  background-color: #eeeed2;
}

.piece {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.piece.black {
  background-color: #000;
}

.piece.white {
  background-color: #fff;
}
</style>
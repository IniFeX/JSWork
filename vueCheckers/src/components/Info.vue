<template>
  <div>
    <button class="btn" @click="restartGame">Restart</button>
    <h3 class="curr-player">Current player: {{ $store.state.currentPlayer }}</h3>
    <h3 class="curr-player">Black player: {{ currentBlackCheckers }}</h3>
    <h3 class="curr-player">White player: {{ currentWhiteCheckers }}</h3>
    <h3 class="curr-player">valid: {{ $store.state.validMoves }}</h3>
    <textarea name="text" id="text" class="text-area">{{
      currentMove
    }}</textarea>
  </div>

</template>

<script>

export default {
  emits: ['restartGame'],
  props: {
    currentBlackCheckers: Number,
    currentWhiteCheckers: Number,
    currentMove: Array,
  },
  methods: {
    restartGame() {
      this.$emit('restartGame');
    }
  }
}
</script>

<style scoped>
.curr-player {
  display: flex;
  flex-direction: column;
  position: relative;
  bottom: 0;
  margin-right: 15px;
  /* /left: 350px; */
  font-size: large;
}
.text-area {
  position: relative;
  width: 170px;
  height: 340px;
}

.btn {
  margin-top: 15px;
  position: relative;
  bottom: 0;
  left: 70px;
  margin-right: 140px;
  /* right: 50px; */
  /* align-self:center; */
  padding: 10px 15px;
  background: none;
  color: gray;
  border: 3px solid gray;
  font-size: larger;
}

</style>
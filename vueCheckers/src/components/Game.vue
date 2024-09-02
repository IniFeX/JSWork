<template>
  <div >
    <Board/>
  </div>
  <div v-if="$store.state.isGameOver" class="gameOver">
    <h1>GAME OVER</h1>
  </div>
</template>

<script>
import Board from "@/components/Board.vue";
import Info from "@/components/Info.vue";

export default {
  components: {Info, Board}

}
</script>

<style scoped>
.gameOver{
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh; /* Высота по высоте видимой области */
  color: red;
  font-size: 60px;
}

.container{
  display: flex;
}
.info {
  margin-right: 5px;
  font-size: large;
}
/*.board {
  flex: 1; !* Даем возможность доске растягиваться *!
}*/
</style>
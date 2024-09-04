<template>
  <div id="app">
    <Game />
  </div>
</template>

<script>
import Board from "./components/Board.vue";
import Game from "@/components/Game.vue";
import SocketioService from '@/services/socketio.service.ts';

export default {
  name: "App",
  components: {
    Game,
    Board,
  },
  // created() {
  //   SocketioService.setupSocketConnection();
  // }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  color: #2c3e50;
}
</style>

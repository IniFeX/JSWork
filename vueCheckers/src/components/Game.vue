<template>
  <div class="mode" v-if="$store.state.currentMode === null">
    <h1>Choose mode:</h1>
    <button
      class="btn"
      @click="changeMode('bot')"
    >VS Bot
    </button>
    <button
      class="btn"
      style="border: 3px solid red"
      @click="changeMode('solo')"
    >SOLO
    </button>
    <button
      class="btn"
      style="border: 3px solid #002fff"
      @click="startOnline"
    >ONLINE
    </button>

  </div>
  <div>
    <Board v-if="$store.state.currentMode !== null"/>
  </div>
  <div v-if="$store.state.isGameOver" class="gameOver">
    <h1>GAME OVER</h1>
  </div>
</template>

<script>
import Board from "@/components/Board.vue";
import Info from "@/components/Info.vue";
import io from "socket.io-client"
import axios from "axios";

export default {
  components: {Info, Board},
  // data() {
  //   return {
  //     board: [],
  //     currentMove: [],
  //   }
  // },
  async created() {
    await this.$store.dispatch("loadMode");
    // console.log(this.$store.state.currentMode);
    // await this.loadBoard();
    // await this.loadMove();
  },

  methods: {
    // async loadBoard() {
    //   const response = await axios.get(`http://localhost:3000/board`);
    //   this.board = response.data;
    // },
    //
    // async loadMove() {
    //   const response = await axios.get(`http://localhost:3000/move`);
    //   this.currentMove = response.data;
    // },
    async changeMode(state) {
      this.$store.commit("changeCurrentMode", state);
      await this.$store.dispatch('saveMode');
      // console.log(this.$store.state.currentMode);
    },
    startOnline() {
      // this.$store.commit("changeCurrentMode", 'online');
      const socket = io('http://localhost:3000');

      // socket.emit('msg', 'hi');
      socket.on('connected_clients', (count) => {
        console.log('Количество подключенных клиентов:', count);
      })
    }
  }
}
</script>

<style scoped>
.gameOver {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  color: red;
  font-size: 60px;
}

.gameOver {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  color: gray;
  font-size: 60px;
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


.container {
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
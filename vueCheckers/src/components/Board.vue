<template>
  <div class="board-container" v-if="!$store.state.isGameOver">
    <div>

      <Info
      :currentBlackCheckers="currentBlackCheckers"
      :currentWhiteCheckers="currentWhiteCheckers"
      :currentMove="currentMove"
      @restartGame="restartGame"
      >
      </Info>
    </div>
    <div class="board">
      <Cell
        v-for="(cell, index) in board"
        :key="index"
        :board="board"
        :cellColor="cell.color"
        :hasChecker="cell.hasChecker"
        :checkerColor="cell.checkerColor"
        :isSelected="$store.state.selectedChecker === index"
        :isHighlighted="isHighlighted(index)"
        :cellIndex="index"
        :isQueen="cell.isQueen"
        @move="completeMove"

      />
    </div>

  </div>

</template>

<script>
import Cell from "./Cell.vue";
import axios from "axios";
import {getValidAttacks, getValidMoves} from "@/rules/rules.js"
import Info from "@/components/Info.vue";
import {botMove} from "@/bot/botMove.js"

export default {
  components: {
    Info,
    Cell,
  },
  data() {
    return {
      board: [],

      currentMove: [],
      availableWhiteChecker: [],
      availableBlackChecker: [],
      currentBlackCheckers: 0,
      currentWhiteCheckers: 0,
    };
  },
  async created() {
    await this.loadBoard();
    await this.loadMove();
    // this.board[44].isQueen = true;
    // console.log(this.board);
    //await this.loadState();
    //console.log(this.$store.state.currentPlayer);
  },

  updated(){
    let amountWhite = 0;
    let amountBlack = 0;
    // this.queenCheckers = [];
    this.availableWhiteChecker = [];
    this.availableBlackChecker = [];
    for (let i = 0; i < this.board.length; i++) {
      if(this.board[i].checkerColor === "white-checker"){
        this.availableWhiteChecker.push(this.board[i]);
        amountWhite++;
      }else if(this.board[i].checkerColor === "black-checker"){
        this.availableBlackChecker.push(this.board[i]);
        amountBlack++;
      }

    }

    this.currentWhiteCheckers = this.availableWhiteChecker.length;
    this.currentBlackCheckers = this.availableBlackChecker.length;
    // let winner = this.gameOver();
  },

  methods: {

    async loadBoard() {
      const response = await axios.get(`http://localhost:3000/board`);
      this.board = response.data;

    },
    async loadMove() {
      const response = await axios.get(`http://localhost:3000/move`);
      this.currentMove = response.data;
    },
    async loadState() {
      const response = await axios.get(`http://localhost:3000/state`);
      this.$store.state.currentPlayer = response.data;
    },
    async restartBoard() {
      const response = await axios.get(`http://localhost:3000/restart`);
      this.board = response.data;
    },
    async saveBoard() {
      await axios.post("http://localhost:3000/board", this.board);
    },
    async saveMove() {
      await axios.post("http://localhost:3000/move", this.currentMove);
    },
    async saveState() {
      await axios.post("http://localhost:3000/state", this.$store.state.currentPlayer);
    },

    async restartGame() {
      await this.restartBoard();
      this.$store.commit('changeSelectedChecker', null);
      this.$store.commit('setState', 'white-checker');
      // this.$store.state.currentPlayer = "white-checker";
      // this.validMoves = [];
      this.$store.commit('changeValidMoves', [])
      this.currentMove = [];
    },

    async completeMove(currentMove){
      // if (this.$store.state.currentPlayer === "black-checker")await botMove(this.board);
      this.currentMove = this.currentMove.concat(currentMove);
      await this.saveBoard();
      await this.saveMove();
      await this.saveState();
    },

    isHighlighted(index) {
      return this.$store.state.validMoves.includes(index);
    },

    convert(index) {
      const id = [Math.floor(index / 8), index % 8];
      return id;
    },
    gameOver(){
      if(this.availableWhiteChecker.length <= 0 ){
        this.$store.commit('changeGameOver', true);
        return "black win";
      }
      else if(this.availableBlackChecker.length <= 0){
        this.$store.commit('changeGameOver', true);
        return "white win";
      }

      let availableBlackMove = [];
      let availableWhiteMove = [];

      for(let i = 0; i < this.availableWhiteChecker.length; i++){
        availableWhiteMove.push(getValidAttacks
          (this.availableWhiteChecker[i].index, this.board));
      }
      if(availableWhiteMove.length <= 0){
        this.$store.commit('changeGameOver', true);
        return "black win";
      }
      for(let i = 0; i < this.availableBlackChecker.length; i++){
        availableBlackMove.push(getValidAttacks
        (this.availableBlackChecker[i].index, this.board));
      }

      if(availableWhiteMove.length <= 0){
        this.$store.commit('changeGameOver', true);
        return "white win";
      }
    }
  },

};
</script>

<style scoped>
.board-container {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.board {
  display: grid;
  grid-template-columns: repeat(8, 70px);
  grid-template-rows: repeat(8, 70px);
  gap: 2px;
  border: 5px solid #000;
  padding: 10px;
  box-sizing: border-box;
  background-color: #000;
}

</style>

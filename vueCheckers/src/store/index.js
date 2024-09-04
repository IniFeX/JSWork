import {createStore} from 'vuex';
import axios from "axios";

export default createStore({
  state: () => ({
    currentPlayer: "white-checker",
    validMoves: [],
    selectedChecker: null,
    isGameOver: false,
    currentMode: null,

  }) ,
  getters: {},
  mutations:{
    changeState(state){
      switch (state.currentPlayer) {
        case "white-checker":
          state.currentPlayer = "black-checker";
          break;
        case "black-checker":
          state.currentPlayer = "white-checker";
          break;
      }
    },
    changeCurrentMode(state, mode){
      state.currentMode = mode;
    },
    setState(state, currentPlayer){
      state.currentPlayer = currentPlayer;
    },
    changeSelectedChecker(state, index){
      state.selectedChecker = index;
    },
    changeValidMoves(state, moves){
      state.validMoves = moves;
    },
    changeGameOver(state, gameOver){
      state.isGameOver = gameOver;
    }
  },
  actions: {
    async loadMode({state, commit}) {
      const response = await axios.get(`http://localhost:3000/mode`);
      commit("changeCurrentMode", response.data);
    },
    async saveMode({state, commit}) {
      await axios.post("http://localhost:3000/saveMode", state.currentMode);
    },
  },
})
import {createStore} from 'vuex';

export default createStore({
  state: () => ({
    currentPlayer: "white-checker",
    validMoves: [],
    selectedChecker: null,
    isGameOver: false,

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

  },
})
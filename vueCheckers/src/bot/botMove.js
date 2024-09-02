import {getValidAttacks, getValidMoves, getValidQueenMoves} from "@/rules/rules";
import store from "@/store";
import axios from "axios";

async function moveChecker(index, board) {
  let isBite = false;
  let checkQueen;

  if(store.state.selectedChecker !== null) {
    checkQueen = board[store.state.selectedChecker].isQueen;
  }

  if (store.state.selectedChecker !== null
    && store.state.validMoves.includes(index)) {


    board[index].hasChecker = true;
    board[index].checkerColor =
      board[store.state.selectedChecker].checkerColor;
    if(checkQueen) board[index].isQueen = true;

    board[store.state.selectedChecker].hasChecker = false;
    board[store.state.selectedChecker].checkerColor = null;
    board[store.state.selectedChecker].isQueen = false;

    const rowDiff = Math.floor( index / 8)
      - Math.floor(store.state.selectedChecker / 8);
    const colDiff = (index % 8) - (store.state.selectedChecker % 8);

    if (
      Math.abs(
        Math.floor(index / 8) - Math.floor(store.state.selectedChecker / 8)
      ) === 2
    ) {
      isBite = true;
      const middleIndex = (index + store.state.selectedChecker) / 2;
      board[middleIndex].hasChecker = false;
      board[middleIndex].isQueen = false;
      board[middleIndex].checkerColor = null;
    }
    else if(
      Math.abs(rowDiff) === Math.abs(colDiff)
      && Math.abs(rowDiff) > 2 && Math.abs(colDiff) > 2
    ){
      isBite = true;

      const startRow = Math.floor(store.state.selectedChecker / 8);
      const startCol = store.state.selectedChecker % 8;
      const endRow = Math.floor(index / 8);
      const endCol = index % 8;

      let cellsBetween = [];

      for (let i = Math.min(startRow, endRow) + 1; i < Math.max(startRow, endRow); i++) {
        for (let j = Math.min(startCol, endCol) + 1; j < Math.max(startCol, endCol); j++) {
          const indexDes = i*8 + j;
          cellsBetween.push(indexDes);
        }
      }

      for(let cell of cellsBetween) {
        console.log(cell);
        board[cell].hasChecker = false;
        board[cell].isQueen = false;
        board[cell].checkerColor = null;
      }
    }

    store.commit('changeSelectedChecker', null);

    store.commit('changeValidMoves', [])
    store.commit('changeValidMoves', getValidAttacks(index, board)) ;
    let changeState = true;
    if (store.state.validMoves.length > 0 && isBite) {

      const randomValidAttackIndex = Math.floor(
        Math.random() * store.state.validMoves.length
      );
      const randValidAttack = store.state.validMoves[randomValidAttackIndex];

      changeState = false;
    }
    store.commit('changeValidMoves', [])

    if(changeState) {
      store.commit('changeState');
    }
    if (store.state.currentPlayer === "black-checker") await botMove(board);

  }
}
async function postValidChecker(validCheckers){
  await axios.post("http://localhost:3000/botPost", validCheckers);
}

async function getBotMove(){
  const response = await axios.get(`http://localhost:3000/bot`);
  return response.data;
}

export async function botMove(board) {
  //if(store.state.currentPlayer = "black-checker");
  const blackCheckers = [];
  const blackQueenCheckers = [];
  for (let i = 0; i < board.length; i++) {
    if (board[i].checkerColor === "black-checker" && board[i].hasChecker){
      blackCheckers.push(board[i]);
    }
    if(board[i].isQueen && board[i].checkerColor === "black-checker"){
      blackQueenCheckers.push(board[i]);
    }
  }
  console.log("black queen: " + blackQueenCheckers);
  // this.blackCheckers = blackCheckers;
  console.log("бот сделал ход");
  let validCheckers = [];
  const validQueenCheckers = [];

  for (let i = 0; i < blackCheckers.length; i++) {
    if (getValidAttacks(blackCheckers[i].index, board).length > 0) {
      validCheckers.push([
        blackCheckers[i].index,
        getValidAttacks(blackCheckers[i].index, board),
      ]);
    }
  }

  if (validCheckers.length <= 0) {
    for (let i = 0; i < blackCheckers.length; i++) {
      if (getValidMoves(blackCheckers[i].index, board).length > 0) {
        validCheckers.push([
          blackCheckers[i].index,
          getValidMoves(blackCheckers[i].index, board),
        ]);
      }
    }
  }

  for (let i = 0; i < blackQueenCheckers.length; i++) {
    if (getValidQueenMoves(blackQueenCheckers[i].index, board).length > 0) {
      validQueenCheckers.push([
        blackQueenCheckers[i].index,
        getValidQueenMoves(blackQueenCheckers[i].index, board),
      ]);
    }
  }

  validCheckers = validCheckers.concat(validQueenCheckers);
  console.log(validQueenCheckers);
  let randomBlackChecker = 0;
  let randomMove = 0;
  if(validCheckers.length > 0){
    await postValidChecker(validCheckers);
  }
  else{
    store.commit('changeGameOver', true)
  }

  [randomBlackChecker, randomMove] = await getBotMove();
  let move = [randomMove];
  store.commit('changeValidMoves', move)
  console.log(randomBlackChecker)
  store.commit('changeSelectedChecker', randomBlackChecker);
  await moveChecker(randomMove, board);

}
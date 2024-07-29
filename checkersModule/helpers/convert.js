export function convert(target, option) {
  const regex = /^(\w+)_+(\d+)_+(\d+)$/;
  // const regex = /field_(\d+)_(\d+)/;

  const match = target.id.match(regex);

  if (match) {
    let firstWord;
    switch (option) {
      case "word":
        firstWord = match[1];
        const i = parseInt(match[2], 10);
        const j = parseInt(match[3], 10);
        return firstWord;
      case "index":
        firstWord = match[1];
        if (firstWord === "checker" || firstWord === "field") {
          const i = parseInt(match[2], 10);
          const j = parseInt(match[3], 10);
          return [i, j];
        } else return false;
      default:
        break;
    }
    //board[i][j] = "X";
  }
}

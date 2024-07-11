
export const TTT = {
  size: 0,
  X: 'X',
  O: 'O',

  initState() {
    return Array(this.size).fill(null);
  },

  player(board) {
    let nx = 0;
    let no = 0;
    for (let i = 0; i < board.length; i++) {
      const curr = board[i];
      if (curr == this.X) {
        nx += 1;
      } else if (curr == this.O) {
        no += 1;
      }
    }
    if (nx > no) {
      return this.O;
    }
    return this.X;
  },

  actions(board) {
    const moves = []
    for (let i = 0; i < this.size; i++) {
      if (board[i] == null) {
        moves.push(i);
      }
    }
    return moves
  },

  result(board, action) {
    const i = action;
    console
    let temp = board.slice();
    if (temp[i] == null && (i > -1 && i < this.size)) {
      temp[i] = this.player(board);
    } else { throw new Error("Invalid Move!"); }
    return temp;
  },

  winner(board) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }
    return null;
  },

  terminal(board) {
    if (this.winner(board) != null)
      return true;
    for (let i = 0; i < this.size; i++) {
      if (board[i] == null) return false;
    }
    return true;
  },

  utility(board) {
    if (this.winner(board) == this.X) {
      return 1;
    } else if (this.winner(board) == this.O) {
      return -1;
    } else { return 0; }
  },

  minimax(board, d) {
    const limit = {
      "ez": 1,
      "mid": 2,
      "diff": 4
    };

    let depth = limit[d];

    if (this.terminal(board))
      return null;

    let optAction = 0;

    if (this.player(board) == this.X) {
      if (JSON.stringify(board) == JSON.stringify(this.initState())) {
        if (depth == 1) optAction = Math.floor(Math.random() * 9);
        return optAction;
      }
      let v = -Infinity;
      const a = this.actions(board);
      for (let i = 0; i < a.length; i++) {
        const r = this.minVal(this.result(board, a[i]), depth - 1)
        if (r > v) {
          v = r;
          optAction = a[i];
        }
      }
    } else if (this.player(board) == this.O) {
        let v = Infinity;
        const a = this.actions(board);
        for (let i = 0; i < a.length; i++) {
          const r = this.maxVal(this.result(board, a[i]), depth - 1)
          if (r < v) {
            v = r;
            optAction = a[i];
          }
        }
    }
    return optAction;
  },

  maxVal(board, d) {
    let v = -Infinity;
    if (d == 0)
        return v
    d -= 1;
    if (this.terminal(board))
      return this.utility(board);
    
    const a = this.actions(board);
    for (let i = 0; i < a.length; i++)
      v = Math.max(v, this.minVal(this.result(board, a[i]), d - 1));
    return v
  },
  minVal(board, d) {
    let v = Infinity;
    if (d == 0)
        return v;
    d -= 1;
    if (this.terminal(board))
      return this.utility(board);
    
    const a = this.actions(board);
    for (let i = 0; i < a.length; i++)
      v = Math.min(v, this.maxVal(this.result(board, a[i]), d - 1));
    return v
  }
};
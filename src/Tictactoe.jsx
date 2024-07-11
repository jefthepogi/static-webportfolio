import { useState, useReducer, useRef, useEffect } from "react";
import { Link, useLocation } from 'react-router-dom';
import * as algo from './Algorithm.jsx';

const initialFlags = {
  player: null,
  status: null,
  winner: null,
  difficulty: "diff",
  // Server Anchored Flags //
  loading: false,
  toggle: false,
};

const useIsMount = () => {
  const isMountRef = useRef(true);
  useEffect(() => {
    isMountRef.current = false;
  }, []);
  return isMountRef.current;
};

function reducer(state, action) {
  switch (action.type) {
    case "setStatus":
      return {
        ...state,
        status: action.payload.status,
        winner: action.payload.winner,
      };
    case "setDifficulty":
      return {
        ...state,
        difficulty: action.payload,
      };
    case "setPlayer":
      return {
        ...state,
        player: action.payload,
      };
    case "setLoading":
      return {
        ...state,
        loading: action.payload,
      };
    case "resetGame":
      return {
        ...initialFlags,
        difficulty: state.difficulty,
      };
    case "Toggle":
      return {
        ...state,
        toggle: !state.toggle,
      };
    default:
      return state 
  }
}

export function TTT_Menu() {
  return (
    <div className="mainContent flexcolumn">
      <h1>Tic Tac Toe</h1>
      <p>Version 1.0, Mid 2024</p>
      <div className="gamemode">
        <Link to="ai">User vs AI</Link>
        <Link to="pvp">PVP</Link>
      </div>
    </div>
  );
}

export function TTT_Game() {
  const [flags, dispatch] = useReducer(reducer, initialFlags);
  let title = flags.status;
  if (flags.loading === true) {
    title = `AI (${flags.player}) is thinking...`
  }
  return (
    <div className="mainContent flexrow">
      <div className="game-board">
        <div className="game-status"><h2>{title}</h2></div>
        {flags.player === null ? (
          <div className="choose">
            <h3>Choose:</h3>
            <button onClick={() => dispatch({ type: "setPlayer", payload: "X" })}>X</button>
            <button onClick={() => { dispatch({ type: "setPlayer", payload: "O" }); dispatch({ type: "Toggle"}); } }>O</button>
          </div>
        ) : (
          <Board flags={flags} dispatch={dispatch}/>
        )}
      </div>
      <div className="game-info">
        {flags.player === null &&
          <div className="topbar">
            <select id="selectLevel" value={flags.difficulty} onChange={e => dispatch({ type: "setDifficulty", payload: e.target.value})}>
              <option value="ez">Easy</option>
              <option value="mid">Medium</option>
              <option value="diff">Hard</option>
            </select>
          </div>
        }
        <div className="desc">
          <h4>GAMEPLAY</h4>
          <ol>
            <li><b>Decide who goes first:</b> The first player will use X, and the second player will use O.</li>
            <li><b>Take turns:</b> Players take turns placing their mark (X or O) in an empty cell on the grid.</li>
            <li><b>Win condition:</b> The first player to align three of their marks in a row (horizontally, vertically, or diagonally) wins the game.</li>
            <li><b>Draw condition:</b> If all nine cells are filled and neither player has three in a row, the game is a draw.</li>
          </ol>
        </div>
      </div>
    </div>
  );
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function Square({state, clicked}) {
  return <button className="square" onClick={clicked}>{state}</button>
}

function Board(props) {

  const len = 3;
  algo.TTT.size = len * len;
  const route = useLocation();
  const [squares, setSquares] = useState(algo.TTT.initState());
  const url = route.pathname;
  const isMount = useIsMount();

  const fetchData = async () => {
    props.dispatch({ type: "setLoading", payload: true });
    await sleep(300);
    const user = props.flags.player;
    const depth = props.flags.difficulty;
    let board = squares.slice();
    const _player = algo.TTT.player(board);
    const is_gameover = () => {
      const _gameover = algo.TTT.terminal(board);
      let _status = `User's (${user}) turn`;
      const _winner = algo.TTT.winner(board);
      if (_gameover) {
        if (_winner == null) _status = "Game Draw.";
        else {
          let p = "AI";
          if (user == _winner) p = "User";
          _status = `${p} (${_winner}) has won!`;
        }
      }
      return [_gameover, _status, _winner];
    }
    // Game Status 
    let [game_over, status, winner] = is_gameover();
    // Check for AI move
    if (user !== _player && !game_over) {
        const move = algo.TTT.minimax(board, depth);
        board = algo.TTT.result(board, move);
        [, status, winner] = is_gameover();
    }
    
    props.dispatch({ type: "setStatus", payload: {status: status, winner: winner} });
    setSquares(board);
    props.dispatch({ type: "setLoading", payload: false });
  }

  if (url == "/games/ttt/ai") {
    useEffect(() => {
      if (props.flags.player == 'O') {
        fetchData();
      } else if (isMount) {
        //console.log("Initial Render");
      } else {
        //console.log("Subsequent Render");
        fetchData();
      }
    }, [props.flags.toggle]);
  }

  function handleClick(i) {
    if (squares[i] || props.flags.winner != null || props.flags.loading)
      return;
    
    const temp = squares.slice();
    temp[i] = props.flags.player;
    setSquares(temp);
    props.dispatch({ type: "Toggle" });
  }
  
  return (
    <>
      <div className="board">
      {[...Array(len)].map((_, outerIndex) => (
        <div key={outerIndex} className="board-row">
          {[...Array(len)].map((_, innerIndex) => {
            const p = outerIndex * len + innerIndex;
            return ( <Square key={innerIndex} state={squares[p]} clicked={() => handleClick(p)}/> );  
          })} 
        </div>
      ))}
      </div>
      <button onClick={() => props.dispatch({ type: "resetGame"}) }>Reset</button>
    </>
  );      
}


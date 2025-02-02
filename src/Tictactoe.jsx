import { useState, useReducer, useRef, useEffect } from "react";
import { Link, useLocation } from 'react-router-dom';
import * as algo from './Algorithm.jsx';

const initialFlags = {
  user: null,
  status: "‎", // fixes layouting jumps 
  winner: null,
  difficulty: "diff",
  // Server Anchored Flags //
  updating: false,
};

function reducer(state, action) {
  switch (action.type) {
    case "setDifficulty":
      return {
        ...state,
        difficulty: action.payload,
      };
    case "setUser":
      return {
        ...state,
        user: action.payload,
      };
    case "setUpdate":
      return {
        ...state,
        updating: action.payload.updateTo,
        status: action.payload.status,
        winner: action.payload.winner,
      };
    case "resetGame":
      return {
        ...initialFlags,
        difficulty: state.difficulty,
      }
    default:
      return state;
  }
}

export function TTT_Menu() {
  return (
    <div className="mainContent flexcolumn">
      <h1>Tic Tac Toe</h1>
      <p>Version 1.1, Late 2024</p>
      <div className="gamemode">
        <Link to="ai">User vs AI</Link>
        <Link to="pvp">PVP</Link>
      </div>
    </div>
  );
}

export function TTT_Game() {
  const [flags, dispatch] = useReducer(reducer, initialFlags);
  const playerChoseO = useRef(false);
  const [board_key, setBoardKey] = useState(0);
  const remountBoard = () => {
    setBoardKey(prevKey => prevKey + 1);
    console.log("remounted");
  }

  const route = useLocation();
  const url = route.pathname;
  const title = flags.status;

  return (
    <div className="mainContent flexrow">
      <div className="game-board">
        <div className="game-status"><h2>{title}</h2></div>
        {(flags.user === null && url === "/games/ttt/ai") ? (
          <div className="choose">
            <h3>CHOOSE</h3>
            <button onClick={() => { dispatch({ type: "setUser", payload: "X" }); playerChoseO.current = false; }}>X</button>
            <button onClick={() => { dispatch({ type: "setUser", payload: "O" }); playerChoseO.current = true; }}>O</button>
          </div>
        ) : (
          <Board key={board_key} flags={flags} dispatch={dispatch} url={url} chosen={playerChoseO}/>
        )}
      </div>
      <div className="game-info">
        {(flags.user === null && url === "/games/ttt/ai") &&
          <div className="topbar">
            <select id="selectLevel" value={flags.difficulty} onChange={e => dispatch({ type: "setDifficulty", payload: e.target.value})}>
              <option value="ez">Easy</option>
              <option value="mid">Hard</option>
              <option value="diff">Impossible</option>
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
        <button id="reset-button" onClick={() => { dispatch({ type: "resetGame"}); if (url === "/games/ttt/pvp") { remountBoard(); } } }>Reset</button>
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
  const [squares, setSquares] = useState(algo.TTT.initState());
  const squaresRef = useRef(squares);
  const executedRef = useRef(false);

  const fetchData = async () => {

    props.dispatch({ type: "setUpdate", payload: { updateTo: true, status: "The AI is thinking...", winner: null } });
    await sleep(300);

    const user = props.flags.user;
    const depth = props.flags.difficulty;
    let board = squaresRef.current.slice();
    const turn = algo.TTT.player(board);
    // Game Status 
    const is_gameover = () => {
      const _gameover = algo.TTT.terminal(board);
      let _status = `User's (${user}) turn`;
      const _winner = algo.TTT.winner(board);
      if (_gameover) {
        if (_winner == null) _status = "Game Draw.";
        else {
          let p = "AI";
          if (user == _winner) { p = "User" };
          _status = `${p} (${_winner}) has won!`;
        }
      }
      return [_gameover, _status, _winner];
    }

    // console.log(squaresRef.current);
    let [game_over, status, winner] = is_gameover();
    
    if (user !== turn && !game_over) {
      // Check for AI move
      const move = algo.TTT.minimax(board, depth);
      board = algo.TTT.result(board, move);
      [, status, winner] = is_gameover();
    }
    setSquares(board);
    squaresRef.current = board;
    props.dispatch({ type: "setUpdate", payload: {updateTo: false, status: status, winner: winner } });
  }

  function switchPlayer() {
    const board = squaresRef.current.slice();
    const user =  algo.TTT.player(board);
    const player = () => {
      return user === "X" ? "Player 1" : "Player 2";
    }
    const _gameover = algo.TTT.terminal(board);
    let _status = `${player()}'s (${user}) turn`;
    const _winner = algo.TTT.winner(board);
    if (_gameover) {
      if (_winner == null) _status = "Game Draw.";
      else {
        let p = "Player 2";
        if (user == _winner) { p = "Player 1" };
        _status = `${p} (${_winner}) has won!`;
      }
    }
    props.dispatch({ type: "setUser", payload: user }); 
    props.dispatch({ type: "setUpdate", payload: {updateTo: false, status: _status, winner: _winner } });
  }

  function handleClick(i) {
    if (squares[i] || props.flags.winner != null || props.flags.updating)
      return;
    const temp = squares.slice();
    temp[i] = props.flags.user;
    setSquares(temp);
    squaresRef.current = temp;
    if (props.url === "/games/ttt/ai") fetchData();
    else if (props.url === "/games/ttt/pvp") {
      switchPlayer();
    }
  }

  if (props.chosen.current == true) {
    useEffect(() => {
      if (executedRef.current) {return;}
      fetchData();
      executedRef.current = true;
      return () => {
        executedRef.current = false;
      }
    }, [])
  } else if (props.chosen.current == false) {
    useEffect(() => {
      if (executedRef.current) {return;}
      props.dispatch({ type: "setUser", payload: "X" });
      const _user = props.url === "/games/ttt/ai" ? "User" : "Player 1";
      props.dispatch({ type: "setUpdate", payload: {updateTo: false, status: `${_user}'s (X) turn`} });
      executedRef.current = true;
      return () => {
        executedRef.current = false;
      }
    }, [])
  }
  
  return (
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
  );      
}


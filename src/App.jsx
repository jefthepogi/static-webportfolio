import { Routes, Route, Link } from 'react-router-dom';
import { TTT_Menu, TTT_Game } from "./Tictactoe"
import SvgLogo from "./assets/SVGLogo.jsx";
import { useState } from 'react';


export default function Interface() {

  return (
    <div className="page">
      <div className="header">
        <div className="logo"><Link to="/"><SvgLogo/></Link></div>
        <nav>
          <ul>
            <li><Link to="/blogs" >Blogs</Link></li>
            <li><Link to="/contacts" >Contact Me</Link></li>
            <li><Link to="/games" >Games</Link></li>
          </ul>
        </nav>
      </div>
      <Routes>
        <Route exact path="/" element={ <Homepage/>}/>
        <Route path="games">
          <Route index element={ <GameList/>}/>
          <Route path="ttt">
            <Route index element={ <TTT_Menu/> }/>
            <Route path="ai" element={ <TTT_Game/>}/>
          </Route>
        </Route>
        <Route path="*" element={
          <div className="mainContent flexcolumn">
            <h1>ERROR: page not found</h1>
            <p>Either I hadn't made this page yet or u placed in dumb url</p>
          </div>} 
        />
      </Routes>
    </div>
  );
}

function Homepage() {
  const word = ["CODING", "PROGRAMMING", "DESIGNING", "LEARNING"];
  const [count, setCount] = useState(0);
  return (
    <div className="mainContent flexcolumn">
      <div className='homepage-title'>
        <p>Hi, my name is</p>
        <h1>JEF RUSSEL Q. MANONGAS</h1>
        <div className='subheader'>
          <h1>I LOVE</h1>
          <h1 class="dynamic-word" onClick={() => {
            setCount(count + 1); 
            if (count == word.length - 1  ) setCount(0);
          }}>{word[count]}.</h1>
        </div>
        <p>Welcome to my webpage :)</p>  
      </div>
    </div>
  );
}

function GameList() {
  return (
    <div className="mainContent flexcolumn">
      <p>Supposed list of games but I'm lazy af</p>
      <div className="list-of-games flexcolumn">
        <Link to="ttt">Tic Tac Toe</Link>
        <Link to="wip">Ultimate Tic Tac Toe (Coming soon...) </Link>
      </div>
    </div>
  );
}

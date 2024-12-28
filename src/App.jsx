import { Routes, Route, Link } from 'react-router-dom';
import { TTT_Menu, TTT_Game } from "./Tictactoe";
import { MyLogo, GithubLogo, LinkedInLogo } from "./assets/SVGLogo.jsx";
import { useState, useLayoutEffect } from 'react';


export default function Interface() {

  return (
    <div className="page">
      <div className="header">
        <div className="navigator">
          <div className="logo"><Link to="/"><MyLogo/></Link></div>
          <nav>
            <ul>
              <li><Link to="/" >About Me</Link></li>
              <li><Link to="/posts" >Posts</Link></li>
              <li><Link to="/contacts" >Contact Me</Link></li>
              <li><Link to="/games" >Games</Link></li>
            </ul>
          </nav>
          <nav>
            <ul>
              <li className="logo ext"><Link to="https://github.com/jefthepogi"><GithubLogo/></Link></li>
              <li className="logo ext"><Link to="https://www.linkedin.com/in/jef-russel-manongas-693a4a2a2/"><LinkedInLogo/></Link></li>
            </ul>
          </nav>
        </div>
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
  const word = ["CODING", "PROGRAMMING", "DESIGNING", "LEARNING", "FUCKING THAT ASS DAILY"];
  const [count, setCount] = useState(0);
  const techs = [
    {id: 1, icon: "fa-brands fa-js", name: "JavaScript"},
    {id: 2, icon: "fa-brands fa-python", name: "Python"},
    {id: 3, icon: "fa-solid fa-c", name: "C/C++"},
    {id: 4, icon: "fa-brands fa-react", name: "React"},
    {id: 5, icon: "fa-brands fa-css", name: "CSS"},
    {id: 6, icon: "fa-brands fa-html5", name: "HTML5"},
  ];
  return (
    <div className="mainContent flexcolumn">
      <div id="homepage-title">
        <h1>Jef Russel Manongas</h1>
        <div className='subheader'>
          <h1>I LOVE&nbsp;</h1>
          <h1 className="dynamic-word" onClick={() => {
            setCount(count + 1);  
            if (count == word.length - 1  ) setCount(0);
          }}>{word[count]}.</h1>
        </div>
        <p>I'm a 19 years old <span>Full-Stack</span> Developer. I have <span>4 years</span> of casual experience in both front-end and back-end programming. Mostly interested with building games, and solving real-world issues.</p>
      </div>
      <div id="tech-stack">
        <h2>I could work with</h2>
        <div className="carousel">
          <StackScroll objects={techs} />
        </div>
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
        <Link to="wip">Kung Fu Chess</Link>
      </div>
    </div>
  );
}

function StackScroll({objects}) {
  const animDur = 20;
  const n = objects.length;

  const listItems = objects.map(tech => { 
    const delay = animDur / n * (n - tech.id) * -1;
    return <span key={tech.id} style={{animationDuration: `${animDur}s`, animationDelay: `${delay}s`}}><i className={tech.icon}></i>{tech.name}</span>
  });

  return <div className="carousel-inner">{listItems}</div>;
}
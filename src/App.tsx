import { useState ,useEffect, useRef, ChangeEvent} from 'react'
import './App.css'
import Confetti from 'react-confetti'
import {useWindowSize} from '@react-hook/window-size'




function App() {
  
const [maingameboard,setGameBoard] = useState([[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]])
const [changed ,setChanged] = useState(false)
const [lost, setLost] = useState(false)
const [won, setWon] = useState(false)
const [score,setScore] = useState(0)
const [bestscore, setBestScore] = useState(0)
const [width,height] = useWindowSize()


function bestscoretracker() {
  if (bestscore < score) {
    setBestScore(score)
    localStorage.setItem('bestscore', JSON.stringify(score))
  }
}

function refresh() {
  window.location.reload();
}

  function randomize(n : number) {
    return Math.floor(Math.random() * n)
  }

  function initialize() {
    const copyboard = [...maingameboard]
    const x = randomize(4)
    const y = randomize(4)
    copyboard[x][y] = 2

    function insurance() {
      const j = randomize(4)
      const z = randomize(4)
      if (x != j && y != z) {
      copyboard[j][z] = 2
      return 
    }

      insurance()
  }
    insurance()
    setGameBoard(copyboard)
}

useEffect(() => {
  initialize()
  const bestscoreFromStorage = localStorage.getItem('bestscore')
  if (bestscoreFromStorage) {
    setBestScore(parseInt(bestscoreFromStorage))
  }
}, []);

useEffect(() => {
  const handleKeyPress = (event:any) => {
    if (event.key === 'ArrowUp') {
      up()
    }
    if (event.key === 'ArrowRight') {
      right()
    }
    if (event.key === 'ArrowDown') {
      down()
    }
    if (event.key === 'ArrowLeft') {
      left()
    }
  };

  
  document.addEventListener('keydown', handleKeyPress);

  
  return () => {
    document.removeEventListener('keydown', handleKeyPress);
  };
}, [maingameboard]);
  

  function addtwo(){

    let copy = [...maingameboard]
    let empty = []
    
    for (let i = 0; i < copy.length ; i++){
      for (let j = 0; j < copy[i].length ; j++){
       if (copy[i][j] === 0 ) {
        empty.push([i,j])
       }
      }
    }
    let randompick = randomize(empty.length)
    let chosen = empty[randompick]
    copy[chosen[0]][chosen[1]] = 2
    setGameBoard(copy)
  
  
  
}

function checklost(gameboard: number[][] = [[],[],[],[]]) {
  let count = 0
  for (let i = 0; i < gameboard.length ; i++){
   for (let j = 0; j < gameboard[i].length ; j++){
    //TOP ROW
    if (i == 0) {
     if (j == 0) {
      if (gameboard[i][j] !== gameboard[i+1][j] && gameboard[i][j] !== gameboard[i][j+1]){
        count += 1
        //TOP ROW - BELOW AND RIGHT
      }
     }
     if (j == gameboard[i].length - 1) {
      if (gameboard[i][j] !== gameboard[i+1][j] && gameboard[i][j] !== gameboard[i][j-1]){
        count += 1
        //TOP ROW - BELOW AND LEFT
      } 
     }
     if (j > 0 && j < gameboard[i].length - 1) {
       if (gameboard[i][j] !== gameboard[i+1][j] && gameboard[i][j] !== gameboard[i][j-1] && gameboard[i][j] !== gameboard[i][j+1]){
        count += 1
        //TOP ROW - BELOW, LEFT, AND RIGHT
      }
     }
    }
    //MIDDLE ROWS
    if (i !== 0 && i !== (gameboard.length - 1)) {
     if (j == 0) {
       if (gameboard[i][j] !== gameboard[i-1][j] && gameboard[i][j] !== gameboard[i+1][j] && gameboard[i][j] !== gameboard[i][j+1]){
        count += 1
        //MIDDLE ROWS - ABOVE, BELOW, AND RIGHT
      }
     }
     if (j == gameboard.length - 1) {
      if (gameboard[i][j] !== gameboard[i-1][j] && gameboard[i][j] !== gameboard[i+1][j] && gameboard[i][j] !== gameboard[i][j-1]){
        count += 1
        //MIDDLE ROWS - ABOVE, BELOW, AND LEFT
      } 
     }
     if (j > 0 && j < gameboard[i].length - 1) {
      if (gameboard[i][j] !== gameboard[i-1][j] && gameboard[i][j] !== gameboard[i+1][j] && gameboard[i][j] !== gameboard[i][j-1]&& gameboard[i][j] !== gameboard[i][j+1]){
        count += 1
        //MIDDLE ROWS - ABOVE, BELOW, LEFT, AND RIGHT
      } 
     } 
    }
    //BOTTOM ROW
    if (i == gameboard.length - 1) {
     if (j == 0) {
      if (gameboard[i][j] !== gameboard[i-1][j] && gameboard[i][j] !== gameboard[i][j+1]){
        count += 1
        //BOTTOM ROW - ABOVE AND RIGHT
      }
     }
     if (j == gameboard[i].length - 1) {
      if (gameboard[i][j] !== gameboard[i-1][j] && gameboard[i][j] !== gameboard[i][j-1]){
        count += 1
        //BOTTOM ROW - ABOVE AND LEFT
      }
     }
     if (j > 0 && j < gameboard[i].length - 1) {
      if (gameboard[i][j] !== gameboard[i-1][j] && gameboard[i][j] !== gameboard[i][j-1] && gameboard[i][j] !== gameboard[i][j+1]){
        count += 1
        //BOTTOM ROW - ABOVE, LEFT, AND RIGHT
      }
     }
    } 
   }
 }
 if (count == 16) {
  let zeroes = 0
  for (let row of maingameboard){
    for (let num of row){
      if (num == 0) {
        zeroes += 1
      }
    }
  }
    if (zeroes == 0) {
      setLost(true)
    }
 }
}

  function checkwon(gameboard: number[][] = [[],[],[],[]]) {
    for(let row of gameboard) {
      for(let num of row) {
        if (num == 2048) {
          setWon(true)
          return
        }
      }
    }
  }

  function removezero(gameboard: number[][] = [[],[],[],[]]) {
    let j = 0;
    for (let row of gameboard) {
      let val = 0;
      gameboard[j] = row.filter(i => i !== val);
      j++;
    }
  }

 

  function combine(copy: number[][] = [[],[],[],[]]){
    removezero(copy);
    for (let row of copy) {
      for (let i = 0; i < row.length - 1; i++) {
        let num = row[i];
        if (num === row[i + 1]) {
          row[i] = num * 2;
          setScore((score) => score += row[i])
          row[i + 1] = 0;
        }
      }
    }
    removezero(copy);
    for (let row of copy) {
      for (let i = row.length; i < maingameboard[0].length; i++) {
        row.push(0);
      }
    }
  }

  function verticalize(copy: number[][] = [[],[],[],[]]) {
    let verticalcopy: number[][] = [[],[],[],[]]
    for (let i = 0; i < copy.length ; i++){
      for (let j = 0; j < copy[i].length ; j++){
       verticalcopy[i].push(copy[j][i]) 
      }
    }
    return verticalcopy
   }

  

  function left() {
    const copy = [...maingameboard]; 
    const copyoriginal = [...maingameboard]
    combine(copy);
    if (JSON.stringify(copy) !== JSON.stringify(copyoriginal)){
      setChanged(true)
    }
    setGameBoard(copy);
  }

  useEffect(() => {
    if (changed) {
      addtwo();
      setChanged(false);
    }
    checklost(maingameboard)
    checkwon(maingameboard)
    bestscoretracker()
  }, [maingameboard]);


  function right() {
    const copy = [...maingameboard];
    const copyoriginal = [...maingameboard]

    for (let row of copy) {
      row.reverse()
    }
    combine(copy)
    if (JSON.stringify(copy) !== JSON.stringify(copyoriginal)){
      setChanged(true)
    }

    for (let row of copy) {
      row.reverse()
    }
    
    setGameBoard(copy)
    
    
  }

  function up() {
    const copy = [...maingameboard]
    const copyoriginal = [...maingameboard]
    let verticalcopy = verticalize(copy)
    combine(verticalcopy)
    let unverticalizedcopy = verticalize(verticalcopy)
    if (JSON.stringify(unverticalizedcopy) !== JSON.stringify(copyoriginal)){
      setChanged(true)
    }
    setGameBoard(unverticalizedcopy)
  }

  function down() {
    const copy = [...maingameboard]
    const copyoriginal = [...maingameboard]
    let verticalcopy = verticalize(copy)
    for (let row of verticalcopy) {
      row.reverse()
    }
    combine(verticalcopy)
    for (let row of verticalcopy) {
      row.reverse()
    }
    let unverticalizedcopy = verticalize(verticalcopy)
    if (JSON.stringify(unverticalizedcopy) !== JSON.stringify(copyoriginal)){
      setChanged(true)
    }
    setGameBoard(unverticalizedcopy)
  }

  const [stopConfetti, setStopConfetti] = useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setStopConfetti(true);
    }, 15000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  

 

  


  




  

  
  return (
  <div>
    {won ? !stopConfetti && <Confetti
          width = {width}
          height = {height}
          numberOfPieces = {60}
          colors = {['#779ecb','#F8C8DC']}
          tweenDuration = {15}
          />
          :
          <div></div>
        }

    <div className = 'scoreboard-container'>
      <div className="game-title"><span className = 'Better'>Better</span><span className = 'title-2'>2048</span></div> 
      <div className="dropdown rules">
        <button type = 'button' className = 'btn btn-default dropdown-toggle rule-button' id = 'rules-dropdown'data-bs-toggle = 'dropdown'>
          <i>Rules</i>
        </button>
        <div className="dropdown-menu no-arrow-keys rule-explanation" aria-labelledby = 'rules-dropdown'>
          <b>How to Play:</b> <br></br>
          <br></br>
          <b>For Mobile Users:</b> Use the game-pad to combine like numbers<br></br>
          <b>For PC Users:</b> Use arrow keys to combine like numbers<br></br>
          <br></br>
          <b>Goal -</b> Achieve a 2048 tile then go for a high score
        </div>
      </div>
      <div className = 'score'>Score:{score}</div>
      {bestscore != 0 ? <div className = 'score'>Best Score:{bestscore}</div> : <div></div>}
    </div>
   

    <div className= 'd-flex justify-content-center'><button className = 'newgame'onClick ={() => refresh()}>New Game</button></div>
    <div className = 'd-flex justify-content-center'>
      
    <div className = 'gameboard-container'>
      <div className="gameboard-win-loss">
        {lost ? <div className = 'lost-won'>You Lost</div> : <div> </div>}
        {won ? <div className = 'lost-won'>You Won</div> : <div> </div>}
      </div>
      <div className="big-screen-rules">
      <b>How to Play:</b> <br></br>
          <br></br>
          <b>For Mobile Users:</b> Use the game-pad to combine like numbers<br></br>
          <b>For PC Users:</b> Use arrow keys to combine like numbers<br></br>
          <br></br>
          <b>Goal -</b> Achieve a 2048 tile then go for a high score
      </div>
    <div className="container-fluid">
      <div className="row">
        {maingameboard.map((numList) => {
          return numList.map(num => (
            <div className='col-3 d-flex justify-content-center align-items-center empty-div numbox'> 
              {num === 0 ? '' : num}
            </div>
          ))
          })
        }
      </div>

    </div>
    </div>
    </div>

    <div className = 'd-flex justify-content-center mt-3'>
      <div className = 'game-pad'>
        <div className = 'd-flex justify-content-center'> <button className = 'direction-button-up-down' onClick={() => up()}></button> </div>
        <button className = 'direction-button-left-right' onClick={() => left()}></button>
        <button className = 'direction-button-left-right'onClick={() => right()}></button>
        <div className = 'd-flex justify-content-center '> <button className = 'direction-button-up-down' onClick={() => down()}></button> </div>
      </div> 
    </div>

    
  </div>
  )
}



export default App

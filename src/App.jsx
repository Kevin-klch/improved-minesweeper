import './App.css'
import { generateField } from './App.js';
import { smileyReset } from './App.js';
import happyImage from './assets/img/smilehappy.png';
import sadImage from './assets/img/smileSad.png';
import glassesImage from './assets/img/smileGlasses.png';
import d0 from './assets/img/d0.svg'


function App() {
  return (
    <>
      <div id="fieldGenerator">
        <button id="fieldSmall" className="generator" onClick={(e) => generateField(e)}>Anfänger</button>
        <button id="fieldMid" className="generator" onClick={(e) => generateField(e)}>Fortgeschritten</button>
        <button id="fieldBig" className="generator" onClick={(e) => generateField(e)}>Profi</button>
      </div>
      <div id="game">
        <div id="stats">
          <div id="bombCounter">
            <img id="bombCounterFirstDigit" src={d0}/>
            <img id="bombCounterSecondDigit" src={d0}/>
            <img id="bombCounterThirdDigit" src={d0}/>
          </div>
          <div id="smileDiv">
            <div className="smile" id="smileHappy" onClick={smileyReset}><img src={happyImage} /></div>
            <div className="smile hidden" id="smileSad" onClick={smileyReset}><img src={sadImage} /></div>
            <div className="smile hidden" id="smileGlasses" onClick={smileyReset}><img src={glassesImage} /></div>
          </div>
          <div id="timer">
            <img id="timerFirstDigit" src={d0}/>
            <img id="timerSecondDigit" src={d0}/>
            <img id="timerThirdDigit" src={d0}/>
          </div>
        </div>
        <div className="vertical"></div>
        <div id="gameField" className="container">

        </div>
      </div>
    </>
  )
}

export default App
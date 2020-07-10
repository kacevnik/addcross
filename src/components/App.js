import React, {useState} from 'react';
import './App.css';

import { Context } from '../context';
import CrossArea from './CrossArea';

document.oncontextmenu = function () { return false };

function App() {

  const Obj = window.Obj.data

  function createArray(width, height) {

    const arr = []
    for (let i = 0; i < height; i++) {
      arr[i] = []
      for (let k = 0; k < width; k++) {
        arr[i][k] = { key: (i + 1) + '-' + (k + 1), color: false }
      }
    }
    return arr
  }

  const [size, setSize] = useState(20);
  const [color, setColor] = useState({"id":1,"color":"#000000"})
  const [button, setButton] = useState([false, false])
  const [width, setWidth] = useState(10);
  const [height, setHeight] = useState(10);
  const [cross, setCross] = useState(createArray(width, height));

  const style = {
    width: width * size + width - 1 + Math.ceil(width / 5) - 1,
    height: height * size + height - 1 + Math.ceil(height / 5) - 1,
  }

  const mouseDownEvent = (key) => {
      setCross(cross.map(row => {
        return row.map(el => {
          if (el.key === key) {
              if (!el.color) {
                el.color = color.color
              } else {
                el.color = el.color !== color.color ? color.color : false
              }
              setButton([!el.color ? 'none' : 'color', false])
          }
          return el
        })
      }))
  }

  const mouseOverEvent = (key) => {
      setCross(cross.map(row => {
        return row.map(el => {
          if (el.key === key) {
            if (button[0]) {
              if (button[0] === 'color') {
                el.color = color.color
              } else {
                el.color = false
              }
            }
          }
          return el
        })
      }))
  }

  const mouseUpEvent = () => {
    setButton([button[0] ? false : button[0], false])
  }

  const mouseLeaveEvent = () => {
    setButton([false, false])
  }
  
  return (
    <Context.Provider value={{mouseDownEvent, mouseOverEvent, mouseUpEvent, mouseLeaveEvent}}>
      <div className="App">
        <CrossArea cross={cross} size={size} style={style}/>
      </div>
    </Context.Provider>
  );
}

export default App;

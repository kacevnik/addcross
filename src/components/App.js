import React, {useState, useEffect} from 'react';
import md5 from 'md5';
import './App.css';

import { Context } from '../context';
import CrossArea from './CrossArea';
import FormAddCross from './FormAddCross';
import SelectColors from './SelectColors';

document.oncontextmenu = function () { return false };

function App() {

  const Obj = window.Obj.data
  const $ = window.jQuery

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

  const size = 20
  const [color, setColor] = useState({"id":1,"color":"#000000"})
  const [colors, setColors] = useState([{"id":1,"color":"#000000"}])
  const [button, setButton] = useState([false, false])
  const [width, setWidth] = useState(10);
  const [height, setHeight] = useState(10);
  const [cross, setCross] = useState(createArray(width, height));

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

  const changeSizeCross = (width, height) => {
    setWidth(width)
    setHeight(height)
    setCross(createArray(width, height))
  }

  const changeColor = (id) => {
    setColor(colors.filter(el => el.id === id)[0])
  }

  const addColor = (newColor) => {
    setColors([...colors, newColor])
  }

  const deleteColor = (id) => {
    if(colors.length > 2){
      setColors(colors.filter(a=>a.id !== id).map((el,ind)=>{
        el.id = ind + 1
        return el
      }))
    } else {
      setColors([{id: 1, color: '#000000'}])
    }
    const idColor = colors.filter((el) => el.id === id)
    if(colors.length === 2){
      setCross(cross.map(row =>{
        row.map(el=>{
          if(el.color) el.color = '#000000'
          return el
        })
        return row
      }))
    } else {
      setCross(cross.map(row =>{
        row.map(el=>{
          if(el.color === idColor[0].color) el.color = false
          return el
        })
        return row
      }))
    }
  }

  useEffect(()=>{
    if(colors.length === 1){
      setColor({id: 1, color: '#000000'})
    } else {
      setColor(colors[0])
    }
  }, [colors])

  const onAddNonogram = (e, name) => {
    e.preventDefault();
    let string = '';
    for (let i = 0; i < height; i++) {
      for (let k = 0; k < width; k++) {
        if (cross[i][k].color === false) {
          string += '0';
        } else {
          let id = colors.filter(el => el.color === cross[i][k].color)
          string += (id[0].id + '');
        }
      }
    }
    $.post(
      Obj.url,
      {
        action: 'addnonograms',
        hash: md5(string),
        ans: string,
        width: width,
        height: height,
        name: name,
        colors: colors,
        nonce: Obj.nonce,
      },
      function(response){
        console.log(response)
      }
    )
  }

  const style = {
    width: width * size + width - 1 + Math.ceil(width / 5) - 1,
    height: height * size + height - 1 + Math.ceil(height / 5) - 1,
  }

  return (
    <Context.Provider value={{mouseDownEvent, mouseOverEvent, mouseUpEvent, mouseLeaveEvent, changeSizeCross, changeColor, addColor, deleteColor, onAddNonogram}}>
      <div className="App">
        <FormAddCross width={width} height={height}/>
        <SelectColors color={color} colors={colors}/>
        <CrossArea cross={cross} size={size} style={style}/>
      </div>
    </Context.Provider>
  );
}

export default App;

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
  const [colors, setColors] = useState([])
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
    setColor(colors.filter(el => el.id === id)[0]);
  }

  const addColor = (newColor) => {
    setColors([...colors, newColor]);
  }

  const deleteColor = (id) => {

    setColors(colors.filter(a=>a.id !== id).map((el,ind)=>{
      el.id = ind + 1
      return el
    }));

  }

  useEffect(()=>{
    if(colors.length > 0){
      setColor(colors[colors.length - 1]);
      setCross(cross.map(row =>{
        row.map(el=>{
          if(colors.filter(c => c.color === el.color).length === 0){
            el.color = null;
          }
          return el
        })
        return row;
      }))
    } else {
      setColor({id: 1, color: '#000000'});
      setCross(createArray(width, height))
    }
  }, [colors, width, height])

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

    const messages = {
      ok: {mess: '<span style="color: #0ED00E;">Ваш кроссворд добавлен!<br> После проверки мы его опубликуем</span>', type: true},
      no_user: {mess: '<span style="color: #8f2923;">Зарегистрируйтесь, или войдите<br> под своим логином и паролем</span>', type: false},
      error_name: {mess: '<span style="color: #8f2923;">Укажите название<br> кроссворда</span>', type: false},
      error_empty_field: {mess: '<span style="color: #8f2923;">Поле не должно быть пустым!</span>', type: false},
      error_data: {mess: '<span style="color: #8f2923;">Ошибка загрузки</span>', type: false},
      error_nonce: {mess: '<span style="color: #8f2923;">Ошибка загрузки</span>', type: false},
      error_hash: {mess: '<span style="color: #8f2923;">Ошибка загрузки</span>', type: false},
      error_size: {mess: '<span style="color: #8f2923;">Неправильно заданны размеры</span>', type: false},
      error_more: {mess: '<span style="color: #8f2923;">Такой кроссворд<br>уже есть на сайте</span>', type: true},
      error_color: {mess: '<span style="color: #8f2923;">Неправильно заданны цвета</span>', type: true},
      error_str: {mess: '<span style="color: #8f2923;">Каждая строчка и столбец<br>Должны иметь<br>Заполненные клетки</span>', type: true},
      error_insert: {mess: '<span style="color: #8f2923;">Ошибка загрузки</span>', type: true},
    }

    document.getElementById("nonogramsAnsShow").click();

    $.post(
      Obj.url,
      {
        action: 'addnonograms',
        hash: md5(string),
        ans: string,
        width: width,
        height: height,
        name: name,
        colors: btoa(JSON.stringify(colors)),
        nonce: Obj.nonce,
      },
      function(response){
        console.log(response)
        $("#nonogramsAcsses").data('action', response);
        $("#nonogramsAcsses p").html(messages[response].mess);
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

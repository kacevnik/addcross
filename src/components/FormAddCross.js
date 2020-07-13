import React, { useContext, useState } from 'react';
import { Context } from '../context';

function FormAddCross({width, height}) {

    const { changeSizeCross } = useContext(Context);

    const [name, setName] = useState('')
    const [widthField, setWidth] = useState(width)
    const [heightField, setHeight] = useState(height)

    const onChangeName = (event) => {
        if(event.target.name === 'name') {
            setName(event.target.value)
        }
    }

    const onChangeSize = (event) => {
        const val = event.target.value
        if(/^[-]?\d+$/.test(val) || val === ''){
            if(event.target.name === 'width'){
                setWidth(val)
            } else {
                setHeight(val)
            }
        }
    }

    const focusoutWidth = (event) => {
        let value = parseInt(event.target.value, 10)
        if(/^[-]?\d+$/.test(value) || value === ''){
            if(value <= 5) value = 5
            if(value >= 50) value = 50
            if(event.target.name === 'width'){
                setWidth(value)
                changeSizeCross(value, heightField)
            }else{
                setHeight(value)
                changeSizeCross(widthField, value)
            }
        }
    }

    const handleSize = (type, size) => {
        let value = size === 'width' ? widthField : heightField
        value = parseInt(value, 10)
        value = type === 'minus' ? (value - 1) : (value + 1)
        if(value <= 5) value = 5
        if(value >= 50) value = 50
        if(size === 'width'){
            setWidth(value)
            changeSizeCross(value, heightField)
        } else {
            setHeight(value)
            changeSizeCross(widthField, value)
        }
    }

    return (
        <form>
            <div className="name-add">
                <label htmlFor="name_input">Название:</label>
                <input
                    type="text"
                    name="name"
                    id="name_input"
                    required=""
                    value={name}
                    onChange={(event)=>onChangeName(event)}
                />
            </div>
            <div className="name-add-size">
                <label htmlFor="width_input">Ширина:</label>
                <span className="name-add-minus" onClick={() => handleSize('minus', 'width')}>-</span>
                <input
                    type="text"
                    name="width"
                    id="width_input"
                    value={widthField}
                    required=""
                    onChange={(event)=>onChangeSize(event)}
                    onBlur={(event)=>focusoutWidth(event)}
                />
                <span className="name-add-plus" onClick={() => handleSize('plus', 'width')}>+</span>
            </div>
            <div className="name-add-size">
                <label htmlFor="height_input">Высота:</label>
                <span className="name-add-minus" onClick={() => handleSize('minus', 'height')}>-</span>
                <input
                    type="text"
                    name="height"
                    id="height_input"
                    value={heightField}
                    required=""
                    onChange={(event)=>onChangeSize(event)}
                    onBlur={(event)=>focusoutWidth(event)}
                />
                <span className="name-add-plus" onClick={() => handleSize('plus', 'height')}>+</span>
            </div>
        </form>
    );
}

export default FormAddCross;
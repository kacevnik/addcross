import React, {useContext, useState} from 'react'
import { ChromePicker } from 'react-color';
import { Context } from '../context';

function SelectColors({colors, color}) {

    const { changeColor, addColor, deleteColor } = useContext(Context);

    const [showColorPicker, setSCPicker] = useState(false)
    const [newColor, setNewColor] = useState({hex: '#22194D'})

    const handleClick = () => {
        setSCPicker(!showColorPicker)
    }

    const closePicker = () => {
        setSCPicker(false)
        const c = colors.filter(el=>el.color === newColor.hex)
        if(c.length === 0){
            addColor({id: colors.length + 1, color: newColor.hex})
        }
    }

    const elements = colors.map(el => {
        let elStyle = {
            backgroundColor: el.color,
        }
        let clx = ['select-color-elements']
        if(color.id === el.id) {
            clx.push('color-now')
        }

        return (
            <div
                title="Выбрать цвет"
                className={clx.join(' ')}
                key={el.id}
                onClick={() => changeColor(el.id)}>
                    <div style={elStyle}></div>
                    {colors.length > 1 ? <span onClick={()=>deleteColor(el.id)}>&times;</span> : null}
            </div>
        )
    })

    if(colors.length < 6) {
        elements.push(<div key="10" className="select-color-elements add-colors" onClick={ handleClick }>+</div>)
    }
    return (
        <div className="select-colors">
            {elements}
            {showColorPicker ?<div className="add-color-popup"><div className="add-color-cover" onClick={closePicker}/><ChromePicker disableAlpha={true} color={newColor} onChange={setNewColor} /></div> : null}
        </div>
    )
}

export default SelectColors
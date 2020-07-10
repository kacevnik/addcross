import React, { useContext } from 'react';
import { Context } from '../context';

function CrossArea({ size, cross, style }) {

    const { mouseDownEvent, mouseOverEvent, mouseUpEvent, mouseLeaveEvent } = useContext(Context);

    let keyRow = 0;

    const elements = cross.map(row => {
        const styleRow = {
            height: size,
        }
        return (
            <div key={keyRow++} className="cross-row" style={styleRow}>
                {row.map(el => {
                    const styleElem = {
                        width: size,
                        height: size,
                        backgroundColor: !el.color ? 'transparent' : el.color
                    }
                    return (
                        <div
                            onMouseDown={() => mouseDownEvent(el.key)}
                            onMouseOver={() => mouseOverEvent(el.key)}
                            onMouseUp={() => mouseUpEvent()}
                            key={el.key}
                            className="cross-elem"
                            style={styleElem}>
                        </div>
                    )
                })}
            </div>
        )
    })

    return (
        <div className="cross-area" style={style} onMouseLeave={() => mouseLeaveEvent()}>
            {elements}
        </div>
    );
}

export default CrossArea;
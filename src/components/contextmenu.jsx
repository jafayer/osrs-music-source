import React, { useEffect } from 'react';

function ContextMenu({ x, y, song, handleClick, addToQueue, close }) {
    
    useEffect(() => {
        document.addEventListener('click', close);
        
        return () => {
            document.removeEventListener('click', close);
        };
    }, [close]);

    const play = (e, song) => {
        e.preventDefault();
        handleClick(null, song);
    };

    const addToQueueHandler = (e, song) => {
        e.preventDefault();
        addToQueue(song);
    };

    console.log({ x, y, song, handleClick, addToQueue, close });
    
    return ( 
        <div className="contextMenu" style={{"top": y, "left": x}}>
            <div className="header">
                <p>Choose Option</p>
            </div>
            <ul>
                <li onClick={(e) => {play(e, song)}}
                    onContextMenu={(e) => {e.preventDefault()}}
                >Play <span>Song</span></li>
                <li onClick={(e) => {addToQueueHandler(e, song)}}
                    onContextMenu={(e) => {e.preventDefault()}}
                >Add to queue <span>Song</span></li>
            </ul>
        </div>
    );
}
 
export default ContextMenu;
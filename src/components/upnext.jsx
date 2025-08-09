import React from 'react';
import Swipe from 'react-easy-swipe';

function UpNext({ mode, standardQueue, manualQueue, removeFromQueue, handleClick, copy, shuffle, toggleShuffle }) {
    
    const makeUpNext = (queue) => {
        let arr = [];
        for(let i = 0; i < queue.length; i++) {
            let elem = (
                <Swipe key={i} onSwipeRight={() => {removeFromQueue(i)}} tolerance="80">
                    <li onClick={(e) => {
                        if(e.ctrlKey || e.metaKey) { // if ctrl/cmd, add to queue
                            removeFromQueue(i)
                        } else {
                            e.preventDefault();
                            handleClick(null,queue[i]);
                            removeFromQueue(i)
                        }
                    }}
                    onContextMenu={(e) => {e.preventDefault(); removeFromQueue(i)}}>
                        {queue[i].title}
                    </li>
                </Swipe>
            );

            arr.push(elem);
        }

        return arr;
    };

    return (
        <div className="upNext">
            <h1>Up Next:</h1>
            <p className="copy" onClick={copy}>Copy link to queue <span className="material-icons">content_copy</span></p>
            <div className="shuffle">
                <p>Shuffle?</p>
                <div className="switch">
                    <label>
                        <input type="checkbox" checked={shuffle} onChange={toggleShuffle} />
                        <span className="slider round"></span>
                    </label>
                </div>
            </div>
            <ul>
                {mode === "auto" && makeUpNext(standardQueue)}
                {mode === "manual" && makeUpNext(manualQueue)}
            </ul>
        </div>
    );
}
 
export default UpNext;
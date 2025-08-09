import React from 'react';
import Swipe from 'react-easy-swipe';
import { Link } from "react-router-dom";

function Song({ song, handleClick, addToQueue, contextMenu }) {
    return (
        <Link to={song.title.replaceAll(" ","_")} onContextMenu={(e) => {contextMenu(e, song)}}>
            <li key={song.id} onClick={(e) => {handleClick(e, song)}}>
                <Swipe onSwipeRight={() => {addToQueue(song)}} tolerance="100">
                    <p>{song.title}</p>
                </Swipe>
            </li>
        </Link>
    );
}
 
export default Song;
import React, { useState } from 'react';
import Song from './song';
import ContextMenu from './contextmenu';

function Player({ mode, modeSelect, playing, songs, handleClick, addToQueue }) {
    const [contextMenu, setContextMenu] = useState(false);
    const [contextMenuSong, setContextMenuSong] = useState(null);
    const [x, setX] = useState(null);
    const [y, setY] = useState(null);

    const makeSongs = (song) => {
        return (
            <Song 
                key={song.id}
                song={song}
                handleClick={handleClick}
                addToQueue={addToQueue}
                contextMenu={showContextMenu}
            />
        );
    };

    const showContextMenu = (e, song) => {
        e.preventDefault();
        closeMenu();
        setContextMenu(true);
        setContextMenuSong(song);
        setX(e.pageX);
        setY(e.pageY);
    };

    const closeMenu = () => {
        setContextMenu(false);
        setX(null);
        setY(null);
        setContextMenuSong(null);
    };

    const addPopup = () => {
        if(contextMenu) {
            return (
                <ContextMenu
                    x={x}
                    y={y}
                    song={contextMenuSong}
                    handleClick={handleClick}
                    addToQueue={addToQueue}
                    close={closeMenu}
                />
            );
        }
        return null;
    };

    return ( 
        <>
            {addPopup()}

            <div className="player">
                <div className="modeSelect">
                    <button 
                        onClick={() => {modeSelect("auto")}}
                        className={"auto " + (mode === "auto" ? "active" : "")}></button>
                    <button 
                        onClick={() => {modeSelect("manual")}}
                        className={"manual " + (mode === "manual" ? "active": "")}></button>
                    <button 
                        onClick={() => {modeSelect("loop")}}
                        className={"loop " + (mode === "loop" ? "active" : "")}></button>
                </div>
                <div className="playing">Playing:<br /><span>
                    {!playing && "Choose a song!"}
                    {playing && playing.title}
                </span></div>
                <div className="songs">
                    <ul>
                        {songs && songs.map(song => makeSongs(song))}
                        {!songs && "Please wait, loading!"}
                    </ul>
                </div>
            </div>
        </>
    );
}
 
export default Player;
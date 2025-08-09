import React from 'react';

function Controls({ loading, isPaused, playPause, skip }) {
    return (
        <div className="controls">
            <button className="playPause" onClick={playPause}>
                <p className="material-icons">
                    {loading ? "refresh" : (isPaused ? "play_arrow" : "pause")}
                </p>
            </button>
            <button className="button" onClick={skip}>
                <p className="material-icons">skip_next</p>
            </button>
        </div>
    );
}
 
export default Controls;
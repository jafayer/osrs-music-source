import React, { Component } from 'react';

class Controls extends Component {
    state = {  }
    render() { 
        return (

            <div className="controls">
                <button className="playPause" onClick={this.props.playPause}><p className="material-icons">{this.props.isPaused ? "play_arrow" : "pause"}</p></button>
                <button className="playPause" onClick={this.props.skip}><p className="material-icons">skip_next</p></button>
            </div>
        );
    }
}
 
export default Controls;
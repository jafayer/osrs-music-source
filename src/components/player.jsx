import React, { Component } from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
  } from "react-router-dom";

class Player extends Component {
    state = {  }
    render() {
        return ( 

            <div className="player">
                <div className="modeSelect">
                    <button 
                        onClick={() => {this.props.modeSelect("auto")}}
                        className={this.props.mode === "auto" ? "active" : ""}><p>Auto</p></button>
                    <button 
                        onClick={() => {this.props.modeSelect("manual")}}
                        className={this.props.mode === "manual" ? "active": ""}><p>Man</p></button>
                    <button 
                        onClick={() => {this.props.modeSelect("loop")}}
                        className={this.props.mode === "loop" ? "active" : ""}><p>Loop</p></button>
                </div>
                <div className="playing">Playing:<br /><span>
                    {!this.props.playing && "Choose a song!"}
                    {this.props.playing && this.props.playing.title}
                </span></div>
                <div className="songs">
                    <ul>
                        {this.props.songs && this.props.songs.map(i => this.props.makeSongs(i))}
                        {!this.props.songs && "Please wait, loading!"}
                    </ul>
                </div>
            </div>
         );
    }
}
 
export default Player;
import React, { Component } from 'react';
import Song from './song';
import ContextMenu from './contextmenu';

class Player extends Component {
    state = { 
        contextMenu: false
    }

    render() {
        return ( 

            <>
                {this.addPopup()}

                <div className="player">
                    <div className="modeSelect">
                        <button 
                            onClick={() => {this.props.modeSelect("auto")}}
                            className={"auto " + (this.props.mode === "auto" ? "active" : "")}></button>
                        <button 
                            onClick={() => {this.props.modeSelect("manual")}}
                            className={"manual " + (this.props.mode === "manual" ? "active": "")}></button>
                        <button 
                            onClick={() => {this.props.modeSelect("loop")}}
                            className={"loop " + (this.props.mode === "loop" ? "active" : "")}></button>
                    </div>
                    <div className="playing">Playing:<br /><span>
                        {!this.props.playing && "Choose a song!"}
                        {this.props.playing && this.props.playing.title}
                    </span></div>
                    <div className="songs">
                        <ul>
                            {this.props.songs && this.props.songs.map(i => this.makeSongs(i))}
                            {!this.props.songs && "Please wait, loading!"}
                        </ul>
                    </div>
                </div>
            </>
         );
    }

    makeSongs = (song) => {
        let elem = (
          <Song 
            song={song}
            handleClick={this.props.handleClick}
            addToQueue={this.props.addToQueue}
            contextMenu={this.contextMenu}
          />
        );
    
        return(elem);
      }


      // contextMenu setup
      contextMenu = (e,song) => {
        e.preventDefault();
        this.closeMenu();
        this.setState({
            contextMenu: true,
            contextMenuSong: song,
            x: e.pageX,
            y: e.pageY
        }, () => {
            this.addPopup();
        });  
    }

    addPopup = () => {
        if(this.state.contextMenu) {
            let menu = (<ContextMenu
                x={this.state.x}
                y={this.state.y}
                click={this.closeMenu}
                song={this.state.contextMenuSong}
                handleClick={this.props.handleClick}
                addToQueue={this.props.addToQueue}
                close={this.closeMenu}
            />);
            return(menu)
        }
    }

    closeMenu = () => {
        this.setState({
            contextMenu: false,
            x: null,
            y: null
        });
    }

}
 
export default Player;
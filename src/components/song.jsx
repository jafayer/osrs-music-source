import React, { Component } from 'react';
import ContextMenu from './contextmenu';

import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
  } from "react-router-dom";


class Song extends Component {
    state = { 
        contextMenu: false
     }

    render() {
        return (
            <>
                <div>
                    {(this.state.contextMenu && this.addPopup())}
                </div>
                
                <Link to={this.props.song.title.replaceAll(" ","_")} onContextMenu={(e) => {this.contextMenu(e)}}>
                    <li key={this.props.song.id} onClick={(e) => {this.props.handleClick(e, this.props.song)}}>
                    <p>{this.props.song.title}</p>
                    </li>
                </Link>
            </>
        );
    }

    addPopup = () => {
        if(this.state.contextMenu) {
            let menu = (<ContextMenu
                x={this.state.x}
                y={this.state.y}
                click={this.closeMenu}
                song={this.props.song}
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

    contextMenu = (e) => {
        e.preventDefault();
        this.closeMenu();
        this.setState({
            contextMenu: true,
            x: e.pageX,
            y: e.pageY
        }, () => {
            this.addPopup(e.pageX, e.pageY);
        });  
    }
}
 
export default Song;
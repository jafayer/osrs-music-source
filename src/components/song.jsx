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
        contextMenu: null
     }

    render() {
        return (
            <>
                <div>
                    {(this.state.contextMenu && this.state.contextMenu)}
                </div>
                
                <Link to={this.props.song.title.replaceAll(" ","_")} onContextMenu={(e) => {this.contextMenu(e)}}>
                    <li key={this.props.song.id} onClick={(e) => {this.props.handleClick(e, this.props.song)}}>
                    <p>{this.props.song.title}</p>
                    </li>
                </Link>
            </>
        );
    }

    addPopup = (x,y) => {
        if(this.state.contextMenu) {
            this.closeMenu();
        }

        let menu = (<ContextMenu
            x={x}
            y={y}
            click={this.closeMenu}
            song={this.props.song}
            handleClick={this.props.handleClick}
            addToQueue={this.props.addToQueue}
            close={this.closeMenu}
        />);
        this.setState({
            contextMenu: null,
            contextMenu: menu
        });
    } 

    closeMenu = () => {
        this.setState({contextMenu: null});
    }

    contextMenu = (e) => {
        e.preventDefault();
        this.addPopup(e.pageX, e.pageY);
    }
}
 
export default Song;
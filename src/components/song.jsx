import React, { Component } from 'react';
import ContextMenu from './contextmenu';


import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
  } from "react-router-dom";


class Song extends Component {
    state = { }

    render() {
        return (
            <Link to={this.props.song.title.replaceAll(" ","_")} onContextMenu={(e) => {this.props.contextMenu(e, this.props.song)}}>
                <li key={this.props.song.id} onClick={(e) => {this.props.handleClick(e, this.props.song)}}>
                <p>{this.props.song.title}</p>
                </li>
            </Link>
        );
    }
    
}
 
export default Song;
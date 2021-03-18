import React, { Component } from 'react';
import Swipe from 'react-easy-swipe';


import {
    Link
  } from "react-router-dom";


class Song extends Component {
    state = { }

    render() {
        return (
            <Link to={this.props.song.title.replaceAll(" ","_")} onContextMenu={(e) => {this.props.contextMenu(e, this.props.song)}}>
                <li key={this.props.song.id} onClick={(e) => {this.props.handleClick(e, this.props.song)}}>
                    <Swipe onSwipeRight={() => {this.props.addToQueue(this.props.song)}} tolerance="100">
                        <p>{this.props.song.title}</p>
                    </Swipe>
                </li>
            </Link>
        );
    }
    
}
 
export default Song;
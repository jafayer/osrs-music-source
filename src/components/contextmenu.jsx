import React, { Component } from 'react';

class ContextMenu extends Component {
    state = { }
    render() {

        return ( 
            <div className="contextMenu" style={{"top": this.props.y, "left": this.props.x}}>
                <div className="header">
                    <p>Choose Option</p>
                </div>
                <ul>
                    <li onClick={(e) => {this.play(e,this.props.song)}}
                        onContextMenu={(e) => {e.preventDefault()}}
                    >Play <span>Song</span></li>
                    <li onClick={(e) => {this.addToQueue(e,this.props.song)}}
                        onContextMenu={(e) => {e.preventDefault()}}
                    >Add to queue <span>Song</span></li>
                </ul>
            </div>
         );
    }
    

    componentDidMount = () => {
        document.addEventListener('click', this.props.close);
    }

    play = (e,song) => {
        e.preventDefault();
        this.props.handleClick(null,song);
    }

    addToQueue = (e, song) => {
        e.preventDefault();
        this.props.addToQueue(song);
    }

    componentWillUnmount = () => {
        document.removeEventListener('click',this.props.close);
    }
}
 
export default ContextMenu;
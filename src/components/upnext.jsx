import React, { Component } from 'react';


class UpNext extends Component {
    state = {  }
    render() {

        
        return (
            <div className="upNext">
                <h1>Up Next:</h1>
                <p className="copy" onClick={this.props.copy}>Copy link to queue <span className="material-icons">content_copy</span></p>
                <ul>
                    {this.props.mode === "auto" && this.makeUpNext(this.props.standardQueue)}
                    {this.props.mode === "manual" && this.makeUpNext(this.props.manualQueue)}
                </ul>
            </div>
        );
    }

    makeUpNext = (queue) => {
        let arr = [];
        for(let i = 0; i < queue.length; i++) {
            let elem = (
                <li key={i} onClick={(e) => {
                    if(e.ctrlKey || e.metaKey) { // if ctrl/cmd, add to queue
                        this.props.removeFromQueue(i)
                    } else {
                        e.preventDefault();
                        this.props.handleClick(null,queue[i]);
                        this.props.removeFromQueue(i)
                    }
                }}
                
                li onContextMenu={(e) => {e.preventDefault(); this.props.removeFromQueue(i)}}>
                    {queue[i].title}
                </li>
            );

            arr.push(elem);
        }

        return(arr);
    }
}
 
export default UpNext;
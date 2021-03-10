import React, { Component } from 'react';


class UpNext extends Component {
    state = {  }
    render() {

        
        return (
            <div className="upNext">
                <h1>Up Next:</h1>
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
                <li key={i} onClick={() => {this.props.removeFromQueue(i)}}>
                    {queue[i].title}
                </li>
            );

            arr.push(elem);
        }

        return(arr);
    }
}
 
export default UpNext;
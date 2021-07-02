import React, { Component } from 'react';

class Instructions extends Component {
    state = { 
        hidden: true
     }
    render() { 
        return (
            <div className="instructions">
                <h1 onClick={this.showHide}>Instructions <i className="material-icons">{this.state.hidden ? "expand_more" : "expand_less"}</i></h1>
                <div className={this.state.hidden && "hidden"}>
                    <p>Click on a song to play. To add a song to the queue, either <span className="code">ctrl/cmd+click</span> or <span className="code">right click</span> and select "add to queue." On mobile, <span className="code">swipe right</span> on the song.</p>
                    <p>To remove a song from the queue, either <span className="code">ctrl/cmd+click</span> or <span className="code">right click</span>. On mobile, <span className="code">swipe right</span> to remove a song from a queue.</p>
                    <p>You can link to any song by entering the name in the url (i.e. <span className="code">https://runetunes.com/sea_shanty2</span>. You can also create custom playlists and use the "Copy link to queue" button to save and share! Your playlist will load from that link every time.</p>
                    <p>If you enable shuffling, your link will shuffle the songs every time you go to it. You can also shuffle the entire playlist by visiting <a href="https://runetunes.com/shuffle">https://runetunes.com/shuffle</a></p>
                </div>     
            </div>
        );
    }

    showHide = () => {
        this.setState({hidden: !this.state.hidden});
    }
}
 
export default Instructions;
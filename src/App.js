import React, { Component } from 'react';
import './App.css';

class App extends Component {
  state = {  }
  render() { 
    return (
      <div>
        <button onClick={this.playPause}>Play/Pause</button>
        {this.state.songlist && this.state.songlist.map(i => this.makeSongs(i))}
      </div>
    );
  }

  audioCtx;

  // init logic
  getFileList = () => {
    fetch('http://localhost:3001')
    .then(res => res.json())
    .then(json => {
      this.setState({songlist: json},
        () => {console.log(this.state.songlist)});
    })
  }

  componentDidMount = () => {
    this.getFileList();

    const AudioContext = window.AudioContext || window.webkitAudioContext;
    this.audioCtx = new AudioContext();
  }

  makeSongs = (song) => {
    let elem = (
      <li onClick={() => {this.getSong(song)}}>
        <p>{song.split('.')[0]}</p>
      </li>
    );

    return(elem);
  }

  // file fetching logic

  getSong = (song) => {
    console.log('Waiting!');
    if(this.state.isPlaying) {
      this.state.isPlaying.stop(0);
    }

    const baseurl = 'https://archive.org/download/OldRunescapeSoundtrack/';
    const path = encodeURI(song);
    const url = baseurl+path;

    fetch(url)
    .then(res => res.arrayBuffer())
    .then(abuffer => {
      this.audioCtx.decodeAudioData(abuffer, res =>{

        let source = this.audioCtx.createBufferSource();
        source.buffer = res;

        this.setState({isPlaying: source},
          () => {
            source.connect(this.audioCtx.destination);

            console.log('Done waiting!');
            source.start();
            if(this.audioCtx.state === 'suspended') this.audioCtx.resume();
            console.log(this.audioCtx);
          });
      });
    });
  }

  playPause = () => {
    if(this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    } else if(this.audioCtx.state === "running") {
      this.audioCtx.suspend();
    }
  }

}
 
export default App;
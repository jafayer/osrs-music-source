import React, { Component } from 'react';
import Player from './components/player';
import UpNext from './components/upnext';
import Controls from './components/controls';
import Song from './components/song';
import './App.css';
import data from './data.json';
import AudioWrapper from './resources/audiowrapper';
import MediaSession from '@mebtte/react-media-session';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

class App extends Component {
  state = {
    isPaused: true,
    mode: "auto",
    song: null,
    manualQueue: [],
    standardQueue: [
      {"filename":"Harmony.ogg","url":"https://archive.org/download/OldRunescapeSoundtrack/Harmony.ogg","id":"160","title":"Harmony"},
      {"filename":"Adventure.ogg","url":"https://archive.org/download/OldRunescapeSoundtrack/Adventure.ogg","id":"1","title":"Adventure"},
      {"filename":"Autumn Voyage.ogg","url":"https://archive.org/download/OldRunescapeSoundtrack/Autumn%20Voyage.ogg","id":"21","title":"Autumn Voyage"},
      {"filename":"Camelot.ogg","url":"https://archive.org/download/OldRunescapeSoundtrack/Camelot.ogg","id":"45","title":"Camelot"}]
   }
  render() {
    return (
      <div className="wrap">
        <div>
          <Player
            mode={this.state.mode}
            modeSelect={this.modeSelect}
            playing={this.state.playing}
            songs={this.state.songlist}
            makeSongs={this.makeSongs}
            handleClick={this.handleClick}
            addToQueue={this.addToQueue}
          />
          <Controls
            isPaused={this.state.isPaused}
            playPause={this.playPause}
            skip={this.skip}
          />
          <UpNext
            mode={this.state.mode}
            standardQueue={this.state.standardQueue}
            manualQueue={this.state.manualQueue}
            removeFromQueue={this.removeFromQueue}
          />
        </div>
        <button onClick={() => {console.log(this.audio)}}>Check Audio</button>
        <button onClick={() => {console.log(this.state)}}>Check state</button>
        <button onClick={() => {console.log(this.props)}}>Check props</button>
        <button onClick={() => {console.log(this.audio.paused)}}>Is paused?</button>
        <button onClick={() => {this.audio.play()}}>Is paused?</button>

        <p className="instructions">Press ctrl+click to add a song to the queue!</p>
        <p className="instructions">Click a song in the queue to remove it!</p>
        <MediaSession
          title={this.state.song && this.state.song.title}
          artist="RuneScape Original Soundtrack"
          artwork={[
            {
              src: './album_cover.jpg',
              sizes: '640x640',
              type: 'image/jpg'
            }
          ]}
          onPlay={this.audio.play}
          onPause={this.audio.pause}
          onNextTrack={this.skip}
        >
          children or null
        </MediaSession>;
      </div>
    );
  }

  // init logic
  audio = new AudioWrapper();

  getActiveQueue = (mode) => {
    let map = {
      manual: 'manualQueue',
      auto: 'standardQueue'
    }

    return(map[mode]);
  }

  componentDidMount = () => {

    this.audio = new AudioWrapper();
    this.audio.audio.onended = this.ended;

    this.setState({songlist: data.songs}, () => {
      console.log(this.state.songslist)
    });

    document.addEventListener('keydown', e => {
      if(e.code === "Space") {
        e.preventDefault();
        document.querySelector(".playPause").focus();
        this.playPause();
        document.querySelector(".playPause").focus();
      }
    });

    this.audio.audio.addEventListener('play', () => {
      this.setState({
        isPaused: false
      }, () => {
        console.log("Playing!");
      });
    });

    this.audio.audio.addEventListener('pause', () => {
      this.setState({
        isPaused: true
      }, () => {
        console.log("Paused!");
      });
    });

    this.audio.audio.addEventListener('loadeddata', () => {
      this.setState({song: this.audio.song}, () => {
        document.title = "RuneScape Music Player - " + this.state.song.title;
        console.log(this.state.song);
      });
    });

    if(this.props.match) {
      let match = this.props.match.params.song.replaceAll("_"," ");
      console.log(match);
      let song = data.songs.find(i => i.title.toLowerCase() === match.toLowerCase());
      if(song) {
        this.handleClick(null,song);
      }
    }

    let queryString = new URLSearchParams(this.props.location.search);
    if(queryString.get('queue')) {
      let version = queryString.get("v");
      let queue = queryString.get("queue").split(",");
      queue = queue.map(song => song.replaceAll("_"," "));
      let inserts = [];

      queue.forEach(song => {
        let insert = data.songs.find(i => i.title.toLowerCase() === song.toLowerCase());
        if(insert) inserts.push(insert);
      })

      console.log(inserts);
  
      this.setState({mode: "manual"}, () => {
        this.addToQueue.apply(null,inserts);
      })
    }

    if('mediasession' in navigator) {
      navigator.mediaSession.setActionHandler('play', this.playPause);
      navigator.mediaSession.setActionHandler('pause', this.playPause);
      navigator.mediaSession.setActionHandler('nexttrack', this.skip);
    }
  }

  // file fetching logic

  addToQueue = (...songs) => {

    let activeQueue = this.getActiveQueue(this.state.mode);
    let queue = Array.prototype.concat(this.state[activeQueue], songs);
  
    this.setState({
      [activeQueue]: queue
    });
  }

  handleClick = (event, song) => {
    if(event) { // if handleClick occurred from click event, check if should add to queue
      if(this.state.mode !== "loop" && (event.ctrlKey || event.metaKey)) { // if ctrl/cmd, add to queue
        event.preventDefault();
        this.addToQueue(song);
  
        return;
      }
    }

    if(this.state.playing) {
      this.audio.pause();
    }

    const url = song.url;
    console.log(url);

    this.audio.setSong(song);
    
    this.setState({
      playing: song,
    }, () => {
      this.audio.play();
    });

  }

  skip = () => {
    let activeQueue = this.getActiveQueue(this.state.mode);

    let queue = this.state[activeQueue].slice();

    if(queue.length === 0) {
      this.audio.song = null;
      this.audio.pause();
      this.setState({
        isPaused: true
      });

      return;
    }

    let play = queue.splice(0,1)[0];
    this.setState({
      [activeQueue]: queue
    }, () => {
      this.handleClick(null, play);
    });
  }

  playPause = () => {

    if(this.state.isPaused) {
      if(this.audio.getSrc() === "" && this.state.mode !== "loop") { // advance to next song if there's a queue and no current track

        let activeQueue = this.getActiveQueue(this.state.mode);

        let queue = this.state[activeQueue].slice();

        if(queue.length === 0) { // if queue is empty, break
          return;
        }

        let play = queue.splice(0,1)[0];
        this.setState({
          [activeQueue]: queue
        }, () => {
          this.handleClick(null, play);
        });
      }
      
      this.audio.play();

    } else {
      this.audio.pause();
    }
  }

  // mode logic
  /* For the purposes of making a more functional audio player,
  the modes have been adjusted from what they would be in the in-game player:

  Auto: after selected song ends, begins autoplay of pre-selected queue of songs
  Manual: Allows for manual queues of songs
  Loop: loops current song as normal*/

  modeSelect = (mode, clicked=true) => {

    if(mode === "loop") { 
      this.audio.audio.loop = true;
    } else { // make sure loop is false if previously declared
      this.audio.audio.loop = false;
    }

    this.setState({
      mode: mode
    }, () => {console.log("The mode is currently set to: " + mode)});
  }

  ended = () => {
    if(this.state.mode === "loop") {
      return;
    }

    let activeQueue = this.getActiveQueue(this.state.mode);

    if(this.state[activeQueue].length === 0) {
      this.audio.pause();
      return;   
    }

    let queue = this.state[activeQueue].slice();
    let play = queue.splice(0,1)[0];
    this.setState({
      [activeQueue]: queue,
    }, () => {
      this.handleClick(null, play);
      this.mediaSessionUpdate(play);
    });
  }

  removeFromQueue = (i) => {
    let activeQueue = this.getActiveQueue(this.state.mode);

    let queue = this.state[activeQueue].slice();
    queue.splice(i,1);

    this.setState({
     [activeQueue]: queue 
    });
  }

  mediaSessionUpdate = (song) => {
    if('mediaSession' in navigator) {
      navigator.mediaSession.metadata = new window.MediaMetadata({
        title: song.title,
        album: 'RuneScape Original Soundtrack'
      });
    }
  }
}

 
export default App;
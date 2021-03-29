import React, { Component } from 'react';
import Player from './components/player';
import UpNext from './components/upnext';
import Controls from './components/controls';
import MediaSession from './components/mediaSession';
import './App.css';
import data from './data.json';
import AudioWrapper from './resources/audiowrapper';
import Instructions from './components/instructions';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class App extends Component {
  state = {
    loading: false,
    isPaused: true,
    mode: "auto",
    manualQueue: [],
    standardQueue: [],
    shuffle: false,
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
            loading={this.state.loading}
          />
          <UpNext
            mode={this.state.mode}
            standardQueue={this.state.standardQueue}
            manualQueue={this.state.manualQueue}
            removeFromQueue={this.removeFromQueue}
            handleClick={this.handleClick}
            copy={this.copyToClipboard}
            shuffle={this.state.shuffle}
            toggleShuffle={this.toggleShuffle}
          />
          <Instructions />
          <ToastContainer />
        </div>
        <MediaSession
          isPaused={this.state.isPaused}
          audio={this.audio}
          song={this.state.song && this.state.song}
          onPlay={this.audio.play}
          onPause={this.audio.pause}
          onNextTrack={this.skip}

        />
      </div>
    );
  }

  // init logic
  audio = new AudioWrapper();

  success = (message) => {
    console.log(toast);
    toast.success(message, {
      position: "bottom-center",
      autoClose: 2000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      });
  }

  failure = (message) => {
    toast.error(message, {
      position: "bottom-center",
      autoClose: 2000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      });
  }

  getActiveQueue = (mode) => {
    let map = {
      manual: 'manualQueue',
      auto: 'standardQueue'
    }

    return(map[mode]);
  }

  shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
  
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
  
    return array;
  }

  componentDidMount = () => {

    this.audio.audio.onended = this.ended;

    this.setState({
      songlist: data.songs,
      standardQueue: data.queue
    });

    this.props.history.listen((route) => {
      console.log(this.props.history);
      let path = route.pathname.split('/')[1];
      let decoded = path.replaceAll("_"," ");
      let song = data.songs.find(i => i.title.toLowerCase() === decoded.toLowerCase());
      if(song) {
        if(this.state.song) {
          if(song.title !== this.state.song.title) {
            this.loadedFromUrlChange = true;
            this.handleClick(null,song);
          }
        }
      }
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

    this.audio.audio.addEventListener('canplay', () => {
      this.setState({song: this.audio.song, loading: false}, () => {
        document.title = "RuneScape Music Player - " + this.state.song.title;
        if(!this.loadedFromUrlChange) {
          this.props.history.push('/' + this.state.song.title.replaceAll(" ","_"));
        } else {
          this.loadedFromUrlChange = null;
        }
        document.querySelector('.playPause').classList.remove('loading');
      });
    });

    if(this.props.match) {
      let match = this.props.match.params.song.replaceAll("_"," ");
      let song = data.songs.find(i => i.title.toLowerCase() === match.toLowerCase());
      if(song) {
        this.handleClick(null,song);
      }
    }

    let queryString = new URLSearchParams(this.props.location.search);
    let isShuffled = queryString.get('shuffle') === "";

    if(queryString.get('queue')) {
      let version = queryString.get("v");
      let queue = queryString.get("queue").split(",");
      queue = queue.map(song => song.replaceAll("_"," "));
      let inserts = [];

      queue.forEach(song => {
        let insert = data.songs.find(i => i.title.toLowerCase() === song.toLowerCase());
        if(insert) inserts.push(insert);
      });

      if(isShuffled) {
        inserts = this.shuffle(inserts);
      }

      this.setState({mode: "manual", shuffle: isShuffled}, () => {
        this.addToQueue.apply(null,inserts);
      })
    } else {
      if(isShuffled) {
        let queue = this.shuffle(data.songs);

        this.setState({mode: 'manual', shuffle: isShuffled}, () => {
          this.addToQueue.apply(null, queue);
        });
      }
    }

    console.log("Shuffled? " + this.state.shuffle);

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
    }, () => {
      if('vibrate' in window.navigator) {
        window.navigator.vibrate(25);
      }
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
    document.querySelector('.playPause').classList.add('loading');
    
    this.setState({
      playing: song,
      loading: true
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
    }, () => {
      if('vibrate' in window.navigator) {
        window.navigator.vibrate([25,50,25])
      }
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

  copyToClipboard = () => {
    if('clipboard' in window.navigator) {
      let baseurl = "https://runetunes.com/";
      let path;
      if(this.state.playing) {
        path = this.state.playing.title.replace(' ', '_');
      }
      let queue = this.state[this.getActiveQueue(this.state.mode)].slice();
      let resQueue = queue.map(song => song.title.replaceAll(' ','_'));
      let url = baseurl+ (path ? path : "") + (resQueue.length > 0 ? ("?queue="+resQueue.join(",")) : "") + (this.state.shuffle ? "&shuffle" : "");

      window.navigator.clipboard.writeText(url).then(() => {
        console.log("wrote to clipboard: " + url);
        if('vibrate' in window.navigator) {
          window.navigator.vibrate(50,50,50);
          this.success('Copied to clipboard!');
        }
      });
    } else {
      this.failure('Couldn\'t copy to clipboard!');
    }
  }

  toggleShuffle = () => {
    this.setState({shuffle: !this.state.shuffle}, () => {
      if(this.state.shuffle) {
        let activeQueue = this.getActiveQueue(this.state.mode);
        let copy = this.state[activeQueue].slice();
        let shuffled = this.shuffle(copy);
        this.setState({
          [activeQueue]: shuffled
        })
      }
    });
  }
}

 
export default App;
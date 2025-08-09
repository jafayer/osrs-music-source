import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
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

function App() {
  const { song: songParam } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [state, setState] = useState({
    loading: false,
    isPaused: true,
    mode: "auto",
    manualQueue: [],
    standardQueue: [],
    shuffle: false,
    songlist: null,
    playing: null,
    song: null,
  });

  // Create audio instance using useMemo to prevent recreation on every render
  const audio = useMemo(() => new AudioWrapper(), []);

  const success = useCallback((message) => {
    console.log(toast);
    toast.success(message, {
      position: "bottom-center",
      autoClose: 1500,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  }, []);

  const failure = useCallback((message) => {
    toast.error(message, {
      position: "bottom-center",
      autoClose: 1500,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  }, []);

  const getActiveQueue = useCallback((mode) => {
    let map = {
      manual: 'manualQueue',
      auto: 'standardQueue'
    }
    return(map[mode]);
  }, []);

  const shuffle = useCallback((array) => {
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
  }, []);

  useEffect(() => {
    let loadedFromUrlChange = false;

    audio.audio.onended = ended;

    setState(prevState => ({
      ...prevState,
      songlist: data.songs,
      standardQueue: data.queue
    }));

    // Handle route changes for song loading
    const handleRouteChange = () => {
      let path = location.pathname.split('/')[1];
      if (path) {
        let decoded = path.replaceAll("_"," ");
        let song = data.songs.find(i => i.title.toLowerCase() === decoded.toLowerCase());
        if(song) {
          if(state.song) {
            if(song.title !== state.song.title) {
              loadedFromUrlChange = true;
              handleClick(null,song);
            }
          }
        }
      }
    };

    // Listen for URL changes
    handleRouteChange();

    document.addEventListener('keydown', e => {
      if(e.code === "Space") {
        e.preventDefault();
        document.querySelector(".playPause").focus();
        playPause();
        document.querySelector(".playPause").focus();
      } else if(e.code === 'ArrowRight' && e.ctrlKey) {
        skip();
      }
    });

    audio.audio.addEventListener('play', () => {
      setState(prevState => ({
        ...prevState,
        isPaused: false
      }));
      console.log("Playing!");
    });

    audio.audio.addEventListener('pause', () => {
      setState(prevState => ({
        ...prevState,
        isPaused: true
      }));
      console.log("Paused!");
    });

    audio.audio.addEventListener('canplay', () => {
      setState(prevState => ({
        ...prevState,
        song: audio.song, 
        loading: false
      }));
      
      document.title = "RuneScape Music Player - " + audio.song.title;
      if(!loadedFromUrlChange) {
        navigate('/' + audio.song.title.replaceAll(" ","_"));
      } else {
        loadedFromUrlChange = false;
      }
      document.querySelector('.playPause').classList.remove('loading');
    });

    let shuffleInMatch;

    if(songParam) {
      let match = songParam.replaceAll("_"," ");
      let song = data.songs.find(i => i.title.toLowerCase() === match.toLowerCase());
      if(song) {
        handleClick(null,song);
      } else if (match.toLowerCase() === "shuffle") {
        shuffleInMatch = true;
      }
    }

    let queryString = new URLSearchParams(location.search);
    let isShuffled = (queryString.get('shuffle') === "") || (shuffleInMatch);

    if(queryString.get('queue')) {
      let queue = queryString.get("queue").split(",");
      queue = queue.map(song => song.replaceAll("_"," "));
      let inserts = [];

      queue.forEach(song => {
        let insert = data.songs.find(i => i.title.toLowerCase() === song.toLowerCase());
        if(insert) inserts.push(insert);
      });

      if(isShuffled) {
        inserts = shuffle(inserts);
      }

      setState(prevState => ({
        ...prevState,
        mode: "manual", 
        shuffle: isShuffled
      }));
      
      addToQueue(...inserts);
    } else {
      if(isShuffled) {
        let queue = shuffle(data.songs.slice());

        setState(prevState => ({
          ...prevState,
          mode: 'manual', 
          shuffle: isShuffled
        }));
        
        addToQueue(...queue);
      }
    }

    console.log("Shuffled? " + state.shuffle);

    if('mediasession' in navigator) {
      navigator.mediaSession.setActionHandler('play', playPause);
      navigator.mediaSession.setActionHandler('pause', playPause);
      navigator.mediaSession.setActionHandler('nexttrack', skip);
    }

    // Cleanup function
    return () => {
      document.removeEventListener('keydown', () => {});
    };
  }, [location.pathname, location.search, songParam, state.song, audio, ended, handleClick, navigate, playPause, skip, shuffle, addToQueue, state.shuffle]);

  const addToQueue = useCallback((...songs) => {
    let activeQueue = getActiveQueue(state.mode);
    let queue = Array.prototype.concat(state[activeQueue], songs);
  
    setState(prevState => ({
      ...prevState,
      [activeQueue]: queue
    }));
    
    if('vibrate' in window.navigator) {
      window.navigator.vibrate(25);
    }
  }, [state.mode, state.manualQueue, state.standardQueue, getActiveQueue]);

  const handleClick = useCallback((event, song) => {
    if(event) { // if handleClick occurred from click event, check if should add to queue
      if(state.mode !== "loop" && (event.ctrlKey || event.metaKey)) { // if ctrl/cmd, add to queue
        event.preventDefault();
        addToQueue(song);
        return;
      }
    }

    if(state.playing) {
      audio.pause();
    }

    const url = song.url;
    console.log(url);

    audio.setSong(song);
    document.querySelector('.playPause').classList.add('loading');
    
    setState(prevState => ({
      ...prevState,
      playing: song,
      loading: true
    }));

    audio.play();
  }, [state.mode, state.playing, addToQueue, audio]);

  const skip = useCallback(() => {
    let activeQueue = getActiveQueue(state.mode);
    let queue = state[activeQueue].slice();

    if(queue.length === 0) {
      audio.song = null;
      audio.pause();
      setState(prevState => ({
        ...prevState,
        isPaused: true
      }));
      return;
    }

    let play = queue.splice(0,1)[0];
    setState(prevState => ({
      ...prevState,
      [activeQueue]: queue
    }));
    
    handleClick(null, play);
  }, [state.mode, state.manualQueue, state.standardQueue, getActiveQueue, handleClick, audio]);

  const playPause = useCallback(() => {
    if(state.isPaused) {
      if(audio.getSrc() === "" && state.mode !== "loop") { // advance to next song if there's a queue and no current track
        let activeQueue = getActiveQueue(state.mode);
        let queue = state[activeQueue].slice();

        if(queue.length === 0) { // if queue is empty, break
          return;
        }

        let play = queue.splice(0,1)[0];
        setState(prevState => ({
          ...prevState,
          [activeQueue]: queue
        }));
        
        handleClick(null, play);
      }
      
      audio.play();
    } else {
      audio.pause();
    }
  }, [state.isPaused, state.mode, state.manualQueue, state.standardQueue, getActiveQueue, handleClick, audio]);

  const modeSelect = useCallback((mode, clicked=true) => {
    if(mode === "loop") { 
      audio.audio.loop = true;
    } else { // make sure loop is false if previously declared
      audio.audio.loop = false;
    }

    setState(prevState => ({
      ...prevState,
      mode: mode
    }));
    
    console.log("The mode is currently set to: " + mode);
  }, [audio]);

  const ended = useCallback(() => {
    if(state.mode === "loop") {
      return;
    }

    let activeQueue = getActiveQueue(state.mode);

    if(state[activeQueue].length === 0) {
      audio.pause();
      return;   
    }

    let queue = state[activeQueue].slice();
    let play = queue.splice(0,1)[0];
    setState(prevState => ({
      ...prevState,
      [activeQueue]: queue,
    }));
    
    handleClick(null, play);
    mediaSessionUpdate(play);
  }, [state.mode, state.manualQueue, state.standardQueue, getActiveQueue, handleClick, audio]);

  const removeFromQueue = useCallback((i) => {
    let activeQueue = getActiveQueue(state.mode);
    let queue = state[activeQueue].slice();
    queue.splice(i,1);

    setState(prevState => ({
      ...prevState,
      [activeQueue]: queue 
    }));
    
    if('vibrate' in window.navigator) {
      window.navigator.vibrate([25,50,25]);
    }
  }, [state.mode, state.manualQueue, state.standardQueue, getActiveQueue]);

  const mediaSessionUpdate = useCallback((song) => {
    if('mediaSession' in navigator) {
      navigator.mediaSession.metadata = new window.MediaMetadata({
        title: song.title,
        album: 'RuneScape Original Soundtrack'
      });
    }
  }, []);

  const copyToClipboard = useCallback(() => {
    if('clipboard' in window.navigator) {
      let baseurl = "https://runetunes.com/";
      let path;
      if(state.playing) {
        path = state.playing.title.replace(' ', '_');
      }
      let queue = state[getActiveQueue(state.mode)].slice();
      let resQueue = queue.map(song => song.title.replaceAll(' ','_'));
      let url = baseurl+ (path ? path : "") + (resQueue.length > 0 ? ("?queue="+resQueue.join(",")) : "") + (state.shuffle ? "&shuffle" : "");

      window.navigator.clipboard.writeText(url).then(() => {
        console.log("wrote to clipboard: " + url);
        if('vibrate' in window.navigator) {
          window.navigator.vibrate(50,50,50);
          success('Copied to clipboard!');
        }
      });
    } else {
      failure('Couldn\'t copy to clipboard!');
    }
  }, [state.playing, state.manualQueue, state.standardQueue, state.mode, state.shuffle, getActiveQueue, success, failure]);

  const toggleShuffle = useCallback(() => {
    const newShuffleState = !state.shuffle;
    setState(prevState => ({
      ...prevState,
      shuffle: newShuffleState
    }));
    
    if(newShuffleState) {
      let activeQueue = getActiveQueue(state.mode);
      let copy = state[activeQueue].slice();
      let shuffled = shuffle(copy);
      setState(prevState => ({
        ...prevState,
        [activeQueue]: shuffled
      }));
    }
  }, [state.shuffle, state.mode, state.manualQueue, state.standardQueue, getActiveQueue, shuffle]);

  useEffect(() => {
    let loadedFromUrlChange = false;

    audio.audio.onended = ended;

    setState(prevState => ({
      ...prevState,
      songlist: data.songs,
      standardQueue: data.queue
    }));

    // Handle route changes for song loading
    const handleRouteChange = () => {
      let path = location.pathname.split('/')[1];
      if (path) {
        let decoded = path.replaceAll("_"," ");
        let song = data.songs.find(i => i.title.toLowerCase() === decoded.toLowerCase());
        if(song) {
          if(state.song) {
            if(song.title !== state.song.title) {
              loadedFromUrlChange = true;
              handleClick(null,song);
            }
          }
        }
      }
    };

    // Listen for URL changes
    handleRouteChange();

    document.addEventListener('keydown', e => {
      if(e.code === "Space") {
        e.preventDefault();
        document.querySelector(".playPause").focus();
        playPause();
        document.querySelector(".playPause").focus();
      } else if(e.code === 'ArrowRight' && e.ctrlKey) {
        skip();
      }
    });

    audio.audio.addEventListener('play', () => {
      setState(prevState => ({
        ...prevState,
        isPaused: false
      }));
      console.log("Playing!");
    });

    audio.audio.addEventListener('pause', () => {
      setState(prevState => ({
        ...prevState,
        isPaused: true
      }));
      console.log("Paused!");
    });

    audio.audio.addEventListener('canplay', () => {
      setState(prevState => ({
        ...prevState,
        song: audio.song, 
        loading: false
      }));
      
      document.title = "RuneScape Music Player - " + audio.song.title;
      if(!loadedFromUrlChange) {
        navigate('/' + audio.song.title.replaceAll(" ","_"));
      } else {
        loadedFromUrlChange = false;
      }
      document.querySelector('.playPause').classList.remove('loading');
    });

    let shuffleInMatch;

    if(songParam) {
      let match = songParam.replaceAll("_"," ");
      let song = data.songs.find(i => i.title.toLowerCase() === match.toLowerCase());
      if(song) {
        handleClick(null,song);
      } else if (match.toLowerCase() === "shuffle") {
        shuffleInMatch = true;
      }
    }

    let queryString = new URLSearchParams(location.search);
    let isShuffled = (queryString.get('shuffle') === "") || (shuffleInMatch);

    if(queryString.get('queue')) {
      let queue = queryString.get("queue").split(",");
      queue = queue.map(song => song.replaceAll("_"," "));
      let inserts = [];

      queue.forEach(song => {
        let insert = data.songs.find(i => i.title.toLowerCase() === song.toLowerCase());
        if(insert) inserts.push(insert);
      });

      if(isShuffled) {
        inserts = shuffle(inserts);
      }

      setState(prevState => ({
        ...prevState,
        mode: "manual", 
        shuffle: isShuffled
      }));
      
      addToQueue(...inserts);
    } else {
      if(isShuffled) {
        let queue = shuffle(data.songs.slice());

        setState(prevState => ({
          ...prevState,
          mode: 'manual', 
          shuffle: isShuffled
        }));
        
        addToQueue(...queue);
      }
    }

    console.log("Shuffled? " + state.shuffle);

    if('mediasession' in navigator) {
      navigator.mediaSession.setActionHandler('play', playPause);
      navigator.mediaSession.setActionHandler('pause', playPause);
      navigator.mediaSession.setActionHandler('nexttrack', skip);
    }

    // Cleanup function
    return () => {
      document.removeEventListener('keydown', () => {});
    };
  }, [location.pathname, location.search, songParam, state.song, audio, ended, handleClick, navigate, playPause, skip, shuffle, addToQueue, state.shuffle]);

  return (
    <div className="wrap">
      <div>
        <Player
          mode={state.mode}
          modeSelect={modeSelect}
          playing={state.playing}
          songs={state.songlist}
          makeSongs={(song) => ({ song, handleClick, addToQueue })}
          handleClick={handleClick}
          addToQueue={addToQueue}
        />
        <Controls
          isPaused={state.isPaused}
          playPause={playPause}
          skip={skip}
          loading={state.loading}
        />
        <UpNext
          mode={state.mode}
          standardQueue={state.standardQueue}
          manualQueue={state.manualQueue}
          removeFromQueue={removeFromQueue}
          handleClick={handleClick}
          copy={copyToClipboard}
          shuffle={state.shuffle}
          toggleShuffle={toggleShuffle}
        />
        <Instructions />
        <ToastContainer />
      </div>
      <MediaSession
        isPaused={state.isPaused}
        audio={audio}
        song={state.song && state.song}
        onPlay={audio.play}
        onPause={audio.pause}
        onNextTrack={skip}
      />
    </div>
  );
}

 
export default App;
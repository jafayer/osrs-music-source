import React, { Component } from 'react';

class MediaSession extends Component {

    render() {
        
        if(this.HAS_MEDIA_SESSION) {
            this.updateMetadata();
            this.mediaSession.playbackState = (this.props.isPaused ? "paused" : "playing");
            this.updatePositionState();
            console.log("mediasession status" + this.mediaSession.playbackState);
        }
        return ( null);
    }

    HAS_MEDIA_SESSION = window && window.navigator && 'mediaSession' in window.navigator;
    mediaSession = this.HAS_MEDIA_SESSION ? window.navigator.mediaSession : null;

    updateMetadata = () => {
        if('MediaMetadata' in window && window.MediaMetadata) {
            let mediaMetadata = new window.MediaMetadata({
                artwork: [
                    {
                      src: 'https://runetunes.com/album_cover.jpg',
                      sizes: '640x640',
                      type: 'image/jpg'
                    }
                  ],
                artist: "RuneScape Original Soundtrack",
                title: this.props.song ? this.props.song.title : "Loading..."
            });

            this.mediaSession.metadata = mediaMetadata;
        }
    }

    actionHandlerWrapper(actionHandler) {
        console.log("FASFASF");
        actionHandler();
        this.updatePositionState();
    }

    updatePositionState() {
        if ('setPositionState' in this.mediaSession && this.props.song) {
            let positionState = {
                duration: this.props.audio.audio.duration ? this.props.audio.audio.duration : 0,
                playbackRate: this.props.audio.audio.playbackRate,
                position: this.props.audio.audio.duration ? this.props.audio.audio.currentTime : 0
            }
            console.log(positionState);
            this.mediaSession.setPositionState(positionState);
        }
      }

    componentDidMount = () => {

        const actionHandlers = [
            ['play',     this.props.onPlay],
            ['pause',    this.props.onPause],
            ['nexttrack',this.props.onNextTrack],
        ]

        
        if(this.HAS_MEDIA_SESSION) {
            this.mediaSession.setActionHandler('play', () => {this.actionHandlerWrapper(this.props.onPlay)});
            this.mediaSession.setActionHandler('pause', () => {this.actionHandlerWrapper(this.props.onPause)});
            this.mediaSession.setActionHandler('nexttrack', () => {this.actionHandlerWrapper(this.props.onNextTrack)});

            this.mediaSession.metadata = this.metadata;
        }
    }
}
 
export default MediaSession;

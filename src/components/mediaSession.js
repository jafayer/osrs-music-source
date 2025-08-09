import { useEffect } from 'react';

function MediaSession({ isPaused, audio, song, onPlay, onPause, onNextTrack }) {
    const HAS_MEDIA_SESSION = window && window.navigator && 'mediaSession' in window.navigator;
    const mediaSession = HAS_MEDIA_SESSION ? window.navigator.mediaSession : null;

    const updateMetadata = () => {
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
                title: song ? song.title : "Loading..."
            });

            mediaSession.metadata = mediaMetadata;
        }
    };

    const actionHandlerWrapper = (actionHandler) => {
        console.log("FASFASF");
        actionHandler();
        updatePositionState();
    };

    const updatePositionState = () => {
        if ('setPositionState' in mediaSession && song) {
            let positionState = {
                duration: audio.audio.duration ? audio.audio.duration : 0,
                playbackRate: audio.audio.playbackRate,
                position: audio.audio.duration ? audio.audio.currentTime : 0
            }
            console.log(positionState);
            mediaSession.setPositionState(positionState);
        }
    };

    useEffect(() => {
        if(HAS_MEDIA_SESSION) {
            mediaSession.setActionHandler('play', () => {actionHandlerWrapper(onPlay)});
            mediaSession.setActionHandler('pause', () => {actionHandlerWrapper(onPause)});
            mediaSession.setActionHandler('nexttrack', () => {actionHandlerWrapper(onNextTrack)});

            mediaSession.metadata = undefined;
        }
    }, [HAS_MEDIA_SESSION, mediaSession, onPlay, onPause, onNextTrack]);

    // Update media session state when props change
    useEffect(() => {
        if(HAS_MEDIA_SESSION) {
            updateMetadata();
            mediaSession.playbackState = (isPaused ? "paused" : "playing");
            updatePositionState();
            console.log("mediasession status" + mediaSession.playbackState);
        }
    }, [HAS_MEDIA_SESSION, mediaSession, isPaused, song, audio]);

    return null;
}
 
export default MediaSession;

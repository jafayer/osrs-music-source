class AudioWrapper {
    constructor(song) {
        this.audio = new Audio();
        if(song){
            this.song = song;
            this.audio.src = song.url;
        }
    }

    getSrc = () => {
        return(this.audio.src);
    }

    setSong = (song) => {
        this.song = song;
        if(song.url) {
            this.audio.src = song.url;
        } else {
            this.audio.src = "";
        }
        return(this.song);
    }

    getSong = () => {
        return(this.song);
    }

    play = () => {
        this.audio.play();
    }

    pause = () => {
        this.audio.pause();
    }
}

export default AudioWrapper;
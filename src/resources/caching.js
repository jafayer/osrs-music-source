class Caching {
    constructor(version, indexedDB) {

        let request = indexedDB.open("songDB", version);
        let db,transaction,store;

        request.onupgradeneeded = (e) => {
            db = request.result;
            store = db.createObjectStore("songStore", {keypath: "id"});
        }

        request.onerror = (e) => {
            console.log("DB error: " + e);
        }

        request.onsuccess = (e) => {
            db = request.result;

            db.error = (e) => {
                console.log("DB ERROR: " + e.target.errorCode);
            }

            this.db = db;
            this.request = request;
            this.version =  version;
            this.store = "songStore"
        }
    }

    insertSong = (song) => {
        let transaction = this.db.transaction([this.store], "readwrite");
        let store = transaction.objectStore(this.store);

        transaction.oncomplete = () => {
            console.log("successfully inserted " + song.title);
        }

        transaction.onerror = (e) => {
            console.log("Transaction error! " + e);
        }

        store.put(song, song.id);
    }

    retrieveSong = (songID, callback) => {
        let transaction = this.db.transaction([this.store], "readwrite");
        let store = transaction.objectStore(this.store);
        let res;

        let resultPromise = store.get(songID);

        resultPromise.onsuccess = () => {
            callback(resultPromise)
        }

        resultPromise.onerror = (e) => {
            console.log("DB retrieval err: " + e);
        }

        resultPromise.oncomplete = () => {
            console.log("successfully retrieved " + resultPromise.result.title);
        }
    }

}

export default Caching;
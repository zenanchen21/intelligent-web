////////////////// DATABASE //////////////////
// the database receives from the server the following structure
/**
 * class Event{
 *  constructor (location, date, name) {
 *  this.location= location;
 *  this.date = date;
 *  this.name = name
 *  }
 *}
 */

var dbPromise;

//define db and store name
const APP_DB_NAME= 'db_app_1';
const STORY_STORE_NAME= 'store_stories';
const EVENT_STORE_NAME= 'store_events';

/**
 * it inits the database
 */
function initDatabase(){
    dbPromise = idb.openDb(APP_DB_NAME, 1, function (upgradeDb) {
        if (!upgradeDb.objectStoreNames.contains(STORY_STORE_NAME)) {
            var storyOS = upgradeDb.createObjectStore(STORY_STORE_NAME, {keyPath: 'id', autoIncrement: true});
            storyOS.createIndex('id', '_id', {unique: true, multiEntry: false});
            storyOS.createIndex('author', 'author.username', {unique: false, multiEntry:true})
        }
        if(!upgradeDb.objectStoreNames.contains(EVENT_STORE_NAME)) {
            var eventOS = upgradeDb.createObjectStore(EVENT_STORE_NAME, {keyPath: 'id', autoIncrement: true});
            eventOS.createIndex('id', '_id', {unique: true, multiEntry: false});
        }
    });
}
/**
 * store data to indexDB
 * @param type of object
 * @param dataObject
 */
function storeCachedData(type, dataObject) {
    if (dbPromise) {
        dbPromise.then(async db => {
            var tx, store;
            if(type=="events") {
                tx = db.transaction(EVENT_STORE_NAME, 'readwrite');
                store = tx.objectStore(EVENT_STORE_NAME);
            }else{
                tx = db.transaction(STORY_STORE_NAME, 'readwrite');
                store = tx.objectStore(STORY_STORE_NAME);
            }
            await store.put(dataObject);
            return tx.complete;
        }).then(function () {
            console.log('added item to the store! ' + JSON.stringify(dataObject));
        }).catch(function (error) {
            localStorage.setItem('type', JSON.stringify(dataObject));
        });

    }
    else localStorage.setItem('type', JSON.stringify(dataObject));
}

/**
 * add all event and post stored in index db
 * to the index page
 */
function getAllData () {
    if (dbPromise) {
        dbPromise.then(function (db) {
            var tx = db.transaction([STORY_STORE_NAME, EVENT_STORE_NAME], 'readonly');
            var postStore = tx.objectStore(STORY_STORE_NAME);
            var eventStore = tx.objectStore(EVENT_STORE_NAME);
            var data = {};
            data.posts = postStore.getAll();
            data.events = eventStore.getAll();
            return data;
        }).then(function(data){
            data.posts.then(function (posts) {
                for(index in posts)
                    addToResults('posts', posts[index]);
            });
            data.events.then(function (events) {
                for(index in events) {
                    addToResults('events', events[index]);
                    addEventOption(events[index]);
                }

            });
        });
    }
    else{
        console.log("fail");
    }
}

function searchIndexDB (keyword) {
    if (dbPromise) {
        dbPromise.then(function (db) {
            var tx = db.transaction([STORY_STORE_NAME, EVENT_STORE_NAME], 'readonly');
            var postStore = tx.objectStore(STORY_STORE_NAME);
            var eventStore = tx.objectStore(EVENT_STORE_NAME);
            var data = {};
            data.posts = postStore.getAll();
            data.events = eventStore.getAll();
            return data;
        }).then(function(data){
            data.posts.then(function (posts) {
                document.getElementById("posts").innerHTML = "";
                for(index in posts) {
                    if(posts[index].author.username.includes(keyword)
                      ||posts[index].content.includes(keyword)) {
                        addToResults('posts', posts[index]);
                    }
                }
            })
            data.events.then(function (events) {
                document.getElementById("events").innerHTML = "";
                for(index in events)
                    if(events[index].title.includes(keyword) ||
                    events[index].content.includes(keyword)) {
                        addToResults('events', events[index]);
                    }
            })
        })
    }
    else{
        console.log("fail");
    }
}

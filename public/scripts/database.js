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

const APP_DB_NAME= 'db_app_1';
const STORY_STORE_NAME= 'store_stories';
const EVENT_STORE_NAME= 'store_events'

/**
 * it inits the database
 */
function initDatabase(){
    dbPromise = idb.openDb(APP_DB_NAME, 1, function (upgradeDb) {
        if (!upgradeDb.objectStoreNames.contains(STORY_STORE_NAME)) {
            var storyOS = upgradeDb.createObjectStore(STORY_STORE_NAME, {keyPath: 'id', autoIncrement: true});
            storyOS.createIndex('author', 'author', {unique: false, multiEntry: true});
        }
        if(!upgradeDb.objectStoreNames.contains(EVENT_STORE_NAME)) {
            var eventOS = upgradeDb.createObjectStore(EVENT_STORE_NAME, {keyPath: 'id', autoIncrement: true});
            eventOS.createIndex('name', 'name', {unique: false, multiEntry: true});
        }

    });
}
/**
 * it saves the forecasts for a city in localStorage
 * @param name
 * @param eventObject
 */
function storeCachedData(name, eventObject) {
    console.log('inserting: '+JSON.stringify(eventObject));
    if (dbPromise) {
        dbPromise.then(async db => {
            var tx = db.transaction(EVENT_STORE_NAME, 'readwrite');
            var store = tx.objectStore(EVENT_STORE_NAME);
            await store.put(eventObject);
            return tx.complete;
        }).then(function () {
            console.log('added item to the store! '+ JSON.stringify(eventObject));
        }).catch(function (error) {
            localStorage.setItem(city, JSON.stringify(eventObject));
        });
    }
    else localStorage.setItem(city, JSON.stringify(eventObject));
}


/**
 * it retrieves the forecasts data for a city from localStorage
 * @param eventName
 * @param date
 * @returns {*}
 */
function getCachedData(eventName, date) {
    if (dbPromise) {
        dbPromise.then(function (db) {
            console.log('fetching: '+name);
            var tx = db.transaction(EVENT_STORE_NAME, 'readonly');
            var store = tx.objectStore(EVENT_STORE_NAME);
            var index = store.index('name');
            return index.getAll(IDBKeyRange.only(eventName));
        }).then(function (readingsList) {
            if (readingsList && readingsList.length>0){
                var max;
                for (var elem of readingsList)
                    if (!max || elem.date>max.date)
                        max= elem;
                if (max) addToResults(max);
            } else {
                const value = localStorage.getItem(eventName);
                if (value == null)
                    addToResults({name: eventName, date: date});
                else addToResults(value);
            }
        });
    } else {
        const value = localStorage.getItem(eventName);
        if (value == null)
            addToResults( {name: eventName, date: date});
        else addToResults(value);
    }
}

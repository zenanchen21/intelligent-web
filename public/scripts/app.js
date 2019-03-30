function addEvent(){
    var formArray= $("form").serializeArray();
    var data={};
    for (index in formArray){
        data[formArray[index].name]= formArray[index].value;
    }
    // const data = JSON.stringify($(this).serializeArray());
    sendAjaxQuery("/", data);
}

function sendAjaxQuery(url, data) {
    $.ajax({
        url: url ,
        data: data,
        dataType: 'json',
        type: 'POST',
        success: function (dataR) {
            // no need to JSON parse the result, as we are using
            // dataType:json, so JQuery knows it and unpacks the
            // object for us before returning it
            addToResults(dataR);
            storeCachedData(dataR.location, dataR);
            if (document.getElementById('offline_div')!=null)
                document.getElementById('offline_div').style.display='none';
        },
        error: function (xhr, status, error) {
            alert('Error: ' + error.message);
        }
    });
}


/**
 * called by the HTML onload
 * showing any cached forecast data and declaring the service worker
 */
function initMSocial() {
    loadData();
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker
          .register('./service-worker.js')
          .then(function() { console.log('Service Worker Registered'); })
          .catch ( function(error) {
              console.log(error.message);
          });
    }
    //check for support
    if ('indexedDB' in window) {
        initDatabase();
    }
    else {
        console.log('This browser doesn\'t support IndexedDB');
    }
}

/**
 * given the list of events created by the user, it will retrieve all teh data from
 * the server (or failing that) from the database
 */
function loadData(){
    var eventList=JSON.parse(localStorage.getItem('events'));
    eventList=removeDuplicates(eventList);
    retrieveAllEventsData(eventList)
}

/**
 * it cycles through the list of events and requests the data from the server for each
 * event
 * @param eventList the list of the evnents the user has requested
 */
function retrieveAllEventsData(eventList){
    for (index in eventList)
        loadEventData(eventList[index]);
}

/**
 * given one event and a date, it queries the server via Ajax to get the latest
 * weather forecast for that event
 * if the request to the server fails, it shows the data stored in the database
 * @param event
 * @param date
 */
function loadEventData(event){
    const input = JSON.stringify({name:event1,location:loc1,date:new Date().getDate()});
    $.ajax({
        url: '/',
        data: input,
        contentType: 'application/json',
        type: 'POST',
        success: function (dataR) {
            // no need to JSON parse the result, as we are using
            // dataType:json, so JQuery knows it and unpacks the
            // object for us before returning it
            addToResults(dataR);
            storeCachedData(dataR.location, dataR);
            if (document.getElementById('offline_div')!=null)
                    document.getElementById('offline_div').style.display='none';
        },
        // the request to the server has failed. Let's show the cached data
        error: function (xhr, status, error) {
            showOfflineWarning();
            addToResults(getCachedData(event, date));
            const dvv= document.getElementById('offline_div');
            if (dvv!=null)
                    dvv.style.display='block';
        }
    });
}


///////////////////////// INTERFACE MANAGEMENT ////////////


/**
 * given the forecast data returned by the server,
 * it adds a row of weather forecasts to the results div
 * @param dataR the data returned by the server:
 * class WeatherForecast{
  *  constructor (location, date, forecast, temperature, wind, precipitations) {
  *    this.location= location;
  *    this.date= date,
  *    this.forecast=forecast;
  *    this.temperature= temperature;
  *    this.wind= wind;
  *    this.precipitations= precipitations;
  *  }
  *}
 */
function addToResults(dataR) {
    if (document.getElementById('events') != null) {
        const row = document.createElement('div');
        // appending a new row
        document.getElementById('events').appendChild(row);
        // formatting the row by applying css classes
        // row.classList.add('card');
        // row.classList.add('my_card');
        // row.classList.add('bg-faded');
        // the following is far from ideal. we should really create divs using javascript
        // rather than assigning innerHTML
        row.innerHTML = "<div class=\"card gedf-card\">" +
          "<div class=\"card-body\">" +
          "<h5 class=\"card-title\">" + dataR.name + "</h5>" +
          "<h6 class=\"card-subtitle mb-2 text-muted\">" + dataR.location + "      " + dataR.data +"</h6></div></div>";
    }
}

/**
 * When the client gets off-line, it shows an off line warning to the user
 * so that it is clear that the data is stale
 */
window.addEventListener('offline', function(e) {
    // Queue up events for server.
    console.log("You are offline");
    showOfflineWarning();
}, false);

/**
 * When the client gets online, it hides the off line warning
 */
window.addEventListener('online', function(e) {
    // Resync data with server.
    console.log("You are online");
    hideOfflineWarning();
    loadData();
}, false);


function showOfflineWarning(){
    if (document.getElementById('offline_div')!=null)
        document.getElementById('offline_div').style.display='block';
}

function hideOfflineWarning(){
    if (document.getElementById('offline_div')!=null)
        document.getElementById('offline_div').style.display='none';
}



/**
 * Given a list of events, it removes any duplicates
 * @param eventList
 * @returns {Array}
 */
function removeDuplicates(eventList) {
    // remove any duplicate
       var uniqueNames=[];
       $.each(eventList, function(i, el){
           if($.inArray(el, uniqueNames) === -1) uniqueNames.push(el);
       });
       return uniqueNames;
}


function sendLoginInfo(url, data) {
    $.ajax({
        url: url ,
        data: data,
        dataType: 'json',
        type: 'POST',
        success: function (dataR) {
            // no need to JSON parse the result, as we are using
            // dataType:json, so JQuery knows it and unpacks the
            // object for us before returning it
            var ret = dataR;
            // in order to have the object printed by alert
            // we need to JSON stringify the object

            // $('result').text('The page has been successfully loaded');
            document.getElementById('results').innerHTML= JSON.stringify(ret);
        },
        error: function (xhr, status, error) {
            alert('Error: ' + error.message);
        }
    });
}


function onSubmit(url) {
    // var eml = $("#eml").val();
    // var psw = $("#psw").val();
    // var loginData={'email': eml, 'password':psw};
    event.preventDefault();
    console.log('login info snet')
    var loginData = $("form").serialize();
    sendLoginInfo(url, loginData);
    console.log('login info snet')

}

// function onSubmit(url) {
//     var formArray= $("form").serializeArray();
//     var data={};
//     for (index in formArray){
//         data[formArray[index].name]= formArray[index].value;
//     }
//     // const data = JSON.stringify($(this).serializeArray());
//     sendLoginInfo(url, data);
//     event.preventDefault();
// }

function checkForErrors(isLoginCorrect){
    if (!isLoginCorrect){
        alert('login or password is incorrect');
    }
}
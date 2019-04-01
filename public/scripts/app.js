/**
 * sigin in form onsubmit
 * lead to home page
 */
function submitForm(url){
    var formArray= $("form").serializeArray();
    var data={};
    for (index in formArray){
        data[formArray[index].name]= formArray[index].value;
    }
    if(url == "/events")
        data.type = "events";
    else {
        data.type = "posts";
    }
    sendAjaxQuery(url, data);
    event.preventDefault();
}

function searchForm(){
    var keyWord = document.getElementById("keyWord").value;
    searchIndexDB(keyWord);
    event.preventDefault();
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
            addToResults(data.type, dataR);
            storeCachedData(data.type, dataR);
            if (document.getElementById('offline_div')!=null)
                document.getElementById('offline_div').style.display='none';
        },
        error: function (xhr, status, error) {
            addToResults(data.type, data);
            storeCachedData(data.type,data);
        }
    });
}


/**
 * called by the HTML onload
 * showing any cached forecast data and declaring the service worker
 */
function initMSocial() {
    // loadData();
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
    loadData();
}

/**
 * given the list of events created by the user, it will retrieve all teh data from
 * the server (or failing that) from the database
 */
function loadData(){
    // var eventList=JSON.parse(localStorage.getItem('events'));
    // var storyList=JSON.parse(localStorage.getItem('posts'));
    getAllData();
    // retrieveAllPostsData(storyList);
    // retrieveAllEventsData(eventList);
}

/**
 * it cycles through the list of events and requests the data from the server for each
 * event
 * @param eventList the list of the evnents the user has requested
 */
function retrieveAllEventsData(eventList){
    for (index in eventList)
        loadEventData('events', eventList[index]);
}

function retrieveAllPostsData(eventList){
    for (index in eventList)
        loadEventData('posts', eventList[index]);
}

/**
 * given one event and a date, it queries the server via Ajax to get the latest
 * weather forecast for that event
 * if the request to the server fails, it shows the data stored in the database
 * @param event
 * @param date
 */
function loadEventData(url, event){
    const input = JSON.stringify(event);
    $.ajax({
        url: "/"+url,
        data: input,
        contentType: 'application/json',
        type: 'POST',
        success: function (dataR) {
            // no need to JSON parse the result, as we are using
            // dataType:json, so JQuery knows it and unpacks the
            // object for us before returning it
            addToResults(url, dataR);
            storeCachedData(url, dataR);
            if (document.getElementById('offline_div')!=null)
                    document.getElementById('offline_div').style.display='none';
        },
        // the request to the server has failed. Let's show the cached data
        error: function (xhr, status, error) {
            showOfflineWarning();
            addToResults(getCachedData(event));
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
function addToResults(type, dataR) {
    if(type == "events") {
        if (document.getElementById("events") != null) {
            const row = document.createElement('div');
            // appending a new row
            document.getElementById("events").appendChild(row);
            // formatting the row by applying css classes
            row.classList.add('card');
            row.classList.add('gedf-card');
            // the following is far from ideal. we should really create divs using javascript
            // rather than assigning innerHTML
            row.innerHTML = "<div class=\"card-body\">" +
              "<h5 class=\"card-title\">" + dataR.name + "</h5>" +
              "<h6 class=\"card-subtitle mb-2 text-muted\">" + dataR.location + "      " + dataR.date + "</h6></div>";
        }
    } else{
        if (document.getElementById("posts") != null) {
            const row = document.createElement("div");
            const header = document.createElement("div");
            const body = document.createElement("div");
            const footer = document.createElement("div");

            row.appendChild(header);
            row.appendChild(body);
            row.appendChild(footer);
            document.getElementById("posts").appendChild(row);

            row.classList.add('card','gedf-card');
            header.classList.add('card-header');
            body.classList.add('card-body');
            footer.classList.add('card-footer');


            header.innerHTML = '<div class="d-flex justify-content-between align-items-center">' +
              '<div class="d-flex justify-content-between align-items-center">' +
              '<div class="mr-2">' +
              '<img class="rounded-circle" width="45" src="https://picsum.photos/50/50" alt="" crossorigin="anonymous"></div>' +
              '<div class="ml-2">' +
              '<div class="h5 m-0">'+dataR.author+'</div>' +
              '</div></div><div>' +
              '<div class="dropdown">' +
              '<button class="btn btn-link dropdown-toggle" type="button" id="gedf-drop1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">' +
              '<i class="fa fa-ellipsis-h"></i>' +
              '</button>' +
              '<div class="dropdown-menu dropdown-menu-right" aria-labelledby="gedf-drop1">'+
              '<div class="h6 dropdown-header">Configuration</div>' +
              '<a class="dropdown-item" href="#">Save</a>' +
              '<a class="dropdown-item" href="#">Hide</a>' +
              '<a class="dropdown-item" href="#">Report</a>' +
              '</div> </div> </div> </div>';

            body.innerHTML = '<div class="text-muted h7 mb-2"> <i class="fa fa-clock-o"></i>10 min ago</div>' +
            '<a class="card-link" href="#">' +
              '<h5 class="card-title">'+dataR.title+'</h5></a>' +
            '<p class="card-text">'+ dataR.content+'</p> </div>';

            footer.innerHTML = '<a href="#" class="card-link"><i class="fa fa-gittip"></i> Like</a>' +
            '<a href="#" class="card-link"><i class="fa fa-comment"></i> Comment</a>' +
            '<a href="#" class="card-link"><i class="fa fa-mail-forward"></i> Share</a>';
        }
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
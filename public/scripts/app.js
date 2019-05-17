/**
 * sigin in form onsubmit
 * lead to home page
 */
function submitForm(formID){
    var url;
    switch(formID){
        case 'eform' : url = '/events';
        break;
        case 'pform' : url = '/posts';
        break;
        default: console.log("wrong form "+ formID);
    }
    var data = new FormData();

    var formArray= $('#'+formID).serializeArray();
    for (index in formArray){
        data.append(formArray[index].name, formArray[index].value);
    }


    var file_data = $('input[name="contentImage"]')[0].files;
    for (var i = 0; i < file_data.length; i++) {
        data.append("contentImage[]", file_data[i]);
    }


    if (url == "/events")
        data.append("type", "events");
    else {
        data.append("type", "posts");
    }

    sendAjaxQuery(url, data);
    event.preventDefault();
    hideModal();
}

function hideModal() {
    $("#exampleModal").removeClass("in");
    $(".modal-backdrop").remove();
    $('body').removeClass('modal-open');
    $('body').css('padding-right', '');
    $('#exampleModal').hide();
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
        enctype: 'multipart/form-data',
        dataType: false,
        contentType: false,
        processData: false,
        method: 'POST',
        type: 'POST', // For jQuery < 1.9
        success: function (dataR) {
            // no need to JSON parse the result, as we are using
            // dataType:json, so JQuery knows it and unpacks the
            // object for us before returning it
            addToResults(data.get("type"), dataR);
            storeCachedData(data.get("type"), dataR);
            if (document.getElementById('offline_div')!=null)
                document.getElementById('offline_div').style.display='none';
        },
        error: function (xhr, status, error) {
            console.log("no response")
            // addToResults(data.type, data);
            // storeCachedData(data.type,data);
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
    // getAllData();
    loadEventData();
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
function loadEventData(){
    $.ajax({
        url: "/",
        contentType: 'application/json',
        type: 'POST',
        success: function (dataR) {
            // no need to JSON parse the result, as we are using
            // dataType:json, so JQuery knows it and unpacks the
            // object for us before returning it
            dataR.forEach(function(event){
                addToResults('events', event);
                storeCachedData('events', event);
            });

        },
        // the request to the server has failed. Let's show the cached data
        error: function (xhr, status, error) {
            console.log('fuck', error);
        }
    });
}


///////////////////////// INTERFACE MANAGEMENT ////////////

/**
 * add post and event to index page
 * @param type
 * @param dataR
 */
function addToResults(type, dataR) {
    console.log("type "+type)
    console.log(dataR)
    if(type == "events") {
        if (document.getElementById("events") != null) {
            const row = document.createElement('div');
            // appending a new row
            document.getElementById("events").prepend(row);
            // formatting the row by applying css classes
            row.classList.add('card');
            row.classList.add('gedf-card');
            // the following is far from ideal. we should really create divs using javascript
            // rather than assigning innerHTML
            row.innerHTML = "<a href='/events/" +dataR._id + "\'><div class=\"card-body\">" +
              "<h5 class=\"card-title\">" + dataR.title + "</h5>" +
              "<h6 class=\"card-subtitle mb-2 text-muted\">" + dataR.address + "      " + dataR.date + "</h6></div>"+
              "<p class=\"card-body\">" + dataR.description + "</p></a>" ;
        }
    } else{
        console.log("adding post to page " + (Date.now()-Date.parse(dataR.date)))
        if (document.getElementById("posts") != null) {
            const row = document.createElement("div");
            const header = document.createElement("div");
            const body = document.createElement("div");
            const footer = document.createElement("div");
            const tim = timeDiff(Date.now(),Date.parse(dataR.date))
            console.log(tim);
            // const postID = '#'+dataR._id;


            row.appendChild(header);
            row.appendChild(body);
            row.appendChild(footer);
            document.getElementById("posts").prepend(row);

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
              '<button class="btn btn-link dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">' +
              '<i class="fa fa-ellipsis-h"></i>' +
              '</button>' +
              '<div class="dropdown-menu dropdown-menu-right" aria-labelledby="gedf-drop1">'+
              '<div class="h6 dropdown-header">Configuration</div>' +
              '<a class="dropdown-item" href="#">Save</a>' +
              '<a class="dropdown-item" href="#">Hide</a>' +
              '<a class="dropdown-item" href="#">Report</a>' +
              '</div> </div> </div> </div>';

            body.innerHTML = '<div class="text-muted h7 mb-2"> <i class="fa fa-clock-o"></i>'+tim+'</div>' +
            '<p class="card-text">'+ dataR.content+'</p> </div>';
            for(var img of dataR.img){
                console.log(img.data);
                // var buf =
                // console.log(buf)
                // var imsrc = img.data.data.toString("base64");
                // 'data:image/jpeg;base64,' +
                // console.log(imsrc)
                // body.innerHTML += '<img src='+imsrc+'width="100" height="100" style="margin-left: 1rem; margin-bottom: 1rem;">';
            }

            footer.innerHTML = '<a href="#" class="card-link"><i class="fa fa-gittip"></i> Like</a>' +
            '<a href="#com" data-toggle="collapse" class="card-link" aria-expanded="false"><i class="fa fa-comment"></i> Comment</a>' +
              '<a href="#" class="card-link"><i class="fa fa-mail-forward"></i> Share</a>'+
            '<div class="collapse input-group mb-3" id="com">\n' +
              '  <input type="text" class="form-control" placeholder="Write a comment..." aria-label="Write a comment">\n' +
              '</div>';
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


// $(function(){
//     $('#xform').click(function(e){
//         e.preventDefault();
//         $('#event_modal').modal('hide');
//         /*
//         $.post('http://path/to/post',
//            $('#myForm').serialize(),
//            function(data, status, xhr){
//              // do something here with response;
//            });
//         */
//     });
// });

function readURL(input) {
    if (input.files.length > 0) {
        const imagesDiv = document.getElementById('postIm');
        imagesDiv.innerHTML = '';
        for(var file of input.files) {
            const reader = new FileReader();
            const ima = document.createElement('img');

            ima.style.marginLeft = '1rem';
            ima.style.marginBottom = '1rem';
            reader.onload = function (e) {
                ima.src = e.target.result;
                ima.width = 100;
                ima.height = 100;
                imagesDiv.appendChild(ima);
            };

            reader.readAsDataURL(file);
        }
        $('#postIm').collapse('show');
    }
}

function timeDiff(date1, date2) {
    var timdiff = '';
    var diffMs = (date1 - date2); // milliseconds diff
    var diffDays = Math.floor(diffMs / 86400000); // days
    var diffHrs = Math.floor((diffMs % 86400000) / 3600000); // hours
    var diffMins = Math.floor(((diffMs % 86400000) % 3600000) / 60000); // minutes
    var diffSecs = Math.floor((((diffMs % 86400000) % 3600000) % 60000) /1000);
    if (diffDays != 0) {
        timdiff += diffDays + " days ";
    }
    if(diffHrs != 0) {
        timdiff += diffHrs + " hours ";
    }
    if(diffMins !=0) {
        timdiff += diffMins + " minutes ";
    }
    timdiff +=  diffSecs+" seconds ago";
    return timdiff;
}
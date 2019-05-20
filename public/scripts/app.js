var online  = true;

/**
 * post and event form on submit function
 * @param formID
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

    var selectorVal = $('#eventSelector').val();

    if(selectorVal != 'Which event...')
        data.append('event', $('#eventSelector').val());

    if($('input[name="contentImage"]')[0]){
        document.getElementById('postIm').innerHTML = '';
        var file_data = $('input[name="contentImage"]')[0].files;
        console.log(file_data)
        for (var i = 0; i < file_data.length; i++) {
            data.append("contentImage[]", file_data[i]);
        }
    }

    if (url == "/events")
        data.append("type", "events");
    else {
        data.append("type", "posts");
        data.append("date", Date.now().toString());
    }

    sendAjaxQuery(url, data);
    $('#'+formID).trigger("reset");
    event.preventDefault();
}

/**
 * handle search form
 */
function searchForm(){
    var keyWord = document.getElementById("keyWord").value;
    socket.emit('search', keyWord)

    searchIndexDB(keyWord);
    event.preventDefault();
}

/**
 * ajax sending multipart form
 * @param url
 * @param data
 */
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
            if(dataR.success){
                window.location.href = '/';
                storeCachedData(data.get("type"), dataR);
            }else{
                socket.emit('send post', dataR);
                addToResults(data.get("type"), dataR);
                storeCachedData(data.get("type"), dataR);
            }

            if (document.getElementById('offline_div')!=null)
                document.getElementById('offline_div').style.display='none';
        },
        error: function (xhr, status, error) {
            console.log("no response");
            if(xhr.status == 403){
                alert('Please complete the form!');
            }else{
                alert('Please Log in before posting');
                window.location.href = 'users/login';
            }

            // addToResults(data.type, data);
            // storeCachedData(data.type,data);
        }
    });
}


/**
 * called by the HTML onload
 * showing any cached data and declaring the service worker
 */
function initMSocial() {
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
 * when page load
 * retrieve event and post from mongodb
 * or from indexed db if offline
 */
function loadData(){
    //load event and post data with ajax
    document.getElementById("posts").innerHTML = "";
    document.getElementById("events").innerHTML = "";
    document.getElementById('eventSelector').innerHTML = "<option selected>Which event...</option>\n";
    if(navigator.onLine) {
        loadEventData();
        loadPostData();
    }else
        getAllData();
}


/**
 * if the request to the server fails, it shows the data stored in the database
 */
function loadEventData(){
    $.ajax({
        url: "/loadevent",
        contentType: 'application/json',
        type: 'POST',
        success: function (dataR) {
            // no need to JSON parse the result, as we are using
            // dataType:json, so JQuery knows it and unpacks the
            // object for us before returning it
            dataR.forEach(function(event){
                addToResults('events', event);
                addEventOption(event)
                storeCachedData('events', event);
            });

        },
        // the request to the server has failed. Let's show the cached data
        error: function (xhr, status, error) {
            console.log('fuck', error);
        }
    });
}

/**
 * load post from mongodb
 */
function loadPostData(){
    $.ajax({
        url: "/",
        contentType: 'application/json',
        type: 'POST',
        success: function (dataR) {
            // no need to JSON parse the result, as we are using
            // dataType:json, so JQuery knows it and unpacks the
            // object for us before returning it
            dataR.forEach(function(post){
                addToResults('posts', post);
                storeCachedData('posts', post);
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
    if(type == "events") {
        if (document.getElementById("events") != null) {
            const row = document.createElement('div');
            //formatting date of the event
            const date = new Date(dataR.date);
            const formatted_date = date.getDate() +
              "-" + (date.getMonth() + 1) + "-" + date.getFullYear();
            const formatted_time = date.getHours() + ":" + date.getMinutes()
            // appending a new row
            document.getElementById("events").prepend(row);
            // formatting the row by applying css classes
            row.classList.add('card');
            row.classList.add('gedf-card');

            row.innerHTML = "<a href='/events/" +dataR._id + "\'><div class=\"card-body\">" +
              "<h5 class=\"card-title\">" + dataR.title + "</h5></a><br/>" +
              "<div class='flex flex-row justify-content-between'> <h6 class=\"card-subtitle mb-2 text-muted\">" + formatted_date +
              "</h6><h6 class=\"card-subtitle mb-2 text-muted\">" + formatted_time + "</h6></div></div>"+
              "<p class=\"card-body\">" + dataR.description + "</p>" ;
        }
    } else{
        console.log(dataR)
        console.log("adding post to page " + (Date.now()-Date.parse(dataR.date)))
        if (document.getElementById("posts") != null) {
            const row = document.createElement("div");
            const header = document.createElement("div");
            const body = document.createElement("div");
            const footer = document.createElement("div");
            const tim = timeDiff(Date.now(),Date.parse(dataR.date))
            const postID = dataR._id;
            var eventTitle = '';
            if(dataR.event){
                eventTitle = "For event: "+dataR.event.title;
            }


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
              '<div class="h5 m-0">'+dataR.author.username+'</div>' +
              '</div></div><span>'+eventTitle+'</span></div>';


            body.innerHTML = '<div class="text-muted h7 mb-2"> <i class="fa fa-clock-o"></i>'+tim+'</div>' +
            '<p class="card-text">'+ dataR.content+'</p> </div>';


            for(var img of dataR.img){
                console.log(img);
                var imsrc = '';
                var bytes = new Uint8Array(img.data.data);
                bytes.forEach((b) => imsrc += String.fromCharCode(b));
                imsrc = 'data:image/jpeg;base64,' + imsrc;
                body.innerHTML += '<img src='+imsrc+' width="100" height="100" style="margin-left: 1rem; margin-bottom: 1rem;">';
            }

            footer.id = "footer"+postID;
            footer.innerHTML = '<a href="#com'+postID+'\" data-toggle="collapse" class="card-link" aria-expanded="false"><i class="fa fa-comment"></i> Comment</a>' +
            '<form class="collapse" id="com'+postID+'\">\n' +
              '<div class="input-group mb-3">\n' +
              '  <input type="text" name="comment" class="form-control com" placeholder="Write a comment..." aria-label="Write a comment">\n' +
              '<div class="input-group-prepend">\n' +
              '    <button class="btn btn-outline-secondary">Comment</button>\n' +
              '  </div></div>'
              '</form>';
            
            for (var com of dataR.comment) {
                addComment(com)
            }
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
    online = true;
    hideOfflineWarning();
    loadData();
}, false);

/**
 * show offline warning while offline
 */
function showOfflineWarning(){
    if (document.getElementById('offline_div')!=null)
        document.getElementById('offline_div').style.display='block';
}

/**
 * hide the offline warning when back online
 */
function hideOfflineWarning(){
    if (document.getElementById('offline_div')!=null)
        document.getElementById('offline_div').style.display='none';
}

/**
 *
 * @param url
 * @param data
 */
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

/**
 * singin form submit event handler
 * @param url
 */
function onSubmit(url) {
    event.preventDefault();
    var loginData = $("form").serialize();
    sendLoginInfo(url, loginData);
}

/**
 * check
 * @param isLoginCorrect
 */
function checkForErrors(isLoginCorrect){
    if (!isLoginCorrect){
        alert('login or password is incorrect');
    }
}

/**
 * read image input and show a preview
 * @param input: multiple file input
 */
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

/**
 * difference between date1 and date 2
 * @param date1
 * @param date2
 * @returns {string}
 */
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

/**
 * Add event title to the event selector of post form
 * @param event
 */
function addEventOption(event) {
    var selector = document.getElementById("eventSelector");
    var option = document.createElement("option");
    option.value = event._id;
    option.text = event.title;
    selector.appendChild(option);
}
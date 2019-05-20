function edit_user(){
    var formArray = $("form").serializeArray();
    var data={};
    for(index in formArray){
        data[formArray[index].name]=formArray[index].value;
    }
    //now data has a form like
    //{name: "mickey", surname:"Mouse",...}
    $.ajax({
        url: "/users/edit" ,
        data: data,
        dataType: 'json',
        type: 'POST',
        success: function (dataR) {
            // no need to JSON parse the result, as we are using
            // dataType:json, so JQuery knows it and unpacks the
            // object for us before returning it
            if(dataR.success){
                alert('preference added');
                window.location =  "/users/profile"
            }else if(dataR.notcomplete){
                $("#message").html("<div class='alert alert-danger alert-dismissible'>" +
                    "<a href=\"#\" class=\"close\" data-dismiss=\"alert\" aria-label=\"close\">x</a>" +
                    "<p>Please complete the From.</p></div>");
            }else{
                $("#message").html("<div class='alert alert-danger alert-dismissible'>" +
                    "<a href=\"#\" class=\"close\" data-dismiss=\"alert\" aria-label=\"close\">x</a>" +
                    "<p>Plese refill the username</p></div>");
            }



            // in order to have the object printed by alert
            // we need to JSON stringify the object

        },
        error: function (xhr, status, error) {
            alert('Error: ' + error.message);
        }
    });
    event.preventDefault();
}


function delete_post(){
            const id = $target.attr('id');
            $.ajax({
                type:'DELETE',
                url: '/users/profile/'+id,
                success: function(response){
                    alert('Deleting Article');
                    window.location.href='/';
                },
                error: function(err){
                    console.log(err);
                }
            });
}

function edit_post(){
    var formArray = $("form").serializeArray();
    var data={};
    for(index in formArray){
        data[formArray[index].name]=formArray[index].value;
    }

    $.ajax({
        url: 'users/post',
        data: data,
        dataType: 'json',
        contentType: 'application/json',
        type: 'POST',
        success: function (dataR) {
            // no need to JSON parse the result, as we are using
            // dataType:json, so JQuery knows it and unpacks the
            // object for us before returning it
            if(dataR.success){
                alert('content updated');
                window.location =  "/users/profile"
            }else if(dataR.notcomplete){
                $("#message").html("<div class='alert alert-danger alert-dismissible'>" +
                    "<a href=\"#\" class=\"close\" data-dismiss=\"alert\" aria-label=\"close\">x</a>" +
                    "<p>Please complete the From.</p></div>");
            }else{
                $("#message").html("<div class='alert alert-danger alert-dismissible'>" +
                    "<a href=\"#\" class=\"close\" data-dismiss=\"alert\" aria-label=\"close\">x</a>" +
                    "<p>Something wrong</p></div>");
                console/log('what is wrong')
            }



            // in order to have the object printed by alert
            // we need to JSON stringify the object

        },
        error: function (xhr, status, error) {
            alert('Error: ' + error.message);
        }
    });
    event.preventDefault();
}


function loadUser(){
    $.ajax({
        url: "/users/profile",
        contentType: 'application/json',
        type: 'POST',
        success: function (dataR) {
            // no need to JSON parse the result, as we are using
            // dataType:json, so JQuery knows it and unpacks the
            // object for us before returning it
            dataR.forEach(function(post){
                addToPgae(post);
            });

        },
        // the request to the server has failed. Let's show the cached data
        error: function (xhr, status, error) {
            console.log('fuck', error);
        }
    });
}

function loadimage(dataR){
    for(var img of dataR.img){
        console.log(img);
        var imsrc = '';
        var bytes = new Uint8Array(img.data.data);
        bytes.forEach((b) => imsrc += String.fromCharCode(b));
        imsrc = 'data:image/jpeg;base64,' + imsrc;
        body.innerHTML += '<img src='+imsrc+' width="100" height="100" style="margin-left: 1rem; margin-bottom: 1rem;">';
    }
}

function addToPgae(dataR) {
        if (document.getElementById("user") != null) {
            const row = document.createElement('div');
            // appending a new row
            document.getElementById("user").prepend(row);
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
}


function sendregister(){
    // let email =$("email").val();
    // let psw = $("psw").val();
    // let psw2 = $("psw2").val();
    // let username =$("username").val();
    // if(psw != psw2) {
    //     console.log('cuowu',psw,psw)
    //     alert("sorry, password doesn't match to the username.");
    //     return;
    // }
    var formArray = $("#register").serializeArray();
    var data={};
    for(index in formArray){
        data[formArray[index].name]=formArray[index].value;
    }
    //now data has a form like
    //{name: "mickey", surname:"Mouse",...}
    $.ajax({
        url: "/users/register" ,
        data: data,
        dataType: 'json',
        type: 'POST',
        success: function (dataR) {
            // no need to JSON parse the result, as we are using
            // dataType:json, so JQuery knows it and unpacks the
            // object for us before returning it
            if(dataR.exsting){
                $("#message").html("<div class='alert alert-danger alert-dismissible'>" +
                    "<a href=\"#\" class=\"close\" data-dismiss=\"alert\" aria-label=\"close\">x</a>" +
                    "<p>Email Exsting</p></div>");
            }else if(dataR.nomatch){
                $("#message").html("<div class='alert alert-danger alert-dismissible'>" +
                    "<a href=\"#\" class=\"close\" data-dismiss=\"alert\" aria-label=\"close\">x</a>" +
                    "<p>Please confirm your password</p></div>");
            }else{
                $("#message").html("<div class='alert alert-success alert-dismissible'>" +
                    "<a href=\"#\" class=\"close\" data-dismiss=\"alert\" aria-label=\"close\">x</a>" +
                    "<p>You can Log in now</p></div>");
                window.location.href =  "/users/profile"
            }



            // in order to have the object printed by alert
            // we need to JSON stringify the object

        },
        error: function (xhr, status, error) {
            alert('Error: ' + error.message);
            console.lgo(error);
        }
    });
    event.preventDefault();
}
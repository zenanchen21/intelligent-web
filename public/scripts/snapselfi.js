
function snapselfi(){
    //!! converts a value to a boolean and ensures a boolean type.
    var hasGetUserMedia = !!(navigator.mediaDevices.getUserMedia ||
        navigator.mediaDevices.webkitGetUserMedia ||
        navigator.mediaDevices.mozGetUserMedia ||
        navigator.mediaDevices.msGetUserMedia);

    var errocb = function(err){
        console.log("sth srong");
    };
    var handleSuccess = function(stream) {
        // Attach the video stream to the video element and autoplay.
        player.srcObject = stream;
    };

    var video_element = document.getElementById('player');
    var canvas = document.getElementById('snapshot');
    var snap = document.getElementById('snap')
    var context = canvas.getContext('2d');
    if(hasGetUserMedia){
        navigator.mediaDevices.getUserMedia({video:true})
            .then(handleSuccess)
            .catch(errocb);

        snap.addEventListener("click",function(){
            context.drawImage(video_element,0,0,640,480);
        });
    }else{
        console.log('someerror');
    }

}


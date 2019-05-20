/**
 * initialize mediaDevices
 * get elements of selectors that will be used
 * display stream on canvas
 * display feezed image on canvas if click snap
 */
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
    var snap = document.getElementById('snap');
    var context = canvas.getContext('2d');
    if(hasGetUserMedia){
        navigator.mediaDevices.getUserMedia({video:true})
            .then(handleSuccess)
            .catch(errocb);
        //draw image to canvas when click
        snap.addEventListener("click",function(){
            context.drawImage(video_element,0,0,640,480);
        });
    }else{
        console.log('someerror');
    }

}


/**
 * Returns an Image object and download to local disk
 * the downloaded image name is reference to the time it downloaded
 * image attribute always be .png
 */
function dloadselfi(){
        //获取canvas标签里的图片内容
    var filename = (new Date()).getTime() + '.' + 'png';
    var canvas = document.getElementById('snapshot');
    download(canvas.toDataURL('image/png'),filename)

}

/**
 * Returns an Image object that can then be painted can be downloaded
 * The url argument must specify an absolute {@link URL}. The name
 * argument is a specifier that is relative to the url argument.
 * @param url an absolute URL giving the base location of the image
 * @param name the location of the image, relative to the url argument
 */
function download(url, name) {
    const aLink = document.createElement('a');
    aLink.download = name;
    aLink.href = url;
    aLink.dispatchEvent(new MouseEvent('click', {}))
    window.location.href = '/'
}




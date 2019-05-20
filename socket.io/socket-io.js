var controler = require('../controllers/posts')
exports.init = function (io, appX) {
  io.on('connection', function (socket) {
    console.log("connected");
    socket.on('disconnect', function(){
      console.log('user disconnected');
    });

    /**
     * when ask to send data broadcast to all socket connected
     */
    socket.on('send comment', function (com) {
      socket.broadcast.emit("new comment", com);
    });

    socket.on('send post', function (post) {
      socket.broadcast.emit("new post", post);
    })

    //event not working because create page does not connect to the index
    socket.on('send event', function (event) {
      socket.broadcast.emit("new event", event);
    });

    //search on mongodb using socket
    socket.on('search', function (keyword) {
      controler.search(keyword, function (data) {
        console.log("search: ", data)
        socket.emit("search result", data);
      });
    })
  });
};
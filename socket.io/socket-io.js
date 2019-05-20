var controler = require('../controllers/posts')
exports.init = function (io, appX) {
  io.on('connection', function (socket) {
    console.log("connected");
    socket.on('disconnect', function(){
      console.log('user disconnected');
    });

    socket.on('send comment', function (com) {
      socket.broadcast.emit("new comment", com);
    });

    socket.on('send post', function (post) {
      socket.broadcast.emit("new post", post);
    })

    socket.on('send event', function (event) {
      socket.broadcast.emit("new event", event);
    });

    socket.on('search', function (keyword) {
      controler.search(keyword, function (data) {
        console.log("search: ", data)
        socket.emit("search result", data);
      });
    })
  });
};
exports.init = function (io, appX) {
  io.on('connection', function (socket) {
    console.log("connected");
    socket.on('disconnect', function(){
      console.log('user disconnected');
    });

    socket.on('send comment', function (com) {
      socket.broadcast.emit("new comment", com)
    });


  });
};
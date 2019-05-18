var socket = io();

$(document).on("submit", "form.collapse", function (event) {
  event.preventDefault();
  var comment = this[0].value;
  const input = JSON.stringify({
    content: comment,
    date: Date.now(),
    postID: this.id.slice(3)
  });
  socket.emit('send comment', input);
  this[0].value = '';
  $(this).collapse('hide');
});

socket.on("new comment", function(comData){
  addComment(JSON.parse(comData));
  console.log("received new : " + comData);
});

function addComment (data) {
  var footer = document.getElementById("footer"+data.id);
  
}
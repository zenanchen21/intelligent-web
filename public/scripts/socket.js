var socket = io();

$(document).on("submit", "form.collapse", function (event) {
  event.preventDefault();
  var form = this;
  var comment = form[0].value;
  const input =JSON.stringify({
    content: comment,
    date: Date.now(),
    postID: form.id.slice(3),
  });
  $.ajax({
    url:'/newComment',
    data: input,
    contentType: 'application/json',
    dataType: 'json',
    type: 'POST',
    success: function (data) {
      socket.emit('send comment', data);
      addComment(data);
      form[0].value = '';
      $(form).collapse('hide');
    },
    error: function (xhr, status, error) {
      console.log(error)
      console.log("fail to comment, try again later");
    }
  });
});

socket.on("new comment", addComment);

socket.on("new post", function (posData) {
  addToResults('posts', posData);
});

socket.on("new event", function (eveData) {
  addToResults('events',eveData);
});

function addComment (data) {
  var footer = document.getElementById("footer"+data.post);
  var div = document.getElementById("coms"+data.post);
  var row = document.createElement('div');
  var timDiff = timeDiff(Date.now(), Date.parse(data.date));


  row.id = 'c'+data._id;
  row.innerHTML = '<div class="d-flex w-100 justify-content-between">\n' +
    '    <h6 class="mb-1">'+data.content+'</h6>\n' +
    '      <small>'+timDiff+'</small>\n</div>' +
    '    <small>'+data.author.username+'</small>'

  row.classList.add('list-group-item', 'list-group-item-dark');
  if(!div){
    div = document.createElement('div');
    div.classList.add('list-group');
    div.id = 'coms'+data.post;
    footer.appendChild(div);
  }

  div.prepend(row);
  if(div.childNodes.length>2){
    var anchor = document.getElementById("a"+data.post)
    if (!anchor){
      anchor = document.createElement('a');
      anchor.id = "a"+data.post;
      anchor.classList.add('list-group-item','d-flex', 'justify-content-between', 'align-items-center');
      anchor.setAttribute('data-toggle','collapse');
    }
    div.insertBefore(anchor,div.childNodes[2]);

    anchor.innerHTML = '<h6>Load more...</h6>\n'+
      '<span class="badge badge-primary badge-pill">'+(div.childNodes.length-3)+'</span>\n'

    var tar = anchor.getAttribute('data-target');
    for(var i=3; i<div.childNodes.length; i++){
      var hideEle = div.childNodes[i];
      if (!hideEle.classList.contains('collapse')){
        hideEle.classList.add('collapse');
      }
      if(tar)
        tar += ",#"+hideEle.id;
      else
        tar = '#'+hideEle.id;
    }
    anchor.setAttribute('data-target', tar);
  }
}

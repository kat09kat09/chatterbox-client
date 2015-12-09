var users= {};



$(document).ready(function() {



//grab most recent 100 -- parse api doc
var getData = function () {
  
    $.ajax({
    // This is the url you should use to communicate with the parse API server.
    url: 'https://api.parse.com/1/classes/chatterbox', 
    type: 'GET', 
    data: {"order":"-createdAt"}, 
    contentType: 'application/json', 
    success: function (data) {
      console.log('chatterbox: Message received. Data: ', data);
      var value; 
      var escaped; 
      var rooms = [];
      var dataResults = data.results;

      for(var i = 0; i < dataResults.length; i++){


        var message = dataResults[i].text; 
        
        var username = dataResults[i].username;


        if(users[username]===undefined) {
          users[username]=[]; 
        }

        //take logic for determining escaped values and put it in a fxn
        //call fxn for the values you're appending
        //if undefined..
        var escapeHtml = function(value){
          if(value !== undefined){
            //escape string for insertion into HTML
            escaped = _.escape(value);
          } else {
            //else return empty
            escaped = _.escape("");
          }
          return escaped;
         };   


        //append checked value to the page
        $('#main').append('<p><a href="" class="pickFriend">' + escapeHtml(username) + "</a> " + ":" + " " + escapeHtml(message) + '</p>');

        
        //set apart the room messages
        if(rooms.indexOf(dataResults[i].roomname) === -1){
          rooms.push(dataResults[i].roomname); 
        }
      }

      //iterate through the rooms list
      for(var i = 0; i < rooms.length; i++){
        var roomEscaped = escapeHtml(rooms[i]);
        //create an option for each unique room
        $('.chatroom').append('<option class= "roomEscaped">' + roomEscaped + '</option>');
      }


      console.log('rooms', rooms); 
     $('.chatroom').change(function(){
        var selectedRoom = $('.chatroom option:selected').val();

        //empty out the child elements of #main (messages)
        $('#main').empty();
        //filter the dataResults by the "selected room"
        for(var i = 0; i < dataResults.length; i++){
          if(dataResults[i].roomname === selectedRoom){
            $('#main').append('<p><a href="" class="pickFriend">' + escapeHtml(dataResults[i].username) + "</a> " + ":" + " " + escapeHtml(dataResults[i].text) + '</p>');
          }
        }

     });
    
  },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to get message. Error: ', data);
    }
  });
}




  var setData = function (message) {
    // console.log('set data gets called'); 

    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: 'https://api.parse.com/1/classes/chatterbox',
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      // dataType: 'application/json',
      success: function (data) {
        // alert("success"); 
        console.log('chatterbox: Message sent. Data: ', data);
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message. Error: ', data);
      }, 
      cache: false
    });

    event.preventDefault(); 
    return false; 
  };

   //bind an event handler to our button
  $('#update').on('click', function() {
    getData(); 
  }); 


  $('.submitMessage').on('click',  function () {
    // debugger;
    console.log('hey i submitted a message'); 
    //grab message
   
    var value = $('.message').val(); 
    var pickChat = $('.userchat').val();
    console.log('pickChat', pickChat); 

    console.log('message', value); 
    
    var username = $('.username').val();

    var message = {
      username: username, 
      text: value,
      roomname: pickChat
    };

    console.log('message', message); 

    // pass it to setData
    setData(message);
    // return false;
  }); 

  $('.pickFriend').on('click', function(){
    //who is the user clicker?
    console.log('friend', $(this).val()); 
    var storedUser= window.location.search;

    storedUser= storedUser.replace(/\?username\=/, "");  
   
    users[storedUser]= 

    //see if the clicked username's friends list contains user clicker
  });
  // $('.chatroom').change(function(){
  //       var selectedRoom = $('.chatroom option:selected').val();
  // });

});






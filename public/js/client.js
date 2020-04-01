$(function () {
    let socket = io();
    let username = '';
    let cookie_username = 'game-username'

    socket.on('connect', function () {

    });

    let getCookie = function(name) {
      var v = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
      return v ? v[2] : null;
    }

    let initializeGameBoardHTML = function(){
      let cols = $(".col");
      for (let x = 0; x < cols.length; x++) {
        for (let y = 0; y < 7; y++) {
          let square = document.createElement('div');
          // square.id = 'block';
          square.className = 'square';
          cols[x].appendChild(square) ;
        }
      }
    }

    socket.on('your_username', function(usrname){
      // Check if username cookie exists on connect
      let cookie = getCookie(cookie_username);
      if (cookie !== null) {
        // If username exists, use that username
        let usrname = cookie;
        socket.emit('prior_username', usrname);
        username = usrname;
      } else {
        username = usrname;
        document.cookie = cookie_username + '=' + usrname;
      }
      $('#username').text('Username: ' + username);
    });

    socket.on('alert_mesg', function(mesg) {
      alert(mesg);
    });

    socket.on('connectToRoom', function(mesg) {
      $('#banner_message').text(mesg);
    });

    socket.on('game_start', function(gameData) {
      $('.matchmaking').remove();
      $('#banner_message').text('');
      let opponent = gameData['player1'];
      if (opponent === username) opponent = gameData['player2'];
      $('#players').text(username + ', you are playing ' + opponent);
      $('#turn').text('Turn: ' + gameData['turn']);
      initializeGameBoardHTML();
    });

    $('#newgame_button').click(function() {
      socket.emit('new_game');
      $('.matchmaking').remove();
      // Send message to player to let them know how to let another player join
    });

    $('#joinrandomgame_button').click(function() {
      socket.emit('join_random_game');
      $('.matchmaking').remove();
      // Send message to player to let them know to wait
    });

    $('#joingame_form').submit(function(e){
      e.preventDefault(); // prevents page reloading
      let game_code = $('#m').val();
      if (game_code === '') return false;
      socket.emit('join_game', game_code);
      return false;
    });
});
        var maxPlayers = 11;
        $(window).bind("load",function()
        { 
           $('#rightButton').click(function() {
            console.log("button press");
           event.preventDefault();
            if($('#leaderboard').scrollLeft() >= 0 && $('#leaderboard').scrollLeft() < maxPlayers * 325)
            {
               $('#leaderboard').scrollLeft($('#leaderboard').scrollLeft() + 325);
            }
        });

        $('#leftButton').click(function() {
           event.preventDefault();
           if($('#leaderboard').scrollLeft() >= 0 && $('#leaderboard').scrollLeft() < maxPlayers * 325)
            {
               $('#leaderboard').scrollLeft($('#leaderboard').scrollLeft() - 325);
            }
        });
      });





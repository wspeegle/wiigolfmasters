        $(document).ready(function()
        {
           $('#rightButton').click(function() {
            console.log("button press");
           event.preventDefault();

           if($('#leaderboard').scrollLeft() == 0)
           {
               $('#leaderboard').scrollLeft(275)
           }else if($('#leaderboard').scrollLeft() <= 275)
            {
               $('#leaderboard').scrollLeft(550)
            }
            else if($('#leaderboard').scrollLeft() <= 550)
            {
               $('#leaderboard').scrollLeft(825)
            }else if($('#leaderboard').scrollLeft() <= 825)
            {
               $('#leaderboard').scrollLeft(1110)
            }else if($('#leaderboard').scrollLeft() <= 1100)
            {
               $('#leaderboard').scrollLeft(1375)
            }
            else if($('#leaderboard').scrollLeft() <= 1375)
            {
               $('#leaderboard').scrollLeft(1650)
            } 
        });

        $('#leftButton').click(function() {
           event.preventDefault();
           if($('#leaderboard').scrollLeft() >= 1375)
           {
               $('#leaderboard').scrollLeft(1100)
           }else if($('#leaderboard').scrollLeft() >= 1100)
            {
               $('#leaderboard').scrollLeft(825)
            }
            else if($('#leaderboard').scrollLeft() >= 825)
            {
               $('#leaderboard').scrollLeft(550)
            }else if($('#leaderboard').scrollLeft() >= 550)
            {
               $('#leaderboard').scrollLeft(275)
            }else if($('#leaderboard').scrollLeft() >= 275)
            {
               $('#leaderboard').scrollLeft(0)
            }
            
        });
      });





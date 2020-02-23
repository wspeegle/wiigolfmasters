function buildPlayerList(player_container_id)
{
    db.collection("players").orderBy('last_name', 'asc').get().then(function(querySnapshot)
    {
        querySnapshot.forEach(function(doc)
        {
            //build an article tile for the first x articles
            //the first article should be bigger and more pronounced
            buildPlayerTile(player_container_id, doc);
        });
    }); 
}

function buildPlayerTile(player_container_id, player_doc)
{
    var db = firebase.firestore();
    db.collection("current_year").doc('7WLtPHTN4hSokQ0qhOtP').get().then(function(doc)
    {
        var current_year = doc.data().year;
        var years = [];
        for(let i = current_year; i >= 2018; i--)
        {
            years[years.length] = i;
        }
        getPlayerAndRoundData(years, function(master_data, sorted)
        {
            var player_id = player_doc.id;
            var rounds = master_data[player_id]["ROUNDS"];
            var round_ids = Object.keys(rounds);
            var latest_round = 0;
            var round_scores = {};
            for(let i = 0; i < round_ids.length; i++)
            {
                var round = rounds[round_ids[i]];
                if(round["YEAR"] == years[0])
                {
                    if(round["ROUND_NUM"] > latest_round)
                    {
                        latest_round = round["ROUND_NUM"];
                        round_scores = {};

                        round_scores[round["ROUND_NUM"]] = {};
                        round_scores[round["ROUND_NUM"]]["SCORE"] = totalScore(round["SCORECARD"]);
                        round_scores[round["ROUND_NUM"]]["PAR"] = parForScorecard(round["SCORECARD"]);
                    } 
                }
            }
            latest_round = Object.keys(round_scores)[0];
            //get years played for this player
            var years_played = [];
            for(let i = 0; i < years.length; i++)
            {
                if(master_data[player_id][years[i]])
                    years_played[years_played.length] = years[i];
            }
                    
            var player_container = document.getElementById(player_container_id);
            var card = document.createElement('a');
            card.className = 'player_tile'
            var player_img =  document.createElement('img');
            player_img.className = 'playerImage';
            player_img.style.width = '150px';
            player_img.style.height = '150px';
            player_img.style.marginTop = '15px';
            getPlayerImage(player_doc.id, player_img);
            card.appendChild(player_img);
            var date_div = document.createElement('div');
            date_div.className = 'player_tile_years_played';
            date_div.innerHTML = years_played.join(' ');
            card.appendChild(date_div);
            var description_div = document.createElement('div');
            description_div.className = 'player_tile_name';
            description_div.innerHTML = player_doc.data().first_name + " " + player_doc.data().last_name; 
            card.appendChild(description_div);
            var last_placing = document.createElement('div');
            last_placing.className = 'player_tile_finish'
            if(years_played.length > 0)
                last_placing.innerHTML = 'Last Finish: ' + master_data[player_doc.id][years_played[0]]["POSITION"];
            else //first year
                last_placing.innerHTML = "Rookie";
            card.appendChild(last_placing);
            var another_stat = document.createElement('div');
            another_stat.className = 'player_tile_finish';
            another_stat.innerHTML = 'Some other info';
            card.appendChild(another_stat);
            player_container.appendChild(card);
            card.href = '/playerdetails.html?player_id='+player_doc.id;
            

           
        });
    });
















}



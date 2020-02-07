//There has to be a better way to do this, but this is my way
function createScorecardBanner(parent_div)
{
    db = firebase.firestore();
    //first get all the rounds for the latest year
    var current_year = new Date().getFullYear();
    var rounds;
    var players;
    getRoundsForYear(current_year).then(function(rounds)
    {
        
        //then we need to get a list of all the players that played in the first round
        getPlayersForRound(rounds[0]).then(function(players)
        {
            
        //then we need to get the total score of all rounds for that year for that player

            var promises = [];
            for(var i = 0; i < players.length; i++)
            {
                promises.push(getPlayerTotalsforRounds(players[i], rounds));
            }
            Promise.all(promises).then(function(player_scores_array)
            {
                
                promises = [];
                for(var i = 0; i < players.length; i++)
                {
                    promises.push(getPlayerName(players[i]));
                }
                Promise.all(promises).then(function(players_info)
                {
                    console.log("rounds");
                    console.log(rounds);
                    console.log("players");
                    console.log(players);
                    console.log("player_scores_array")
                    console.log(player_scores_array);
                    console.log("players_info");
                    console.log(players_info);
                    var master_data = {};
                    for(let i = 0; i < players_info.length; i++)
                    {
                        var player_id = Object.keys(players_info[i])[0];
                        master_data[player_id] = players_info[i][player_id];
                    }
                    for(let i=0; i < player_scores_array.length; i++)
                    {
                        var player_id = Object.keys(player_scores_array[i])[0];
                        master_data[player_id]["TOTAL"] = player_scores_array[i][player_id]["TOTAL"];
                        master_data[player_id]["PAR"] = player_scores_array[i][player_id]["PAR"];

                    }   
                    console.log(master_data);
                    //Now that we have the data we need...we can finally build the fucking scorecard tiles
                    var lb_div = document.getElementById(parent_div);
                    Object.keys(master_data).forEach(function(key){
                        var wrapper = document.createElement('a');
                        wrapper.href = '/players/'+key;
                        wrapper.className = 'leaderboardCard';
                        var rank_div = document.createElement('div');
                        rank_div.className = 'rank';
                        rank_div.innerHTML = '1';
                        wrapper.appendChild(rank_div);
                        var pic_div = document.createElement('div');
                        pic_div.className = 'cardPic';
                        var img = document.createElement('img');
                        img.className = 'playerImage';
                        img.style.width = '60px';
                        img.style.height = '60px';
                        img.src = 'test.jpg';
                        pic_div.appendChild(img);
                        wrapper.appendChild(pic_div);
                        var name_wrapper = document.createElement('div');
                        var name_div = document.createElement('div');
                        name_div.className = 'cardName';
                        name_div.innerHTML = master_data[key]["FIRST_NAME"] + " " + master_data[key]["LAST_NAME"];
                        name_wrapper.appendChild(name_div);
                        wrapper.appendChild(name_div);
                        var score_div = document.createElement('div');
                        score_div.className = 'cardScore';
                        var score_span = document.createElement('span');
                        if(master_data[key]["TOTAL"] < master_data[key]["PAR"])
                            score_span.className = 'under'
                        score_span.innerHTML = master_data[key]["PAR"] - master_data[key]["TOTAL"];
                        score_div.appendChild(score_span);
                        wrapper.appendChild(score_div);
                        lb_div.appendChild(wrapper);
                    })
                    
                    
                });


            });
            
        
        
            
        });
        
    });
    current_year--;
    
    
        
    //then we need to find out how many holes were played that year, and calculate the player's score

}

var getRoundsForYear = function(year){
return new Promise(function(resolve, reject)
{
    var rounds = [];
    db = firebase.firestore();
    db.collection("round").where("year", "==", year).orderBy("round_num", "asc").get().then(function(querySnapshot)
    {
        querySnapshot.forEach(function(doc)
        {
            var doc_data = doc.data();
            rounds[doc_data.round_num-1] = doc.id;
        });
        resolve(rounds);
    });
});
}

var getPlayersForRound = function(round)
{
    return new Promise(function(resolve, reject)
    {
        var players = [];
        db = firebase.firestore();
        db.collection("player_score").where("round", "==", round).get().then(function(querySnapshot)
        {
            querySnapshot.forEach(function(doc)
            {
                var doc_data = doc.data();
                players[players.length] = doc_data.player;
            });

            resolve(players);
        });
})
}

var getPlayerTotalsforRounds = function(player, rounds)
{
    return new Promise(function(resolve, reject)
    {
        db = firebase.firestore();
        var player_totals = {};
        db.collection("player_score").where("round", "in", rounds).get().then(function(querySnapshot)
        {
            var total = 0;
            var par   = 0;
            querySnapshot.forEach(function(doc)
            {
                var doc_data = doc.data();
                if(doc_data.player == player)
                {
                    total += totalScore(doc_data.score);
                    par =+ doc_data.par;
                }
            });

            player_totals[player] = {"TOTAL": total, "PAR": par};
        });
        
        resolve(player_totals)
    });
}

var getPlayerName = function(player_id)
{
    return new Promise(function(resolve, reject)
    {
        db = firebase.firestore();
        var player = {};
        db.collection("players").doc(player_id).get().then(function(doc)
        {
            
            var doc_data = doc.data();
            player[player_id] = {};
            player[player_id]["FIRST_NAME"]    = doc_data.first_name;
            player[player_id]["LAST_NAME"]     = doc_data.last_name;
            // player["PIC_LINK"]      = doc_data.pic_link;
            
            resolve(player);
        });
    });
}

function totalScore(score_array)
{
    var total = 0;
    for(var i = 0; i < Object.keys(score_array).length; i++)
    {
        total += isNaN(parseInt(score_array[i])) ? 0 : parseInt(score_array[i]);
    }
    return total;

}
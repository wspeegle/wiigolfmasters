//There has to be a better way to do this, but this is my way
function createScorecardBanner(parent_div)
{
    db = firebase.firestore();
    //first get all the rounds for the latest year
    var current_year = new Date().getFullYear();
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
                    //Now that we have the data we need...we can finally build the fucking scorecard tiles
                    //...but first we need to make sure they are ordered correctly!
                    //How the hell do we account for missing the cut
                    var sorted = Object.keys(master_data).sort(function(a,b)
                    {
                        return (master_data[a]["TOTAL"]-master_data[b]["TOTAL"])
                    }).map(function(k)
                    {
                         return k;
                    });
                    console.log(sorted);
                    var lb_div = document.getElementById(parent_div);
                    var position_rank = 1;
                    var position_text = "1";
                    
                    for(let i = 0; i < sorted.length; i++)
                    {
                        if(i > 0 && master_data[sorted[i]]["TOTAL"] == master_data[sorted[i-1]]["TOTAL"])
                        {
                            //there is a tie we need to display that
                            position_text = "T"+position_rank;                            
                        }else if(i+1 < sorted.length && master_data[sorted[i]]["TOTAL"] == master_data[sorted[i+1]]["TOTAL"] && master_data[sorted[i]]["TOTAL"] != master_data[sorted[i-1]]["TOTAL"])
                        {//First score of a series of ties
                            position_rank++;
                            position_text = "T"+position_rank;
                            
                        }else
                        {
                            position_rank = i+1;
                            position_text = position_rank;
                        }
                        lb_div.appendChild(createLeaderboardCard(master_data[sorted[i]], sorted[i], position_text));
                    }
                    
                });
            });
        });
    });
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

var getPlayerImage = function(player_id, img)
{
    return new Promise(function(resolve, reject)
    {
        var storageRef = firebase.storage().ref();
        storageRef.child('images/players/'+player_id).getDownloadURL().then(function(url)
        {
            img.src = url;
        });
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


function createLeaderboardCard(player_data, player_id, position)
{
    var wrapper = document.createElement('a');
    wrapper.href = '/players/'+player_id;
    wrapper.className = 'leaderboardCard';
    var rank_div = document.createElement('div');
    rank_div.className = 'rank';
    rank_div.innerHTML = position;
    wrapper.appendChild(rank_div);
    var pic_div = document.createElement('div');
    pic_div.className = 'cardPic';
    var img = document.createElement('img');
    img.className = 'playerImage';
    img.style.width = '60px';
    img.style.height = '60px';
    getPlayerImage(player_id, img);
    pic_div.appendChild(img);
    wrapper.appendChild(pic_div);
    var name_wrapper = document.createElement('div');
    var name_div = document.createElement('div');
    name_div.className = 'cardName';
    name_div.innerHTML = player_data["FIRST_NAME"] + " " + player_data["LAST_NAME"];
    name_wrapper.appendChild(name_div);
    wrapper.appendChild(name_wrapper);
    var score_div = document.createElement('div');
    score_div.className = 'cardScore';
    var score_span = document.createElement('span');
    if(player_data["TOTAL"] < player_data["PAR"])
    {
        score_span.className = 'under'
        score_span.innerHTML = "-" + (player_data["PAR"] - player_data["TOTAL"]);
    }else if(player_data["TOTAL"] > player_data["PAR"])
    {
        score_span.innerHTML = "+" + (player_data["TOTAL"] - player_data["PAR"]);
        score_span.className = 'over';
    }
    else
    {
        score_span.innerHTML = "E";
        score_span.className = 'over';
    }
    let holes_played = (player_data["PAR"] / 72)*18;
    score_div.appendChild(score_span);
    score_div.innerHTML += "Thru " + holes_played;
    name_wrapper.appendChild(score_div);
    return wrapper;
}
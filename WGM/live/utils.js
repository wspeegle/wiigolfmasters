var initializeFirebase = function()
{
    firebase.initializeApp
    ({
        apiKey: "AIzaSyB3qmQNbtcpQeLSn3mHsAoYtDxGL-uHL6c",
        authDomain: "wiigolfmasters.firebaseapp.com",
        databaseURL: "https://wiigolfmasters.firebaseio.com",
        projectId: "wiigolfmasters",
        storageBucket: "wiigolfmasters.appspot.com",
        messagingSenderId: "660957033972",
        appId: "1:660957033972:web:59179876aae65a91b875a1",
        measurementId: "G-8TGBMCXL58"
    });
}

var getPlayerAndRoundData = function(years, callback)
{
    db = firebase.firestore();
    var promises = [];
    for(let i = 0; i < years.length; i++)
    {
        promises.push(getMasterDataForYear(years[i]));
    }
    Promise.all(promises).then(function(master_data_array, sorted_array)
    {
        var master_data = {};
        var sorted = {};

        for(let i = 0; i < master_data_array.length; i ++)
        {
            var master_data_keys = Object.keys(master_data);
            var m_d = master_data_array[i];
            if(m_d)
            {
                var m_d_keys = Object.keys(m_d);
                for(let j = 0; j < m_d_keys.length; j++)
                {
                    if(master_data_keys.indexOf(m_d_keys[j]) == -1)
                    {
                        master_data[m_d_keys[j]] = {};
                        master_data[m_d_keys[j]]["FIRST_NAME"] = m_d[m_d_keys[j]]["FIRST_NAME"];
                        master_data[m_d_keys[j]]["LAST_NAME"] = m_d[m_d_keys[j]]["LAST_NAME"];
                        master_data[m_d_keys[j]]["ROUNDS"] = {};
                    }
                    var year = m_d[m_d_keys[j]]["YEAR"];
                    master_data[m_d_keys[j]][year] = {};
                    master_data[m_d_keys[j]][year]["TOTAL"] = m_d[m_d_keys[j]]["TOTAL"];
                    master_data[m_d_keys[j]][year]["PAR"] = m_d[m_d_keys[j]]["PAR"];
                    master_data[m_d_keys[j]][year]["POSITION"] = m_d[m_d_keys[j]]["POSITION"];
                    var rounds = m_d[m_d_keys[j]]["ROUNDS"];
                    var round_keys = Object.keys(rounds);
                    for(let k = 0; k < round_keys.length; k++)
                    {
                        master_data[m_d_keys[j]]["ROUNDS"][round_keys[k]] = {};
                        master_data[m_d_keys[j]]["ROUNDS"][round_keys[k]]["YEAR"] = m_d[m_d_keys[j]]["ROUNDS"][round_keys[k]]["YEAR"];
                        master_data[m_d_keys[j]]["ROUNDS"][round_keys[k]]["ROUND_NUM"] = m_d[m_d_keys[j]]["ROUNDS"][round_keys[k]]["ROUND_NUM"];
                        master_data[m_d_keys[j]]["ROUNDS"][round_keys[k]]["SCORECARD"] = m_d[m_d_keys[j]]["ROUNDS"][round_keys[k]]["SCORECARD"];
                    }
                }

                //sort on current year which should be year 0
                var sorted = Object.keys(master_data).sort(function(a,b)
                            {

                                if(master_data[a][years[0]] && master_data[b][years[0]])
                                    return (master_data[a][years[0]]["TOTAL"]-master_data[b][years[0]]["TOTAL"])
                            }).map(function(k)
                            {
                                return k;
                            });
                
                
                        
            }
    }
        console.log(master_data);
        callback(master_data, sorted);
    });

    
    
}

var getMasterDataForYear = function(year)
{
    return new Promise(function(resolve, reject)
    {
        //first get all the rounds for the latest year
        getRoundsForYear(year).then(function(rounds)
        {
            //then we need to get a list of all the players that played in the first round
            if(Object.keys(rounds).length > 0)
            {
                getPlayersForRound(Object.keys(rounds)[0]).then(function(players)
                {
                    //then we need to get the total score of all rounds for that year for that player
                    promises = [];
                    for(var i = 0; i < players.length; i++)
                    {
                        promises.push(getPlayerTotalsforRounds(players[i], Object.keys(rounds)));
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
                                master_data[player_id]["ROUNDS"] = {};
                            }
                            for(let i=0; i < player_scores_array.length; i++)
                            {
                                var player_id = Object.keys(player_scores_array[i])[0];
                                var player_rounds = {};
                                if(player_id)
                                {
                                    master_data[player_id]["TOTAL"] = player_scores_array[i][player_id]["TOTAL"];
                                    master_data[player_id]["PAR"] = player_scores_array[i][player_id]["PAR"];
                                    
                                    for(let j = 0; j < Object.keys(player_scores_array[i][player_id]["ROUNDS"]).length; j++)
                                    {
                                        var round_id = Object.keys(player_scores_array[i][player_id]["ROUNDS"])[j];
                                        player_rounds[round_id] = {};
                                        player_rounds[round_id]["YEAR"] = rounds[round_id]["YEAR"];
                                        player_rounds[round_id]["ROUND_NUM"] = rounds[round_id]["ROUND_NUM"];
                                        player_rounds[round_id]["SCORECARD"] = player_scores_array[i][player_id]["ROUNDS"][round_id]["SCORECARD"];
                                    }
                                    master_data[player_id]["ROUNDS"] = player_rounds;
                                    master_data[player_id]["YEAR"] = year;
                                }
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
                                master_data[sorted[i]]["POSITION"] = position_text;
                                
                            }
                            resolve(master_data, sorted);
                            
                            
                        });
                    });
                });
            }
                else resolve(null, null);
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
                rounds[doc.id] = {};
                rounds[doc.id]["ROUND_NUM"] = doc_data.round_num;
                rounds[doc.id]["YEAR"] = doc_data.year;
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
            var rounds = {};
            querySnapshot.forEach(function(doc)
            {
                var doc_data = doc.data();
                if(doc_data.player == player)
                {
                    total += totalScore(doc_data.score);
                    par =+ doc_data.par;
                    rounds[doc_data.round] = {};
                    rounds[doc_data.round]["SCORECARD"] = doc_data.score;
                }
            });

            player_totals[player] = {"TOTAL": total, "PAR": par, "ROUNDS": rounds};
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

var getRounds = function()
{
    return new Promise(function(resolve, reject)
    {
        db = firebase.firestore();
        var rounds = {};
        db.collection("round").orderBy("year", "desc").get().then(function(querySnapshot)
        {
            querySnapshot.forEach(function(doc)
            {
                rounds[doc.id] = {};
                rounds[doc.id]["ROUND_NUM"] = doc.data().round_num;
                rounds[doc.id]["YEAR"]      = doc.data().year;
            });
            resolve(rounds);
        });
    });
}
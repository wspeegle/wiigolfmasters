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
                        master_data[m_d_keys[j]]["BIO"] = m_d[m_d_keys[j]]["BIO"];
                        master_data[m_d_keys[j]]["ROUNDS"] = {};
                    }
                    var year = m_d[m_d_keys[j]]["YEAR"];
                    master_data[m_d_keys[j]][year] = {};
                    master_data[m_d_keys[j]][year]["TOTAL"] = m_d[m_d_keys[j]]["TOTAL"];
                    master_data[m_d_keys[j]][year]["PAR"] = m_d[m_d_keys[j]]["PAR"];
                    master_data[m_d_keys[j]][year]["POSITION"] = m_d[m_d_keys[j]]["POSITION"];
                    master_data[m_d_keys[j]][year]["MISSED_CUT"] = m_d[m_d_keys[j]]["MISSED_CUT"];
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
                                    return ((master_data[a][years[0]]["TOTAL"]-master_data[a][years[0]]["PAR"])-(master_data[b][years[0]]["TOTAL"]-master_data[b][years[0]]["PAR"]))
                            }).map(function(k)
                            {
                                return k;
                            });
                
                
                        
            }
    }
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
                                    var missed_cut = false;
                                    master_data[player_id]["TOTAL"] = player_scores_array[i][player_id]["TOTAL"];
                                    master_data[player_id]["PAR"] = player_scores_array[i][player_id]["PAR"];
                                    master_data[player_id]["MISSED_CUT"] = player_scores_array[i][player_id]["MISSED_CUT"];
                                    
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
                                return ((master_data[a]["TOTAL"]-master_data[a]["PAR"]) - (master_data[b]["TOTAL"]-master_data[b]["PAR"]))
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
                                }else if(i>0 && i+1 < sorted.length && master_data[sorted[i]]["TOTAL"] == master_data[sorted[i+1]]["TOTAL"] && master_data[sorted[i]]["TOTAL"] != master_data[sorted[i-1]]["TOTAL"])
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
            var missed_cut = false;
            var player_rounds = {};
            querySnapshot.forEach(function(doc)
            {
                var doc_data = doc.data();
                if(doc_data.player == player)
                {
                    total += totalScore(doc_data.score);
                    par += doc_data.par;
                    player_rounds[doc_data.round] = {};
                    player_rounds[doc_data.round]["SCORECARD"] = doc_data.score;
                    if(doc_data.missed_cut)
                        missed_cut = true;
                }
            });

            player_totals[player] = {"TOTAL": total, "PAR": par, "ROUNDS": player_rounds, "MISSED_CUT": missed_cut};
            resolve(player_totals);
        });
        
        
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
            player[player_id]["BIO"]           = doc_data.bio;
            
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

function parForScorecard(score_array)
{
    const par_array     = [4,3,5,3,5,4,4,3,5,4,3,5,3,5,4,4,3,5];
    var par = 0;
    for(var i = 0; i < Object.keys(score_array).length; i++)
    {
        if(score_array[i] > 0)
        {
            par += par_array[i];
        }
    }
    return par;
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

function getQueryVariable(variable)
{
       var query = window.location.search.substring(1);
       var vars = query.split("&");
       for (var i=0;i<vars.length;i++) {
               var pair = vars[i].split("=");
               if(pair[0] == variable){return pair[1];}
       }
       return(false);
}


function signIn()
{
    var provider = new firebase.auth.GoogleAuthProvider();
    console.log('signinwithredirect');
    firebase.auth().signInWithRedirect(provider);
}

function signOut() {
    firebase
        .auth()
        .signOut()
        .then(function() {
            // Sign-out successful.
        })
        .catch(function(error) {
            // An error happened.
        });
}

async function buildHeader(header_id)
{
    var header = document.getElementById(header_id);
    var home = document.createElement('a');
    home.href = '/home.html';
    var logo = document.createElement('img');
    logo.src = '/images/logo.png';
    logo.style.height = '60px';
    home.appendChild(logo);
    var news = document.createElement('a');
    news.innerHTML = 'News';
    news.href='/news.html';
    var leaders = document.createElement('a');
    leaders.innerHTML = 'Leaders';
    leaders.href='/leaderboard.html';
    var players = document.createElement('a');
    players.href='/playerlist.html';
    players.innerHTML = 'Players';
    var teetimes = document.createElement('a');
    teetimes.innerHTML = 'Tee Times';
    teetimes.href='/teetimes.html';
    var watch = document.createElement('a');
    var live = false; //await isStreamLive();
    if(live)
    {
        var live_div = document.createElement('div');
        live_div.className = 'watch_live';
        watch.appendChild(live_div);
    }
    var watch_text = document.createElement('span');
    watch_text.innerHTML = 'Watch';
    watch.appendChild(watch_text);
    watch.href='/watch.html';

    var insta = document.createElement('a');
    insta.href='https://www.instagram.com/wiigolfmasters';
    insta.innerHTML = "Instagram";

    //check to see if stream is live


    header.appendChild(home);
    header.appendChild(news);
    // header.appendChild(leaders);
    header.appendChild(players);
    header.appendChild(teetimes);
    // header.appendChild(insta);
    header.appendChild(watch);

}

async function isStreamLive()
{
    var live = false;
    await $.ajax({ 
        url:'https://api.twitch.tv/helix/streams?user_login=wiigolfmasters',
        headers:{'Client-ID': 'jkg4izi3wxvtzu4ucegba25tx3emll'},
        success:function(channel) { 
              if(channel.data.length > 0) live = true;
         },
    });
    return live;
}

function createModalPopup(modal_text)
{
    var modal = document.createElement('div');
    modal.id = 'popup_modal';
    modal.className ='modal';
    var modal_content = document.createElement('div');
    modal_content.className = 'modal-content';
    var modal_msg = document.createElement('p');
    modal_msg.innerHTML = modal_text;
    modal_content.appendChild(modal_msg);
    modal.appendChild(modal_content);
    document.children[0].appendChild(modal); 
}



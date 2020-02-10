//There has to be a better way to do this, but this is my way
function createScorecardBanner(parent_div)
{
    getPlayerAndRoundData(function(master_data, sorted)
    {
        var lb_div = document.getElementById(parent_div);
        for(let i = 0; i < sorted.length; i++)
        {
            lb_div.appendChild(createLeaderboardCard(master_data[sorted[i]], sorted[i], master_data[sorted[i]]["POSITION"]));
        }
    });
    
}

function createLeaderboardCard(player_data, player_id, position)
{
    var wrapper = document.createElement('a');
    wrapper.href = '/playerdetails.html?player_id='+player_id;
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
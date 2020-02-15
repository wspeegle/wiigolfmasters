//There has to be a better way to do this, but this is my way
function createScorecardBanner(parent_div)
{
    db.collection("current_year").doc('7WLtPHTN4hSokQ0qhOtP').get().then(function(doc)
    {
        var current_year = doc.data().year;
        var years = [current_year];
        getPlayerAndRoundData(years, function(master_data, sorted)
        {
            var lb_div = document.getElementById(parent_div);
            for(let i = 0; i < sorted.length; i++)
            {
                lb_div.appendChild(createLeaderboardCard(master_data[sorted[i]], sorted[i], master_data[sorted[i]][current_year]["POSITION"], years[0]));
            }
            var max_players = sorted.length;
            createScrollButtons(max_players, lb_div);
        });
    }); 
}

function createLeaderboardCard(player_data, player_id, position, year)
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
    //name_div.innerHTML = player_data["FIRST_NAME"] + " " + player_data["LAST_NAME"];
    name_div.innerHTML = player_data["LAST_NAME"].toUpperCase();
    name_wrapper.appendChild(name_div);
    wrapper.appendChild(name_wrapper);
    var score_div = document.createElement('div');
    score_div.className = 'cardScore';
    var score_span = document.createElement('span');
    if(player_data[year]["TOTAL"] < player_data[year]["PAR"])
    {
        score_span.className = 'under'
        score_span.innerHTML = "-" + (player_data[year]["PAR"] - player_data[year]["TOTAL"]);
    }else if(player_data[year]["TOTAL"] > player_data[year]["PAR"])
    {
        score_span.innerHTML = "+" + (player_data[year]["TOTAL"] - player_data[year]["PAR"]);
        score_span.className = 'over';
    }
    else
    {
        score_span.innerHTML = "E";
        score_span.className = 'over';
    }
    let holes_played = (player_data[year]["PAR"] / 72)*18;
    score_div.appendChild(score_span);
    var thru_div = document.createElement('div');
    thru_div.innerHTML = " Thru " + holes_played;
    thru_div.className = 'thru';
    score_div.appendChild(thru_div);
    name_wrapper.appendChild(score_div);
    return wrapper;
}

function createScrollButtons(max_players, lb_div)
{

    var right_button = document.createElement('div');
    right_button.className = 'lb_button';
    right_button.id = 'rightButton';
    var arrow = document.createElement('span');
    arrow.className = 'arrow_span';
    arrow.innerHTML = '...';
    right_button.appendChild(arrow);
    right_button.addEventListener('click', function()
    {
        event.preventDefault();
        if(lb_div.scrollLeft >= 0 && lb_div.scrollLeft < max_players * 241)
        {
        lb_div.scrollLeft = lb_div.scrollLeft+ 241;
        }
    });
    lb_div.appendChild(right_button);

    var left_button = document.createElement('div');
    left_button.className = 'lb_button';
    left_button.id = 'leftButton';
    var arrow = document.createElement('span');
    arrow.className = 'arrow_span';
    arrow.innerHTML = "...";
    left_button.appendChild(arrow);
    left_button.addEventListener('click', function()
    {
        event.preventDefault();
        if(lb_div.scrollLeft >= 0 && lb_div.scrollLeft < max_players * 241)
            {
            lb_div.scrollLeft = lb_div.scrollLeft - 241;
            }
    });
    lb_div.appendChild(left_button);
}


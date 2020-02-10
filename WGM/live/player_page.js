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

function buildPlayerPage(player_id)
{
    buildPlayerHeader(player_id).then(function(master_data, sorted)
    {
        getRounds(player_id).then(function(rounds_info)
        {
            var years_played = [];
            var player_rounds = master_data[player_id]["ROUNDS"];
            for(let i = 0; i < player_rounds.length; i++)
            {
                var round_id = player_rounds[i];
                var round_info = rounds_info[round_id];
                if(years_played.indexOf(round_info["YEAR"]) == -1)
                    years_played[years_played.length] = round_info["YEAR"];
            }

            years_played = years_played.sort().reverse();

            createYearTabs(years_played);
            for(let i = 0; i < years_played.length; i++)
            {
                createScoreCard(years_played[i]);
                for(let j = 0; j < player_rounds.length; j++)
                {
                    addScorecardRow(years_played[i], j+1, player_id, player_rounds[j]);
                }
            }
        })
    });
}

function buildPlayerHeader(player_id)
{
    return new Promise(function(resolve, reject)
    {
    getPlayerAndRoundData(function(master_data, sorted)
    {
        
        var img = document.getElementById('player_img');
        getPlayerImage(player_id, img);
        
        var name_div = document.getElementById('player_name');
        name_div.innerHTML = master_data[player_id]["FIRST_NAME"] + " " + master_data[player_id]["LAST_NAME"];
        var pos_div = document.getElementById('player_position');        
        pos_div.innerHTML = master_data[player_id]["POSITION"];
        var thru_div = document.getElementById('player_thru');
        thru_div.innerHTML = (master_data[player_id]["PAR"] / 72)*18;
        var total_div = document.getElementById('player_total');
        if(master_data[player_id]["TOTAL"] < master_data[player_id]["PAR"])
        {
            total_div.classList += ' under'
            total_div.innerHTML = "-" + (master_data[player_id]["PAR"] - master_data[player_id]["TOTAL"]);
        }else if(master_data[player_id]["TOTAL"] > master_data[player_id]["PAR"])
        {
            total_div.innerHTML = "+" + (master_data[player_id]["TOTAL"] - master_data[player_id]["PAR"]);
            total_div.classList += ' over';
        }
        else
        {
            total_div.innerHTML = "E";
            total_div.classList += ' over';
        }
        resolve(master_data, sorted);
    });
});
}


function createYearTabs(years_played)
{
    var tab_div = document.getElementById('year_tabs');
    for(let i = 0; i < years_played.length; i++)
    {
        var button = document.createElement('button');
        button.className = 'tablinks';
        button.innerHTML = years_played[i];
        button.addEventListener('click', openYear);
        button.id = years_played[i]+"_tab";
        tab_div.appendChild(button);
    }

}

function openYear(evt) {
    // Declare all variables
    var i, tabcontent, tablinks;

    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
            tabcontent[i].style.display = "none";
    }

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
            tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(evt.target.id+"_content").style.display = "block";
    evt.target.className += " active";
}

function createScoreCard(year)
{
    const par_array     = [4,3,5,3,5,4,4,3,5,4,3,5,3,5,4,4,3,5];
    var parent_div = document.getElementById('scorecards');
    var table_div = document.createElement('div');
    table_div.id = year+"_tab_content";
    table_div.className = 'tabcontent';
    var table = document.createElement('table');
    table.className='player_card'; 
    table.id = year+"_scorecard_table";
    var col_group = document.createElement('colgroup');
    var col = document.createElement('col');
    col.style.width = '80px';
    col_group.appendChild(col);
    for(let i = 1; i < 19; i++)
    {
        var col = document.createElement('col');
        col.style.width = '41px';
        col_group.appendChild(col);
    }
    var col = document.createElement('col');
    col.style.width = '80px';
    col_group.appendChild(col);
    table.appendChild(col_group);
    var hole_header = document.createElement('tr');
    var th = document.createElement('th');
    th.className = 'holeNos';
    th.innerHTML = 'Hole';
    hole_header.appendChild(th);
    for(let i = 1; i < 20; i++)
    {
        th = document.createElement('th');
        th.className = 'holeNos';
        th.innerHTML = i;
        hole_header.appendChild(th);
    }
    th.className = 'holeNos';
    th.innerHTML = 'Total';
    hole_header.appendChild(th);
    table.appendChild(hole_header);
    var par_header = document.createElement('tr');
    var td = document.createElement('td');
    td.className = 'parNos';
    td.innerHTML = 'Par';
    par_header.appendChild(td);
    for(let i = 0; i < 19; i++)
    {
        td = document.createElement('td');
        td.className = 'parNos';
        td.innerHTML = par_array[i];
        par_header.appendChild(td);
    }
    td.innerHTML = '72';
    td.className = 'parNos';
    par_header.appendChild(td);
    table.appendChild(par_header);


    table_div.appendChild(table);
    parent_div.appendChild(table_div);
}

function addScorecardRow(year, round_num, player_id, round_id)
{
    return new Promise(function(resolve, reject)
    {
        var table   = document.getElementById(year+"_scorecard_table");
        var row     = table.insertRow();
        var row_num = table.rows.length;
        //Create user select dropdown in first column
        //When a user is selected, it will prompt the onchange and fill in their scorecard if they have one for the selected round
        var cell = row.insertCell();
        cell.innerHTML = "Round " + round_num;
        cell.className = 'roundNo';
        //Build the rest of the input fields for each hole. id = row_col
        for (var i = 0; i < 18; i++)
        {
            cell = row.insertCell();
            cell.className = 'scoreNos';
            cell.innerHTML = '<div></div>'
        }
        //Total cell
        cell = row.insertCell();
        cell.className = 'scoreNos';
    
    
    
        getScorecardRowScores(year, row_num,player_id, round_id).then(function()
        {
            resolve(row_num);
        });
    
    });
}




function getScorecardRowScores(year, row_num, player_id, round_id)
{
    return new Promise(function(resolve, reject)
    {
        const par_array     = [4,3,5,3,5,4,4,3,5,4,3,5,3,5,4,4,3,5];
        var table                   = document.getElementById(year+'_scorecard_table');
        var db                      = firebase.firestore();
        var player_scores           = db.collection("player_score");
        var players_round_scorecard = player_scores.where("player", '==', player_id).where("round", '==', round_id);
        players_round_scorecard.get().then(function(querySnapshot)
        {
            var row = table.rows[row_num-1];
            querySnapshot.forEach(function(doc)
            {
                var score = doc.data().score;
                //Iterate through the table's row and add the score to each column in the scorecard
                var row_total = 0;
                for (var i = 1; i < 19; i++)
                {
                    row.cells[i].children[0].innerHTML = score[i - 1];
                    if(score[i-1] < par_array[i-1])
                    {
                        //birdie or eagle
                        if(score[i-1] == par_array[i-1]-1)
                        row.cells[i].children[0].className = 'birdie';
                        else
                        row.cells[i].children[0].className = 'eagle';
                    }else if(score[i-1] > par_array[i-1])
                    {
                        if(score[i-1] == par_array[i-1]+1)
                        row.cells[i].children[0].className ='bogey';
                        else
                        row.cells[i].children[0].className = 'double_bogey';
                    }
                    row_total += parseInt(row.cells[i].children[0].innerHTML);
                }
                row.cells[19].innerHTML = row_total;
            })
            resolve();
        });
    });
}
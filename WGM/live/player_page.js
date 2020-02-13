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
        
            var years_played = [];
            var rounds_info = master_data[player_id]["ROUNDS"];
            for(let i = 0; i < Object.keys(rounds_info).length; i++)
            {
                var round_info = rounds_info[Object.keys(rounds_info)[i]];
                if(years_played.indexOf(round_info["YEAR"]) == -1)
                    years_played[years_played.length] = round_info["YEAR"];
            }

            years_played = years_played.sort().reverse();

            createYearTabs(years_played);
            for(let i = 0; i < years_played.length; i++)
            {
                var rounds_ordered = orderRoundsByRoundNumForYear(rounds_info, years_played[i]);
                createScoreCard(years_played[i]);
                for(let j = 0; j < Object.keys(rounds_ordered).length; j++)
                {
                    var round_id = Object.keys(rounds_ordered)[j];
                    if(rounds_ordered[round_id]["YEAR"] == years_played[i])
                        addScorecardRow(years_played[i], rounds_ordered[round_id]["ROUND_NUM"], player_id, round_id);
                }
                createStatSection(years_played[i], master_data[player_id]);
            }



           
            //first get all the rounds for the latest year
            db.collection("current_year").doc('7WLtPHTN4hSokQ0qhOtP').get().then(function(doc)
            {
                document.getElementById(doc.data().year + "_tab").click();
                document.getElementById(doc.data().year + "_total").click();
            });
        
    });
}

function buildPlayerHeader(player_id)
{
    return new Promise(function(resolve, reject)
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
                
                var img = document.getElementById('player_img');
                getPlayerImage(player_id, img);
                
                var name_div = document.getElementById('player_name');
                name_div.innerHTML = master_data[player_id]["FIRST_NAME"] + " " + master_data[player_id]["LAST_NAME"];
                var pos_div = document.getElementById('player_position');        
                pos_div.innerHTML = master_data[player_id][years[0]]["POSITION"];
                var today_div = document.getElementById('player_today');
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
                if(round_scores[latest_round]["SCORE"] < round_scores[latest_round]["PAR"])
                {
                    today_div.classList += ' under'
                    today_div.innerHTML = "-" + (round_scores[latest_round]["PAR"] - round_scores[latest_round]["SCORE"]);
                }else if(round_scores[latest_round]["SCORE"] > round_scores[latest_round]["PAR"])
                {
                    today_div.innerHTML = "+" + (round_scores[latest_round]["SCORE"] - round_scores[latest_round]["PAR"]);
                    today_div.classList += ' over';
                }
                else
                {
                    today_div.innerHTML = "E";
                    today_div.classList += ' over';
                }
                

                var thru_div = document.getElementById('player_thru');
                thru_div.innerHTML = (master_data[player_id][years[0]]["PAR"] / 72)*18;
                var total_div = document.getElementById('player_total');
                if(master_data[player_id][years[0]]["TOTAL"] < master_data[player_id][years[0]]["PAR"])
                {
                    total_div.classList += ' under'
                    total_div.innerHTML = "-" + (master_data[player_id][years[0]]["PAR"] - master_data[player_id][years[0]]["TOTAL"]);
                }else if(master_data[player_id][years[0]]["TOTAL"] > master_data[player_id][years[0]]["PAR"])
                {
                    total_div.innerHTML = "+" + (master_data[player_id][years[0]]["TOTAL"] - master_data[player_id][years[0]]["PAR"]);
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
    var year = evt.target.id.split('_')[0];
    document.getElementById(year + "_total").click();
    document.getElementById(year + "_total").className += " active";
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

function createStatSection(year, player_data)
{
    createStatTabs(year, player_data);
    createGraphs(year, player_data);
}

function createStatTabs(year, player_data)
{
    //first create all the round buttons to activate each individual graph
    var rounds = player_data["ROUNDS"];
    var rounds_div = document.createElement('div');
    var parent_div = document.getElementById(year + '_tab_content');
    rounds_div.id = year + '_rounds_tab';
    rounds_div.className = 'tab';
    var round_button = document.createElement('button');
    round_button.classList = 'tablinks graphtabs';
    round_button.id = year+'_total';
    round_button.innerHTML = 'Total';
    round_button.addEventListener('click', openChart);
    rounds_div.appendChild(round_button);
    var rounds_ordered = orderRoundsByRoundNumForYear(rounds, year);
    for(let i = 0; i < Object.keys(rounds_ordered).length; i++)
    {
        
        var round = rounds_ordered[Object.keys(rounds_ordered)[i]];
        if(round["YEAR"] == year)
        {
            round_button = document.createElement('button');
            round_button.classList = 'tablinks graphtabs';
            round_button.id = year + "_R" + round["ROUND_NUM"];
            round_button.innerHTML = 'Round ' + round["ROUND_NUM"];
            round_button.addEventListener('click', openChart);
            rounds_div.appendChild(round_button);
        }
    }
    parent_div.appendChild(rounds_div);





}

function createGraphs(year, player_data)
{
    var parent_div = document.getElementById(year + '_tab_content');
    var rounds = player_data["ROUNDS"];
    var wrapper_div = document.createElement('div');
    wrapper_div.className = 'tabStats';
    wrapper_div.id = year + "_total_graph";
    var canvas_wrapper = document.createElement('div');
    canvas_wrapper.className = 'canvasWrapper';
    var chart_canvas = document.createElement('canvas');
    chart_canvas.id = year + "_total_graph";
    chart_canvas.style.width = '400px';
    chart_canvas.style.height = '400px';
    chart_canvas.style.paddingLeft = '25px';
    var total_ctx = chart_canvas.getContext('2d');
    canvas_wrapper.appendChild(chart_canvas);
    parent_div.appendChild(canvas_wrapper);
    var total_legend_div = document.createElement('div');
    total_legend_div.id = year + "_total_legend";
    total_legend_div.className = 'legend-con';
    total_legend_div.style.paddingLeft = '150px';
    wrapper_div.appendChild(canvas_wrapper);
    wrapper_div.appendChild(total_legend_div);
    parent_div.appendChild(wrapper_div);
    var round_totals = [0,0,0,0,0];
    for(let i = 0; i < Object.keys(rounds).length; i++)
    {
        round_id = Object.keys(rounds)[i];
        if(rounds[round_id]["YEAR"] == year)
        {
            var wrapper_div = document.createElement('div');
            wrapper_div.className = 'tabStats';
            wrapper_div.id = year + "_R" + rounds[round_id]["ROUND_NUM"] + "_graph";
            var canvas_wrapper = document.createElement('div');
            canvas_wrapper.className = 'canvasWrapper';
            var chart_canvas = document.createElement('canvas');
            chart_canvas.id = year + "_R" + rounds[round_id]["ROUND_NUM"] + "_graph";
            chart_canvas.style.width = '400px';
            chart_canvas.style.height = '400px';
            chart_canvas.style.paddingLeft = '25px';
            canvas_wrapper.appendChild(chart_canvas);
            parent_div.appendChild(canvas_wrapper);
            var legend_div = document.createElement('div');
            legend_div.id = year + "_R" + rounds[round_id]["ROUND_NUM"] + "_legend";
            legend_div.className = 'legend-con';
            legend_div.style.paddingLeft = '150px';
            wrapper_div.appendChild(canvas_wrapper);
            wrapper_div.appendChild(legend_div);
            parent_div.appendChild(wrapper_div);

            var round_score =  getScoreTypes(rounds[round_id]["SCORECARD"]);
            for(let j = 0; j < round_score.length; j++)
            {
                round_totals[j] = round_totals[j] + round_score[j];
            }
            var ctx = chart_canvas.getContext('2d');
            generateChart(ctx, round_score, legend_div);
        }
        
    }

    generateChart(total_ctx, round_totals, total_legend_div);




}

function openChart(evt)
{

    var tabcontent = document.getElementsByClassName("tabStats");
    for (i = 0; i < tabcontent.length; i++) {
            tabcontent[i].style.display = "none";
    }

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("graphtabs");
    for (i = 0; i < tablinks.length; i++) {
            tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(evt.target.id+"_graph").style.display = "flex";
    evt.currentTarget.className += " active";
}

function getScoreTypes(scorecard)
{
    const par_array     = [4,3,5,3,5,4,4,3,5,4,3,5,3,5,4,4,3,5];
    //[eagles, birdies, pars, bogeys, double bogey+]
    var name_count = [0,0,0,0,0];
    for(let i = 0; i < Object.keys(scorecard).length; i++)
    {
        let score = parseInt(scorecard[i]);
        let par = par_array[i];

        if(score < par)
        {
            if(score < (par-1))
                name_count[0] = name_count[0]+1;
            else
                name_count[1] = name_count[1]+1;
        }else if(score > par)
        {
            if(score > (par+1))
                name_count[4] = name_count[4]+1;
            else 
                name_count[3] = name_count[3]+1;
        }else
            name_count[2] = name_count[2]+1;
    }
    
    return name_count;
}

function generateChart(ctx, round_score, legend_div)
{
    const labels = ["Eagles", "Birdies", "Pars", "Bogeys", "Double Bogey+"];
    var chart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                    backgroundColor: ["#fce300", "#076652", "#d9d9d7", "#b1b3b2", "#606060"],
                    data: round_score,
            }]
    },
    options: {
        legendCallback: function (chart) {
                var legendHtml = [];
                legendHtml.push('<ul>');
                var item = chart.data.datasets[0];
                for (var i = 0; i < item.data.length; i++) {
                        legendHtml.push('<li>');
                        legendHtml.push('<span class="chart-legend" style="background-color:' + item.backgroundColor[i] + '"></span>');
                        var percent = Math.round((item.data[i] / 54) * 100);
                        legendHtml.push('<span class="chart-legend-label-text">' + chart.data.labels[i] + ': ' + item.data[i] + ' (' + percent + '%)</span>');
                        legendHtml.push('</li>');
                }

                legendHtml.push('</ul>');
                return legendHtml.join("");
        },
        responsive: false,
        elements: {
                arc: {
                        borderWidth: 0
                }
        },
        legend: false,
        tooltips: {
                callbacks: {
                        label: function (tooltipItem, data) {
                                var indice = tooltipItem.index;
                                var percent = Math.round((data.datasets[0].data[indice] / 9) * 100);
                                return data.labels[indice] + ': ' + data.datasets[0].data[indice] + ' (' + percent + '%)';

                        }
                },
                bodyFontSize: 20,
        }
}
    });
    legend_div.innerHTML = chart.generateLegend();

}

function orderRoundsByRoundNumForYear(rounds_info, year)
{
    var this_years_rounds = [];
    //Order rounds in the year by round num
    for(let k = 0; k < Object.keys(rounds_info).length; k++)
    {
        var round_id = Object.keys(rounds_info)[k];
        if(rounds_info[round_id]["YEAR"] == year)
        {
            var round_info = {};
            round_info[round_id] = rounds_info[round_id];
            this_years_rounds[rounds_info[round_id]["ROUND_NUM"]-1] = round_info;
        }
    }
    var round_info = {};
    for(let j = 0; j < this_years_rounds.length; j++)
    {
        var round_id = Object.keys(this_years_rounds[j])[0]; //I dont think you should ever do this, but here we ares
        
        round_info[round_id] = this_years_rounds[j][round_id];
    }
    return round_info;


}
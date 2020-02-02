function update_scorecard(table)
{
    var db = firebase.firestore();
    var roundSelect = document.getElementById('round_select');
    var round_id = roundSelect[roundSelect.selectedIndex].value;
    
    var userSelect = document.getElementById('userSelect_3');
    var user_id = userSelect[userSelect.selectedIndex].value;
    console.log("round: " + round_id + ", user: " + user_id);
    console.log(roundSelect);
    var score = {};
    

    for(var i = 2; i < table.rows.length; i++)
    {
        var table_row = table.rows[i];
        for(var j=1; j < 19; j++)
        {
            score[j-1] = table_row.cells[j].children[0].value;
        }
        console.log(score);

    db
        .collection('player_score')
        .add({
            player: '/player/'+user_id,
            round: '/round/'+round_id,
            score: score
        })
        .then(function(docRef) {
            console.log('Document written with ID: ', docRef.id);
        })
        .catch(function(error) {
            console.error('Error adding document: ', error);
        });

    }
}

function addScorecardRow()
{
    var table = document.getElementById('update_scores');
    
    var row = table.insertRow();
    var row_num = table.rows.length;
    var cell = row.insertCell();
    cell.innerHTML = "<select id='userSelect_" + row_num + "'>";
    cell.className = 'roundNo';
    for(var i = 0; i < 18; i++)
    {
        cell = row.insertCell();
        cell.className = 'scoreNos';
        cell.innerHTML = "<input style='width: 25px; height:25px' type='text'>";
    }

    getData("players", function(querySnapshot){
    var userSelect = document.getElementById('userSelect_'+row_num);
    var opt = document.createElement('option');
    opt.appendChild(document.createTextNode("-"));
    userSelect.appendChild(opt);
        querySnapshot.forEach(function(doc) {
            var doc_data = doc.data();
            opt = document.createElement('option');
            console.log(doc);
            opt.appendChild(document.createTextNode(doc_data.first_name + " " + doc_data.last_name));
            opt.value = doc.id;
            userSelect.appendChild(opt);
        }); 
});
}

var players_signed_up = [];

function buildTeeTimes(parent_div_id)
{
    var parent_div = document.getElementById(parent_div_id);
    parent_div.innerHTML = '';
    db.collection("current_round").doc('LBFeqyBZADwYfaQFQONK').get().then(function(doc)
    {
        var current_year = doc.data().year;
        var current_round = doc.data().round_num;
        db.collection('teetimes').where('year', '==', current_year).where('round_num', '==', current_round).orderBy("group", "asc").get().then(function(querySnapshot)
        {
            players_signed_up = [];
            querySnapshot.forEach(async function(doc)
            {
                //build a new card for each tee time
                //a tee time can have multiple cards (multiple stations)
                //card includes a 2x2 table
                //col 1 is Player 1-4
                //col 2 is either a user select or a div of the persons name
                //select should have an onchange that writes to the db and replaces the select with the div of their name
                //select should also not show users who already have been selected
                var players = [];
                players[0] = doc.data().player_1;
                players[1] = doc.data().player_2;
                players[2] = doc.data().player_3;
                players[3] = doc.data().player_4;

                var tee_time_div = document.createElement('div');
                tee_time_div.className = 'tee_time_card';
                var tee_time_info_div = document.createElement('div');
                tee_time_info_div.innerHTML = /*"Round " + doc.data().round_num + */"Group " + doc.data().group + " - " + doc.data().time + " " + doc.data().ampm;
                tee_time_info_div.className = 'tee_time';
                tee_time_div.appendChild(tee_time_info_div);
                var entry_table = document.createElement('table');
                for(let i = 0; i < players.length; i++)
                {
                    var row = entry_table.insertRow();
                    var c1 = row.insertCell();
                    c1.innerHTML = 'Player '+(i+1);
                    var c2 = row.insertCell();
                    if(players[i] == '')//need to create a select 
                    {
                        var sign_up_button = document.createElement('button');
                        sign_up_button.className = 'update_scorecard_button';
                        sign_up_button.value = 'Sign Up';
                        sign_up_button.innerHTML = 'Sign Up';
                        sign_up_button.onclick = async function()
                        {
                            var user = firebase.auth().currentUser;
                            if(user)
                            {
                                if(players_signed_up.indexOf(user.displayName) == -1)
                                {
                                    await addUserToTeeTime(user.displayName, doc.id, i+1);
                                    buildTeeTimes(parent_div_id);
                                }
                            }else
                            {
                                //need to show a popup telling them to login, probably have the log in button in
                                createModalPopup("You need to sign in with a Google account to sign up for a tee time.<br><br><br> <button class='update_scorecard_button' onclick = 'signIn()'>Sign In</button> ");
                                // signIn();
                            }
                        };
                        c2.appendChild(sign_up_button);
                    }else
                    {
                        c2.innerHTML = players[i];
                        players_signed_up[players_signed_up.length] = players[i];
                    }

                }
                tee_time_div.appendChild(entry_table);
                parent_div.appendChild(tee_time_div);
            });
        });
    });
}

function addUserToTeeTime(user, tee_time_id, player_num)
{
        //there is probably a better way to do this but im very tired
        if(player_num == 1)
        {
            db.collection('teetimes').doc(tee_time_id).set(
                {
                     player_1: user       
                }, {merge:true}
            );
        }else if(player_num == 2)
        {
            db.collection('teetimes').doc(tee_time_id).set(
                {
                     player_2: user       
                }, {merge:true}
            );
        }else if(player_num == 3)
        {
            db.collection('teetimes').doc(tee_time_id).set(
                {
                     player_3: user       
                }, {merge:true}
            );
        }else if(player_num == 4)
        {
            db.collection('teetimes').doc(tee_time_id).set(
                {
                     player_4: user       
                }, {merge:true}
            );
        }
}

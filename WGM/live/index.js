// Table structure
// Position - Player - Today - Thru - Total - R1 - R2 - R3 - Total
// 1        - Dale   - -2    -  13   - -10   - 70 - 66 - 50 - 186
// 2        - Wills   - -1   -  13   - -9   - 70 - 66 - 51 - 187

// use scorecard_banner.js as guide
// also utils line 294 (parforScorecard function) to get par for each round
// total score function above ^^ (284)
// Initialize Cloud Firestore through Firebase
// Player object to push all data
const playerObj = {};
const leaderboardTable = document.querySelector('.leaderboard_table');
// Grab each player id
let playersNameAndId = firestore
    .collection('players')
    .get()
    .then(querySnapshot => {
        querySnapshot.forEach((doc, i) =>
            console.log(`HELLO ${doc.id} => ${doc.data().first_name}`)
        );
    });

// Import all player data using id
// Insert data into table
// Sort by TOTAL

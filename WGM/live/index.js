// Initialize Cloud Firestore through Firebase
firebase.initializeApp({
    apiKey: 'AIzaSyB3qmQNbtcpQeLSn3mHsAoYtDxGL-uHL6c',
    authDomain: 'wiigolfmasters.firebaseapp.com',
    databaseURL: 'https://wiigolfmasters.firebaseio.com',
    projectId: 'wiigolfmasters',
    storageBucket: 'wiigolfmasters.appspot.com',
    messagingSenderId: '660957033972',
    appId: '1:660957033972:web:59179876aae65a91b875a1',
    measurementId: 'G-8TGBMCXL58'
});
$(document).ready(function() {
    var user = null;
    firebase
        .auth()
        .getRedirectResult()
        .then(function(result) {
            if (result.credential) {
                // This gives you a Google Access Token. You can use it to access the Google API.
                var token = result.credential.accessToken;
                // ...
            }
            // The signed-in user info.
            user = result.user;
        })
        .catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // The email of the user's account used.
            var email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential;
            // ...
        });
    user = firebase.auth().currentUser;
    var userDiv = document.getElementById('userInfo');
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            userDiv.innerHTML = user['displayName'];
        } else {
            userDiv.innerHTML = 'Not logged in';
        }
    });
    console.log('user::::');
    console.log(user);

    var db = firebase.firestore();
    db.collection('players')
        .get()
        .then(function(querySnapshot) {
            var userSelect = document.getElementById('userSelect');
            querySnapshot.forEach(function(doc) {
                // doc.data() is never undefined for query doc snapshots
                console.log(doc.id, ' => ', doc.data());
                var doc_data = doc.data();
                var opt = document.createElement('option');
                console.log(doc);
                opt.appendChild(
                    document.createTextNode(
                        doc_data.first_name + ' ' + doc_data.last_name
                    )
                );
                opt.value = doc.id;
                userSelect.appendChild(opt);
            });
        })
        .catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // The email of the user's account used.
            var email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential;
            console.log(errorMessage);
        });

    // Table structure
    // Position - Player - Today - Thru - Total - R1 - R2 - R3 - Total
    // 1        - Dale   - -2    -  13   - -10   - 70 - 66 - 50 - 186
    // 2        - Wills   - -1   -  13   - -9   - 70 - 66 - 51 - 187

    // use scorecard_banner.js as guide
    // also utils line 294 (parforScorecard function) to get par for each round
    // total score function above ^^ (284)
    // Initialize Cloud Firestore through Firebase
    const LEADERBOARD_OBJ = {};

    // Get players
    let players = db
        .collection('players')
        .get()
        .then(querySnapshot => {
            let playersArray = [];
            querySnapshot.forEach(doc => {
                playersArray.push(doc.data());
            });
            LEADERBOARD_OBJ['players'] = playersArray;
        });
    // Get current year
    const CURRENT_YEAR = db
        .collection('current_year')
        .doc('7WLtPHTN4hSokQ0qhOtP')
        .get()
        .then(doc => (LEADERBOARD_OBJ['current_year'] = doc.data().year));
    console.log(LEADERBOARD_OBJ);
    // Get rounds in current year
    // Get player scores for current years rounds
    // Compare to par
    // Sort by lowest
    // Insert into table

    // createScorecardBanner('leaderboard_table'); // db not defined??????
    // Import all player data using id
    // Insert data into table
    // Sort by TOTAL
});

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

function signIn() {
    var provider = new firebase.auth.GoogleAuthProvider();
    console.log('signinwithredirect');
    firebase.auth().signInWithRedirect(provider);
}

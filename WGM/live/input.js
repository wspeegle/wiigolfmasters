// Initialize Cloud Firestore through Firebase
const config = {
    apiKey: 'AIzaSyB3qmQNbtcpQeLSn3mHsAoYtDxGL-uHL6c',
    authDomain: 'wiigolfmasters.firebaseapp.com',
    databaseURL: 'https://wiigolfmasters.firebaseio.com',
    projectId: 'wiigolfmasters',
    storageBucket: 'wiigolfmasters.appspot.com',
    messagingSenderId: '660957033972',
    appId: '1:660957033972:web:59179876aae65a91b875a1',
    measurementId: 'G-8TGBMCXL58'
};

firebase.initializeApp(config);

const firestore = firebase.firestore();

function testing() {
    let firstName = document.getElementById('firstName').value;
    let lastName = document.getElementById('lastName').value;
    let player = document.getElementById('player').value;
    let round = document.getElementById('round').value;
    let score = document.getElementById('score').value;
    firestore
        .collection('players')
        .add({
            first_name: firstName,
            last_name: lastName
        })
        .then(function(docRef) {
            console.log('Document written with ID: ', docRef.id);
        })
        .catch(function(error) {
            console.error('Error adding document: ', error);
        });
    console.log({ firstName, lastName, player, round, score });
}

// Add a new document with a generated id.

firestore
    .collection('players')
    .get()
    .then(querySnapshot => {
        querySnapshot.forEach(doc => {
            console.log(`${doc.id} => ${doc.data().first_name}`);
        });
    });

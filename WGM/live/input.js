const firebase = require('firebase');
// Required for side-effects
require('firebase/firestore');

function testing() {
    let firstName = document.getElementById('firstName').value;
    let lastName = document.getElementById('lastName').value;
    let player = document.getElementById('player').value;
    let round = document.getElementById('round').value;
    let score = document.getElementById('score').value;
    console.log({ firstName, lastName, player, round, score });
}

// Initialize Cloud Firestore through Firebase
const firebaseConfig = {
    apiKey: 'AIzaSyB3qmQNbtcpQeLSn3mHsAoYtDxGL-uHL6c',
    authDomain: 'wiigolfmasters.firebaseapp.com',
    databaseURL: 'https://wiigolfmasters.firebaseio.com',
    projectId: 'wiigolfmasters',
    storageBucket: 'wiigolfmasters.appspot.com',
    messagingSenderId: '660957033972',
    appId: '1:660957033972:web:59179876aae65a91b875a1',
    measurementId: 'G-8TGBMCXL58'
};

var db = firebase.firestore();
